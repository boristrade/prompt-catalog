import "server-only";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/lib/i18n/config";

/*
  Шаблоны — витрина результата.

  Отличаются от каталога промтов тем, что здесь главное не текст, а
  картинка: человек видит, что получается, и забирает промт целиком одной
  кнопкой. Каталог отвечает на «мне нужен промт для задачи», шаблоны — на
  «а что вообще так можно?».

  Картинки лежат в public/templates и подхватываются по id, как обложки
  разделов: ai-avatar.jpg → шаблон «Создаём ИИ-аватара». Списка файлов в
  коде нет намеренно — иначе добавление картинки требовало бы ещё и правки
  кода, а забытая строчка выглядела бы как «картинка не загрузилась».
*/

export interface Template {
  id: string;
  title: string;
  summary: string;
  /** Где запускать: подпись под карточкой. */
  bestFor: string;
  prompt: string;
}

const RU: Template[] = [
  {
    id: "ai-avatar",
    title: "Создаём ИИ-аватара",
    summary:
      "Один персонаж, который выглядит одинаково на всех кадрах — основа для канала, бренда или маскота.",
    bestFor: "Midjourney / Sora / Nano Banana",
    prompt: `Создай фотореалистичный портрет персонажа для повторяющегося использования.

Персонаж: {пол}, {возраст} лет, {национальность/типаж}
Внешность: {цвет и длина волос}, {цвет глаз}, {особая примета — родинка, веснушки, шрам}
Одежда: {стиль одежды}, {основной цвет}
Настроение: {дружелюбное / серьёзное / дерзкое}

Кадр: портрет по грудь, взгляд в камеру, нейтральный фон {цвет фона}
Свет: мягкий рассеянный спереди, лёгкий контровой сзади
Камера: 85mm, диафрагма f/2.0, малая глубина резкости
Качество: фотореализм, детальная кожа с естественной текстурой, без пластиковости

Важно для повторяемости: запомни и повторяй в следующих кадрах ровно эти черты — {ключевая примета 1}, {ключевая примета 2}. Меняй только ракурс, фон и одежду.`,
  },
  {
    id: "ugc-creator",
    title: "Создаём UGC-блогера",
    summary:
      "Ролик «как будто снял обычный человек на телефон» — для рекламы, которая не выглядит рекламой.",
    bestFor: "Sora / Veo / Kling",
    prompt: `Сгенерируй вертикальное видео в стиле UGC — как будто снято на телефон обычным человеком, без студии.

Герой: {пол}, {возраст} лет, {типаж — свой парень / уставшая мама / студент}
Место: {кухня / ванная / машина / улица}, естественный бытовой беспорядок в кадре
Продукт в руках: {название продукта}

Действие по секундам:
0–2 с: держит продукт близко к камере, говорит {первая фраза-крючок}
2–6 с: показывает, как пользуется, камера чуть дрожит
6–10 с: смотрит в камеру, говорит {главная выгода}

Съёмка: фронтальная камера телефона, вертикаль 9:16, естественный свет из окна
Стиль: без штатива, лёгкая тряска, без цветокоррекции, звук как из телефона
Важно: НЕ должно выглядеть как реклама — никакого глянца, идеального света и постановочных улыбок.`,
  },
  {
    id: "ai-cartoon",
    title: "Создаём ИИ-мультфильмы",
    summary:
      "Сцена в мультстиле с узнаваемым персонажем — короткие ролики для детского или развлекательного канала.",
    bestFor: "Sora / Veo / Midjourney",
    prompt: `Создай кадр анимационного мультфильма.

Стиль анимации: {3D Pixar-подобный / плоский 2D / аниме / пластилиновый}
Персонаж: {кто это — зверёк, ребёнок, робот}, {главная черта внешности}
Эмоция: {радость / удивление / задумчивость}

Сцена: {где происходит действие}
Время суток: {утро / день / закат / ночь}
Что делает персонаж: {действие одним предложением}

Композиция: {общий план / средний / крупный}, персонаж {слева / по центру / справа}
Палитра: {2–3 основных цвета}, мягкие тени, тёплый свет
Детали: выразительные большие глаза, чистые силуэты, фон слегка размыт

Соотношение сторон: {16:9 для YouTube / 9:16 для Shorts}`,
  },
  {
    id: "product-ad",
    title: "Рекламное видео продукта",
    summary:
      "Динамичный ролик для товара — на примере спортивного питания, но подходит любому продукту в банке или коробке.",
    bestFor: "Sora / Veo / Runway",
    prompt: `Сгенерируй рекламный ролик продукта — динамичный, без людей в кадре.

Продукт: {название}, {тип упаковки — банка / туба / коробка}
Цвета упаковки: {основной цвет} и {акцентный цвет}
Ниша: {спортивное питание / косметика / напиток}

Раскадровка:
0–2 с: продукт вращается на тёмном фоне, по краям бегут блики
2–4 с: макросъёмка — {текстура: порошок сыплется / капли на банке / порошок в шейкере}
4–7 с: продукт в руке на фоне {спортзал / кухня / улица}, движение камеры вокруг
7–10 с: продукт в центре, за ним вспышка света, появляется логотип

Свет: контрастный, драматичный, {цвет} подсветка сзади
Камера: плавные движения на слайдере, замедление в конце каждого кадра
Стиль: премиальная реклама, глубокий чёрный фон, высокий контраст
Формат: {9:16 вертикально / 16:9 горизонтально}`,
  },
  {
    id: "ai-blogger",
    title: "Создаём ИИ-блогера",
    summary:
      "Виртуальный ведущий, который говорит на камеру — один персонаж на весь канал, без съёмок и студии.",
    bestFor: "Sora / HeyGen / Veo",
    prompt: `Создай видео говорящего на камеру виртуального блогера.

Ведущий: {пол}, {возраст} лет, {типаж — эксперт / друг / провокатор}
Внешность: {причёска}, {одежда}, {особая деталь — очки, серьга, кепка}
Манера речи: {спокойная и уверенная / быстрая и энергичная / ироничная}

Фон: {домашний кабинет / студия с неоном / кирпичная стена / улица}
Свет: {мягкий кольцевой спереди / контрастный неоновый / дневной из окна}

Что говорит: {текст реплики на 15–20 секунд}

Кадр: средний план по грудь, взгляд прямо в камеру, лёгкие естественные жесты руками
Камера: статичная, едва заметное покачивание для живости
Липсинк: губы точно попадают в произносимый текст
Формат: {9:16 для Shorts и Reels / 16:9 для YouTube}

Для повторяемости: сохрани внешность и фон, чтобы следующие выпуски выглядели как тот же канал.`,
  },
];

