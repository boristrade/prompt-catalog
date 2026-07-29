import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

export type { Locale, Dictionary };
export { getDictionary };

/*
  Разбирает языковой сегмент адреса. Неизвестный язык — это 404, а не
  молчаливый откат на английский: иначе /xx/pricing отдавал бы страницу
  с адресом, которого не существует, и поисковик проиндексировал бы мусор.
*/
export async function pageLocale(
  params: Promise<{ locale: string }>,
): Promise<{ locale: Locale; t: Dictionary }> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, t: getDictionary(locale) };
}

export { DEFAULT_LOCALE };
