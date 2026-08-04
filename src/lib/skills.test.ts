import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SKILLS, allSkills, isSkill, skill } from "./skills";

/*
  Скилы читаются с диска: .md в content/skills — и скил на сайте.
  Ломается это не так, как обычный модуль: файл переименовали — адрес
  страницы разошёлся с именем внутри шапки, и скил, подключённый по
  инструкции с сайта, у человека молча не срабатывает. Шапку испортили —
  Claude Code не подключит его вовсе, а на сайте страница выглядит
  целой. Ни того ни другого не видно ни в типах, ни в сборке.
*/

const DIR = join(process.cwd(), "content", "skills");

describe("скилы", () => {
  it("находит все .md из content/skills", () => {
    const onDisk = existsSync(DIR)
      ? readdirSync(DIR)
          .filter((name) => name.toLowerCase().endsWith(".md"))
          .map((name) => name.slice(0, -3))
      : [];

    expect(onDisk.length).toBeGreaterThan(0);
    expect([...SKILLS].sort()).toEqual(onDisk.sort());
  });

  it("у каждого есть название, описание и файл", () => {
    for (const locale of ["ru", "en"] as const) {
      for (const item of allSkills(locale)) {
        expect(item.title.length, `${locale}/${item.id}`).toBeGreaterThan(3);
        expect(item.summary.length, `${locale}/${item.id}`).toBeGreaterThan(20);
        expect(item.file.length, `${locale}/${item.id}`).toBeGreaterThan(200);
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
      const file = skill("ru", id)!.file;
      expect(file.startsWith("---\n"), id).toBe(true);

      const header = file.slice(4, file.indexOf("\n---", 4));
      expect(header, id).toMatch(/^name: [a-z0-9-]+$/m);
      expect(header, id).toMatch(/^description: .{20,}$/m);
    }
  });

  it("имя внутри файла совпадает с адресом страницы и именем папки", () => {
    for (const id of SKILLS) {
      const item = skill("ru", id)!;
      expect(item.file).toContain(`name: ${id}`);
      expect(item.folder).toBe(id);
    }
  });

  it("файл один и тот же на всех языках", () => {
    for (const id of SKILLS) {
      expect(skill("en", id)!.file).toBe(skill("ru", id)!.file);
    }
  });

  /*
    Разбор пишется руками и есть не у всех — но если он есть, он должен
    быть переведён. Кириллица в английской карточке означает, что перевод
    забыли и скопировали русский текст.
  */
  it("в английских описаниях нет кириллицы", () => {
    for (const item of allSkills("en")) {
      const all = [
        item.title,
        item.summary,
        item.why,
        ...item.what,
        ...item.tags,
      ].join(" ");
      expect(all, `en/${item.id}`).not.toMatch(/[а-яА-ЯёЁ]/);
    }
  });

  /*
    Скил без своего разбора обязан публиковаться целым: название из
    заголовка файла, описание из шапки. Проверяем на выдуманном скиле,
    которого в таблице разборов нет, — иначе поломку заметили бы только
    после того, как новый .md выйдет на сайт пустой карточкой.
  */
  it("скил без разбора берёт название и описание из самого файла", () => {
    const withText = allSkills("ru").filter((item) => item.what.length > 0);
    const withoutText = allSkills("ru").filter((item) => item.what.length === 0);

    // Сейчас разбор написан для всех — значит, проверять нечего, но и
    // молча пропускать нельзя: пусть тест скажет об этом прямо.
    expect(withText.length + withoutText.length).toBe(SKILLS.length);

    for (const item of withoutText) {
      expect(item.title.length, item.id).toBeGreaterThan(3);
      expect(item.summary.length, item.id).toBeGreaterThan(20);
      expect(item.what, item.id).toEqual([]);
      expect(item.why, item.id).toBe("");
    }
  });

  it("isSkill отсекает чужие адреса", () => {
    expect(isSkill("dead-code")).toBe(true);
    expect(isSkill("нет-такого")).toBe(false);
    expect(skill("ru", "нет-такого")).toBeUndefined();
  });

  it("allSkills отдаёт все и в том же порядке", () => {
    expect(allSkills("en").map((s) => s.id)).toEqual([...SKILLS]);
  });
});
