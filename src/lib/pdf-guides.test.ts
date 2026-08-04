import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PDF_GUIDE_PATHS, allPdfGuides, pdfGuide } from "./pdf-guides";
import { GUIDES } from "./guides";

/*
  Гайды-файлы читаются с диска, а не из кода, поэтому ломаются они не
  так, как обычный модуль: файл переименовали — карточка исчезла, обложку
  положили под другим именем — карточка осталась без картинки, файл
  открыли на телефоне и получили 404, потому что middleware увёл его на
  языковой префикс. Ни одну из этих поломок не видно ни в типах, ни в
  сборке. Ловим здесь.
*/

const DIR = join(process.cwd(), "public", "guides");

describe("гайды-файлы", () => {
  it("находит все PDF из public/guides", () => {
    const onDisk = existsSync(DIR)
      ? readdirSync(DIR).filter((f) => f.toLowerCase().endsWith(".pdf"))
      : [];

    expect(PDF_GUIDE_PATHS.length).toBe(onDisk.length);
    for (const file of onDisk) {
      expect(PDF_GUIDE_PATHS).toContain(`/guides/${file}`);
    }
  });

  it("у каждого есть название и файл существует на диске", () => {
    for (const locale of ["ru", "en"] as const) {
      for (const item of allPdfGuides(locale)) {
        expect(item.title.length, `${locale}/${item.slug}`).toBeGreaterThan(3);
        expect(item.file, item.slug).toMatch(/\.pdf$/i);
        expect(
          existsSync(join(process.cwd(), "public", item.file)),
          item.file,
        ).toBe(true);
      }
    }
  });

  /*
    Обложка ищется по имени файла. Опечатка в имени не роняет ничего —
    карточка просто выходит без картинки, — так что заметить это можно
    только здесь.
  */
  it("обложка, если указана, лежит на диске", () => {
    for (const item of allPdfGuides("ru")) {
      if (!item.cover) continue;
      expect(
        existsSync(join(process.cwd(), "public", item.cover)),
        item.cover,
      ).toBe(true);
    }
  });

  it("названия переведены: в английских нет кириллицы", () => {
    for (const item of allPdfGuides("en")) {
      expect(`${item.title} ${item.summary}`, item.slug).not.toMatch(
        /[а-яА-ЯёЁ]/,
      );
    }
  });

  /*
    Адрес /guides/<имя> у текстового и у файлового гайда один и тот же.
    Совпадение имён означало бы, что страница гайда и редирект на PDF
    спорят за один адрес, и кто победит — зависит от порядка проверок.
  */
  it("имена не пересекаются с текстовыми гайдами", () => {
    for (const item of allPdfGuides("ru")) {
      expect(GUIDES, item.slug).not.toContain(item.slug);
    }
  });

  it("pdfGuide отсекает чужие адреса", () => {
    expect(pdfGuide("ru", "такого-файла-нет")).toBeUndefined();
  });

  /*
    Middleware добавляет языковой префикс всему, что через него проходит.
    Для PDF это смертельно: /guides/имя.pdf превратилось бы в
    /ru/guides/имя.pdf, то есть в 404, — а ссылка на карточке выглядела
    бы совершенно рабочей. Проверяем сам matcher, а не поведение: он
    решает всё, и он же — одна строчка, которую легко переписать, не
    подумав про файлы.
  */
  it("middleware не перехватывает сами файлы", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "middleware.ts"),
      "utf8",
    );
    const line = source.match(/^\s*"(\/\(\(\?!.+)",$/m);
    expect(line, "matcher в middleware.ts не найден").not.toBeNull();

    const matcher = new RegExp(`^${line![1].replace(/\\\\/g, "\\")}$`);

    for (const path of PDF_GUIDE_PATHS) {
      expect(matcher.test(path), path).toBe(false);
    }
    // Обычная страница через middleware проходить обязана.
    expect(matcher.test("/ru/guides")).toBe(true);
  });
});
