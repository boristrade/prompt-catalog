/*
  Шаблоны слайдов — код, а не картинки от нейросети.

  Так сделано нарочно. Сгенерированная картинка не повторяется дважды:
  второй слайд выходит в другом стиле, чем первый, а карусель — это
  набор, где одинаковость и есть дизайн. И текст на генерации ломается:
  кириллица в картинках у всех моделей выходит с ошибками в буквах, а
  ник обязан читаться на всех слайдах одинаково.

  Рисуем канвасом, а не снимаем скриншот с вёрстки: канвас даёт точный
  пиксель и одинаковый результат на телефоне и на компьютере, а
  скриншотилки спотыкаются о шрифты и на iOS ведут себя иначе.
*/

import { wrap, fitSize, slideNumber, type Measure } from "./layout";
import type { Palette } from "./palette";

/** Размер кадра. 4:5 — самый крупный, что Instagram не обрезает. */
export const W = 1080;
export const H = 1350;

/** Поля кадра. Меньше 80 — и текст лезет под интерфейс приложения. */
const PAD = 84;

const SANS = "Inter, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const INK = "#f4f2ef";
const MUTED = "#a5a09a";
const CANVAS = "#0d0c0b";
const PANEL = "#191715";
const LINE = "#2a2724";

export type SlideKind = "cover" | "statement" | "prompt";

export interface Slide {
  kind: SlideKind;
  /** Рубрика над заголовком. */
  eyebrow: string;
  title: string;
  /** Абзацы под заголовком. Для kind: prompt — не используется. */
  body: string;
  /** Текст промта в рамке. Только для kind: prompt. */
  code: string;
  /** Вывод под чертой, акцентным цветом. */
  takeaway: string;
}

export interface Deck {
  handle: string;
  tagline: string;
  slides: Slide[];
}

/* ── Мелкие помощники рисования ──────────────────────────────────── */

