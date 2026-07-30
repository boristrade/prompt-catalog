import "server-only";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { CategorySlug } from "@/lib/categories";

/*
  Обложки направлений лежат в public/covers и подхватываются по имени
  файла: designers.jpg → карточка «Для дизайнеров». Списка в коде нет
  намеренно — иначе загрузка картинки требовала бы ещё и правки кода, а
  забытая строчка выглядела бы как «обложка не загрузилась».

  Каталог читается один раз при сборке: страница статическая, в рантайме
  файловая система за ней не ходит.
*/

const DIR = join(process.cwd(), "public", "covers");

/* jpg для фотографий, png для рисунков с прозрачностью, webp — если сжимали сами. */
const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];

function readCovers(): Partial<Record<CategorySlug, string>> {
  if (!existsSync(DIR)) return {};

  const found: Record<string, string> = {};
  for (const file of readdirSync(DIR)) {
    const dot = file.lastIndexOf(".");
    if (dot <= 0) continue;

    const name = file.slice(0, dot).toLowerCase();
    const ext = file.slice(dot + 1).toLowerCase();
    if (!EXTENSIONS.includes(ext)) continue;

    // Два файла с одним именем и разными расширениями — берём первый по алфавиту.
    found[name] ??= `/covers/${file}`;
  }

  return found;
}

const COVERS = readCovers();

/** Путь к обложке направления или undefined, если файла нет. */
export function coverFor(slug: CategorySlug): string | undefined {
  return COVERS[slug];
}
