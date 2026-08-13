"use client";

import { useEffect, useRef, useState } from "react";
import { countValue } from "@/lib/motion";

/*
  Цифра докручивается до значения, когда до неё доходят глазами.

  На сервере сразу печатается итог, а не ноль: без JS, в поиске и в
  первом кадре в разметке стоит настоящее число. Ноль появляется только
  в браузере и только перед самой анимацией — то есть считать нечему
  ровно в тех случаях, когда считать некому.
*/
export default function CountUp({
  value,
  duration = 1100,
}: {
  value: number;
  /** Длительность в мс. */
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Просили меньше движения или браузер старый — цифра просто стоит.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    let start = 0;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();

        function step(now: number) {
          if (!start) start = now;
          const elapsed = now - start;
          setShown(countValue(value, elapsed, duration));
          if (elapsed < duration) raf = requestAnimationFrame(step);
        }

        raf = requestAnimationFrame(step);
      },
      // Порог повыше: счётчик, запускающийся, когда над экраном видна
      // одна верхняя пиксельная строчка, человек пропускает.
      { threshold: 0.6 },
    );

    setShown(0);
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  /*
    tabular-nums обязателен: у пропорциональных цифр разная ширина, и
    счётчик на ходу дёргал бы вправо-влево подпись рядом.
  */
  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}
