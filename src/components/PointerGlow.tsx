"use client";

import { useEffect } from "react";

/*
  Координаты курсора для неоновой обводки карточек.

  Один слушатель на всю страницу, а не по одному на карточку. Слушателей
  было бы столько же, сколько карточек, и каждый писал бы свои переменные
  на каждое движение мыши — при пяти карточках это пятикратная работа ради
  одного и того же числа.

  Пишем не чаще кадра: pointermove срабатывает сотни раз в секунду, а
  перерисоваться чаще, чем экран обновляется, всё равно нельзя.

  Атрибут data-glow на <html> включает эффект. Без него подсветки нет
  вовсе — значит, она не появится ни при выключенном JS, ни там, где
  подсвечивать нечем.
*/
export default function PointerGlow() {
  useEffect(() => {
    /*
      На тачскрине курсора нет: подсветка «под указателем» там либо не
      появится, либо застынет в точке последнего касания и будет выглядеть
      как artefact. Тем, кто просил меньше движения, — тоже не показываем.
    */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;

    function apply() {
      frame = 0;
      root.style.setProperty("--gx", x.toFixed(1));
      root.style.setProperty("--gy", y.toFixed(1));
      // Доля ширины экрана — по ней слегка ведём оттенок, чтобы свечение
      // не выглядело нарисованным одним цветом.
      root.style.setProperty("--gxp", (x / window.innerWidth).toFixed(3));
    }

    function onMove(event: PointerEvent) {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    }

    root.dataset.glow = "on";
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      delete root.dataset.glow;
    };
  }, []);

  return null;
}
