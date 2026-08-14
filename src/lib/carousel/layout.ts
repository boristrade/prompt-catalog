/*
  Раскладка текста на слайде.

  Измерение вынесено в параметр, а не берётся из канваса: так эти
  функции можно проверить тестом, не поднимая браузер. В боевом коде
  сюда передают ctx.measureText, в тесте — счёт по символам.
*/

/** Ширина строки в пикселях. */
export type Measure = (text: string) => number;

/**
 * Разбивает текст на строки по ширине.
 *
 * Переносы в исходном тексте сохраняются: в промте перевод строки —
 * часть смысла, а не оформление.
 */
export function wrap(text: string, width: number, measure: Measure): string[] {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    if (paragraph === "") {
      lines.push("");
      continue;
    }

    let line = "";
    for (const word of paragraph.split(" ")) {
      const candidate = line ? `${line} ${word}` : word;

      if (measure(candidate) <= width) {
        line = candidate;
        continue;
      }

      if (line) lines.push(line);

      /*
        Слово, не влезающее целиком, режем по буквам. Без этого длинный
        адрес или хеш уезжает за край кадра — на слайде это не
        прокрутка, а обрезанная картинка.
      */
      if (measure(word) > width) {
        let chunk = "";
        for (const letter of word) {
          if (measure(chunk + letter) > width && chunk) {
            lines.push(chunk);
            chunk = letter;
          } else {
            chunk += letter;
          }
        }
        line = chunk;
      } else {
        line = word;
      }
    }

    lines.push(line);
  }

  return lines;
}

/**
 * Самый крупный кегль из списка, при котором текст влезает в блок.
 *
 * Список задаётся сверху вниз: перебираем от желаемого к запасному.
 * Если не влезает ни один, отдаём последний — обрезать текст молча
 * хуже, чем показать его мельче задуманного.
 */
export function fitSize(
  text: string,
  box: { width: number; height: number },
  sizes: number[],
  measureAt: (size: number) => Measure,
  lineHeight = 1.15,
): { size: number; lines: string[] } {
  let last = { size: sizes[sizes.length - 1], lines: [] as string[] };

  for (const size of sizes) {
    const lines = wrap(text, box.width, measureAt(size));
    last = { size, lines };
    if (lines.length * size * lineHeight <= box.height) return last;
  }

  return { ...last, lines: wrap(text, box.width, measureAt(last.size)) };
}

/**
 * Номер слайда в виде 05/09.
 *
 * Ведущий ноль обязателен: без него ширина строки прыгает на девятом
 * слайде, и шапка кадра съезжает — на карусели это заметно, потому что
 * слайды листают подряд.
 */
export function slideNumber(index: number, total: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(index + 1)}/${pad(total)}`;
}
