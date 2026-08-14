/*
  Цвет карусели берётся из фотографии.

  Нейросеть здесь не нужна: доминирующий оттенок — это арифметика по
  пикселям, она считается за миллисекунды прямо в браузере и не стоит
  ничего. Фотографию при этом никуда не отправляем — она не покидает
  телефон.

  Из фото берём только оттенок. Насыщенность и светлоту ставим свои:
  если взять цвет пикселя как есть, на тёмном фоне он окажется то
  чёрным, то кислотным — в зависимости от того, что человек снял.
  Оттенок отвечает за «похоже на фото», фиксированные S и L — за то,
  что текст останется читаемым на любом снимке.
*/

export interface Palette {
  /** Акцент: рубрики, линии, цифры. */
  accent: string;
  /** Свечение в углу кадра — тот же оттенок, но глубокий и тёмный. */
  glow: string;
}

/** Запасной цвет — фиолетовый сайта. Ставится, когда фото серое. */
export const FALLBACK: Palette = {
  accent: "#a78bfa",
  glow: "#3b1d7a",
};

/*
  Насыщенность и светлота акцента. Подобраны так, чтобы контраст к
  почти чёрному фону оставался выше 4.5 при любом оттенке: жёлтый на
  чёрном светлее синего при одинаковой L, и без запаса синий акцент
  проваливался бы.
*/
const ACCENT_S = 0.82;
const ACCENT_L = 0.58;
const GLOW_S = 0.7;
const GLOW_L = 0.22;

/** Сколько секторов оттенка. 24 — шаг в 15°, соседние тона не сливаются. */
const BUCKETS = 24;

/*
  Пиксели, которые не голосуют:
  — почти чёрные и почти белые: у них оттенок случайный, шум матрицы;
  — блёклые: серый асфальт своей массой перебьёт единственное яркое
    пятно, ради которого фото и выбрали.
*/
const MIN_LIGHT = 0.12;
const MAX_LIGHT = 0.92;
const MIN_SAT = 0.18;

/** Голосов, ниже которых считаем фото серым и берём запасной цвет. */
const MIN_VOTES = 40;

function toHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const light = (max + min) / 2;
  const span = max - min;

  if (span === 0) return { hue: 0, sat: 0, light };

  const sat = span / (1 - Math.abs(2 * light - 1));
  let hue: number;
  if (max === rn) hue = ((gn - bn) / span) % 6;
  else if (max === gn) hue = (bn - rn) / span + 2;
  else hue = (rn - gn) / span + 4;

  hue *= 60;
  if (hue < 0) hue += 360;
  return { hue, sat, light };
}

/** HSL в hex. Доли, не проценты: hue в градусах, остальное 0..1. */
export function hsl(hue: number, sat: number, light: number): string {
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;

  const [r, g, b] =
    hue < 60
      ? [c, x, 0]
      : hue < 120
        ? [x, c, 0]
        : hue < 180
          ? [0, c, x]
          : hue < 240
            ? [0, x, c]
            : hue < 300
              ? [x, 0, c]
              : [c, 0, x];

  const hex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Палитра по пикселям фотографии.
 *
 * На вход — данные канваса (RGBA подряд), фото стоит предварительно
 * ужать: на превью 200×250 результат тот же, а работы в сто раз меньше.
 */
export function paletteFrom(pixels: Uint8ClampedArray): Palette {
  const votes = new Float64Array(BUCKETS);
  let total = 0;

  for (let i = 0; i + 3 < pixels.length; i += 4) {
    // Прозрачные пиксели не голосуют: у png с вырезанным фоном их
    // большинство, и они утянули бы оттенок в чёрный.
    if (pixels[i + 3] < 200) continue;

    const { hue, sat, light } = toHsl(pixels[i], pixels[i + 1], pixels[i + 2]);
    if (light < MIN_LIGHT || light > MAX_LIGHT || sat < MIN_SAT) continue;

    // Вес — насыщенность: одно сочное пятно весит больше, чем много
    // блёклого. Иначе акцент почти всегда получался бы бежевым.
    const bucket = Math.min(BUCKETS - 1, Math.floor((hue / 360) * BUCKETS));
    votes[bucket] += sat;
    total += 1;
  }

  if (total < MIN_VOTES) return FALLBACK;

  let best = 0;
  for (let i = 1; i < BUCKETS; i++) if (votes[i] > votes[best]) best = i;
  if (votes[best] === 0) return FALLBACK;

  // Середина сектора, а не его край: край — это уже соседний оттенок.
  const hue = ((best + 0.5) / BUCKETS) * 360;

  return {
    accent: hsl(hue, ACCENT_S, ACCENT_L),
    glow: hsl(hue, GLOW_S, GLOW_L),
  };
}