const EN: Template[] = [
  {
    id: "ai-avatar",
    title: "Build an AI avatar",
    summary:
      "One character who looks the same in every shot — a base for a channel, a brand or a mascot.",
    bestFor: "Midjourney / Sora / Nano Banana",
    prompt: `Create a photorealistic portrait of a character meant for repeated use.

Character: {gender}, {age} years old, {ethnicity/type}
Looks: {hair colour and length}, {eye colour}, {distinctive mark — mole, freckles, scar}
Clothing: {style}, {main colour}
Mood: {friendly / serious / bold}

Framing: chest-up portrait, looking into the camera, plain {background colour} backdrop
Light: soft diffused key from the front, subtle rim light behind
Camera: 85mm, f/2.0, shallow depth of field
Quality: photorealistic, detailed skin with natural texture, nothing plastic-looking

For consistency: remember and repeat exactly these traits in later shots — {key trait 1}, {key trait 2}. Vary only the angle, background and clothing.`,
  },
  {
    id: "ugc-creator",
    title: "Build a UGC creator",
    summary:
      "A clip that looks shot on a phone by a regular person — for ads that do not look like ads.",
    bestFor: "Sora / Veo / Kling",
    prompt: `Generate a vertical UGC-style video — as if filmed on a phone by an ordinary person, no studio.

Person: {gender}, {age} years old, {type — regular guy / tired mum / student}
Place: {kitchen / bathroom / car / street}, natural everyday clutter in frame
Product in hand: {product name}

Action by seconds:
0–2 s: holds the product close to camera, says {opening hook line}
2–6 s: demonstrates using it, camera shakes slightly
6–10 s: looks into the camera, says {main benefit}

Filming: phone front camera, vertical 9:16, natural window light
Style: handheld, slight shake, no colour grading, phone-quality audio
Important: it must NOT look like an ad — no gloss, no perfect lighting, no staged smiles.`,
  },
  {
    id: "ai-cartoon",
    title: "Build AI cartoons",
    summary:
      "A cartoon scene with a recognisable character — short clips for a kids or entertainment channel.",
    bestFor: "Sora / Veo / Midjourney",
    prompt: `Create a frame from an animated cartoon.

Animation style: {Pixar-like 3D / flat 2D / anime / claymation}
Character: {who it is — animal, child, robot}, {main visual trait}
Emotion: {joy / surprise / thoughtfulness}

Scene: {where the action happens}
Time of day: {morning / day / sunset / night}
What the character does: {action in one sentence}

Composition: {wide / medium / close-up}, character {left / centre / right}
Palette: {2–3 main colours}, soft shadows, warm light
Details: expressive large eyes, clean silhouettes, slightly blurred background

Aspect ratio: {16:9 for YouTube / 9:16 for Shorts}`,
  },
  {
    id: "product-ad",
    title: "Product ad video",
    summary:
      "A dynamic product clip — shown on sports nutrition, but it fits anything sold in a tub or a box.",
    bestFor: "Sora / Veo / Runway",
    prompt: `Generate a product commercial — dynamic, with no people in frame.

Product: {name}, {packaging type — tub / tube / box}
Packaging colours: {main colour} and {accent colour}
Niche: {sports nutrition / cosmetics / drink}

Storyboard:
0–2 s: product rotating on a dark background, highlights running along the edges
2–4 s: macro shot — {texture: powder pouring / droplets on the tub / powder in a shaker}
4–7 s: product in hand against {gym / kitchen / street}, camera orbiting
7–10 s: product centred, light flare behind it, logo appears

Light: contrasty and dramatic, {colour} backlight
Camera: smooth slider moves, easing out at the end of each shot
Style: premium commercial, deep black background, high contrast
Format: {9:16 vertical / 16:9 horizontal}`,
  },
  {
    id: "ai-blogger",
    title: "Build an AI blogger",
    summary:
      "A virtual host talking to camera — one character for the whole channel, no filming and no studio.",
    bestFor: "Sora / HeyGen / Veo",
    prompt: `Create a talking-head video of a virtual blogger.

Host: {gender}, {age} years old, {type — expert / friend / provocateur}
Looks: {hairstyle}, {clothing}, {distinctive detail — glasses, earring, cap}
Delivery: {calm and confident / fast and energetic / ironic}

Background: {home office / neon studio / brick wall / street}
Light: {soft ring light in front / contrasty neon / daylight from a window}

What they say: {15–20 seconds of script}

Framing: medium chest-up shot, looking straight into camera, light natural hand gestures
Camera: static, barely perceptible sway to keep it alive
Lip sync: mouth matches the spoken text exactly
Format: {9:16 for Shorts and Reels / 16:9 for YouTube}

For consistency: keep the looks and background so later episodes read as the same channel.`,
  },
];

