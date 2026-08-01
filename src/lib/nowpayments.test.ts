import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createHmac } from "node:crypto";
import { verifyIpn, isPaid } from "./nowpayments";

/*
  Сюда добавлен регресс на реальную аварию: подпись расходилась с
  NOWPayments из-за не-ASCII в order_description (см. коммит про
  экранирование юникода). Тест воспроизводит обе формы подписи — с
  JSON.stringify как есть и с PHP/Python-подобным экранированием — и
  проверяет, что verifyIpn принимает любую из них при верном секрете.
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

function escapeNonAscii(json: string): string {
  return json.replace(/[-￿]/g, (char) =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}

function signAs(payload: Record<string, unknown>, form: "js" | "php"): string {
  const canonical = JSON.stringify(sortDeep(payload));
  const body = form === "php" ? escapeNonAscii(canonical) : canonical;
  return createHmac("sha512", SECRET).update(body).digest("hex");
}

describe("verifyIpn", () => {
  beforeEach(() => {
    process.env.NOWPAYMENTS_IPN_SECRET = SECRET;
  });
  afterEach(() => {
    delete process.env.NOWPAYMENTS_IPN_SECRET;
  });

  const payload = {
    order_id: "18A588A6-monthly-ms8vzli9",
    order_description: "PrompTom — PRO на месяц",
    payment_status: "finished",
  };
  const raw = JSON.stringify(payload);

  it("принимает подпись в форме JS (не-ASCII не экранирован)", () => {
    const sig = signAs(payload, "js");
    expect(verifyIpn(raw, sig)).toEqual(payload);
  });

  it("принимает подпись в форме PHP/Python (не-ASCII экранирован)", () => {
    const sig = signAs(payload, "php");
    expect(verifyIpn(raw, sig)).toEqual(payload);
  });

  it("отклоняет неверную подпись", () => {
    expect(verifyIpn(raw, "0".repeat(128))).toBeNull();
  });

  it("отклоняет запрос без подписи", () => {
    expect(verifyIpn(raw, null)).toBeNull();
  });

  it("отклоняет неразбираемый JSON", () => {
    const sig = createHmac("sha512", SECRET).update("не json").digest("hex");
    expect(verifyIpn("не json", sig)).toBeNull();
  });

  it("закрыта наглухо, если секрет не задан", () => {
    delete process.env.NOWPAYMENTS_IPN_SECRET;
    const sig = signAs(payload, "js");
    expect(verifyIpn(raw, sig)).toBeNull();
  });

  it("подпись, посчитанная другим секретом, не проходит", () => {
    const wrongSig = createHmac("sha512", "чужой-секрет")
      .update(JSON.stringify(sortDeep(payload)))
      .digest("hex");
    expect(verifyIpn(raw, wrongSig)).toBeNull();
  });
});

describe("isPaid", () => {
  it("finished и confirmed считаются оплатой", () => {
    expect(isPaid("finished")).toBe(true);
    expect(isPaid("confirmed")).toBe(true);
  });

  it("partially_paid не считается оплатой — человек внёс меньше нужного", () => {
    expect(isPaid("partially_paid")).toBe(false);
  });

  it("промежуточные и нестроковые статусы — не оплата", () => {
    expect(isPaid("waiting")).toBe(false);
    expect(isPaid("confirming")).toBe(false);
    expect(isPaid(undefined)).toBe(false);
    expect(isPaid(null)).toBe(false);
    expect(isPaid(123)).toBe(false);
  });
});
