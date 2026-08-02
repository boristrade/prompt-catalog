import { describe, it, expect } from "vitest";
import { faqSchema, jsonLd, promptSchema, websiteSchema } from "./schema";

describe("jsonLd", () => {
  it("экранирует < , чтобы </script> внутри данных не закрыл тег раньше времени", () => {
    const html = jsonLd({ a: "</script><script>alert(1)</script>" });
    expect(html).not.toContain("</script>");
    expect(html).toContain("\\u003c/script>");
  });

  it("остаётся валидным JSON после экранирования", () => {
    const data = { q: "Как это работает <b>тут</b>?" };
    const html = jsonLd(data);
    expect(JSON.parse(html.replace(/\\u003c/g, "<"))).toEqual(data);
  });
});

describe("websiteSchema", () => {
  it("строка поиска ведёт на каталог того же языка", () => {
    const schema = websiteSchema("ru");
    expect(schema.url).toContain("/ru");
    expect(schema.potentialAction.target).toContain("/ru/prompts?q=");
    expect(schema.potentialAction.target).toContain("{search_term_string}");
  });
});

describe("faqSchema", () => {
  it("каждый вопрос становится Question/Answer в mainEntity", () => {
    const items = [
      { q: "Вопрос один?", a: "Ответ один." },
      { q: "Вопрос два?", a: "Ответ два." },
    ];
    const schema = faqSchema(items);

    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Вопрос один?",
      acceptedAnswer: { "@type": "Answer", text: "Ответ один." },
    });
  });
});

describe("promptSchema", () => {
  it("isAccessibleForFree совпадает с тарифом промта", () => {
    const free = promptSchema({
      locale: "en",
      category: "designers",
      id: "test",
      title: "Test prompt",
      summary: "Summary",
      tags: ["a", "b"],
      free: true,
    });
    const pro = promptSchema({ ...freeParams(), free: false });

    expect(free.isAccessibleForFree).toBe(true);
    expect(pro.isAccessibleForFree).toBe(false);
  });

  it("адрес собирается из локали, раздела и id", () => {
    const schema = promptSchema(freeParams());
    expect(schema.url).toMatch(/\/en\/prompts\/designers\/test$/);
  });
});

function freeParams() {
  return {
    locale: "en",
    category: "designers",
    id: "test",
    title: "Test prompt",
    summary: "Summary",
    tags: ["a", "b"],
    free: true,
  };
}
