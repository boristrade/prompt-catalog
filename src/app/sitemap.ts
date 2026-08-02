import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { PROMPTS } from "@/lib/prompts";
import { LEGAL_DOCS } from "@/lib/legal";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site";

/*
  Карта сайта.

  Без неё поисковик обходит сайт по ссылкам и находит страницы медленно и
  выборочно — а у нас каждая существует в шести языковых версиях, то есть
  восемь десятков адресов, половина из которых с главной за один переход
  не достижима.

  Языковые версии перечислены через alternates, а не отдельными записями:
  так робот понимает, что это переводы одной страницы, а не восемьдесят
  разных. Это то же самое, что говорит hreflang в самой странице, только
  сказанное заранее и всё сразу.
*/

/** Пути без языкового префикса и то, насколько они важны. */
const PATHS: { path: string; priority: number; changeFrequency: Change }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/prompts", priority: 0.9, changeFrequency: "weekly" },
  ...CATEGORIES.map((c) => ({
    path: `/prompts/${c.slug}`,
    priority: 0.9,
    changeFrequency: "weekly" as Change,
  })),
  /*
    Каждый промт отдельным адресом. Это большая часть карты — и ровно то,
    ради чего она заводилась: страницы промтов с главной за один переход
    не достижимы, а именно на них приходят из поиска.
  */
  ...PROMPTS.map((p) => ({
    path: `/prompts/${p.category}/${p.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as Change,
  })),
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools", priority: 0.7, changeFrequency: "monthly" },
  { path: "/partner", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  ...LEGAL_DOCS.map((doc) => ({
    path: `/legal/${doc}`,
    priority: 0.2,
    changeFrequency: "yearly" as Change,
  })),
];

type Change = "weekly" | "monthly" | "yearly";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  return PATHS.flatMap(({ path, priority, changeFrequency }) => {
    const languages = Object.fromEntries(
      LOCALES.map((locale) => [locale, `${base}/${locale}${path}`]),
    );

    return LOCALES.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified,
      changeFrequency,
      // Английская версия чуть важнее прочих: на неё же ведёт x-default.
      priority: locale === DEFAULT_LOCALE ? priority : priority * 0.9,
      alternates: { languages },
    }));
  });
}
