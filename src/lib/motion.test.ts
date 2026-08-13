import { describe, expect, it } from "vitest";
import { countValue, easeOutCubic } from "./motion";

describe("easeOutCubic", () => {
  it("начинается в нуле и заканчивается в единице", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });

  it("зажимает выход за границы", () => {
    expect(easeOutCubic(-2)).toBe(0);
    expect(easeOutCubic(4)).toBe(1);
  });

  it("тормозит к концу, а не идёт равномерно", () => {
    // На половине времени набрано уже больше половины пути — иначе
    // движение неотличимо от линейного, ради чего всё и затевалось.
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.8);
  });

  it("не убывает", () => {
    let previous = 0;
    for (let p = 0; p <= 1; p += 0.05) {
      const value = easeOutCubic(p);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });
});

describe("countValue", () => {
  it("стартует с нуля и доходит ровно до цели", () => {
    expect(countValue(117, 0, 1100)).toBe(0);
    expect(countValue(117, 1100, 1100)).toBe(117);
  });

  it("не перескакивает цель после конца анимации", () => {
    expect(countValue(117, 9000, 1100)).toBe(117);
  });

  it("никогда не выходит за цель по дороге", () => {
    for (let ms = 0; ms <= 1100; ms += 25) {
      const value = countValue(117, ms, 1100);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(117);
    }
  });

  it("при нулевой длительности сразу отдаёт итог", () => {
    // Деление на ноль дало бы NaN, а в разметке — пустое место вместо цифры.
    expect(countValue(20, 0, 0)).toBe(20);
  });

  it("отдаёт целое число", () => {
    expect(Number.isInteger(countValue(117, 300, 1100))).toBe(true);
  });
});
