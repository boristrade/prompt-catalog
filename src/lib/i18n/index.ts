import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";
import { siteUrl } from "@/lib/site";

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

/*
  Шесть адресов одной страницы поисковик по умолчанию считает дублями и
  оставляет в выдаче один. hreflang говорит, что это переводы друг друга,
  и тогда француз находит французскую версию, а не английскую.

  x-default — куда вести того, чей язык не из списка. Ведём на английский:
  на / его отправил бы туда же и Accept-Language.
*/
export function localeAlternates(locale: Locale, path = "") {
  const languages: Record<string, string> = {};
  for (const item of LOCALES) languages[item] = `${siteUrl()}/${item}${path}`;
  languages["x-default"] = `${siteUrl()}/${DEFAULT_LOCALE}${path}`;

  return { canonical: `${siteUrl()}/${locale}${path}`, languages };
}

export { DEFAULT_LOCALE };
