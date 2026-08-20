import { describe, it, expect } from "vitest";
import { MAX_EMAIL, looksLikeEmail, normaliseEmail } from "./email-address";

/*
  Проверка адреса стоит на входе в список рассылки, и ошибиться она может
  в обе стороны, причём молча.

  Пропустит мусор — таблица набьётся строками, письма по которым уйдут в
  отказ, а отказы бьют по репутации домена, с которого уходят ещё и чеки
  об оплате. Отвергнет настоящий адрес — человек решит, что подписка
  сломана, и второй раз не придёт. Второе хуже, поэтому проверка нарочно
  мягкая; здесь закреплено, насколько именно.
*/

describe("почтовый адрес", () => {
  it("приводится к одному виду: без пробелов и в нижнем регистре", () => {
    // Иначе «Ivan@Mail.ru» и «ivan@mail.ru» окажутся двумя подписками, и
    // человек получит каждое письмо дважды.
    expect(normaliseEmail("  Ivan@Mail.RU ")).toBe("ivan@mail.ru");
  });

  it("принимает адреса, которые бывают у живых людей", () => {
    for (const value of [
      "ivan@mail.ru",
      "ivan.petrov+promptom@gmail.com",
      "a@b.co",
      "офис@почта.рф",
      "name@sub.domain.example.museum",
      "  Ivan@Mail.RU  ",
    ]) {
      expect(looksLikeEmail(value), value).toBe(true);
    }
  });

  it("отвергает то, что адресом быть не может", () => {
    for (const value of [
      "",
      "   ",
      "ivan",
      "ivan@",
      "@mail.ru",
      "ivan@mail",
      "ivan @mail.ru",
      "ivan@mail .ru",
      "два@адреса@mail.ru",
    ]) {
      expect(looksLikeEmail(value), JSON.stringify(value)).toBe(false);
    }
  });

  it("длиннее предела из стандарта не принимает", () => {
    // Без верхней границы в поле пришлёт мегабайт первый же робот.
    const long = `${"a".repeat(MAX_EMAIL)}@mail.ru`;
    expect(looksLikeEmail(long)).toBe(false);
    expect(MAX_EMAIL).toBe(254);
  });
});
