import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
  Фон первого экрана держится на вещах, каждая из которых ломается молча.

  Холст без класса .hero-backdrop не получает ни размера, ни положения —
  он схлопывается в ноль пикселей и рисует в пустоту. Ошибки при этом нет
  нигде: канвас есть, код работает, фона не видно.

  Цвет читается из --c-accent. Вписанный в код второй раз, он пережил бы
  смену палитры и остался бы прежним — а искать его пошли бы куда угодно,
  только не в фон первого экрана.

  Кадры считаются только пока фон на экране. Без наблюдателя телефон
  греется на странице, до которой человек давно долистал.
*/

const dir = __dirname;
const source = readFileSync(join(dir, "HeroBackdrop.tsx"), "utf8");
const css = readFileSync(join(dir, "..", "app", "globals.css"), "utf8");

describe("фон первого экрана", () => {
  it("класс холста описан в стилях", () => {
    expect(source).toContain('className="hero-backdrop"');
    expect(css).toContain(".hero-backdrop {");
  });

  it("слой не ловит нажатия", () => {
    // Кнопка «Найти промт» на телефоне стоит прямо поверх фона.
    const block = css.slice(css.indexOf(".hero-backdrop {"));
    expect(block.slice(0, block.indexOf("}"))).toContain("pointer-events: none");
  });

  it("цвет берётся из акцента сайта", () => {
    expect(source).toContain("--c-accent");
  });

  it("кадры останавливаются вне экрана и в свёрнутой вкладке", () => {
    expect(source).toContain("IntersectionObserver");
    expect(source).toContain("visibilitychange");
  });

  it("просьба «меньше движения» останавливает фон", () => {
    expect(source).toContain("prefers-reduced-motion");
  });

  /*
    Оба слоя живут в одном холсте и одном цикле кадров. Второй канвас
    рядом стоил бы второго requestAnimationFrame, второй очистки экрана и
    второго прохода по данным — ради картинки, которую человек всё равно
    видит как одну.
  */
  it("шар и созвездие рисуются одним циклом", () => {
    expect(source.match(/requestAnimationFrame\(loop\)/g)?.length).toBe(2);
    expect(source.match(/clearRect/g)?.length).toBe(1);
    expect(source).toContain("drawStars();");
    expect(source).toContain("drawSphere();");
  });
});
