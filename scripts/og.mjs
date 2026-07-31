/*
  Генератор карточек ссылки (Open Graph).

  Картинки лежат в public/og статикой, а не рисуются на каждый запрос:
  превью запрашивают роботы мессенджеров, им нужен мгновенный ответ, и
  платить функцией за то, что меняется раз в полгода, незачем.

  Скрипт, а не «нарисовал руками в фигме»: сменится логотип или обложка
  раздела — пересобрать всё одной командой, и карточки не разойдутся с
  сайтом. Текст на картинку не пишем вовсе: заголовок и описание превью
  берёт из og:title и og:description, а они у нас на шести языках.

  Запуск: node scripts/og.mjs
  Шрифт: node scripts/og.mjs --font путь/к/inter.css  (css со встроенным
  base64; без него берётся системный гротеск — годится для черновика)
*/

import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "public/og");

const WIDTH = 1200;
const HEIGHT = 630;

const CATEGORIES = ["designers", "marketers", "ugc", "marketplaces", "saas"];

const fontArg = process.argv.indexOf("--font");
const fontCss =
  fontArg > -1 && process.argv[fontArg + 1]
    ? readFileSync(process.argv[fontArg + 1], "utf8")
    : "";

/** Знак PrompTom. Та же геометрия, что в src/components/layout/Logo.tsx. */
const MARK = `
<svg viewBox="0 0 48 48" width="110" height="110">
  <defs>
    <linearGradient id="g" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#6d28d9"/><stop offset="1" stop-color="#a855f7"/>
    </linearGradient>
    <mask id="m">
      <path d="M20 5 H30 A11 11 0 0 1 30 27 V43 H20 Z" fill="#fff"/>
      <circle cx="31.5" cy="16" r="7" fill="#000"/>
      <path d="M28 21 L23.5 30 L33 22.5 Z" fill="#000"/>
      <path d="M30 11.9 C30 15.2 28.7 16.5 25.4 16.5 C28.7 16.5 30 17.8 30 21.1 C30 17.8 31.3 16.5 34.6 16.5 C31.3 16.5 30 15.2 30 11.9 Z" fill="#fff"/>
      <path d="M34.5 10.7 C34.5 12.35 33.85 13 32.2 13 C33.85 13 34.5 13.65 34.5 15.3 C34.5 13.65 35.15 13 36.8 13 C35.15 13 34.5 12.35 34.5 10.7 Z" fill="#fff"/>
    </mask>
  </defs>
  <rect width="48" height="48" fill="url(#g)" mask="url(#m)"/>
  <rect x="11" y="8"  width="7"  height="4" rx="2" fill="url(#g)" opacity=".5"/>
  <rect x="0"  y="15" width="18" height="4" rx="2" fill="url(#g)" opacity=".85"/>
  <rect x="6"  y="22" width="12" height="4" rx="2" fill="url(#g)" opacity=".32"/>
  <rect x="9"  y="29" width="9"  height="4" rx="2" fill="url(#g)" opacity=".7"/>
  <circle cx="5"  cy="10" r="1.8" fill="url(#g)" opacity=".45"/>
  <circle cx="12" cy="37" r="1.8" fill="url(#g)" opacity=".55"/>
</svg>`;

function dataUri(file) {
  const base64 = readFileSync(file).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

/*
  Обложка раздела уходит вправо и растворяется в фоне: жёсткий край
  выглядел бы как две склеенные картинки. Слева остаётся место под знак,
  чтобы в ленте мессенджера бренд читался раньше фотографии.
*/
function html(cover) {
  return `<style>
  ${fontCss}
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    background: #09090f;
    font-family: Inter, "Liberation Sans", system-ui, sans-serif;
    color: #f5f5fa;
    position: relative; overflow: hidden;
  }
  .glow {
    position: absolute; left: -180px; top: -220px;
    width: 900px; height: 900px; border-radius: 50%;
    background: radial-gradient(closest-side, rgba(124,58,237,.42), transparent 70%);
  }
  .cover {
    position: absolute; right: 0; top: 0; width: 620px; height: 100%;
    background-image: url("${cover ?? ""}");
    background-size: cover; background-position: center;
    -webkit-mask-image: linear-gradient(to right, transparent, #000 42%);
    mask-image: linear-gradient(to right, transparent, #000 42%);
    opacity: ${cover ? 0.62 : 0};
  }
  .body { position: absolute; left: 84px; top: 50%; transform: translateY(-50%); }
  .word { margin-top: 30px; font-size: 84px; font-weight: 800; letter-spacing: -.035em; }
  .word span {
    background: linear-gradient(115deg, #7c3aed, #a855f7);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .sub { margin-top: 18px; font-size: 27px; font-weight: 400; color: #9d9db4; letter-spacing: -.01em; }
  .rule { margin-top: 34px; width: 96px; height: 5px; border-radius: 3px;
          background: linear-gradient(115deg, #7c3aed, #a855f7); }

  /* Мотив «штрихов» из знака, крупно и еле заметно. Нужен только там,
     где обложки нет: пустая правая половина выглядит как обрезанная. */
  .bars { position: absolute; right: 96px; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 26px; align-items: flex-end; }
  .bars i { display: block; height: 22px; border-radius: 11px;
            background: linear-gradient(115deg, #7c3aed, #a855f7); }
  </style>
  <div class="glow"></div>
  <div class="cover"></div>
  ${
    cover
      ? ""
      : `<div class="bars">
           <i style="width:150px;opacity:.28"></i>
           <i style="width:330px;opacity:.55"></i>
           <i style="width:240px;opacity:.18"></i>
           <i style="width:290px;opacity:.4"></i>
           <i style="width:180px;opacity:.22"></i>
         </div>`
  }
  <div class="body">
    ${MARK}
    <div class="word">Promp<span>Tom</span></div>
    <div class="sub">AI prompt catalogue</div>
    <div class="rule"></div>
  </div>`;
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});

mkdirSync(out, { recursive: true });

const jobs = [["default", null], ...CATEGORIES.map((slug) => [slug, slug])];

for (const [name, slug] of jobs) {
  const coverFile = slug ? resolve(root, `public/covers/${slug}.jpg`) : null;
  // Раздел без обложки — не повод падать: получится обычная фирменная карточка.
  const cover = coverFile && existsSync(coverFile) ? dataUri(coverFile) : null;

  await page.setContent(html(cover), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  /*
    JPEG, а не PNG: на карточке с фотографией PNG весит впятеро больше при
    неотличимой картинке, а превью тянет робот мессенджера — чем легче,
    тем раньше оно появится в переписке.
  */
  const buffer = await page.screenshot({ type: "jpeg", quality: 88 });
  writeFileSync(resolve(out, `${name}.jpg`), buffer);
  console.log(`og/${name}.jpg`, `${Math.round(buffer.length / 1024)} КБ`);
}

await browser.close();
