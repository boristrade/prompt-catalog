import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { PROMPTS } from "@/lib/prompts";
import { LEGAL_DOCS } from "@/lib/legal";
import { GUIDES } from "@/lib/guides";
import { PDF_GUIDE_PATHS } from "@/lib/pdf-guides";
import { SKILLS } from "@/lib/skills";
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
  /*
    Пополнения каталога. changeFrequency: daily — не преувеличение, а
    смысл страницы: она меняется ровно тогда, когда появляются промты, и
    робот должен приходить за ними, а не раз в месяц.
  */
  { path: "/new", priority: 0.8, changeFrequency: "daily" },
  /*
    Конструктор каруселей. Его тут не было вовсе: раздел, ради которого
    на сайт приходят из соцсетей, поисковику не показывался ни строчкой.
  */
  { path: "/carousel", priority: 0.9, changeFrequency: "monthly" },
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
  /*
    Гайды и скилы — то, ради чего приходят из поиска по вопросу, а не по
    названию сайта. Каждый отдельным адресом: на список никто не ищет,
    ищут «как писать промты» и «скил для Claude Code».
  */
  { path: "/guides", priority: 0.8, changeFrequency: "monthly" },
  ...GUIDES.map((slug) => ({
    path: `/guides/${slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as Change,
  })),
  { path: "/skills", priority: 0.8, changeFrequency: "monthly" },
  ...SKILLS.map((id) => ({
    path: `/skills/${id}`,
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

type Change = "daily" | "weekly" | "monthly" | "yearly";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  /*
    Гайды-файлы стоят отдельной строкой, а не в PATHS: у них нет языковых
    версий — файл один и лежит по одному адресу. Прогнав их через общий
    цикл, мы объявили бы шесть переводов одного PDF, которых не
    существует.
  */
  const files = PDF_GUIDE_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "monthly" as Change,
    priority: 0.7,
  }));

  return [
    ...files,
    ...PATHS.flatMap(({ path, priority, changeFrequency }) => {
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
    }),
  ];
}
