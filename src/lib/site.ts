import "server-only";

/*
  Адрес сайта. Единственное место, где он вычисляется.

  Раньше таких мест было два — одно для метаданных, другое для оплаты, — и
  запасные варианты у них отличались. Пока переменная задана, разницы нет;
  сотрут её, и SEO переехало бы на боевой домен, а адрес для уведомлений о
  платеже — на localhost. Уведомления перестали бы приходить, оплата
  проходила бы, доступ не открывался. Разбирать такое пришлось бы по
  жалобам людей, потерявших деньги.

  Порядок источников:

  1. NEXT_PUBLIC_SITE_URL — свой домен, задаётся руками и имеет приоритет.
  2. VERCEL_PROJECT_PRODUCTION_URL — боевой адрес проекта. Vercel обновляет
     его сам при смене домена, поэтому это разумный запасной вариант, а не
     заглушка. Именно VERCEL_PROJECT_PRODUCTION_URL, а не VERCEL_URL:
     последний свой у каждой сборки и через деплой протухает.
  3. localhost — только когда ни того, ни другого нет, то есть на своей
     машине.
*/
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production}`;

  return "http://localhost:3000";
}
