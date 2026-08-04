import { describe, it, expect } from "vitest";
import { GUIDES, allGuides, guide, isGuide } from "./guides";

/*
  Тексты гайдов живут в двух таблицах — русской и английской. TypeScript
  следит за тем, чтобы ключи совпадали, но не видит, что перевод забыли и
  оставили русскую строку, или что раздел пустой. Это ловим здесь.
*/

describe("гайды", () => {
  it("у каждого есть заголовок, описание и хотя бы два раздела", () => {
    for (const locale of ["ru", "en"] as const) {
      for (const slug of GUIDES) {
        const item = guide(locale, slug);
        expect(item.title.length, `${locale}/${slug} title`).toBeGreaterThan(5);
        expect(item.summary.length, `${locale}/${slug} summary`).toBeGreaterThan(20);
        expect(item.intro.length, `${locale}/${slug} intro`).toBeGreaterThan(40);
        expect(item.sections.length, `${locale}/${slug} sections`).toBeGreaterThanOrEqual(2);
        expect(item.minutes).toBeGreaterThan(0);
      }
    }
  });

  it("ни один раздел не пустой", () => {
    for (const locale of ["ru", "en"] as const) {
      for (const slug of GUIDES) {
        for (const section of guide(locale, slug).sections) {
          expect(section.title.length, `${locale}/${slug}`).toBeGreaterThan(3);
          expect(section.body.length, `${locale}/${slug}/${section.title}`).toBeGreaterThan(0);
        }
      }
    }
  });

  /*
    Кириллица в английском тексте означает, что перевод забыли и
    скопировали русский. TypeScript такого не заметит: типы совпадают.
  */
  it("в английских текстах нет кириллицы", () => {
    for (const slug of GUIDES) {
      const item = guide("en", slug);
      const all = [
        item.title,
        item.summary,
        item.intro,
        ...item.sections.flatMap((s) => [s.title, ...s.body]),
      ].join(" ");
      expect(all, `en/${slug}`).not.toMatch(/[а-яА-ЯёЁ]/);
    }
  });

  it("isGuide отсекает чужие адреса", () => {
    expect(isGuide("claude-md")).toBe(true);
    expect(isGuide("такого-нет")).toBe(false);
  });

  it("allGuides отдаёт все и в том же порядке", () => {
    expect(allGuides("ru").map((g) => g.slug)).toEqual([...GUIDES]);
  });
});
