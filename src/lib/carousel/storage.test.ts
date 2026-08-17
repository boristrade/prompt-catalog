import { describe, it, expect } from "vitest";
import { MAX_SLIDES, parseDeck, parsePalette, slideKey } from "./storage";
import type { Deck } from "./templates";

const slide = {
  kind: "statement",
  photo: false,
  eyebrow: "рубрика",
  title: "Заголовок",
  body: "Текст",
  code: "",
  takeaway: "Вывод",
};

const deck: Deck = {
  handle: "@username",
  tagline: "подпись",
  format: "post",
  slides: [{ ...slide, kind: "cover" }, slide] as Deck["slides"],
};

describe("parseDeck", () => {
  it("возвращает набор обратно как был", () => {
    expect(parseDeck(JSON.stringify(deck))).toEqual(deck);
  });

  it("на мусоре отдаёт null, а не падает", () => {
    // В хранилище пишет предыдущая версия сайта, читает следующая:
    // страница обязана открыться пустой, а не сломаться.
    for (const raw of [null, "", "не json", "[]", "null", "42", '"строка"']) {
      expect(parseDeck(raw), raw ?? "null").toBeNull();
    }
  });

  it("отвергает набор без слайдов", () => {
    expect(parseDeck(JSON.stringify({ ...deck, slides: [] }))).toBeNull();
    expect(parseDeck(JSON.stringify({ handle: "@a" }))).toBeNull();
  });

  it("отвергает слайд с неизвестным типом", () => {
    // Такой слайд нечем отрисовать: шаблона под него нет.
    const broken = { ...deck, slides: [{ ...slide, kind: "видео" }] };
    expect(parseDeck(JSON.stringify(broken))).toBeNull();
  });

  it("отвергает весь набор, а не выкидывает один слайд", () => {
    const half = { ...deck, slides: [slide, { kind: "нет такого" }] };
    expect(parseDeck(JSON.stringify(half))).toBeNull();
  });

  it("подставляет пустые строки вместо пропущенных полей", () => {
    const bare = { slides: [{ kind: "cover" }] };
    const parsed = parseDeck(JSON.stringify(bare));

    expect(parsed).not.toBeNull();
    expect(parsed!.handle).toBe("");
    expect(parsed!.slides[0].title).toBe("");
    expect(parsed!.slides[0].takeaway).toBe("");
  });

  it("не пускает числа и объекты вместо текста", () => {
    const odd = { handle: 7, tagline: {}, slides: [{ kind: "cover", title: 1 }] };
    const parsed = parseDeck(JSON.stringify(odd));

    expect(parsed!.handle).toBe("");
    expect(parsed!.tagline).toBe("");
    expect(parsed!.slides[0].title).toBe("");
  });

  it("незнакомый формат кадра заменяет лентой", () => {
    // Форматов может стать больше или меньше, а набор в хранилище
    // переживает обе правки: 4:5 — то, с чего конструктор начинался.
    const odd = { ...deck, format: "квадрат" };
    expect(parseDeck(JSON.stringify(odd))!.format).toBe("post");
    expect(parseDeck(JSON.stringify({ ...deck, format: 7 }))!.format).toBe("post");
  });

  it("помнит вертикальный формат", () => {
    const story = { ...deck, format: "story" };
    expect(parseDeck(JSON.stringify(story))!.format).toBe("story");
  });

  it("набор без флага фотографии остаётся годным", () => {
    // Так выглядят наборы, сохранённые до появления флага.
    const old = { ...deck, slides: [{ kind: "cover", title: "Заголовок" }] };
    const parsed = parseDeck(JSON.stringify(old));

    expect(parsed).not.toBeNull();
    expect(parsed!.slides[0].photo).toBe(false);
  });

  it("отвергает набор длиннее предела площадки", () => {
    const long = { ...deck, slides: Array(MAX_SLIDES + 1).fill(slide) };
    expect(parseDeck(JSON.stringify(long))).toBeNull();

    const edge = { ...deck, slides: Array(MAX_SLIDES).fill(slide) };
    expect(parseDeck(JSON.stringify(edge))).not.toBeNull();
  });
});

