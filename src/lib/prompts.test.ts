import { describe, it, expect } from "vitest";
import {
  PROMPTS,
  isLocked,
  veil,
  toolsAmong,
  toolsInCategory,
  usesTool,
  getPromptById,
  getPromptsByCategory,
  searchPrompts,
  type Prompt,
} from "./prompts";

describe("veil", () => {
  it("вырезает и текст, и пример целиком", () => {
    const prompt = PROMPTS.find((p) => p.tier === "pro")!;
    const veiled = veil(prompt);

    expect(veiled.prompt).toBe("");
    expect(veiled.example).toBe("");
    // Название, описание и теги остаются: по ним на страницу приходят
    // из поиска, спрячь мы их — страница исчезла бы из выдачи.
    expect(veiled.title).toBe(prompt.title);
    expect(veiled.summary).toBe(prompt.summary);
    expect(veiled.tags).toEqual(prompt.tags);
    expect(veiled.bestFor).toBe(prompt.bestFor);
  });

  /*
    Ни куска настоящего текста — вообще ни одного.

    Закрывать текст размытием и полупрозрачной плашкой можно только
    поверх того, чего в разметке нет: попавшее в разметку читается через
    инструменты разработчика, чем его ни закрой. Проверка идёт по всем
    промтам, а не по одному, и берёт длинные куски: совпадение по
    случайному короткому слову ничего не значило бы.
  */
  it("в закрытом промте не остаётся ни куска настоящего текста", () => {
    for (const prompt of PROMPTS) {
      const veiled = veil(prompt);

      for (const source of [prompt.prompt, prompt.example]) {
        const chunk = source.slice(0, 40);
        expect(veiled.prompt.includes(chunk), prompt.id).toBe(false);
        expect(veiled.example.includes(chunk), prompt.id).toBe(false);
      }
    }
  });

  it("не трогает исходный объект", () => {
    const prompt = PROMPTS[0];
    veil(prompt);
    expect(prompt.prompt.length).toBeGreaterThan(0);
  });
});

describe("isLocked", () => {
  const free: Prompt = { ...PROMPTS[0], tier: "free" };
  const pro: Prompt = { ...PROMPTS[0], tier: "pro" };

  it("free-промт не закрыт ни для кого", () => {
    expect(isLocked(free, "free")).toBe(false);
    expect(isLocked(free, "pro")).toBe(false);
  });

  it("pro-промт закрыт для free и открыт для pro", () => {
    expect(isLocked(pro, "free")).toBe(true);
    expect(isLocked(pro, "pro")).toBe(false);
  });
});

describe("toolsInCategory / usesTool", () => {
  const prompt: Prompt = { ...PROMPTS[0], bestFor: "ChatGPT / Claude" };

  it("usesTool разбирает bestFor по «/» и не зависит от регистра", () => {
    expect(usesTool(prompt, "ChatGPT")).toBe(true);
    expect(usesTool(prompt, "claude")).toBe(true);
    expect(usesTool(prompt, "Midjourney")).toBe(false);
  });

  it("toolsInCategory возвращает уникальные имена по алфавиту", () => {
    const tools = toolsInCategory("designers", "en");
    const sorted = [...tools].sort((a, b) => a.localeCompare(b));
    expect(tools).toEqual(sorted);
    expect(new Set(tools).size).toBe(tools.length);
    expect(tools.length).toBeGreaterThan(0);
  });

  it("toolsAmong считает по переданному списку, а не по всему каталогу", () => {
    const subset: Prompt[] = [
      { ...PROMPTS[0], bestFor: "Midjourney / DALL-E" },
      { ...PROMPTS[0], bestFor: "Midjourney" },
    ];
    expect(toolsAmong(subset)).toEqual(["DALL-E", "Midjourney"]);
  });
});

describe("getPromptById / getPromptsByCategory — согласованность языков", () => {
  it("каждый промт находится по своему id в обоих языках", () => {
    for (const prompt of PROMPTS.slice(0, 5)) {
      expect(getPromptById(prompt.id, "ru")?.id).toBe(prompt.id);
      expect(getPromptById(prompt.id, "en")?.id).toBe(prompt.id);
    }
  });

  it("несуществующий id — undefined, а не исключение", () => {
    expect(getPromptById("такого-нет", "ru")).toBeUndefined();
  });

  it("категория содержит только свои промты", () => {
    const prompts = getPromptsByCategory("designers", "ru");
    expect(prompts.length).toBeGreaterThan(0);
    expect(prompts.every((p) => p.category === "designers")).toBe(true);
  });
});

describe("searchPrompts", () => {
  it("пустой запрос возвращает всё без изменений", () => {
    expect(searchPrompts(PROMPTS, "")).toBe(PROMPTS);
    expect(searchPrompts(PROMPTS, "   ")).toBe(PROMPTS);
  });

  it("находит по заголовку без учёта регистра", () => {
    const prompt = PROMPTS[0];
    const needle = prompt.title.slice(0, 5).toUpperCase();
    const found = searchPrompts(PROMPTS, needle);
    expect(found.some((p) => p.id === prompt.id)).toBe(true);
  });

  it("находит по тегу", () => {
    const prompt = PROMPTS.find((p) => p.tags.length > 0)!;
    const found = searchPrompts(PROMPTS, prompt.tags[0]);
    expect(found.some((p) => p.id === prompt.id)).toBe(true);
  });

  it("не находит текст самого промта — он не в области поиска", () => {
    // Слово из середины промта, которого точно нет в заголовке/описании/
    // тегах любого другого промта, не должно давать ложных совпадений
    // через прямой поиск по prompt.prompt.
    const prompt = PROMPTS.find((p) => p.prompt.includes("Role:"));
    if (!prompt) return;
    const inTitle = prompt.title.toLowerCase().includes("role:");
    const inSummary = prompt.summary.toLowerCase().includes("role:");
    expect(inTitle || inSummary).toBe(false);
    expect(searchPrompts([prompt], "Role:")).toEqual([]);
  });

  it("несуществующий запрос — пустой список", () => {
    expect(searchPrompts(PROMPTS, "нет такого промта вообще никогда")).toEqual([]);
  });
});
