import { describe, it, expect } from "vitest";
import { buildOrderId, parseOrderId, isPeriodId } from "./billing";

describe("buildOrderId / parseOrderId", () => {
  it("собранный order_id разбирается обратно в код и период", () => {
    const orderId = buildOrderId("18A588A6", "monthly");
    expect(parseOrderId(orderId)).toEqual({
      paymentCode: "18A588A6",
      period: "monthly",
    });
  });

  it("два вызова подряд дают разные order_id — метка времени спасает от совпадений", () => {
    const a = buildOrderId("18A588A6", "monthly");
    const b = buildOrderId("18A588A6", "monthly");
    expect(a).not.toBe(b);
  });

  it("неразбираемая строка — null, а не исключение", () => {
    expect(parseOrderId("мусор")).toBeNull();
    expect(parseOrderId("")).toBeNull();
    expect(parseOrderId("code-onlyone")).toBeNull();
  });

  it("неизвестный период в теле order_id — null", () => {
    expect(parseOrderId("18A588A6-weekly-abc123")).toBeNull();
  });
});

describe("isPeriodId", () => {
  it("признаёт только известные периоды", () => {
    expect(isPeriodId("monthly")).toBe(true);
    expect(isPeriodId("yearly")).toBe(true);
    expect(isPeriodId("weekly")).toBe(false);
    expect(isPeriodId("")).toBe(false);
  });
});
