import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

/*
  Возврат после входа приезжает не туда, если в настройках Supabase не
  разрешён адрес /auth/callback: Supabase молча подменяет его на Site
  URL, то есть на корень сайта. Код входа приходит на «/», обменивать
  его там некому, и человек видит обычную главную вместо входа — без
  ошибки в браузере и без записи в логах.

  Проверяем, что такой возврат уводится на настоящую точку обмена. Тест
  поведенческий, а не текстовый: важно не то, что в коде есть нужная
  строчка, а то, куда в итоге уходит запрос.
*/

function get(url: string) {
  return middleware(new NextRequest(new Request(url, { method: "GET" })));
}

describe("middleware: возврат после входа", () => {
  it("код входа на корне уводится на /auth/callback", async () => {
    const res = await get("https://promptom.app/?code=abc123");

    expect(res.status).toBe(307);
    const to = new URL(res.headers.get("location")!);
    expect(to.pathname).toBe("/auth/callback");
    expect(to.searchParams.get("code")).toBe("abc123");
  });

  it("token_hash из письма — так же", async () => {
    const res = await get(
      "https://promptom.app/?token_hash=xyz&type=magiclink",
    );

    const to = new URL(res.headers.get("location")!);
    expect(to.pathname).toBe("/auth/callback");
    expect(to.searchParams.get("token_hash")).toBe("xyz");
    // type нужен для verifyOtp — потеряв его, обмен не состоится.
    expect(to.searchParams.get("type")).toBe("magiclink");
  });

  it("код входа на языковом адресе тоже ловится", async () => {
    const res = await get("https://promptom.app/ru?code=abc123");

    const to = new URL(res.headers.get("location")!);
    expect(to.pathname).toBe("/auth/callback");
  });

  /*
    Обычная страница не должна попадать в эту ветку: она уводится на
    языковой префикс, как и раньше.
  */
  it("страница без кода входа идёт своей дорогой", async () => {
    const res = await get("https://promptom.app/pricing");

    const to = new URL(res.headers.get("location")!);
    expect(to.pathname).not.toBe("/auth/callback");
    expect(to.pathname).toMatch(/^\/[a-z]{2}\/pricing$/);
  });

  it("реферальная метка не путается с кодом входа", async () => {
    const res = await get("https://promptom.app/ru?ref=ABC12345");

    const location = res.headers.get("location");
    if (location) {
      expect(new URL(location).pathname).not.toBe("/auth/callback");
    }
  });
});