describe("parsePalette", () => {
  it("возвращает цвета обратно", () => {
    const palette = { accent: "#a78bfa", glow: "#3b1d7a" };
    expect(parsePalette(JSON.stringify(palette))).toEqual(palette);
  });

  it("отвергает всё, что не шестизначный hex", () => {
    for (const bad of [
      { accent: "red", glow: "#3b1d7a" },
      { accent: "#fff", glow: "#3b1d7a" },
      { accent: "#a78bfa", glow: "rgb(0,0,0)" },
      { accent: "#a78bfa" },
      {},
    ]) {
      expect(parsePalette(JSON.stringify(bad)), JSON.stringify(bad)).toBeNull();
    }
  });

  it("на мусоре отдаёт null", () => {
    expect(parsePalette("не json")).toBeNull();
    expect(parsePalette(null)).toBeNull();
  });
});

describe("slideKey", () => {
  const palette = { accent: "#a78bfa", glow: "#3b1d7a" };

  it("у одного и того же слайда ключ не меняется", () => {
    expect(slideKey(deck, palette, 1, "")).toBe(slideKey(deck, palette, 1, ""));
  });

  it("правка своего слайда меняет только его ключ", () => {
    // Ради этого всё и затевалось: правят один слайд — перерисовывается
    // один, а не все шесть по четверти секунды каждый.
    const edited: Deck = {
      ...deck,
      slides: [deck.slides[0], { ...deck.slides[1], title: "Другой" }],
    };

    expect(slideKey(edited, palette, 0, "")).toBe(slideKey(deck, palette, 0, ""));
    expect(slideKey(edited, palette, 1, "")).not.toBe(
      slideKey(deck, palette, 1, ""),
    );
  });

  it("смена ника меняет ключи всех слайдов", () => {
    // Ник печатается в каждом кадре — здесь перерисовать надо всё.
    const renamed: Deck = { ...deck, handle: "@other" };
    for (let i = 0; i < deck.slides.length; i++) {
      expect(slideKey(renamed, palette, i, "")).not.toBe(
        slideKey(deck, palette, i, ""),
      );
    }
  });

  it("смена палитры и фото меняет ключи", () => {
    expect(slideKey(deck, { accent: "#ff8800", glow: "#3b1d7a" }, 0, "")).not.toBe(
      slideKey(deck, palette, 0, ""),
    );
    expect(slideKey(deck, palette, 0, "photo-2")).not.toBe(
      slideKey(deck, palette, 0, ""),
    );
  });

  it("подложенное фото меняет ключ своего слайда", () => {
    // Флажок «фото фоном» переписывает кадр целиком, а в остальном
    // слайд остаётся тем же — без него правка прошла бы незамеченной.
    const lit: Deck = {
      ...deck,
      slides: [deck.slides[0], { ...deck.slides[1], photo: true }],
    };
    expect(slideKey(lit, palette, 1, "")).not.toBe(slideKey(deck, palette, 1, ""));
  });

  it("смена формата меняет ключи всех слайдов", () => {
    const tall: Deck = { ...deck, format: "story" };
    for (let i = 0; i < deck.slides.length; i++) {
      expect(slideKey(tall, palette, i, "")).not.toBe(
        slideKey(deck, palette, i, ""),
      );
    }
  });

  it("удаление слайда меняет ключи остальных", () => {
    // В кадре стоит номер вида 02/06: изменилось общее число — изменились
    // все кадры.
    const shorter: Deck = { ...deck, slides: [deck.slides[0]] };
    expect(slideKey(shorter, palette, 0, "")).not.toBe(
      slideKey(deck, palette, 0, ""),
    );
  });
});
