"use client";

import { useEffect, useRef } from "react";

/*
  Фон первого экрана: точки дрейфуют и связываются нитью, когда
  сближаются.

  Канвас, а не CSS: связи нужно пересчитывать каждый кадр — какие точки
  сейчас рядом, знает только код. На CSS такое можно изобразить лишь
  заранее нарисованной картинкой, то есть без самого эффекта.

  Без JS не появляется ничего, и это правильно: фон декоративный, его
  отсутствие ничего не ломает и ни о чём не сообщает. По той же причине
  канвас помечен aria-hidden — читалке с экрана рассказывать о нём
  нечего.
*/

/** Расстояние, ближе которого точки связываются нитью, px. */
const LINK = 110;

/** Скорость дрейфа, px в секунду. Крупнее — и фон начинает отвлекать. */
const SPEED = 14;

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dark = window.matchMedia("(prefers-color-scheme: dark)");

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let onScreen = false;
    let colour = "#a78bfa";

    /*
      Цвет берём из той же переменной, что и весь акцент сайта, а не
      вписываем сюда второй раз: иначе при смене палитры фон остался бы
      старого оттенка, и никто бы не догадался искать его здесь.
    */
    /*
      Все внутренние функции — стрелочные и объявлены до использования.
      Объявление через function поднимается наверх, и TypeScript, не зная,
      когда его вызовут, забывает, что canvas и ctx выше уже проверены
      на null: файл переставал собираться на два десятка ошибок.
    */
    const readColour = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--c-accent")
        .trim();
      if (value) colour = value;
    };

    const seed = () => {
      /*
        Плотность считается от площади, но с потолком. Связи ищутся
        перебором пар: сотня точек — это пять тысяч проверок на кадр, и
        на широком мониторе фон начал бы стоить дороже всей страницы.
      */
      const count = Math.min(
        70,
        Math.max(16, Math.round((width * height) / 9000)),
      );

      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      }));
    };

    const move = (dt: number) => {
      const step = (SPEED * dt) / 1000;
      for (const dot of dots) {
        dot.x += dot.vx * step;
        dot.y += dot.vy * step;
        // Отражение от края, а не переброс на другую сторону: точка,
        // исчезающая слева и появляющаяся справа, обрывает нити рывком.
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = colour;
      ctx.fillStyle = colour;
      ctx.lineWidth = 1;

      for (let a = 0; a < dots.length; a++) {
        for (let b = a + 1; b < dots.length; b++) {
          const dx = dots[a].x - dots[b].x;
          const dy = dots[a].y - dots[b].y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK) continue;

          // Нить тает по мере расхождения точек: связь, гаснущая разом,
          // читается как моргание.
          ctx.globalAlpha = (1 - distance / LINK) * 0.45;
          ctx.beginPath();
          ctx.moveTo(dots[a].x, dots[a].y);
          ctx.lineTo(dots[b].x, dots[b].y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 0.7;
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw();
    };

    const loop = (now: number) => {
      // Первый кадр после паузы приходит с большим разрывом: без
      // ограничения точки прыгнули бы через пол-экрана.
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      move(dt);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame || calm.matches || !onScreen || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    readColour();
    resize();

    /*
      Считать кадры за пределами экрана — греть телефон впустую. То же
      про свёрнутую вкладку: браузер и сам придерживает
      requestAnimationFrame, но не везде одинаково.
    */
    const watcher = new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start();
      else stop();
    });
    watcher.observe(canvas);

    const sizes = new ResizeObserver(resize);
    sizes.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onTheme = () => {
      readColour();
      // Перерисовываем сразу: при выключенном движении кадров больше не
      // будет, и фон остался бы в цвете прежней темы.
      draw();
    };

    document.addEventListener("visibilitychange", onVisibility);
    dark.addEventListener("change", onTheme);
    calm.addEventListener("change", start);

    // Тему на сайте переключают вручную — это атрибут на <html>.
    const theme = new MutationObserver(onTheme);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      stop();
      watcher.disconnect();
      sizes.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      dark.removeEventListener("change", onTheme);
      calm.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="constellation" />;
}
