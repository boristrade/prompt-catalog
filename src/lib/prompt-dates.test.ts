import { describe, it, expect } from "vitest";
import { ADDED, LATEST, addedOf, isNew } from "./prompt-dates";
import { PROMPTS } from "./prompts";
import { PROMPTS_EN } from "./prompts.en";

/*
  Даты пополнения лежат отдельной таблицей, а не полем в промте, — и
  именно поэтому расходятся молча. Промт без даты нигде не падает: он
  просто не показывается в «Что нового» и никогда не помечается новым, а
  заметить это можно, только зная, что он там должен быть.
*/

describe("даты пополнения каталога", () => {
  it("дата есть у каждого промта", () => {
    for (const prompt of PROMPTS) {
      expect(addedOf(prompt.id), prompt.id).not.toBe("");
    }
  });

  it("в таблице нет дат от промтов, которых уже нет", () => {
    // Удалили промт, забыли строчку — и «Что нового» считает пополнение
    // из промтов, которых в каталоге не осталось.
    const ids = new Set(PROMPTS.map((p) => p.id));
    for (const id of Object.keys(ADDED)) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it("таблица одна на оба языка", () => {
    // Английский перевод появляется вместе с оригиналом: разные наборы
    // id означали бы, что где-то потеряли перевод.
    expect(Object.keys(PROMPTS_EN).sort()).toEqual(
      PROMPTS.map((p) => p.id).sort(),
    );
  });

  it("даты записаны так, как их можно сравнивать строками", () => {
    // Сортировка и выбор последнего пополнения сравнивают строки:
    // «14.08.2026» сломало бы и то и другое, не уронив сборку.
    for (const [id, day] of Object.entries(ADDED)) {
      expect(day, id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("последнее пополнение — действительно последнее", () => {
    for (const day of Object.values(ADDED)) {
      expect(day <= LATEST, `${day} > ${LATEST}`).toBe(true);
    }
  });

  /*
    «Новое» — это последняя пачка целиком, а не «моложе такого-то числа».
    Значок поэтому не зависит от того, когда собрали страницу: собери её
    через месяц — и новыми останутся те же промты, а не ни одного.
  */
  it("новыми считаются промты последнего пополнения", () => {
    const fresh = PROMPTS.filter((p) => isNew(p.id));
    expect(fresh.length).toBeGreaterThan(0);
    for (const prompt of fresh) {
      expect(addedOf(prompt.id) <= LATEST).toBe(true);
    }

    // И не весь каталог разом: иначе значок ничего не означает.
    expect(fresh.length).toBeLessThan(PROMPTS.length);
  });

  it("незнакомый промт не считается новым и не падает", () => {
    expect(isNew("такого-промта-нет")).toBe(false);
    expect(addedOf("такого-промта-нет")).toBe("");
  });
});
