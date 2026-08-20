import { describe, it, expect } from "vitest";
import { counted, plural } from "./plural";
import { getDictionary } from "./i18n/dictionaries";
import { LOCALES } from "./i18n/config";

/*
  До этого на сайте стояла одна форма на все числа: «208 промтов». Для
  двухсот восьми это верно, для девяноста одного — нет. Ошибка такого
  рода не роняет ни сборку, ни тесты общего вида: её видно только глазами
  и только на том числе, которое сегодня выпало.
*/

const RU = getDictionary("ru").catalog.promptWord;

describe("число и слово рядом", () => {
  it("по-русски склоняет по последней цифре, а не по величине", () => {
    expect(plural("ru", 1, RU)).toBe("промт");
    expect(plural("ru", 91, RU)).toBe("промт");
    expect(plural("ru", 2, RU)).toBe("промта");
    expect(plural("ru", 92, RU)).toBe("промта");
    expect(plural("ru", 5, RU)).toBe("промтов");
    expect(plural("ru", 208, RU)).toBe("промтов");
  });

  it("одиннадцать и сто одиннадцать — исключения, и они учтены", () => {
    // Ровно та пара, на которой ломается самодельное «если 1, то так».
    expect(plural("ru", 11, RU)).toBe("промтов");
    expect(plural("ru", 111, RU)).toBe("промтов");
  });

  it("по-английски всё проще, и это тоже проверено", () => {
    const en = getDictionary("en").catalog.promptWord;
    expect(plural("en", 1, en)).toBe("prompt");
    expect(plural("en", 2, en)).toBe("prompts");
    expect(plural("en", 91, en)).toBe("prompts");
  });

  it("по-польски три формы, как в русском", () => {
    const pl = getDictionary("pl").catalog.promptWord;
    expect(plural("pl", 1, pl)).toBe("prompt");
    expect(plural("pl", 22, pl)).toBe("prompty");
    expect(plural("pl", 25, pl)).toBe("promptów");
  });

  it("во всех языках форма находится, а не выпадает пустой", () => {
    // Запасная форма other есть у каждого языка нарочно: справочник может
    // вернуть категорию, которой в словаре не оказалось.
    for (const locale of LOCALES) {
      const forms = getDictionary(locale).catalog.promptWord;
      for (const n of [0, 1, 2, 5, 11, 21, 91, 208]) {
        expect(plural(locale, n, forms).length, `${locale}/${n}`).toBeGreaterThan(0);
      }
    }
  });

  it("counted склеивает число со словом на языке страницы", () => {
    expect(counted("ru", 91, RU)).toBe("91 промт");
    expect(counted("ru", 208, RU)).toBe("208 промтов");
  });
});
