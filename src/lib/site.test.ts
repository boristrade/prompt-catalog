import { describe, it, expect, afterEach } from "vitest";
import { siteUrl } from "./site";

/*
  Регресс на аварию из ревью: siteUrl() раньше дублировался в двух местах
  с разными запасными вариантами (один падал на localhost при смене
  домена, из-за чего адрес для уведомлений об оплате мог утечь на
  localhost, если переменная окружения потеряется). Теперь источник один,
  и порядок приоритета закреплён тестами.
*/
describe("siteUrl", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  });

  it("своя переменная — в приоритете, лишний слэш в конце срезается", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://promptom.io/";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "prompt-catalog-alpha.vercel.app";
    expect(siteUrl()).toBe("https://promptom.io");
  });

  it("своей переменной нет — берётся боевой домен Vercel", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "prompt-catalog-alpha.vercel.app";
    expect(siteUrl()).toBe("https://prompt-catalog-alpha.vercel.app");
  });

  it("ничего не задано — localhost, а не пустая строка", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    expect(siteUrl()).toBe("http://localhost:3000");
  });

  it("пустая строка в переменной не считается заданным значением", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "prompt-catalog-alpha.vercel.app";
    expect(siteUrl()).toBe("https://prompt-catalog-alpha.vercel.app");
  });
});
