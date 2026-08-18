import { describe, it, expect, vi } from "vitest";
import { existsSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  SKILLS,
  allSkills,
  isSkill,
  isSkillLocked,
  skill,
  veilSkill,
} from "./skills";

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

  /*
    Шапка бывает не плоской: у скилов с метаданными в ней дерево — автор,
    лицензия, требования. Вложенный ключ «name» — не имя скила, и принять
    его за имя значит уронить сборку жалобой на несовпадение, которого
    нет. Проверяем на такой шапке целиком.
  */
  it("вложенные ключи в шапке не путаются с именем скила", async () => {
    const path = join(DIR, "vitest-nested.md");

    writeFileSync(
      path,
      [
        "---",
        "name: vitest-nested",
        "description: A skill whose front matter has nested keys under it.",
        "author:",
        "  name: Someone Else",
        "  url: https://example.com",
        "metadata:",
        "  tags: one, two",
        "  requires:",
        "    - python3",
        "---",
        "",
        "# Nested front matter",
        "",
        "Body.",
      ].join("\n"),
      "utf8",
    );

    try {
      vi.resetModules();
      const fresh = await import("./skills");
      const item = fresh.skill("ru", "vitest-nested");

      expect(item, "скил не собрался из-за вложенной шапки").toBeDefined();
      expect(item!.folder).toBe("vitest-nested");
      expect(item!.title).toBe("Nested front matter");
      // Теги лежат под metadata, а не наверху, — наверх они не всплывают.
      expect(item!.tags).toEqual([]);
    } finally {
      rmSync(path, { force: true });
      vi.resetModules();
    }
  });

  /*
    Раньше здесь стояло «поровну», и при нечётном числе скилов такое
    условие выполнить нельзя вовсе: двадцать три пополам не делятся.
    Смысл проверки был не в равенстве, а в том, чтобы платная половина
    не росла незаметно, — его и оставляем. Лишний скил при нечётном
    числе достаётся бесплатной стороне.
  */
  it("платных не больше, чем бесплатных", () => {
    const all = allSkills("ru");
    const pro = all.filter((item) => item.tier === "pro");

    expect(pro.length, `платных ${pro.length} из ${all.length}`).toBeLessThanOrEqual(
      all.length - pro.length,
    );
  });

  /*
    Под замком должен оказаться файл — и только он. Название, описание и
    разбор остаются, потому что по ним на страницу приходят из поиска:
    спрячь мы их, страница исчезла бы из выдачи вместе с файлом.
  */
  it("замок прячет файл, но не описание", () => {
    for (const item of allSkills("ru")) {
      const veiled = veilSkill(item);

      expect(veiled.title).toBe(item.title);
      expect(veiled.summary).toBe(item.summary);
      expect(veiled.what).toEqual(item.what);
      expect(veiled.why).toBe(item.why);
      expect(veiled.folder).toBe(item.folder);

      for (const [i, file] of veiled.files.entries()) {
        const full = item.files[i].text;
        expect(file.path, item.id).toBe(item.files[i].path);
        expect(file.text.length, `${item.id}/${file.path}`).toBeLessThan(
          full.length,
        );
        // Показанное — настоящий кусок файла, а не выдуманный образец.
        expect(file.text.length, `${item.id}/${file.path}`).toBeGreaterThan(40);
        expect(full.includes(file.text), `${item.id}/${file.path}`).toBe(true);
        // И это уже инструкции, а не шапка: шапку человек и так видит
        // на странице заголовком и описанием.
        expect(file.text.startsWith("---"), `${item.id}/${file.path}`).toBe(
          false,
        );
      }

      expect(veiled.file).toBe(veiled.files[0].text);
    }
  });

  /*
    Обрыв по границе строки: файл — это разметка, и обрубок посреди
    строки читается как испорченный файл, а не как «дальше по подписке».
  */
  it("обрезанный файл не обрывается посреди строки", () => {
    for (const item of allSkills("ru")) {
      for (const file of veilSkill(item).files) {
        const full = item.files.find((f) => f.path === file.path)!.text;
        const rest = full.slice(full.indexOf(file.text) + file.text.length);
        expect(rest.startsWith("\n"), `${item.id}/${file.path}`).toBe(true);
      }
    }
  });

  it("замок только у платных и только для неоплативших", () => {
    const pro = allSkills("ru").find((item) => item.tier === "pro")!;
    const free = allSkills("ru").find((item) => item.tier === "free")!;

    expect(isSkillLocked(pro, "free")).toBe(true);
    expect(isSkillLocked(pro, "pro")).toBe(false);
    expect(isSkillLocked(free, "free")).toBe(false);
    expect(isSkillLocked(free, "pro")).toBe(false);
  });

  /*
    Новый файл, положенный в папку, обязан быть бесплатным, пока его
    намеренно не внесли в платные. Ошибка в эту сторону отдаёт лишнее;
    ошибка в обратную берёт деньги за то, чего никто не обещал продавать.
  */
  it("скил без строчки в платных считается бесплатным", async () => {
    const path = join(DIR, "vitest-tier.md");
    writeFileSync(
      path,
      "---\nname: vitest-tier\ndescription: A skill nobody marked as paid, so it must be free.\n---\n\n# Tier default\n\nBody.\n",
      "utf8",
    );

    try {
      vi.resetModules();
      const fresh = await import("./skills");
      expect(fresh.skill("ru", "vitest-tier")!.tier).toBe("free");
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

  /*
    Разбор необязателен: скил без него публикуется с названием и
    описанием из шапки файла. Но он обязан быть либо на обоих языках,
    либо ни на одном.

    Иначе получается тихая поломка одной стороны: на русской странице
    человек читает «что делает» и «зачем нужен», а на английской вместо
    этого стоит описание из шапки — оно написано для модели, не для
    читателя, и выглядит как недоделанная страница. Сборку это не
    роняет, типы этого не видят: разбор в обоих словарях необязателен по
    отдельности, и расхождение заметно только глазами.
  */
  it("разбор есть либо на обоих языках, либо ни на одном", () => {
    const ru = allSkills("ru");
    const en = allSkills("en");

    // Пустой what — признак того, что разбора нет и текст взят из шапки.
    const onlyOne = ru
      .map((item, i) => ({
        id: item.id,
        ru: item.what.length > 0,
        en: en[i].what.length > 0,
      }))
      .filter((item) => item.ru !== item.en);

    expect(onlyOne).toEqual([]);
  });

  it("разбор есть хотя бы у одного скила — иначе проверка выше пустая", () => {
    // Без этого условие «либо там, либо там» выполняется тривиально:
    // разбора нет ни у кого, и страж молчит навсегда.
    expect(allSkills("ru").some((item) => item.what.length > 0)).toBe(true);
  });
});
