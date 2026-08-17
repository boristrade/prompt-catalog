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

/*
  Два формата.

  Квадратно-вытянутый 4:5 — самый крупный, что Instagram не обрезает в
  ленте. Вертикальный 9:16 — под TikTok и сторис: там 4:5 показывают с
  полями сверху и снизу, и кадр выглядит вставленным.

  Ширина у обоих одна. Всё, что считается по горизонтали, от формата не
  зависит вовсе, а по вертикали позиции заданы долями высоты — иначе на
  9:16 текст сбился бы в верхнюю треть, а низ остался пустым.
*/
export const FRAMES = {
  post: { w: 1080, h: 1350 },
  story: { w: 1080, h: 1920 },
} as const;

export type FrameId = keyof typeof FRAMES;
export interface Frame {
  w: number;
  h: number;
}

/** Поля кадра. Меньше 80 — и текст лезет под интерфейс приложения. */
const PAD = 84;

const SANS = "Inter, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const INK = "#f4f2ef";
const MUTED = "#a5a09a";
const CANVAS = "#0d0c0b";
const PANEL = "#191715";
const LINE = "#2a2724";

export type SlideKind = "cover" | "statement" | "prompt" | "final";

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
  /** Подложить фотографию под этот слайд. У обложки она всегда. */
  photo: boolean;
}

