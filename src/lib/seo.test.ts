import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { categoryOgImage, DEFAULT_OG_IMAGE } from "./seo";
import { CATEGORIES } from "@/lib/categories";

/*
  Регресс на поломку, которую нельзя заметить глазами: адрес og:image
  собирался из slug без проверки файла, и у нового раздела картинка
  превью указывала в никуда. На самой странице это не видно совсем —
  ломается только карточка в мессенджере, то есть ровно там, где ссылку
  пересылают, и ровно так, что автор об этом не узнает.
*/
describe("categoryOgImage", () => {
  const drawn = new Set(
    readdirSync(join(process.cwd(), "public", "og"))
      .filter((f) => f.endsWith(".jpg"))
      .map((f) => f.replace(/\.jpg$/, "")),
  );

  it("для раздела со своей картинкой отдаёт её", () => {
    expect(categoryOgImage("designers")).toBe("/og/designers.jpg");
  });

  it("для раздела без картинки отдаёт общую, а не битый адрес", () => {
    expect(categoryOgImage("такого-раздела-нет")).toBe(DEFAULT_OG_IMAGE);
  });

  /*
    Главное здесь: любой раздел каталога — существующий и будущий —
    получает адрес картинки, которая на диске есть. Тест перебирает
    CATEGORIES, поэтому новый раздел без обложки его не сломает, но и
    битую ссылку не пропустит.
  */
  it("каждый раздел каталога получает существующий файл", () => {
    for (const category of CATEGORIES) {
      const image = categoryOgImage(category.slug);
      const name = image.replace("/og/", "").replace(/\.jpg$/, "");
      expect(drawn.has(name)).toBe(true);
    }
  });

  it("общая картинка тоже лежит на диске", () => {
    expect(drawn.has(DEFAULT_OG_IMAGE.replace("/og/", "").replace(/\.jpg$/, ""))).toBe(
      true,
    );
  });
});
