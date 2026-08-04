import "server-only";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/lib/i18n/config";

/*
  Гайды-файлы: положил PDF в public/guides — он появился в списке.

  Текстовые гайды (guides.ts) живут в коде: их читает Google, по ним
  приходят из поиска по вопросу. Но так можно добавить только то, что
  кто-то заново набрал разделами и абзацами. Готовый свёрстанный PDF
  через такую форму не проходит — от него остаётся текст без вёрстки, а
  добавление превращается в переписывание.

  Поэтому второй вид: файл на диске. Каталог читается при сборке, как
  обложки направлений в covers.ts. Списка файлов в коде нет намеренно —
  иначе загрузка гайда требовала бы ещё и правки кода, а забытая строчка
  выглядела бы как «файл не загрузился».

  Открывается PDF не внутри страницы, а во весь экран в родной читалке.
  Встроенный просмотр через <iframe> на iPhone показывает первую
  страницу и не листает дальше — а больше половины заходов с телефона.
*/

const DIR = join(process.cwd(), "public", "guides");

interface Text {
  title: string;
  summary: string;
}

/**
 * Названия и описания для карточки.
 *
 * Ключ — имя файла без расширения. Файла здесь может и не быть: тогда
 * название соберётся из имени файла, и гайд всё равно откроется. Строчка
 * тут нужна, только чтобы карточка читалась по-человечески и на двух
 * языках, — но её отсутствие ничего не ломает.
 *
 * Порядок в этой таблице задаёт порядок в списке.
 */
const META: Record<string, { ru: Text; en: Text }> = {
  "telegram-mini-app": {
    ru: {
      title: "Своё приложение за вечер: Mini App",
      summary:
        "Без кода. Без идеи. Берёшь готовый чертёж успешной апки — и собираешь свою версию.",
    },
    en: {
      title: "Your own app in one evening: Mini App",
      summary:
        "No code. No idea needed. Take the blueprint of an app that already works and build your version.",
    },
  },
};

export interface PdfGuide {
  /** Имя файла без расширения. Адрес /guides/<slug> ведёт на этот PDF. */
  slug: string;
  title: string;
  summary: string;
  /** Путь к самому файлу: /guides/telegram-mini-app.pdf */
  file: string;
  /** Первая страница картинкой, если её положили рядом. */
  cover?: string;
  /** Сколько страниц — если удалось сосчитать. */
  pages?: number;
}

const COVER_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];

function split(file: string): { name: string; ext: string } | undefined {
  const dot = file.lastIndexOf(".");
  if (dot <= 0) return undefined;
  return {
    name: file.slice(0, dot),
    ext: file.slice(dot + 1).toLowerCase(),
  };
}

/*
  Название из имени файла — запасной вариант, когда строчки в META нет.
  «kak-pisat-promty.pdf» → «Kak pisat promty». Некрасиво, но лучше
  пустой карточки: видно, что файл на месте, и его можно открыть.
*/
function titleFromName(name: string): string {
  const words = name.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/*
  Число страниц — ради строчки «7 страниц» на карточке: она отвечает на
  тот же вопрос, что «8 мин чтения» у текстовых гайдов, — надолго ли это.

  Считаем по самому файлу, а не руками: руками поставленное число
  разойдётся с файлом при первой же замене, и никто этого не заметит.
  Способ грубый — ищем объекты страниц в тексте файла, — и на PDF со
  сжатыми таблицами объектов не сработает. Тогда возвращаем undefined:
  карточка просто останется без этой строчки, а гайд откроется как ни в
  чём не бывало. Врать числом хуже, чем промолчать.
*/
function countPages(path: string): number | undefined {
  const data = readFileSync(path).toString("latin1");

  // «/Type /Page», но не «/Type /Pages» — последнее это узел дерева.
  const direct = data.match(/\/Type\s*\/Page(?![s\w])/g)?.length;
  if (direct) return direct;

  const counts = [...data.matchAll(/\/Count\s+(\d+)/g)].map((m) =>
    Number(m[1]),
  );
  const max = Math.max(0, ...counts);
  return max || undefined;
}

interface Found {
  slug: string;
  file: string;
  cover?: string;
  pages?: number;
}

function readFiles(): Found[] {
  if (!existsSync(DIR)) return [];

  const covers: Record<string, string> = {};
  const pdfs: Found[] = [];

  for (const file of readdirSync(DIR).sort()) {
    const parts = split(file);
    if (!parts) continue;

    if (COVER_EXTENSIONS.includes(parts.ext)) {
      covers[parts.name] ??= `/guides/${file}`;
      continue;
    }
    if (parts.ext !== "pdf") continue;

    pdfs.push({
      slug: parts.name,
      file: `/guides/${file}`,
      pages: countPages(join(DIR, file)),
    });
  }

  for (const pdf of pdfs) pdf.cover = covers[pdf.slug];

  /*
    Сначала перечисленные в META — в том порядке, в котором они там
    записаны; затем остальные по алфавиту. Новый файл без строчки в META
    оказывается в конце, а не втискивается в середину по имени.
  */
  const order = Object.keys(META);
  return pdfs.sort((a, b) => {
    const ai = order.indexOf(a.slug);
    const bi = order.indexOf(b.slug);
    if (ai !== bi)
      return (ai < 0 ? order.length : ai) - (bi < 0 ? order.length : bi);
    return a.slug.localeCompare(b.slug);
  });
}

const FILES = readFiles();

export function allPdfGuides(locale: Locale): PdfGuide[] {
  return FILES.map((found) => {
    const meta = META[found.slug]?.[locale === "ru" ? "ru" : "en"];
    return {
      ...found,
      title: meta?.title ?? titleFromName(found.slug),
      summary: meta?.summary ?? "",
    };
  });
}

/** Гайд-файл по адресу или undefined, если такого файла нет. */
export function pdfGuide(locale: Locale, slug: string): PdfGuide | undefined {
  return allPdfGuides(locale).find((item) => item.slug === slug);
}

/*
  Пути к самим файлам — для карты сайта. Один файл на все языки: он и
  написан на одном языке, и лежит по одному адресу, так что языковых
  версий у него нет и alternates ему не нужны.
*/
export const PDF_GUIDE_PATHS = FILES.map((found) => found.file);
