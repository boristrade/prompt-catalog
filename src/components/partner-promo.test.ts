import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { COMMISSION_PERCENT } from "@/lib/billing";

/*
  Блок партнёрской программы на главной обещает деньги, а деньги здесь
  названы в шести переводах сразу. Опечатка в одном языке — это не
  кривая вёрстка, а неверная цифра перед человеком, который по ней
  примет решение.

  Проверяем ровно два способа, которыми доля может разъехаться с
  начислением: подстановка потерялась в переводе, и ставка вписана в
  текст числом.
*/

const source = readFileSync(join(__dirname, "PartnerPromo.tsx"), "utf8");

/* Без пояснений: в них суммы названы нарочно, и искать их там незачем. */
const code = source
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\/\/.*$/gm, "");

describe("партнёрский блок на главной", () => {
  it("во всех языках доля подставляется, а не написана словами", () => {
    // Без {percent} строка выглядит целой — просто без числа. Заметить
    // это можно только открыв сайт на том самом языке.
    for (const locale of LOCALES) {
      const t = getDictionary(locale);
      expect(t.home.partnerText, locale).toContain("{percent}");
    }
  });

  it("ставка нигде не вписана числом", () => {
    // Вписанная руками «30%» переживёт смену COMMISSION_RATE и станет
    // обещанием, которого база не выполнит.
    const rate = new RegExp(`${COMMISSION_PERCENT}\\s*%`);
    for (const locale of LOCALES) {
      const t = getDictionary(locale);
      for (const [key, value] of Object.entries(t.home)) {
        if (typeof value === "string" && key.startsWith("partner")) {
          expect(rate.test(value), `${locale}.${key}`).toBe(false);
        }
      }
    }
  });

  it("суммы считаются из тарифов, а не написаны в разметке", () => {
    // «$2,40» в вёрстке пережило бы смену цены и осталось бы враньём.
    expect(code).toContain("commissionOf(PERIODS.monthly.price)");
    expect(code).toContain("commissionOf(PERIODS.yearly.price)");
    expect(code).not.toMatch(/\$\d/);
  });
});