function measureWith(ctx: CanvasRenderingContext2D, font: string): Measure {
  return (text) => {
    ctx.font = font;
    return ctx.measureText(text).width;
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Строки подряд от базовой линии вниз. Возвращает нижнюю границу. */
function lines(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  x: number,
  y: number,
  step: number,
): number {
  let cursor = y;
  for (const row of rows) {
    ctx.fillText(row, x, cursor);
    cursor += step;
  }
  return cursor;
}

/* ── Общие слои ──────────────────────────────────────────────────── */

/*
  Фон: почти чёрный холст и тёплое свечение в верхнем правом углу —
  оттенком из фотографии. Свечение важнее, чем кажется: без него
  тёмный слайд читается как пустая заливка, а не как кадр.
*/
function ground(ctx: CanvasRenderingContext2D, palette: Palette) {
  ctx.fillStyle = CANVAS;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.86, H * 0.16, 0, W * 0.86, H * 0.16, W * 0.95);
  glow.addColorStop(0, palette.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
}

/** Шапка кадра: номер слева, рубрика справа, тонкая черта под ними. */
function header(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  left: string,
  right: string,
) {
  ctx.font = `500 26px ${MONO}`;
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = palette.accent;
  ctx.fillText(left, PAD, 104);

  ctx.fillStyle = MUTED;
  ctx.textAlign = "right";
  ctx.fillText(right.toUpperCase(), W - PAD, 104);
  ctx.textAlign = "left";

  ctx.fillStyle = LINE;
  ctx.fillRect(PAD, 126, W - PAD * 2, 2);
}

/** Ник внизу слева — на каждом слайде, это и есть авторство. */
function signature(
  ctx: CanvasRenderingContext2D,
  handle: string,
  tagline: string,
) {
  ctx.font = `500 30px ${MONO}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(handle, PAD, H - PAD - (tagline ? 44 : 0));

  if (tagline) {
    ctx.font = `400 26px ${SANS}`;
    ctx.fillStyle = "#7c7770";
    ctx.fillText(tagline, PAD, H - PAD);
  }
}

/*
  Гигантская цифра в правом нижнем углу, еле различимая. Она даёт кадру
  глубину и подсказывает, где человек в карусели, — но не спорит с
  текстом, потому что почти сливается с фоном.
*/
function ghostNumber(ctx: CanvasRenderingContext2D, value: number) {
  ctx.save();
  ctx.font = `700 420px ${SANS}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(255,255,255,0.045)";
  ctx.fillText(String(value), W - PAD + 24, H - 210);
  ctx.restore();
}

/** Короткая акцентная черта и вывод под ней. */
function takeawayBlock(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  text: string,
  y: number,
): number {
  if (!text) return y;

  ctx.fillStyle = palette.accent;
  ctx.fillRect(PAD, y, 120, 5);

  ctx.font = `700 38px ${SANS}`;
  const rows = wrap(text, W - PAD * 2, measureWith(ctx, `700 38px ${SANS}`));
  ctx.fillStyle = palette.accent;
  ctx.font = `700 38px ${SANS}`;
  return lines(ctx, rows, PAD, y + 76, 50);
}

/* ── Шаблоны ─────────────────────────────────────────────────────── */

/*
  Обложка. Фотография во весь кадр, поверх — затемнение снизу и слева,
  чтобы заголовок читался, каким бы ни было фото.

  Затемнение двойное: вертикальное поднимает низ, боковое — левый край,
  где стоит текст. Одного вертикального мало: на светлом снимке
  заголовок в середине кадра всё равно пропадает.
*/
function drawCover(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  deck: Deck,
  palette: Palette,
  photo: CanvasImageSource | null,
) {
  ground(ctx, palette);

  if (photo) {
    const iw = Number((photo as HTMLImageElement).naturalWidth || W);
    const ih = Number((photo as HTMLImageElement).naturalHeight || H);
    // Заполняем кадр целиком, лишнее срезаем — поля вокруг фото
    // выглядят как ошибка вёрстки, а не как приём.
    const scale = Math.max(W / iw, H / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(photo, (W - dw) / 2, (H - dh) / 2, dw, dh);
  }

  const down = ctx.createLinearGradient(0, H * 0.25, 0, H);
  down.addColorStop(0, "rgba(13,12,11,0)");
  down.addColorStop(1, "rgba(13,12,11,0.94)");
  ctx.fillStyle = down;
  ctx.fillRect(0, 0, W, H);

  const side = ctx.createLinearGradient(0, 0, W * 0.8, 0);
  side.addColorStop(0, "rgba(13,12,11,0.9)");
  side.addColorStop(1, "rgba(13,12,11,0)");
  ctx.fillStyle = side;
  ctx.fillRect(0, 0, W, H);

  if (slide.eyebrow) {
    ctx.font = `700 26px ${MONO}`;
    ctx.fillStyle = palette.accent;
    ctx.fillText(slide.eyebrow.toUpperCase(), PAD, 108);
  }

  const box = { width: W - PAD * 2 - 40, height: 380 };
  const { size, lines: rows } = fitSize(
    slide.title,
    box,
    [92, 80, 68, 58, 48],
    (s) => measureWith(ctx, `700 ${s}px ${SANS}`),
    1.12,
  );

  const height = rows.length * size * 1.12;
  const top = H * 0.5 - height / 2;

  // Акцентная планка слева от заголовка — отсюда взгляд начинает читать.
  ctx.fillStyle = palette.accent;
  ctx.fillRect(PAD, top - size * 0.82, 8, height);

  ctx.font = `700 ${size}px ${SANS}`;
  ctx.fillStyle = INK;
  const after = lines(ctx, rows, PAD + 40, top, size * 1.12);

  if (slide.takeaway) {
    const label = slide.takeaway;
    ctx.font = `400 28px ${MONO}`;
    const w = ctx.measureText(label).width + 60;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    roundRect(ctx, PAD + 40, after - 4, w, 68, 12);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(label, PAD + 70, after + 40);
  }

  signature(ctx, deck.handle, deck.tagline);
}

/** Слайд-утверждение: рубрика, крупный заголовок, абзацы, вывод. */
function drawStatement(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  deck: Deck,
  palette: Palette,
  index: number,
  total: number,
) {
  ground(ctx, palette);
  header(ctx, palette, slideNumber(index, total), slide.eyebrow || "");
  ghostNumber(ctx, index + 1);

  let y = 330;

  if (slide.eyebrow) {
    ctx.font = `700 26px ${MONO}`;
    ctx.fillStyle = palette.accent;
    ctx.fillText(slide.eyebrow.toUpperCase(), PAD, y);
    y += 76;
  }

  const { size, lines: rows } = fitSize(
    slide.title,
    { width: W - PAD * 2, height: 300 },
    [82, 72, 62, 52],
    (s) => measureWith(ctx, `700 ${s}px ${SANS}`),
    1.14,
  );
  ctx.font = `700 ${size}px ${SANS}`;
  ctx.fillStyle = INK;
  y = lines(ctx, rows, PAD, y, size * 1.14) + 30;

  if (slide.body) {
    ctx.font = `400 36px ${SANS}`;
    const rowsBody = wrap(
      slide.body,
      W - PAD * 2,
      measureWith(ctx, `400 36px ${SANS}`),
    );
    ctx.font = `400 36px ${SANS}`;
    ctx.fillStyle = MUTED;
    y = lines(ctx, rowsBody, PAD, y + 24, 54) + 40;
  }

  takeawayBlock(ctx, palette, slide.takeaway, y);
  signature(ctx, deck.handle, deck.tagline);
}

/*
  Слайд с промтом. Текст лежит в тёмной рамке с акцентной планкой слева
  — той же формы, что блок кода в интерфейсах. Так сразу видно, что это
  не рассуждение, а то, что копируют целиком.
*/
function drawPrompt(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  deck: Deck,
  palette: Palette,
  index: number,
  total: number,
) {
  ground(ctx, palette);
  header(ctx, palette, slideNumber(index, total), slide.eyebrow || "");
  ghostNumber(ctx, index + 1);

  let y = 330;

  if (slide.eyebrow) {
    ctx.font = `700 26px ${MONO}`;
    ctx.fillStyle = palette.accent;
    ctx.fillText(slide.eyebrow.toUpperCase(), PAD, y);
    y += 74;
  }

  const { size, lines: rows } = fitSize(
    slide.title,
    { width: W - PAD * 2, height: 200 },
    [82, 70, 60, 50],
    (s) => measureWith(ctx, `700 ${s}px ${SANS}`),
    1.14,
  );
  ctx.font = `700 ${size}px ${SANS}`;
  ctx.fillStyle = INK;
  y = lines(ctx, rows, PAD, y, size * 1.14) + 34;

  if (slide.code) {
    const inner = W - PAD * 2 - 96;
    const rowsCode = wrap(
      slide.code,
      inner,
      measureWith(ctx, `400 31px ${MONO}`),
    );
    const boxH = rowsCode.length * 46 + 72;

    ctx.fillStyle = PANEL;
    roundRect(ctx, PAD, y, W - PAD * 2, boxH, 18);
    ctx.fill();
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    roundRect(ctx, PAD, y, W - PAD * 2, boxH, 18);
    ctx.stroke();

    ctx.fillStyle = palette.accent;
    ctx.fillRect(PAD, y + 14, 6, boxH - 28);

    ctx.font = `400 31px ${MONO}`;
    ctx.fillStyle = "#d8d3cd";
    lines(ctx, rowsCode, PAD + 52, y + 60, 46);

    y += boxH + 46;
  }

  takeawayBlock(ctx, palette, slide.takeaway, y);
  signature(ctx, deck.handle, deck.tagline);
}

/** Рисует слайд целиком. Холст должен быть 1080×1350. */
export function drawSlide(
  ctx: CanvasRenderingContext2D,
  deck: Deck,
  palette: Palette,
  index: number,
  photo: CanvasImageSource | null,
) {
  const slide = deck.slides[index];
  const total = deck.slides.length;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  if (slide.kind === "cover") drawCover(ctx, slide, deck, palette, photo);
  else if (slide.kind === "prompt")
    drawPrompt(ctx, slide, deck, palette, index, total);
  else drawStatement(ctx, slide, deck, palette, index, total);
}
