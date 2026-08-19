"use client";

import { useEffect, useRef } from "react";

/*
  Фон первого экрана: шар из падающих световых нитей, а вокруг него —
  созвездие из точек, которые дрейфуют и связываются нитью, когда
  сближаются.

  Два слоя, но один холст и один цикл кадров. Это не мелочь: два канваса
  — это два requestAnimationFrame, две очистки экрана и два прохода по
  всем данным на каждый кадр, ради картинки, которую человек всё равно
  видит как одну. Здесь оба слоя рисуются подряд в одном проходе, и
  наблюдатель за экраном, пауза в свёрнутой вкладке и просьба «меньше
  движения» тоже одни на двоих.

  Канвас, а не CSS, и у каждого слоя своя причина. У шара положение нити
  на экране считается из широты, долготы и угла поворота каждый кадр. У
  созвездия связи пересчитываются каждый кадр — какие точки сейчас
  рядом, знает только код. И то и другое на CSS выражается лишь заранее
  нарисованной картинкой, то есть без самого движения.

  Без JS не появляется ничего, и это правильно: фон декоративный, его
  отсутствие ничего не ломает и ни о чём не сообщает. Поэтому же канвас
  помечен aria-hidden — читалке с экрана рассказывать о нём нечего.
*/

/* ── Шар ─────────────────────────────────────────────────────────── */

/** Полный оборот шара, мс. Быстрее — и фон начинает отвлекать от текста. */
const SPIN = 44000;

/** Сколько нить проходит по меридиану за секунду, в долях от четверти дуги. */
const FALL = 0.24;

/** Длина хвоста в радианах широты. Длиннее — и нити читаются дугами. */
const TAIL = 0.3;

/** Из скольких отрезков рисуется хвост. Меньше — видны углы на сгибе. */
const JOINTS = 5;

/* ── Созвездие ───────────────────────────────────────────────────── */

/** Расстояние, ближе которого точки связываются нитью, px. */
const LINK = 110;

/** Скорость дрейфа, px в секунду. Крупнее — и фон начинает отвлекать. */
const DRIFT = 14;

interface Thread {
  /** Долгота: где нить стоит на шаре. Не меняется — шар везёт её сам. */
  lon: number;
  /** Широта головы: от +π/2 на полюсе до −π/2 внизу. */
  lat: number;
  speed: number;
  bright: number;
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function HeroBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dark = window.matchMedia("(prefers-color-scheme: dark)");

    let threads: Thread[] = [];
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let spin = 0;
    let onScreen = false;
    let colour = "#a78bfa";

