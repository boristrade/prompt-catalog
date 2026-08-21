import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MARK, marks } from "./templates";
import { slideKey } from "./storage";
import type { Deck } from "./templates";

/*
  Метка сайта на последнем кадре — единственное, чем зарабатывает
  конструктор. Ломается она молча в обе стороны, и обе плохи: пропала у
  бесплатного — работа раздаётся даром; осталась у оплатившего — человек
  заплатил ровно за её отсутствие и получил её же.
*/

const slide = {
  kind: "statement" as const,
  photo: false,
  eyebrow: "",
  title: "Заголовок",
  body: "",
  code: "",
  takeaway: "",
};

const deck: Deck = {
  handle: "@username",
  tagline: "",
  format: "post",
  slides: [{ ...slide, kind: "cover" }, slide, { ...slide, kind: "final" }],
};

describe("метка на последнем кадре", () => {
  it("у бесплатного стоит, и только на последнем", () => {
    expect(marks(0, 3, false)).toBe(false);
    expect(marks(1, 3, false)).toBe(false);
    expect(marks(2, 3, false)).toBe(true);
  });

  it("у оплатившего не стоит нигде", () => {
    for (let i = 0; i < 3; i++) {
      expect(marks(i, 3, true), `кадр ${i}`).toBe(false);
    }
  });

  it("в карусели из одного кадра он же и последний", () => {
    // Иначе на самой короткой карусели метки не было бы вовсе — а это
    // ровно тот случай, когда её проще всего не заметить и раздать.
    expect(marks(0, 1, false)).toBe(true);
  });

  it("на пустом наборе меток нет", () => {
    expect(marks(0, 0, false)).toBe(false);
  });

  it("оплата перерисовывает кадр, а не достаёт старый из склада", () => {
    // Готовые кадры лежат в памяти по ключу. Не войди в него признак
    // оплаты — купивший доступ увидел бы прежнюю картинку с меткой.
    const palette = { accent: "#a78bfa", glow: "#3b1d7a" };
    expect(slideKey(deck, palette, 2, "", true)).not.toBe(
      slideKey(deck, palette, 2, "", false),
    );
  });

  it("метка — адрес сайта, а не случайная строка", () => {
    expect(MARK).toBe("promptom.app");
  });

  it("страница конструктора читает оплату на каждый заход", () => {
    // Отдай её Next из предсборки — метку видел бы и тот, кто заплатил
    // за её отсутствие, причём до первой правки страницы.
    const page = readFileSync(
      join(process.cwd(), "src", "app", "[locale]", "carousel", "page.tsx"),
      "utf8",
    );
    expect(page).toContain('export const dynamic = "force-dynamic"');
    expect(page).toContain("getAccount()");
  });
});
