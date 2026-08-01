import { describe, it, expect } from "vitest";
import {
  COMMISSION_RATE,
  COMMISSION_PERCENT,
  PERIODS,
  commissionOf,
} from "./billing";

/*
  Вознаграждение партнёра — живые деньги наружу, поэтому округление и
  ставка закреплены тестами. Расхождение между числом на странице и
  числом в начислении — это спор о деньгах, который придётся разбирать
  вручную по каждой выплате.
*/
describe("commissionOf", () => {
  it("ставка и её процент согласованы между собой", () => {
    expect(COMMISSION_PERCENT).toBe(Math.round(COMMISSION_RATE * 100));
    expect(COMMISSION_PERCENT).toBe(30);
  });

  it("считает вознаграждение по реальным тарифам", () => {
    // 7.99 * 0.3 = 2.397 → 2.40
    expect(commissionOf(PERIODS.monthly.price)).toBe(2.4);
    // 59 * 0.3 = 17.7
    expect(commissionOf(PERIODS.yearly.price)).toBe(17.7);
  });

  it("округляет до цента, а не оставляет хвост с плавающей точкой", () => {
    const value = commissionOf(19.99);
    expect(value).toBe(6);
    expect(Number.isInteger(Math.round(value * 100))).toBe(true);
  });

  it("нулевая сумма даёт нулевое вознаграждение", () => {
    expect(commissionOf(0)).toBe(0);
  });

  it("никогда не возвращает больше самой суммы", () => {
    for (const price of [0.01, 1, 7.99, 59, 1000]) {
      expect(commissionOf(price)).toBeLessThan(price);
    }
  });

  it("результат всегда с точностью до двух знаков", () => {
    for (const price of [7.99, 59, 0.07, 13.33, 99.95]) {
      const value = commissionOf(price);
      expect(Math.abs(value * 100 - Math.round(value * 100))).toBeLessThan(1e-9);
    }
  });
});
