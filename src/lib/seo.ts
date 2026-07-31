import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { localeAlternates, siteBase } from "@/lib/i18n";

/*
  Разметка страницы одним вызовом: заголовок, описание, переводы и
  карточка для мессенджеров.

  Раздельно это не живёт. Ссылку на сайт кидают в Telegram и Instagram, и
  без og-тегов там появляется голый адрес вместо картинки с заголовком —
  разница в переходах кратная. Стоит забыть их на одной новой странице, и
  именно она окажется той, которой поделятся. Поэтому у страниц есть один
  общий вход, а не набор полей, которые каждый раз собирают заново.
*/

/** og:locale хочет формат языка со страной, а не просто «ru». */
const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  uk: "uk_UA",
  de: "de_DE",
  pl: "pl_PL",
  ru: "ru_RU",
};

export const DEFAULT_OG_IMAGE = "/og/default.jpg";

interface Options {
  locale: Locale;
  /** Путь без языка: "/pricing". Пустой — главная. */
  path?: string;
  /** Заголовок вкладки. Шаблон сам добавит «— PrompTom». */
  title: string;
  description: string;
  /** Своя карточка, если у раздела есть обложка. */
  image?: string;
  /*
    Заголовок в превью. По умолчанию к нему дописывается название сайта:
    в ленте мессенджера у ссылки нет ни адресной строки, ни вкладки, и
    без имени непонятно, куда ведёт.
  */
  socialTitle?: string;
  /** Убрать страницу из поиска. */
  noIndex?: boolean;
}

export function pageMeta({
  locale,
  path = "",
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  socialTitle,
  noIndex = false,
}: Options): Metadata {
  const url = `${siteBase()}${`/${locale}${path}`}`;
  const heading = socialTitle ?? `${title} — PrompTom`;

  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),

    openGraph: {
      type: "website",
      siteName: "PrompTom",
      url,
      title: heading,
      description,
      locale: OG_LOCALE[locale],
      // Остальные языки — подсказка роботу, что у страницы есть переводы.
      alternateLocale: LOCALES.filter((item) => item !== locale).map(
        (item) => OG_LOCALE[item],
      ),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          // alt читают в лентах те, у кого выключены картинки.
          alt: heading,
        },
      ],
    },

    twitter: {
      // Крупная карточка, а не миниатюра сбоку: превью со строчкой текста
      // рядом с почтовой маркой пролистывают, не заметив.
      card: "summary_large_image",
      title: heading,
      description,
      images: [image],
    },
  };
}

/** Карточка раздела каталога, если для него нарисована обложка. */
export function categoryOgImage(slug: string): string {
  return `/og/${slug}.jpg`;
}
