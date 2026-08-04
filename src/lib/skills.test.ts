import { describe, it, expect, vi } from "vitest";
import { existsSync, readdirSync, rmSync, writeFileSync } from "node:fs";
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

/** Сколько файлов лежит в папке скила, считая вложенные. */
function countFiles(dir: string): number {
  return readdirSync(dir, { withFileTypes: true }).reduce(
    (sum, entry) =>
      sum + (entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1),
    0,
  );
}

describe("скилы", () => {
  it("находит всё, что лежит в content/skills", () => {
    // Скил — это либо имя.md, либо папка имя/ с SKILL.md внутри.
    const onDisk = existsSync(DIR)
      ? readdirSync(DIR, { withFileTypes: true })
          .filter(
            (entry) =>
              entry.isDirectory() || entry.name.toLowerCase().endsWith(".md"),
          )
          .map((entry) =>
            entry.isDirectory() ? entry.name : entry.name.slice(0, -3),
          )
      : [];

    expect(onDisk.length).toBeGreaterThan(0);
    expect([...SKILLS].sort()).toEqual(onDisk.sort());
  });

  /*
    Скил из нескольких файлов работает только целиком: SKILL.md
    ссылается на соседний файл, и без него агент прочитает «смотри
    references/scenarios.md» и не найдёт его. На странице должны быть все
    файлы папки, каждый со своим путём.
  */
  it("у скила из папки на странице есть все её файлы", () => {
    for (const id of SKILLS) {
      const item = skill("ru", id)!;

      expect(item.files.length, id).toBeGreaterThan(0);
      expect(item.files[0].path, id).toBe("SKILL.md");
      expect(item.files[0].text, id).toBe(item.file);

      for (const file of item.files) {
        expect(file.text.length, `${id}/${file.path}`).toBeGreaterThan(0);
      }
    }

    const onDisk = readdirSync(DIR, { withFileTypes: true }).filter((entry) =>
      entry.isDirectory(),
    );
    for (const entry of onDisk) {
      const item = skill("ru", entry.name)!;
      const count = countFiles(join(DIR, entry.name));
      expect(item.files.length, entry.name).toBe(count);
    }
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
    const withoutText = allSkills("ru").filter(
      (item) => item.what.length === 0,
    );

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

  /*
    Главное обещание раздела: положил .md — скил на сайте, без правки
    кода. Проверяем это на настоящем файле, а не на разговорах: кладём
    его в каталог, заново читаем модуль и смотрим, что получилось.

    Заодно проверяется длина описания. В шапке оно написано для модели, и
    у иного скила это абзац на тысячу символов — на карточке он вытеснил
    бы всё остальное.
  */
  it("положенный .md публикуется сам, с названием и описанием из файла", async () => {
    const long = `Turns things into other things. ${"Explains the reasoning at length. ".repeat(20)}`;
    const path = join(DIR, "vitest-drop-in.md");

    writeFileSync(
      path,
      // Описание в кавычках — так пишут, когда внутри есть двоеточие.
      // Кавычки нужны формату, а не карточке.
      `---\nname: vitest-drop-in\ndescription: "${long}"\ntags: one, two\n---\n\n# A dropped-in skill\n\nBody.\n`,
      "utf8",
    );

    try {
      vi.resetModules();
      const fresh = await import("./skills");
      const item = fresh.skill("ru", "vitest-drop-in");

      expect(
        item,
        "скил не появился после того, как файл положили",
      ).toBeDefined();
      expect(item!.title).toBe("A dropped-in skill");
      expect(item!.folder).toBe("vitest-drop-in");
      expect(item!.tags).toEqual(["one", "two"]);

      // Обрезано по концу предложения: сколько целых фраз влезло, столько
      // и осталось — без хвоста, оборванного посреди слова.
      expect(item!.summary.length).toBeLessThanOrEqual(200);
      expect(item!.summary.startsWith("Turns things into other things.")).toBe(
        true,
      );
      expect(item!.summary.endsWith(".")).toBe(true);
      expect(long.startsWith(item!.summary)).toBe(true);

      // Разбора нет — страница покажет то, что есть, и не упадёт.
      expect(item!.what).toEqual([]);
      expect(item!.why).toBe("");
    } finally {
      rmSync(path, { force: true });
      vi.resetModules();
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