    /*
      Цвет берём из той же переменной, что и весь акцент сайта, а не
      вписываем сюда второй раз: иначе при смене палитры фон остался бы
      прежнего оттенка, и никто бы не догадался искать его здесь.
    */
    /*
      Все внутренние функции — стрелочные и объявлены до использования.
      Объявление через function поднимается наверх, и TypeScript, не зная,
      когда его вызовут, забывает, что canvas и ctx выше уже проверены на
      null: файл переставал собираться на два десятка ошибок.
    */
    const readColour = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--c-accent")
        .trim();
      if (value) colour = value;
    };

    /*
      Шар вписан в меньшую сторону, но не в половину её: на телефоне
      высота первого экрана вдвое больше ширины, и шар «в половину
      высоты» вылез бы за края.
    */
    const geometry = () => ({
      radius: Math.min(width * 0.42, height * 0.42, 260),
      cx: width / 2,
      cy: height * 0.44,
    });

    const seed = () => {
      /*
        Плотность от площади, с потолком. Каждая нить — это пять
        отрезков и точка, и на широком мониторе без предела фон стоил бы
        дороже всей остальной страницы.
      */
      const count = Math.min(
        240,
        Math.max(90, Math.round((width * height) / 2400)),
      );

      threads = Array.from({ length: count }, () => ({
        lon: Math.random() * Math.PI * 2,
        // Разбрасываем по всей дуге сразу: иначе первые секунды шар
        // пустой, а потом на него разом обрушивается ливень.
        lat: Math.PI / 2 - Math.random() * Math.PI,
        speed: 0.7 + Math.random() * 0.8,
        bright: 0.35 + Math.random() * 0.65,
      }));

      /*
        Точек заметно меньше, чем нитей, и предел у них жёстче: связи
        ищутся перебором пар, то есть их число растёт квадратом. Полсотни
        точек — это больше тысячи проверок на кадр, и они складываются с
        работой шара, а не заменяют её.
      */
      const stars = Math.min(
        44,
        Math.max(12, Math.round((width * height) / 14000)),
      );

      dots = Array.from({ length: stars }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      }));
    };

    const move = (dt: number) => {
      spin += (dt / SPIN) * Math.PI * 2;

      const fall = (FALL * dt) / 1000;
      for (const thread of threads) {
        thread.lat -= fall * thread.speed * (Math.PI / 2);

        // Дошла до низа — возвращаем на полюс с новой долготой, иначе
        // нити со временем выстроились бы в один и тот же узор.
        if (thread.lat < -Math.PI / 2 - TAIL) {
          thread.lat = Math.PI / 2 + TAIL;
          thread.lon = Math.random() * Math.PI * 2;
          thread.speed = 0.7 + Math.random() * 0.8;
          thread.bright = 0.35 + Math.random() * 0.65;
        }
      }

      const step = (DRIFT * dt) / 1000;
      for (const dot of dots) {
        dot.x += dot.vx * step;
        dot.y += dot.vy * step;
        // Отражение от края, а не переброс на другую сторону: точка,
        // исчезающая слева и появляющаяся справа, обрывает нити рывком.
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
      }
    };

    /** Созвездие. Рисуется первым — оно дальше, шар идёт поверх. */
    const drawStars = () => {
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
          ctx.globalAlpha = (1 - distance / LINK) * 0.38;
          ctx.beginPath();
          ctx.moveTo(dots[a].x, dots[a].y);
          ctx.lineTo(dots[b].x, dots[b].y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 0.62;
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawSphere = () => {
      const { radius, cx, cy } = geometry();
      if (radius <= 0) return;

      /*
        Свет, скопившийся внизу шара, и его отражение под ним. Рисуются
        первыми — нити должны идти поверх, иначе шар выглядит затянутым
        плёнкой.
      */
      const pool = ctx.createRadialGradient(
        cx,
        cy + radius * 0.62,
        0,
        cx,
        cy + radius * 0.62,
        radius * 0.95,
      );
      pool.addColorStop(0, colour);
      pool.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = pool;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Отражение — сплюснутое пятно под шаром, а не вторая копия нитей:
      // рисовать шар дважды ради размытого следа вдвое дороже.
      ctx.save();
      ctx.translate(cx, cy + radius * 1.16);
      ctx.scale(1, 0.34);
      const echo = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      echo.addColorStop(0, colour);
      echo.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.36;
      ctx.fillStyle = echo;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = colour;
      ctx.lineCap = "round";

      for (const thread of threads) {
        const angle = thread.lon + spin;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        ctx.beginPath();
        let depth = 0;

        for (let i = 0; i <= JOINTS; i++) {
          const lat = thread.lat + (TAIL * i) / JOINTS;
          if (lat > Math.PI / 2) break;

          const ring = Math.cos(lat) * radius;
          const x = cx + ring * sin;
          const y = cy - Math.sin(lat) * radius;
          if (i === 0) {
            ctx.moveTo(x, y);
            depth = cos;
          } else {
            ctx.lineTo(x, y);
          }
        }

        /*
          Дальняя половина шара тусклее ближней, но не спрятана: сквозь
          неё и видно, что это шар, а не диск.
        */
        const front = (depth + 1) / 2;
        ctx.globalAlpha = thread.bright * (0.24 + front * 0.86);
        ctx.lineWidth = 0.9 + front * 1.2;
        ctx.stroke();

        /*
          Точка на конце нити. Без неё шар читается как клубок дуг: свет,
          который падает, узнаётся по яркой голове, а не по следу — след
          только показывает, откуда она пришла.
        */
        if (thread.lat >= -Math.PI / 2 && thread.lat <= Math.PI / 2) {
          ctx.globalAlpha = Math.min(1, thread.bright * (0.3 + front * 0.9));
          ctx.fillStyle = colour;
          ctx.beginPath();
          ctx.arc(
            cx + Math.cos(thread.lat) * radius * sin,
            cy - Math.sin(thread.lat) * radius,
            1 + front,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      drawStars();
      drawSphere();
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
      // ограничения шар провернулся бы рывком, а точки прыгнули бы
      // через пол-экрана.
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

  return <canvas ref={ref} aria-hidden className="hero-backdrop" />;
}
