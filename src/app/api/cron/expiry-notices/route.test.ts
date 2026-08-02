import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/*
  Регресс на то, что нашлось уже на боевом сайте: маршрут был написан
  «нет ключа — пропускаем проверку», переменную забыли задать, и адрес
  рассылки оказался открыт наружу. Снаружи это выглядело как исправно
  работающая задача — 200 и {"ok":true}, — то есть заметить было нечем.

  Проверяем три двери отдельно: без ключа не работаем вовсе, с ключом и
  без заголовка не пускаем, с ключом и верным заголовком работаем.
*/

const rpcMock = vi.fn();
const sendMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: () => true,
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ rpc: rpcMock }),
}));

vi.mock("@/lib/email", () => ({
  sendExpiryNotice: (...args: unknown[]) => sendMock(...args),
}));

const SECRET = "test-cron-secret";

function request(auth?: string): Request {
  return new Request("http://localhost/api/cron/expiry-notices", {
    headers: auth ? { authorization: auth } : {},
  });
}

describe("GET /api/cron/expiry-notices — доступ", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    sendMock.mockClear();
    delete process.env.CRON_SECRET;
  });
  afterEach(() => {
    delete process.env.CRON_SECRET;
  });

  it("без CRON_SECRET маршрут закрыт и до базы не доходит", async () => {
    const { GET } = await import("./route");
    const res = await GET(request() as never);

    expect(res.status).toBe(503);
    expect(rpcMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("пустая строка в CRON_SECRET — то же самое, что её нет", async () => {
    process.env.CRON_SECRET = "   ";
    const { GET } = await import("./route");
    const res = await GET(request() as never);

    expect(res.status).toBe(503);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("ключ задан, заголовка нет — 401, и рассылка не запускается", async () => {
    process.env.CRON_SECRET = SECRET;
    const { GET } = await import("./route");
    const res = await GET(request() as never);

    expect(res.status).toBe(401);
    expect(rpcMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  // Значение только из ASCII: в HTTP-заголовок нелатиница не помещается
  // в принципе — Request отвергает её раньше, чем дело дойдёт до проверки.
  it("чужой ключ в заголовке не проходит", async () => {
    process.env.CRON_SECRET = SECRET;
    const { GET } = await import("./route");
    const res = await GET(request("Bearer wrong-key") as never);

    expect(res.status).toBe(401);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("верный ключ — рассылка идёт, письмо на каждого из списка", async () => {
    process.env.CRON_SECRET = SECRET;
    rpcMock.mockResolvedValueOnce({
      data: [
        { user_id: "1", email: "a@example.com", pro_until: "2026-08-05T00:00:00Z" },
        { user_id: "2", email: "b@example.com", pro_until: "2026-08-06T00:00:00Z" },
      ],
      error: null,
    });

    const { GET } = await import("./route");
    const res = await GET(request(`Bearer ${SECRET}`) as never);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, sent: 2 });
    expect(sendMock).toHaveBeenCalledTimes(2);
    expect(sendMock.mock.calls[0][0]).toMatchObject({ to: "a@example.com" });
  });

  it("ошибка базы — 500, писем не шлём", async () => {
    process.env.CRON_SECRET = SECRET;
    rpcMock.mockResolvedValueOnce({
      data: null,
      error: { message: "connection lost" },
    });

    const { GET } = await import("./route");
    const res = await GET(request(`Bearer ${SECRET}`) as never);

    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
