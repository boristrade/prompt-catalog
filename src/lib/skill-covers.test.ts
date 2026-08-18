import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { SKILL_COVER_PATHS, skillCover } from "./skill-covers";
import { allSkills } from "./skills";

/*
  Живые обложки читаются с диска, как PDF-гайды, и ломаются так же
  незаметно: ролик переименовали — обложка исчезла; middleware увёл
  /skill-covers/имя.mp4 на языковой префикс — на странице пустое место
  вместо видео, и ни одной ошибки нигде. Ловим здесь.
*/

const DIR = join(process.cwd(), "public", "skill-covers");

describe("обложки скилов", () => {
  it("находит все ролики из public/skill-covers", () => {
    const onDisk = existsSync(DIR)
      ? readdirSync(DIR).filter((f) => f.toLowerCase().endsWith(".mp4"))
      : [];

    for (const file of onDisk) {
      expect(SKILL_COVER_PATHS).toContain(`/skill-covers/${file}`);
    }
  });

  it("каждый файл существует на диске", () => {
    for (const path of SKILL_COVER_PATHS) {
      expect(existsSync(join(process.cwd(), "public", path)), path).toBe(true);
    }
  });

  it("обложка достаётся ровно тому скилу, чьё имя носит", () => {
    // Ролик с именем, под которым нет скила, — обычно опечатка: он
    // просто не покажется, а человек будет уверен, что положил его.
    const ids = new Set(allSkills("ru").map((item) => item.id));
    for (const path of SKILL_COVER_PATHS) {
      const name = path.slice("/skill-covers/".length, path.lastIndexOf("."));
      expect(ids.has(name), path).toBe(true);
    }
  });

  it("у ролика есть первый кадр картинкой", () => {
    // Без него тот, кто выключил анимацию в системе, видит пустой
    // прямоугольник вместо обложки.
    for (const item of allSkills("ru")) {
      if (!item.cover) continue;
      expect(item.cover.poster, item.id).toBeTruthy();
    }
  });

  /*
    Вес. Обложка играет сама и на телефоне через мобильный интернет:
    ролик на несколько мегабайт съест трафик до того, как человек решит,
    интересен ли ему скил. Предел взят с запасом — он ловит исходник с
    камеры, положенный без пережатия, а не лишнюю сотню килобайт.
  */
  it("ролик не тяжелее полутора мегабайт", () => {
    for (const path of SKILL_COVER_PATHS) {
      if (!path.endsWith(".mp4")) continue;
      const size = statSync(join(process.cwd(), "public", path)).size;
      expect(size / 1048576, `${path}: ${(size / 1048576).toFixed(1)} МБ`)
        .toBeLessThanOrEqual(1.5);
    }
  });

  it("middleware не перехватывает сами файлы", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "middleware.ts"),
      "utf8",
    );
    const line = source.match(/^\s*"(\/\(\(\?!.+)",$/m);
    expect(line, "matcher в middleware.ts не найден").not.toBeNull();

    const matcher = new RegExp(`^${line![1].replace(/\\\\/g, "\\")}$`);
    for (const path of SKILL_COVER_PATHS) {
      expect(matcher.test(path), path).toBe(false);
    }
  });

  it("у скила без ролика обложки нет, и это не ошибка", () => {
    expect(skillCover("такого-скила-нет")).toBeUndefined();
  });
});
