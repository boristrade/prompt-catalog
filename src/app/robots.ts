import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/*
  Что можно обходить и где лежит карта сайта.

  Закрыты не «секретные» разделы — прятать в robots.txt то, что должно
  быть закрыто, бессмысленно: файл читают все, и он скорее подсказка, где
  искать. Закрыты страницы, которым в поиске нечего делать: кабинет и
  админка у каждого свои, оплата — шаг воронки, а не ответ на запрос.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/*/account", "/*/admin", "/*/pay", "/*/login"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
