import { describe, it, expect } from "vitest";
import {
  PROMPTS,
  isLocked,
  veil,
  toolsInCategory,
  usesTool,
  getPromptById,
  getPromptsByCategory,
  type Prompt,
} from "./prompts";

describe("veil", () => {
  it("вырезает текст промта и пример, остальное оставляет", () => {
    const prompt = PROMPTS[0];
    const veiled = veil(prompt);

    expect(veiled.prompt).toBe("");
    expect(veiled.example).toBe("");
    expect(veiled.title).toBe(prompt.title);
    expect(veiled.summary).toBe(prompt.summary);
    expect(veiled.tags).toEqual(prompt.tags);
    expect(veiled.bestFor).toBe(prompt.bestFor);
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
