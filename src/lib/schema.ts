import { siteUrl } from "@/lib/site";

/*
  Структурированные данные (schema.org) для трёх мест на сайте:
  сайт целиком, вопрос-ответ и страница промта. Без них Google не может
  построить расширенный сниппет — раскрывающиеся вопросы прямо в выдаче,
  строку поиска под ссылкой, — и показывает голый заголовок со ссылкой,
  как и любой другой сайт без разметки.

  Каждый билдер собирает только то, что на странице действительно есть:
  никаких выдуманных дат публикации или рейтингов. Структурированные
  данные, не совпадающие с видимым содержимым страницы, Google не просто
  игнорирует — за них можно получить ручные санкции по всему сайту, а не
  только по одной странице.
*/

/**
 * Сериализует JSON-LD безопасно для `dangerouslySetInnerHTML`.
 * `<` экранируем в `<`: без этого `</script>` внутри данных
 * (например, в тексте вопроса) закрыл бы тег раньше времени и превратил
 * остаток JSON в обычный HTML на странице.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/*
  Сайт целиком — даёт Google строку поиска прямо под ссылкой в выдаче.

  На своём языке: сайт живёт по адресам вида /ru/..., /en/..., и строка
  поиска должна вести на ту же языковую версию, а не всегда на
  английскую, — иначе результат поиска был бы на одном языке, а сайт
  вокруг него открылся бы на другом.
*/
export function websiteSchema(locale: string) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PrompTom",
    url: `${base}/${locale}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/${locale}/prompts?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** Раскрывающиеся вопросы в самой выдаче — при клике сразу открыт ответ. */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/*
  Гайд как Article — здесь это честно: он написан, чтобы его читали, у
  него есть заголовок и краткое содержание, и то и другое видно на
  странице.

  Даты публикации нет намеренно. Её пришлось бы или выдумать, или
  подставить дату сборки — а дата сборки меняется при каждом деплое, и
  Google увидел бы, что «статья обновлена» там, где не поменялось ни
  слова. Разметка без даты честнее разметки с неправдой.
*/
export function articleSchema(params: {
  locale: string;
  /** Путь без языка: "/guides/claude-md". */
  path: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: `${siteUrl()}/${params.locale}${params.path}`,
    inLanguage: params.locale,
    isPartOf: {
      "@type": "WebSite",
      name: "PrompTom",
      url: siteUrl(),
    },
  };
}

/*
  Промт как CreativeWork, а не Article: у него нет автора-журналиста и
  даты публикации, и вписывать их ради более крупного значка в выдаче
  значило бы сообщить неправду разметкой, которую не видно на странице.

  isAccessibleForFree — единственное поле, которое было бы нечестным
  оставить не глядя: для PRO-промта оно false, и это ровно то, что видно
  на странице любому — задача и заголовок открыты всем, текст под замком.
*/
export function promptSchema(params: {
  locale: string;
  category: string;
  id: string;
  title: string;
  summary: string;
  tags: string[];
  free: boolean;
}) {
  const url = `${siteUrl()}/${params.locale}/prompts/${params.category}/${params.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: params.title,
    description: params.summary,
    url,
    keywords: params.tags.join(", "),
    isAccessibleForFree: params.free,
    isPartOf: {
      "@type": "WebSite",
      name: "PrompTom",
      url: siteUrl(),
    },
  };
}
