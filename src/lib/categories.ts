// Категории каталога — совпадают с enum prompt_category в БД (Фаза 2)
export type CategorySlug =
  | "designers"
  | "marketers"
  | "ugc"
  | "marketplaces"
  | "saas";

export interface Category {
  slug: CategorySlug;
  title: string;
  nav: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "designers",
    title: "Промты для дизайнеров",
    nav: "Для дизайнеров",
    description: "Генерация концептов, мудборды, UI-макеты, брендинг и айдентика.",
  },
  {
    slug: "marketers",
    title: "Промты для маркетологов",
    nav: "Для маркетологов",
    description: "Рекламные креативы, стратегии, воронки, тексты объявлений.",
  },
  {
    slug: "ugc",
    title: "Промты для UGC",
    nav: "Для UGC",
    description: "Сценарии роликов, хуки, нативный контент для TikTok и Reels.",
  },
  {
    slug: "marketplaces",
    title: "Промты для маркетплейсов",
    nav: "Для маркетплейсов",
    description: "Карточки товаров, инфографика, SEO-описания для WB и Ozon.",
  },
  {
    slug: "saas",
    title: "Промты для SaaS-проектов",
    nav: "Для SaaS",
    description:
      "Проверка идеи, границы MVP, онбординг, тарифы и метрики роста.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
