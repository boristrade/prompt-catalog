import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHmac } from "node:crypto";

/*
  Регресс на главную находку этого ревью: NOWPayments шлёт «оплачено» и на
  confirmed, и на finished — одна и та же оплата приходит вебхуком дважды.
  До исправления это значило два вызова extend_access и двойной платный
  срок. Тест бьёт по маршруту напрямую, подменяя только Supabase-клиент, и
  проверяет: на повторное уведомление record_payment_and_extend вызывается,
  но продление не засчитывается второй раз (rpc возвращает duplicate: true
  — так, как это делает функция в базе при повторной вставке order_id).
*/

const SECRET = "test-ipn-secret";

function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortDeep((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

function sign(payload: Record<string, unknown>): string {
  return createHmac("sha512", SECRET)
    .update(JSON.stringify(sortDeep(payload)))
    .digest("hex");
}

function request(payload: Record<string, unknown>): Request {
  const raw = JSON.stringify(payload);
  return new Request("http://localhost/api/billing/nowpayments", {
    method: "POST",
    body: raw,
    headers: { "x-nowpayments-sig": sign(payload) },
  });
}

const rpcMock = vi.fn();
const receiptMock = vi.fn().mockResolvedValue(undefined);
const commissionMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: () => true,
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ rpc: rpcMock }),
}));

vi.mock("@/lib/email", () => ({
  sendPaymentReceipt: (...args: unknown[]) => receiptMock(...args),
  sendCommissionNotice: (...args: unknown[]) => commissionMock(...args),
}));

describe("POST /api/billing/nowpayments — идемпотентность", () => {
  beforeEach(() => {
    process.env.NOWPAYMENTS_IPN_SECRET = SECRET;
    rpcMock.mockReset();
    receiptMock.mockClear();
    commissionMock.mockClear();
  });
  afterEach(() => {
    delete process.env.NOWPAYMENTS_IPN_SECRET;
  });

  const payload = {
    order_id: "18A588A6-monthly-ms8vzli9",
    order_description: "PrompTom — PRO на месяц",
    payment_status: "finished",
  };

  it("первое уведомление продлевает доступ через record_payment_and_extend", async () => {
    rpcMock.mockResolvedValueOnce({
      data: { duplicate: false, pro_until: "2026-08-30T00:00:00.000Z" },
      error: null,
    });

    const { POST } = await import("./route");
    const res = await POST(request(payload) as never);
    const json = await res.json();

    /*
      Сумма и вознаграждение уходят из своего справочника тарифов, а не
      из тела уведомления: там они пришли бы снаружи, и завышенное число
      обернулось бы завышенной выплатой партнёру.
    */
    expect(rpcMock).toHaveBeenCalledWith("record_payment_and_extend", {
      p_order_id: payload.order_id,
      p_code: "18A588A6",
      p_days: 30,
      p_amount: 7.99,
      p_commission: 2.4,
    });
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, proUntil: "2026-08-30T00:00:00.000Z" });
  });

  it("оплата с известным покупателем и партнёром — письма уходят обоим", async () => {
    rpcMock.mockResolvedValueOnce({
      data: {
        duplicate: false,
        pro_until: "2026-08-30T00:00:00.000Z",
        buyer_email: "buyer@example.com",
        partner_email: "partner@example.com",
        commission: 2.4,
      },
      error: null,
    });

    const { POST } = await import("./route");
    const res = await POST(request(payload) as never);
    await res.json();

    expect(receiptMock).toHaveBeenCalledTimes(1);
    expect(receiptMock.mock.calls[0][0]).toMatchObject({
      to: "buyer@example.com",
      amount: 7.99,
    });
    expect(commissionMock).toHaveBeenCalledTimes(1);
    expect(commissionMock.mock.calls[0][0]).toMatchObject({
      to: "partner@example.com",
      commission: 2.4,
    });
  });

  it("повтор того же order_id — писем не шлём: продления и вознаграждения не было", async () => {
    rpcMock.mockResolvedValueOnce({
      data: { duplicate: true, pro_until: null },
      error: null,
    });

    const { POST } = await import("./route");
    await POST(request(payload) as never);

    expect(receiptMock).not.toHaveBeenCalled();
    expect(commissionMock).not.toHaveBeenCalled();
  });

  it("повтор того же order_id (confirmed после finished) не продлевает второй раз", async () => {
    rpcMock.mockResolvedValueOnce({
      data: { duplicate: true, pro_until: null },
      error: null,
    });

    const { POST } = await import("./route");
    const res = await POST(request(payload) as never);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, duplicate: true });
  });

  it("неоплаченный статус вообще не доходит до базы", async () => {
    const waiting = { ...payload, payment_status: "waiting" };
    const { POST } = await import("./route");
    const res = await POST(request(waiting) as never);

    expect(rpcMock).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("неверная подпись отклоняется до всякого обращения к базе", async () => {
    const raw = JSON.stringify(payload);
    const bad = new Request("http://localhost/api/billing/nowpayments", {
      method: "POST",
      body: raw,
      headers: { "x-nowpayments-sig": "0".repeat(128) },
    });

    const { POST } = await import("./route");
    const res = await POST(bad as never);

    expect(rpcMock).not.toHaveBeenCalled();
    expect(res.status).toBe(401);
  });

  it("код платежа не найден — 404, а не тихий успех", async () => {
    rpcMock.mockResolvedValueOnce({
      data: { duplicate: false, pro_until: null },
      error: null,
    });

    const { POST } = await import("./route");
    const res = await POST(request(payload) as never);

    expect(res.status).toBe(404);
  });

  it("ошибка базы — 500, чтобы NOWPayments повторил попытку", async () => {
    rpcMock.mockResolvedValueOnce({
      data: null,
      error: { message: "connection lost" },
    });

    const { POST } = await import("./route");
    const res = await POST(request(payload) as never);

    expect(res.status).toBe(500);
  });
});
