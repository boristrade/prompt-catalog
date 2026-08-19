import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/*
  Печатающийся заголовок — это h1 главной страницы, то есть то, по чему
  страницу находят. Ломается он молча: типы следят за формой вопросов, но
  не за их числом, длиной и не за тем, остался ли в разметке неподвижный
  текст для поисковика и читалки с экрана.
*/

const source = readFileSync(join(__dirname, "TypedHeading.tsx"), "utf8");

describe("печатающийся заголовок", () => {
  it("вопросов поровну на всех языках", () => {
    // Разное число — разный круг: у немца заголовок успевал бы сменяться
    // трижды, пока у поляка дважды. Заметить это можно только сидя на
    // странице с секундомером.
    const counts = LOCALES.map((locale) => getDictionary(locale).home.typed.length);
    expect(new Set(counts).size, counts.join(", ")).toBe(1);
    expect(counts[0]).toBeGreaterThanOrEqual(2);
  });

  it("у каждого вопроса есть обе половины", () => {
    // Пустой хвост — заголовок без градиента, пустое начало — заголовок,
    // который целиком градиентный. И то и другое выглядит как поломка.
    for (const locale of LOCALES) {
      for (const [i, phrase] of getDictionary(locale).home.typed.entries()) {
        expect(phrase.lead.trim().length, `${locale}/${i} lead`).toBeGreaterThan(0);
        expect(phrase.accent.trim().length, `${locale}/${i} accent`).toBeGreaterThan(0);
      }
    }
  });

  /*
    Длина. Место под заголовок держится по самому длинному вопросу — иначе
    строка дёргала бы вниз подпись и кнопки на каждую букву. Значит
    слишком длинный вопрос оставляет пустой блок над сгибом у всех
    остальных, а на 360px это половина первого экрана.
  */
  it("вопрос не превращается в абзац", () => {
    for (const locale of LOCALES) {
      for (const phrase of getDictionary(locale).home.typed) {
        const text = `${phrase.lead} ${phrase.accent}`;
        expect(text.length, `${locale}: ${text}`).toBeLessThanOrEqual(56);
      }
    }
  });

  it("в разметке остаётся неподвижный заголовок", () => {
    // Без него h1 меняется десять раз в секунду: поисковику нечего
    // прочитать, читалке с экрана — нечего объявить.
    expect(source).toContain('className="sr-only"');
    expect(source).toContain("aria-hidden");
  });

  it("место под заголовок держится по самому длинному вопросу", () => {
    // Все вопросы лежат в одной ячейке сетки: невидимые задают высоту,
    // бегущий рисуется поверх. Без этого на каждую букву съезжали бы вниз
    // и подпись, и кнопки.
    expect(source).toContain("invisible col-start-1 row-start-1");
  });

  it("просьба «меньше движения» останавливает набор", () => {
    expect(source).toContain("prefers-reduced-motion");
  });
});
