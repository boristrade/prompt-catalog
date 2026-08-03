import { describe, it, expect } from "vitest";
import { GUIDES, allGuides, guide, isGuide } from "./guides";
import { SKILLS, allSkills, isSkill, skill } from "./skills";

/*
  Тексты гайдов и скилов живут в двух таблицах — русской и английской.
  TypeScript следит за тем, чтобы ключи совпадали, но не видит, что
  перевод забыли и оставили русскую строку, или что раздел пустой.
  Это ловим здесь.
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

describe("скилы", () => {
  it("у каждого есть описание, разбор и файл", () => {
    for (const locale of ["ru", "en"] as const) {
      for (const id of SKILLS) {
        const item = skill(locale, id);
        expect(item.title.length, `${locale}/${id}`).toBeGreaterThan(3);
        expect(item.summary.length, `${locale}/${id}`).toBeGreaterThan(20);
        expect(item.what.length, `${locale}/${id}`).toBeGreaterThanOrEqual(2);
        expect(item.why.length, `${locale}/${id}`).toBeGreaterThan(40);
        expect(item.tags.length, `${locale}/${id}`).toBeGreaterThan(0);
      }
    }
  });

  /*
    Файл обязан начинаться с шапки из трёх дефисов с полями name и
    description — без неё Claude Code скил не подключит, а человек об
    этом узнает, только когда скил молча не сработает.
  */
  it("каждый файл начинается с корректной шапки", () => {
    for (const id of SKILLS) {
      const file = skill("ru", id).file;
      expect(file.startsWith("---\n"), id).toBe(true);

      const header = file.slice(4, file.indexOf("\n---", 4));
      expect(header, id).toMatch(/^name: [a-z0-9-]+$/m);
      expect(header, id).toMatch(/^description: .{20,}$/m);
    }
  });

  it("имя внутри файла совпадает с адресом страницы и именем папки", () => {
    for (const id of SKILLS) {
      const item = skill("ru", id);
      expect(item.file).toContain(`name: ${id}`);
      expect(item.folder).toBe(id);
    }
  });

  it("файл один и тот же на всех языках", () => {
    for (const id of SKILLS) {
      expect(skill("en", id).file).toBe(skill("ru", id).file);
    }
  });

  it("в английских описаниях нет кириллицы", () => {
    for (const id of SKILLS) {
      const item = skill("en", id);
      const all = [item.title, item.summary, item.why, ...item.what, ...item.tags].join(" ");
      expect(all, `en/${id}`).not.toMatch(/[а-яА-ЯёЁ]/);
    }
  });

  it("isSkill отсекает чужие адреса", () => {
    expect(isSkill("dead-code")).toBe(true);
    expect(isSkill("нет-такого")).toBe(false);
  });

  it("allSkills отдаёт все и в том же порядке", () => {
    expect(allSkills("en").map((s) => s.id)).toEqual([...SKILLS]);
  });
});
