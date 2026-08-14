import { describe, it, expect } from "vitest";
import { FALLBACK, hsl, paletteFrom } from "./palette";
import { fitSize, slideNumber, wrap } from "./layout";

/** Полотно из повторяющегося цвета: RGBA подряд, как отдаёт канвас. */
function fill(rgb: [number, number, number], count: number): Uint8ClampedArray {
  const data = new Uint8ClampedArray(count * 4);
  for (let i = 0; i < count; i++) {
    data[i * 4] = rgb[0];
    data[i * 4 + 1] = rgb[1];
    data[i * 4 + 2] = rgb[2];
    data[i * 4 + 3] = 255;
  }
  return data;
}

/** Ширина «моноширинного» шрифта: по десять пикселей на символ. */
const mono = (text: string) => text.length * 10;

describe("paletteFrom", () => {
  it("берёт оттенок фотографии", () => {
    // Тёплый оранжевый кадр — акцент обязан выйти оранжевым, а не
    // фиолетовым запасным.
    const palette = paletteFrom(fill([230, 120, 40], 500));
    expect(palette).not.toEqual(FALLBACK);

    const r = parseInt(palette.accent.slice(1, 3), 16);
    const g = parseInt(palette.accent.slice(3, 5), 16);
    const b = parseInt(palette.accent.slice(5, 7), 16);
    expect(r).toBeGreaterThan(g);
    expect(g).toBeGreaterThan(b);
  });

  it("на сером фото отдаёт запасной цвет", () => {
    // У серого оттенка нет вовсе: без запасного акцент был бы случайным.
    expect(paletteFrom(fill([128, 128, 128], 500))).toEqual(FALLBACK);
  });

  it("на почти пустом фото отдаёт запасной цвет", () => {
    expect(paletteFrom(fill([230, 120, 40], 5))).toEqual(FALLBACK);
  });

  it("не пускает в голосование прозрачные пиксели", () => {
    const data = fill([230, 120, 40], 500);
    for (let i = 3; i < data.length; i += 4) data[i] = 0;
    expect(paletteFrom(data)).toEqual(FALLBACK);
  });

  it("яркое пятно перебивает блёклый фон", () => {
    // 400 блёклых синеватых против 120 сочных оранжевых: побеждают
    // оранжевые, потому что вес — насыщенность, а не количество.
    const dull = fill([120, 130, 150], 400);
    const vivid = fill([240, 110, 20], 120);
    const both = new Uint8ClampedArray(dull.length + vivid.length);
    both.set(dull);
    both.set(vivid, dull.length);

    const palette = paletteFrom(both);
    const r = parseInt(palette.accent.slice(1, 3), 16);
    const b = parseInt(palette.accent.slice(5, 7), 16);
    expect(r).toBeGreaterThan(b);
  });

  it("акцент всегда одной светлоты, каким бы ни было фото", () => {
    // Иначе на тёмном снимке акцент сливался бы с фоном, а на светлом
    // выжигал глаза. Из фото берётся только оттенок.
    for (const rgb of [
      [230, 120, 40],
      [20, 90, 200],
      [40, 200, 90],
      [200, 40, 160],
    ] as [number, number, number][]) {
      const { accent } = paletteFrom(fill(rgb, 500));
      const r = parseInt(accent.slice(1, 3), 16) / 255;
      const g = parseInt(accent.slice(3, 5), 16) / 255;
      const b = parseInt(accent.slice(5, 7), 16) / 255;
      const light = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
      expect(light).toBeGreaterThan(0.5);
      expect(light).toBeLessThan(0.66);
    }
  });
});

describe("hsl", () => {
  it("считает крайние точки", () => {
    expect(hsl(0, 1, 0.5)).toBe("#ff0000");
    expect(hsl(120, 1, 0.5)).toBe("#00ff00");
    expect(hsl(240, 1, 0.5)).toBe("#0000ff");
    expect(hsl(0, 0, 0)).toBe("#000000");
    expect(hsl(0, 0, 1)).toBe("#ffffff");
  });
});

describe("wrap", () => {
  it("переносит по словам, не разрывая их зря", () => {
    expect(wrap("одно два три", 80, mono)).toEqual(["одно два", "три"]);
  });

  it("сохраняет переводы строк исходного текста", () => {
    // В промте перевод строки — часть смысла, а не оформление.
    expect(wrap("первая\nвторая", 200, mono)).toEqual(["первая", "вторая"]);
  });

  it("режет слово, которое не влезает целиком", () => {
    // Иначе длинный адрес уезжает за край кадра.
    const lines = wrap("ааааааааааааааа", 50, mono);
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) expect(mono(line)).toBeLessThanOrEqual(50);
  });

  it("ни одна строка не шире отведённого", () => {
    const lines = wrap(
      "Промт это не заклинание он работает когда даёт модели три вещи",
      120,
      mono,
    );
    for (const line of lines) expect(mono(line)).toBeLessThanOrEqual(120);
  });
});

describe("fitSize", () => {
  const measureAt = (size: number) => (text: string) => text.length * size * 0.5;

  it("берёт самый крупный кегль, при котором текст влезает", () => {
    const { size } = fitSize(
      "Мой голос, не средний",
      { width: 400, height: 200 },
      [96, 72, 56, 40],
      measureAt,
    );
    expect(size).toBeLessThanOrEqual(96);
    expect(size).toBeGreaterThanOrEqual(40);
  });

  it("длинный заголовок уводит на кегль мельче", () => {
    const short = fitSize(
      "Коротко",
      { width: 400, height: 200 },
      [96, 72, 56, 40],
      measureAt,
    );
    const long = fitSize(
      "Заголовок, который в две строки не помещается никакими силами и продолжает идти",
      { width: 400, height: 200 },
      [96, 72, 56, 40],
      measureAt,
    );
    expect(long.size).toBeLessThan(short.size);
  });

  it("не влезло нигде — отдаёт самый мелкий, а не обрезает", () => {
    const { size, lines } = fitSize(
      "слово ".repeat(200),
      { width: 100, height: 50 },
      [96, 72, 56, 40],
      measureAt,
    );
    expect(size).toBe(40);
    expect(lines.length).toBeGreaterThan(1);
  });
});

describe("slideNumber", () => {
  it("считает от единицы и добавляет ведущий ноль", () => {
    expect(slideNumber(0, 9)).toBe("01/09");
    expect(slideNumber(4, 9)).toBe("05/09");
  });

  it("ширина строки не прыгает между слайдами", () => {
    // Ради этого и ведущий ноль: иначе на десятом слайде шапка кадра
    // съезжает, и на пролистывании это заметно.
    const total = 12;
    const widths = new Set(
      Array.from({ length: total }, (_, i) => slideNumber(i, total).length),
    );
    expect(widths.size).toBe(1);
  });
});
