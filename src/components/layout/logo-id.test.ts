import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/*
  Страж уникальности id у знака.

  Знак объявляет градиент и маску внутри своего svg, а ссылка url(#id)
  ищется по всему документу. Знаков на странице два — в шапке и в
  подвале, — и с одинаковыми id Safari не разрешает вторую ссылку:
  маска не применяется, вместо «P» остаётся сплошной фиолетовый
  квадрат. Chrome при этом рисует правильно, поэтому ни сборка, ни
  просмотр на компьютере такую ошибку не ловят — только глаз на
  телефоне. Один раз уже поймали.

  TypeScript следит, чтобы параметр вообще передали. Что он у каждого
  знака свой — проследить может только проверка вроде этой.
*/

const SRC = join(process.cwd(), "src");

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return tsxFiles(path);
    return entry.name.endsWith(".tsx") ? [path] : [];
  });
}

/** Значения id у всех вставок <LogoMark …> в коде. */
function markIds(): { file: string; id: string }[] {
  return tsxFiles(SRC).flatMap((file) => {
    const source = readFileSync(file, "utf8");
    // Объявление самого компонента пропускаем — это не вставка.
    if (file.endsWith("Logo.tsx")) {
      const body = source.slice(source.indexOf("export default function Logo"));
      return [...body.matchAll(/<LogoMark\s+id="([^"]+)"/g)].map((m) => ({
        file,
        id: m[1],
      }));
    }
    return [...source.matchAll(/<LogoMark\s+id="([^"]+)"/g)].map((m) => ({
      file,
      id: m[1],
    }));
  });
}

describe("id у знака PrompTom", () => {
  it("знак вставлен хотя бы дважды — иначе проверка ничего не стережёт", () => {
    // Проверка вырождается в тавтологию, если вставка осталась одна:
    // столкнуться двум id будет негде, и тест станет зелёным навсегда.
    expect(markIds().length).toBeGreaterThanOrEqual(2);
  });

  it("у каждой вставки свой id", () => {
    const found = markIds();
    const ids = found.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("каждая вставка передаёт id явно", () => {
    // <LogoMark className=…> без id — та самая забытая вставка.
    const missing = tsxFiles(SRC).filter((file) =>
      /<LogoMark(?!\s+id=)/.test(readFileSync(file, "utf8")),
    );
    expect(missing).toEqual([]);
  });
});