export interface Deck {
  handle: string;
  tagline: string;
  format: FrameId;
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
function ground(ctx: CanvasRenderingContext2D, palette: Palette, f: Frame) {
  ctx.fillStyle = CANVAS;
  ctx.fillRect(0, 0, f.w, f.h);

  const glow = ctx.createRadialGradient(
    f.w * 0.86,
    f.h * 0.16,
    0,
    f.w * 0.86,
    f.h * 0.16,
    f.w * 0.95,
  );
  glow.addColorStop(0, palette.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, f.w, f.h);
  ctx.globalAlpha = 1;
}

/** Фотография во весь кадр, лишнее срезаем по центру. */
function fill(
  ctx: CanvasRenderingContext2D,
  photo: CanvasImageSource,
  f: Frame,
) {
  const iw = Number((photo as HTMLImageElement).naturalWidth || f.w);
  const ih = Number((photo as HTMLImageElement).naturalHeight || f.h);
  // Поля вокруг фото выглядят как ошибка вёрстки, а не как приём.
  const scale = Math.max(f.w / iw, f.h / ih);
  ctx.drawImage(photo, (f.w - iw * scale) / 2, (f.h - ih * scale) / 2, iw * scale, ih * scale);
}

/*
  Затемнение под текстом на слайде с фотографией.

  Сплошная плашка убила бы снимок, а один вертикальный градиент не
  спасает: на светлом кадре текст в середине всё равно пропадает.
  Поэтому и общее приглушение, и градиент от низа.
*/
function scrim(ctx: CanvasRenderingContext2D, f: Frame, flat: number) {
  ctx.fillStyle = `rgba(13,12,11,${flat})`;
  ctx.fillRect(0, 0, f.w, f.h);

  const down = ctx.createLinearGradient(0, f.h * 0.2, 0, f.h);
  down.addColorStop(0, "rgba(13,12,11,0)");
  down.addColorStop(1, "rgba(13,12,11,0.92)");
  ctx.fillStyle = down;
  ctx.fillRect(0, 0, f.w, f.h);
}

/** Шапка кадра: номер слева, рубрика справа, тонкая черта под ними. */
function header(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  left: string,
  right: string,
  f: Frame,
) {
  ctx.font = `500 26px ${MONO}`;
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = palette.accent;
  ctx.fillText(left, PAD, 104);

  ctx.fillStyle = MUTED;
  ctx.textAlign = "right";
  ctx.fillText(right.toUpperCase(), f.w - PAD, 104);
  ctx.textAlign = "left";

  ctx.fillStyle = LINE;
  ctx.fillRect(PAD, 126, f.w - PAD * 2, 2);
}

/** Ник внизу слева — на каждом слайде, это и есть авторство. */
function signature(
  ctx: CanvasRenderingContext2D,
  handle: string,
  tagline: string,
  f: Frame,
) {
  ctx.font = `500 30px ${MONO}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(handle, PAD, f.h - PAD - (tagline ? 44 : 0));

  if (tagline) {
    ctx.font = `400 26px ${SANS}`;
    ctx.fillStyle = "#7c7770";
    ctx.fillText(tagline, PAD, f.h - PAD);
  }
}

/*
  Гигантская цифра в правом нижнем углу, еле различимая. Она даёт кадру
  глубину и подсказывает, где человек в карусели, — но не спорит с
  текстом, потому что почти сливается с фоном.
*/
function ghostNumber(ctx: CanvasRenderingContext2D, value: number, f: Frame) {
  ctx.save();
  ctx.font = `700 420px ${SANS}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(255,255,255,0.045)";
  ctx.fillText(String(value), f.w - PAD + 24, f.h - f.h * 0.155);
  ctx.restore();
}

/** Короткая акцентная черта и вывод под ней. */
function takeawayBlock(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  text: string,
  y: number,
  f: Frame,
): number {
  if (!text) return y;

  ctx.fillStyle = palette.accent;
  ctx.fillRect(PAD, y, 120, 5);

  const rows = wrap(text, f.w - PAD * 2, measureWith(ctx, `700 38px ${SANS}`));
  ctx.fillStyle = palette.accent;
  ctx.font = `700 38px ${SANS}`;
  return lines(ctx, rows, PAD, y + 76, 50);
}

/** С чего начинается текст. Доля высоты, а не число: форматов два. */
function contentTop(f: Frame): number {
  return f.h * 0.245;
}

/* ── Шаблоны ─────────────────────────────────────────────────────── */

/*
  Обложка. Фотография во весь кадр, поверх — затемнение снизу и слева,
  чтобы заголовок читался, каким бы ни было фото.
*/
function drawCover(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  deck: Deck,
  palette: Palette,
  photo: CanvasImageSource | null,
  f: Frame,
) {
  ground(ctx, palette, f);
  if (photo) fill(ctx, photo, f);

  const down = ctx.createLinearGradient(0, f.h * 0.25, 0, f.h);
  down.addColorStop(0, "rgba(13,12,11,0)");
  down.addColorStop(1, "rgba(13,12,11,0.94)");
  ctx.fillStyle = down;
  ctx.fillRect(0, 0, f.w, f.h);

  const side = ctx.createLinearGradient(0, 0, f.w * 0.8, 0);
  side.addColorStop(0, "rgba(13,12,11,0.9)");
  side.addColorStop(1, "rgba(13,12,11,0)");
  ctx.fillStyle = side;
  ctx.fillRect(0, 0, f.w, f.h);

  if (slide.eyebrow) {
    ctx.font = `700 26px ${MONO}`;
    ctx.fillStyle = palette.accent;
    ctx.fillText(slide.eyebrow.toUpperCase(), PAD, 108);
  }

  const box = { width: f.w - PAD * 2 - 40, height: f.h * 0.28 };
  const { size, lines: rows } = fitSize(
    slide.title,
    box,
    [92, 80, 68, 58, 48],
    (s) => measureWith(ctx, `700 ${s}px ${SANS}`),
    1.12,
  );

  const height = rows.length * size * 1.12;
  const top = f.h * 0.5 - height / 2;

  // Акцентная планка слева от заголовка — отсюда взгляд начинает читать.
  ctx.fillStyle = palette.accent;
  ctx.fillRect(PAD, top - size * 0.82, 8, height);

  ctx.font = `700 ${size}px ${SANS}`;
  ctx.fillStyle = INK;
  const after = lines(ctx, rows, PAD + 40, top, size * 1.12);

  if (slide.takeaway) {
    ctx.font = `400 28px ${MONO}`;
    const w = ctx.measureText(slide.takeaway).width + 60;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    roundRect(ctx, PAD + 40, after - 4, w, 68, 12);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(slide.takeaway, PAD + 70, after + 40);
  }

  signature(ctx, deck.handle, deck.tagline, f);
}

/** Слайд-утверждение: рубрика, крупный заголовок, абзацы, вывод. */
function drawStatement(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  deck: Deck,
  palette: Palette,
  index: number,
  total: number,
  photo: CanvasImageSource | null,
  f: Frame,
) {
  ground(ctx, palette, f);
  if (slide.photo && photo) {
    fill(ctx, photo, f);
    scrim(ctx, f, 0.62);
  }

  header(ctx, palette, slideNumber(index, total), slide.eyebrow || "", f);
  if (!slide.photo) ghostNumber(ctx, index + 1, f);

  let y = contentTop(f);

  if (slide.eyebrow) {
    ctx.font = `700 26px ${MONO}`;
    ctx.fillStyle = palette.accent;
    ctx.fillText(slide.eyebrow.toUpperCase(), PAD, y);
    y += 76;
  }

  const { size, lines: rows } = fitSize(
    slide.title,
    { width: f.w - PAD * 2, height: f.h * 0.22 },
    [82, 72, 62, 52],
    (s) => measureWith(ctx, `700 ${s}px ${SANS}`),
    1.14,
  );
  ctx.font = `700 ${size}px ${SANS}`;
  ctx.fillStyle = INK;
  y = lines(ctx, rows, PAD, y, size * 1.14) + 30;

  if (slide.body) {
    const rowsBody = wrap(
      slide.body,
      f.w - PAD * 2,
      measureWith(ctx, `400 36px ${SANS}`),
    );
    ctx.font = `400 36px ${SANS}`;
    ctx.fillStyle = MUTED;
    y = lines(ctx, rowsBody, PAD, y + 24, 54) + 40;
  }

  takeawayBlock(ctx, palette, slide.takeaway, y, f);
  signature(ctx, deck.handle, deck.tagline, f);
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
  photo: CanvasImageSource | null,
  f: Frame,
) {
  ground(ctx, palette, f);
  if (slide.photo && photo) {
    fill(ctx, photo, f);
    scrim(ctx, f, 0.68);
  }

  header(ctx, palette, slideNumber(index, total), slide.eyebrow || "", f);
  if (!slide.photo) ghostNumber(ctx, index + 1, f);

  let y = contentTop(f);

  if (slide.eyebrow) {
    ctx.font = `700 26px ${MONO}`;
    ctx.fillStyle = palette.accent;
    ctx.fillText(slide.eyebrow.toUpperCase(), PAD, y);
    y += 74;
  }

  const { size, lines: rows } = fitSize(
    slide.title,
    { width: f.w - PAD * 2, height: f.h * 0.15 },
    [82, 70, 60, 50],
    (s) => measureWith(ctx, `700 ${s}px ${SANS}`),
    1.14,
  );
  ctx.font = `700 ${size}px ${SANS}`;
  ctx.fillStyle = INK;
  y = lines(ctx, rows, PAD, y, size * 1.14) + 34;

  if (slide.code) {
    const inner = f.w - PAD * 2 - 96;
    const rowsCode = wrap(
      slide.code,
      inner,
      measureWith(ctx, `400 31px ${MONO}`),
    );
    const boxH = rowsCode.length * 46 + 72;

    ctx.fillStyle = PANEL;
    roundRect(ctx, PAD, y, f.w - PAD * 2, boxH, 18);
    ctx.fill();
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    roundRect(ctx, PAD, y, f.w - PAD * 2, boxH, 18);
    ctx.stroke();

    ctx.fillStyle = palette.accent;
    ctx.fillRect(PAD, y + 14, 6, boxH - 28);

    ctx.font = `400 31px ${MONO}`;
    ctx.fillStyle = "#d8d3cd";
    lines(ctx, rowsCode, PAD + 52, y + 60, 46);

    y += boxH + 46;
  }

  takeawayBlock(ctx, palette, slide.takeaway, y, f);
  signature(ctx, deck.handle, deck.tagline, f);
}

/*
  Последний слайд.

  Он отличается от остальных нарочно: текст по центру, крупный ник и
  рамка с призывом. Досмотревший до конца — самый ценный читатель, и
  ему надо сказать вслух, что делать дальше. Без этого слайда карусель
  заканчивается на полуслове, и человек просто листает ленту дальше.
*/
function drawFinal(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  deck: Deck,
  palette: Palette,
  photo: CanvasImageSource | null,
  f: Frame,
) {
  ground(ctx, palette, f);
  if (slide.photo && photo) {
    fill(ctx, photo, f);
    scrim(ctx, f, 0.72);
  }

  ctx.textAlign = "center";
  const mid = f.w / 2;

  if (slide.eyebrow) {
    ctx.font = `700 26px ${MONO}`;
    ctx.fillStyle = palette.accent;
    ctx.fillText(slide.eyebrow.toUpperCase(), mid, f.h * 0.3);
  }

  const { size, lines: rows } = fitSize(
    slide.title,
    { width: f.w - PAD * 2, height: f.h * 0.2 },
    [88, 76, 64, 54],
    (s) => measureWith(ctx, `700 ${s}px ${SANS}`),
    1.14,
  );
  ctx.font = `700 ${size}px ${SANS}`;
  ctx.fillStyle = INK;
  let y = lines(ctx, rows, mid, f.h * 0.4, size * 1.14) + 20;

  if (slide.body) {
    const rowsBody = wrap(
      slide.body,
      f.w - PAD * 2 - 60,
      measureWith(ctx, `400 34px ${SANS}`),
    );
    ctx.font = `400 34px ${SANS}`;
    ctx.fillStyle = MUTED;
    y = lines(ctx, rowsBody, mid, y + 30, 50) + 30;
  }

  if (slide.takeaway) {
    ctx.font = `700 32px ${SANS}`;
    const w = ctx.measureText(slide.takeaway).width + 80;
    ctx.fillStyle = palette.accent;
    roundRect(ctx, mid - w / 2, y + 16, w, 84, 42);
    ctx.fill();
    ctx.fillStyle = "#0d0c0b";
    ctx.fillText(slide.takeaway, mid, y + 70);
    y += 130;
  }

  // Ник здесь крупный и по центру: это последнее, что видит человек.
  ctx.font = `500 40px ${MONO}`;
  ctx.fillStyle = INK;
  ctx.fillText(deck.handle, mid, y + 60);

  if (deck.tagline) {
    ctx.font = `400 28px ${SANS}`;
    ctx.fillStyle = MUTED;
    ctx.fillText(deck.tagline, mid, y + 106);
  }

  ctx.textAlign = "left";
}

/** Рисует слайд целиком. Холст должен совпадать с размером формата. */
export function drawSlide(
  ctx: CanvasRenderingContext2D,
  deck: Deck,
  palette: Palette,
  index: number,
  photo: CanvasImageSource | null,
) {
  const slide = deck.slides[index];
  const total = deck.slides.length;
  const f = FRAMES[deck.format] ?? FRAMES.post;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  if (slide.kind === "cover") drawCover(ctx, slide, deck, palette, photo, f);
  else if (slide.kind === "final") drawFinal(ctx, slide, deck, palette, photo, f);
  else if (slide.kind === "prompt")
    drawPrompt(ctx, slide, deck, palette, index, total, photo, f);
  else drawStatement(ctx, slide, deck, palette, index, total, photo, f);
}
