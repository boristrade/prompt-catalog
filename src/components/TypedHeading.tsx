"use client";

import { useEffect, useRef, useState } from "react";

/*
  Заголовок первого экрана, который сам себя печатает: набирает вопрос,
  стирает, набирает следующий и по кругу.

  Три вещи, без которых такой заголовок вредит странице.

  Первая — поиск и читалки с экрана. Заголовок, который то пустой, то
  наполовину набран, — это h1, меняющийся десять раз в секунду. Поэтому
  внутри h1 лежит обычный неподвижный текст первого вопроса, видимый
  только читалке и поисковику, а бегущая строка помечена aria-hidden.
  Без JS человек видит первый вопрос целиком: он же и отрисован на
  сервере.

  Вторая — прыжки вёрстки. Вопросы разной длины, и на телефоне каждая
  строка, добавленная или убранная, дёргала бы вниз весь экран вместе с
  кнопками. Поэтому все вопросы лежат в одной ячейке сетки: невидимые
  задают высоту по самому длинному, бегущий рисуется поверх.

  Третья — просьба «меньше движения». Тогда печатать нечего: остаётся
  первый вопрос целиком, как в разметке с сервера.
*/

export interface Phrase {
  /** Начало вопроса обычным цветом. */
  lead: string;
  /** Хвост вопроса градиентом — как в прежнем заголовке. */
  accent: string;
}

/** Мс на букву при наборе. Медленнее — и человек начинает ждать. */
const TYPE = 55;

/** Стирание быстрее набора: перечитывать уже прочитанное незачем. */
const ERASE = 26;

/** Сколько держим готовый вопрос. Меньше — не успеть прочитать. */
const HOLD = 2200;

/** Пауза на пустом месте перед следующим вопросом. */
const GAP = 420;

const full = (phrase: Phrase) => `${phrase.lead} ${phrase.accent}`;

export default function TypedHeading({
  phrases,
  className = "",
}: {
  phrases: Phrase[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  // Начинаем с готового первого вопроса: ровно то, что пришло с сервера.
  const [count, setCount] = useState(full(phrases[0]).length);
  const [erasing, setErasing] = useState(false);
  const [awake, setAwake] = useState(false);

  const box = useRef<HTMLSpanElement>(null);

  /*
    Печатаем, только пока заголовок на экране и вкладка открыта. Строка
    за пределами видимости — это перерисовка React двадцать раз в
    секунду впустую, и на телефоне это заметно по батарее.
  */
  useEffect(() => {
    const node = box.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const decide = () => {
      const rect = node.getBoundingClientRect();
      const seen = rect.bottom > 0 && rect.top < window.innerHeight;
      setAwake(seen && !document.hidden);
    };

    const watcher = new IntersectionObserver(decide);
    watcher.observe(node);
    document.addEventListener("visibilitychange", decide);

    return () => {
      watcher.disconnect();
      document.removeEventListener("visibilitychange", decide);
    };
  }, []);

  useEffect(() => {
    if (!awake) return;

    const text = full(phrases[index]);

    /*
      Один таймер на один шаг, а не общий цикл: шаги разной длины —
      буква, пауза на готовом вопросе, буква назад, пауза на пустом
      месте. Общим интервалом это выражалось бы счётчиком тактов, где
      каждая правка длительности превращается в арифметику.
    */
    const wait = erasing ? (count > 0 ? ERASE : GAP) : count < text.length ? TYPE : HOLD;

    const timer = setTimeout(() => {
      if (!erasing && count < text.length) setCount(count + 1);
      else if (!erasing) setErasing(true);
      else if (count > 0) setCount(count - 1);
      else {
        setErasing(false);
        setIndex((i) => (i + 1) % phrases.length);
      }
    }, wait);

    return () => clearTimeout(timer);
  }, [awake, count, erasing, index, phrases]);

  const phrase = phrases[index];
  const shown = full(phrase).slice(0, count);
  // Пробел между началом и хвостом отдаём началу: иначе хвост
  // появляется с прыжком на ширину пробела.
  const split = phrase.lead.length + 1;

  return (
    <h1 className={className}>
      <span className="sr-only">{full(phrases[0])}</span>

      {/*
        Все вопросы в одной ячейке сетки. Невидимые держат высоту по
        самому длинному, бегущий лежит поверх них — поэтому строка
        никогда не дёргает вниз ни подпись, ни кнопки.
      */}
      <span aria-hidden className="grid">
        {phrases.map((item) => (
          <span
            key={item.lead}
            className="invisible col-start-1 row-start-1"
          >
            {full(item)}
          </span>
        ))}

        <span ref={box} className="col-start-1 row-start-1">
          {shown.slice(0, split)}
          <span className="grad-text">{shown.slice(split)}</span>
          <span className="caret" />
        </span>
      </span>
    </h1>
  );
}
