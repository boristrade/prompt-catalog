import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
  Шапка нарисована дважды: широкий экран и телефон — это разная вёрстка,
  а не одна и та же с другими отступами. Из-за этого пункт легко добавить
  в одно место и забыть про второе, что уже случилось с админкой: на
  телефоне владелец не мог в неё попасть вовсе.

  Проверяем не пиксели, а сам факт присутствия ссылки в обоих кусках
  разметки. Тест грубый — читает исходник как текст, — но ловит ровно ту
  ошибку, которая тут случается: пункт есть в одном меню и отсутствует в
  другом.
*/
const dir = __dirname;
const header = readFileSync(join(dir, "Header.tsx"), "utf8");
const userMenu = readFileSync(join(dir, "UserMenu.tsx"), "utf8");

/** Кусок Header.tsx после `{open && (` — выпадающее меню телефона. */
function mobileMenu(): string {
  const start = header.indexOf("{open && (");
  expect(start).toBeGreaterThan(-1);
  return header.slice(start);
}

describe("пункты меню не расходятся между телефоном и десктопом", () => {
  it("ссылка на админку есть в меню телефона", () => {
    expect(mobileMenu()).toContain("/admin");
  });

  it("ссылка на админку есть в меню под аватаром", () => {
    expect(userMenu).toContain("/admin");
  });

  it("админка в обоих меню скрыта от не-администратора", () => {
    // Ссылка без проверки isAdmin рассказала бы каждому, что админка
    // существует и живёт по этому адресу.
    expect(mobileMenu()).toContain("user.isAdmin");
    expect(userMenu).toContain("user.isAdmin");
  });

  it("выход и аккаунт есть в обоих меню", () => {
    for (const source of [mobileMenu(), userMenu]) {
      expect(source).toContain("/auth/signout");
      expect(source).toContain("/account");
    }
  });

  /*
    Избранное убрали из строки наверху — она не влезала, — но не из сайта:
    на широком экране оно теперь под аватаром. Проверяем оба места, иначе
    следующая правка тихо оставит его только на телефоне.
  */
  it("избранное есть и в меню телефона, и в меню под аватаром", () => {
    // В шапке пункт один на оба меню — меню телефона рисует список
    // целиком, за этим следит проверка ниже.
    expect(header).toContain("account#favorites");
    expect(userMenu).toContain("account#favorites");
  });

  /*
    В строке наверху пункты отбираются по wide — их там помещается около
    пяти из девяти. Меню телефона обязано показывать список целиком: там
    он вертикальный и в длине не ограничен. Если однажды и мобильное меню
    начнут фильтровать, пункты пропадут ровно так же, как когда-то
    пропала админка.
  */
  it("меню телефона показывает список целиком, без отбора по wide", () => {
    const mobile = mobileMenu();
    expect(mobile).toContain("nav.map(");
    expect(mobile).not.toContain("wide");

    // А наверху — наоборот, только отобранные.
    expect(header.slice(0, header.indexOf("{open && ("))).toContain(
      "filter((item) => item.wide)",
    );
  });
});
