import { describe, it, expect } from "vitest";
import { niches } from "./niches";
import { W, H } from "./templates";

/*
  Готовые тексты — содержимое, а не код: ошибка в них не роняет ни
  типы, ни сборку. Видно её только на слайде, а до слайда надо дойти:
  выбрать нишу, выбрать текст, нажать «Применить». Поэтому проверки
  здесь про то, что глазами не поймаешь — про полноту и про длину.
*/

const RU = niches("ru");
const EN = niches("en");

describe("ниши", () => {
  it("их десять на обоих языках", () => {
    expect(RU).toHaveLength(10);
    expect(EN).toHaveLength(10);
  });

  it("совпадают по составу и порядку", () => {
    // Иначе человек, переключивший язык, теряет выбранную нишу.
    expect(EN.map((n) => n.id)).toEqual(RU.map((n) => n.id));
  });

  it("в каждой по десять готовых текстов", () => {
    for (const list of [RU, EN]) {
      for (const niche of list) {
        expect(niche.decks.length, niche.id).toBe(10);
      }
    }
  });

  it("наборы совпадают по адресам на обоих языках", () => {
    for (const [i, niche] of RU.entries()) {
      expect(EN[i].decks.map((d) => d.id), niche.id).toEqual(
        niche.decks.map((d) => d.id),
      );
    }
  });

  it("адреса наборов уникальны", () => {
    const ids = RU.flatMap((n) => n.decks.map((d) => d.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("наборы слайдов", () => {
  it("начинаются с обложки", () => {
    // Первый слайд решает, откроют ли карусель. Если он окажется не
    // обложкой, фотография не попадёт в кадр вовсе.
    for (const list of [RU, EN]) {
      for (const niche of list) {
        for (const deck of niche.decks) {
          expect(deck.slides[0].kind, deck.id).toBe("cover");
        }
      }
    }
  });

  it("обложка в наборе одна", () => {
    for (const list of [RU, EN]) {
      for (const niche of list) {
        for (const deck of niche.decks) {
          const covers = deck.slides.filter((s) => s.kind === "cover");
          expect(covers.length, deck.id).toBe(1);
        }
      }
    }
  });

  it("в наборе от трёх до десяти слайдов", () => {
    // Больше десяти Instagram не примет в одну карусель.
    for (const list of [RU, EN]) {
      for (const niche of list) {
        for (const deck of niche.decks) {
          expect(deck.slides.length, deck.id).toBeGreaterThanOrEqual(3);
          expect(deck.slides.length, deck.id).toBeLessThanOrEqual(10);
        }
      }
    }
  });

  it("у каждого слайда есть заголовок", () => {
    for (const list of [RU, EN]) {
      for (const niche of list) {
        for (const deck of niche.decks) {
          for (const [i, slide] of deck.slides.entries()) {
            expect(slide.title.trim().length, `${deck.id}/${i}`).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  /*
    Длины. Кегль подбирается автоматически и текст не обрежется, но
    слишком длинный заголовок уедет на пятый кегль и превратится в
    мелкую простыню — в ленте такой слайд не читают. Пределы взяты с
    запасом: они ловят опечатку вроде вставленного абзаца, а не
    придирку к паре лишних слов.
  */
  it("заголовки не превращаются в абзац", () => {
    for (const list of [RU, EN]) {
      for (const niche of list) {
        for (const deck of niche.decks) {
          for (const slide of deck.slides) {
            expect(slide.title.length, `${deck.id}: ${slide.title}`).toBeLessThanOrEqual(60);
          }
        }
      }
    }
  });

  it("рубрика остаётся строкой, а не предложением", () => {
    for (const list of [RU, EN]) {
      for (const niche of list) {
        for (const deck of niche.decks) {
          for (const slide of deck.slides) {
            expect(slide.eyebrow.length, `${deck.id}: ${slide.eyebrow}`).toBeLessThanOrEqual(40);
          }
        }
      }
    }
  });

  it("текст и промт влезают в кадр", () => {
    for (const list of [RU, EN]) {
      for (const niche of list) {
        for (const deck of niche.decks) {
          for (const slide of deck.slides) {
            expect(slide.body.length, `${deck.id} body`).toBeLessThanOrEqual(220);
            expect(slide.code.length, `${deck.id} code`).toBeLessThanOrEqual(260);
          }
        }
      }
    }
  });

  it("подпись на кнопке помещается в список", () => {
    for (const list of [RU, EN]) {
      for (const niche of list) {
        for (const deck of niche.decks) {
          expect(deck.title.length, deck.id).toBeGreaterThan(0);
          expect(deck.title.length, deck.title).toBeLessThanOrEqual(52);
        }
      }
    }
  });
});

describe("кадр", () => {
  it("формат 4:5 — тот, что Instagram не обрезает", () => {
    expect(W / H).toBeCloseTo(0.8, 5);
  });
});
