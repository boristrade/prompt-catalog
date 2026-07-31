import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./config";
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

/*
  Стабильный адрес сайта. VERCEL_URL здесь не годится: он свой у каждой
  сборки, и canonical увёл бы поисковик на одноразовый хост, живущий до
  следующего деплоя. VERCEL_PROJECT_PRODUCTION_URL — адрес продакшена и
  переживает деплои; свой домен задаётся NEXT_PUBLIC_SITE_URL и имеет
  приоритет.
*/
export function siteBase(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  return "http://localhost:3000";
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
  for (const item of LOCALES) languages[item] = `${siteBase()}/${item}${path}`;
  languages["x-default"] = `${siteBase()}/${DEFAULT_LOCALE}${path}`;

  return { canonical: `${siteBase()}/${locale}${path}`, languages };
}

export { DEFAULT_LOCALE };
