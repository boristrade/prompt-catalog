import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
  Шар держится на трёх вещах, каждая из которых ломается молча.

  Холст без класса .sphere не получает ни размера, ни положения — он
  схлопывается в ноль пикселей и рисует в пустоту. Ошибки при этом нет
  нигде: канвас есть, код работает, фона не видно.

  Цвет читается из --c-accent. Вписанный в код второй раз, он пережил бы
  смену палитры и остался бы прежним — а искать его пошли бы куда угодно,
  только не в фон первого экрана.

  Кадры считаются только пока шар на экране. Без наблюдателя телефон
  греется на странице, до которой человек давно долистал.
*/

const dir = __dirname;
const sphere = readFileSync(join(dir, "Sphere.tsx"), "utf8");
const css = readFileSync(
  join(dir, "..", "app", "globals.css"),
  "utf8",
);

describe("шар на первом экране", () => {
  it("класс холста описан в стилях", () => {
    expect(sphere).toContain('className="sphere"');
    expect(css).toContain(".sphere {");
  });

  it("слой не ловит нажатия", () => {
    // Кнопка «Найти промт» на телефоне стоит прямо поверх шара.
    const block = css.slice(css.indexOf(".sphere {"));
    expect(block.slice(0, block.indexOf("}"))).toContain("pointer-events: none");
  });

  it("цвет берётся из акцента сайта", () => {
    expect(sphere).toContain("--c-accent");
  });

  it("кадры останавливаются вне экрана и в свёрнутой вкладке", () => {
    expect(sphere).toContain("IntersectionObserver");
    expect(sphere).toContain("visibilitychange");
  });

  it("просьба «меньше движения» останавливает вращение", () => {
    expect(sphere).toContain("prefers-reduced-motion");
  });
});
