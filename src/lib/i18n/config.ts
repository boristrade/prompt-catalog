/*
  Порядок здесь — это порядок в переключателе языков на сайте.
  Русский последний осознанно: аудитория каталога шире, чем русскоязычная.
*/
export const LOCALES = ["en", "fr", "uk", "de", "pl", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

/*
  Язык по умолчанию — тот, на который уводит корень сайта, когда по
  заголовкам браузера ничего не подобралось.
*/
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  uk: "Українська",
  de: "Deutsch",
  pl: "Polski",
  ru: "Русский",
};

/** Короткая подпись для кнопки переключателя. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  uk: "UK",
  de: "DE",
  pl: "PL",
  ru: "RU",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/*
  Подбирает язык по заголовку Accept-Language.

  Разбираем грубо, без веса q: берём коды по порядку и первый, который
  знаем, — этого достаточно. Полноценный разбор RFC 4647 здесь ничего
  не улучшит, а ошибиться в нём легко.
*/
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  for (const part of acceptLanguage.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    // ru-RU → ru
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}

/** Меняет язык в пути: /fr/pricing → /de/pricing. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  // parts[0] пустой, parts[1] — язык.
  if (parts.length > 1 && isLocale(parts[1])) {
    parts[1] = next;
    return parts.join("/");
  }
  return `/${next}${pathname}`;
}