/* Картинки-примеры. Читаем каталог один раз при сборке, как обложки. */
const DIR = join(process.cwd(), "public", "templates");
const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];

function readImages(): Record<string, string> {
  if (!existsSync(DIR)) return {};

  const found: Record<string, string> = {};
  for (const file of readdirSync(DIR)) {
    const dot = file.lastIndexOf(".");
    if (dot <= 0) continue;

    const name = file.slice(0, dot).toLowerCase();
    const ext = file.slice(dot + 1).toLowerCase();
    if (!EXTENSIONS.includes(ext)) continue;

    found[name] ??= `/templates/${file}`;
  }
  return found;
}

const IMAGES = readImages();

/** Картинка-пример или undefined, пока файла нет. */
export function templateImage(id: string): string | undefined {
  return IMAGES[id];
}

export function templatesFor(locale: Locale): Template[] {
  return locale === "ru" ? RU : EN;
}

/*
  Английские шаблоны обязаны совпадать по id с русскими: по id ищется
  картинка. Расхождение здесь ломало бы витрину молча — на английской
  версии пропали бы примеры. Пусть лучше падает сборка.
*/
const ruIds = RU.map((item) => item.id).join(",");
const enIds = EN.map((item) => item.id).join(",");
if (ruIds !== enIds) {
  throw new Error(
    `templates.ts: списки шаблонов разошлись\n  ru: ${ruIds}\n  en: ${enIds}`,
  );
}
