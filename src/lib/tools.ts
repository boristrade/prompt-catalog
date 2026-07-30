import type { Locale } from "@/lib/i18n/config";

/** Группы задач. Названия групп лежат в словарях — здесь только ключи. */
export const TOOL_GROUPS = [
  "text",
  "images",
  "design",
  "video",
  "marketing",
] as const;

export type ToolGroup = (typeof TOOL_GROUPS)[number];

export interface Tool {
  name: string;
  url: string;
  group: ToolGroup;
  description: string;
  pricing: "free" | "freemium" | "paid";
}

/*
  Подборка сервисов и нейросетей, сгруппированных по задачам.
  В Фазе 7 источником станет таблица tools в Supabase.

  Описания русские; английские лежат ниже в TOOLS_EN и подставляются на
  всех языках, кроме русского.
*/
export const TOOLS: Tool[] = [
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    group: "text",
    description: "Универсальный ассистент для текстов, идей, кода и анализа.",
    pricing: "freemium",
  },
  {
    name: "Claude",
    url: "https://claude.ai",
    group: "text",
    description:
      "Сильный собеседник для длинных текстов, разбора файлов и вдумчивых задач.",
    pricing: "freemium",
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    group: "text",
    description:
      "Ассистент Google с доступом к актуальному поиску и работе с изображениями.",
    pricing: "freemium",
  },
  {
    name: "Perplexity",
    url: "https://perplexity.ai",
    group: "text",
    description:
      "Поисковый AI со ссылками на источники — для ресёрча и фактов.",
    pricing: "freemium",
  },

  {
    name: "Midjourney",
    url: "https://midjourney.com",
    group: "images",
    description: "Лучшее качество генерации для концептов, визуалов и рекламы.",
    pricing: "paid",
  },
  {
    name: "Flux",
    url: "https://blackforestlabs.ai",
    group: "images",
    description:
      "Фотореалистичная генерация с точной прорисовкой деталей и текста.",
    pricing: "freemium",
  },
  {
    name: "Leonardo AI",
    url: "https://leonardo.ai",
    group: "images",
    description: "Генерация с контролем стиля и бесплатным дневным лимитом.",
    pricing: "freemium",
  },
  {
    name: "Adobe Firefly",
    url: "https://firefly.adobe.com",
    group: "images",
    description: "Генерация внутри экосистемы Adobe, безопасная для коммерции.",
    pricing: "freemium",
  },

  {
    name: "Figma AI",
    url: "https://figma.com",
    group: "design",
    description: "Макеты интерфейсов с AI-помощниками прямо в редакторе.",
    pricing: "freemium",
  },
  {
    name: "Canva",
    url: "https://canva.com",
    group: "design",
    description: "Быстрая графика, карточки и презентации с Magic Studio.",
    pricing: "freemium",
  },
  {
    name: "Photoroom",
    url: "https://photoroom.com",
    group: "design",
    description: "Удаление фона и студийные фото товаров для маркетплейсов.",
    pricing: "freemium",
  },
  {
    name: "Upscayl",
    url: "https://upscayl.org",
    group: "design",
    description: "Бесплатное увеличение разрешения изображений без потерь.",
    pricing: "free",
  },

  {
    name: "CapCut",
    url: "https://capcut.com",
    group: "video",
    description:
      "Монтаж вертикальных роликов, авто-субтитры и тренды для Reels/TikTok.",
    pricing: "freemium",
  },
  {
    name: "HeyGen",
    url: "https://heygen.com",
    group: "video",
    description: "AI-аватары и говорящие головы для UGC без съёмки.",
    pricing: "freemium",
  },
  {
    name: "ElevenLabs",
    url: "https://elevenlabs.io",
    group: "video",
    description: "Реалистичная озвучка и клонирование голоса на разных языках.",
    pricing: "freemium",
  },
  {
    name: "Runway",
    url: "https://runwayml.com",
    group: "video",
    description:
      "Генерация и редактирование видео нейросетью, эффекты и motion.",
    pricing: "freemium",
  },

  {
    name: "MPStats",
    url: "https://mpstats.io",
    group: "marketing",
    description: "Аналитика ниш, конкурентов и ключей для Wildberries и Ozon.",
    pricing: "paid",
  },
  {
    name: "Notion AI",
    url: "https://notion.so",
    group: "marketing",
    description: "База знаний и контент-планы с AI-помощником внутри.",
    pricing: "freemium",
  },
];

/*
  Английские описания. Ключ — имя сервиса: имена не переводятся, поэтому
  они же и есть идентификаторы. Пропущенное описание ломает сборку ниже.
*/
const TOOLS_EN: Record<string, string> = {
  ChatGPT: "An all-round assistant for text, ideas, code and analysis.",
  Claude:
    "A strong thinking partner for long texts, file analysis and careful work.",
  Gemini: "Google's assistant with live search access and image understanding.",
  Perplexity: "Search AI that cites its sources — for research and facts.",
  Midjourney:
    "The best generation quality for concepts, visuals and advertising.",
  Flux: "Photorealistic generation with accurate detail and readable text.",
  "Leonardo AI": "Generation with style control and a free daily allowance.",
  "Adobe Firefly":
    "Generation inside the Adobe ecosystem, safe for commercial use.",
  "Figma AI": "Interface design with AI helpers right inside the editor.",
  Canva: "Fast graphics, listings and decks with Magic Studio.",
  Photoroom: "Background removal and studio product shots for marketplaces.",
  Upscayl: "Free, lossless image upscaling.",
  CapCut: "Vertical video editing, auto captions and trends for Reels/TikTok.",
  HeyGen: "AI avatars and talking heads for UGC without filming.",
  ElevenLabs: "Realistic voiceover and voice cloning across languages.",
  Runway: "AI video generation and editing, effects and motion.",
  MPStats: "Niche, competitor and keyword analytics for Wildberries and Ozon.",
  "Notion AI": "A knowledge base and content plans with an AI helper inside.",
};

const untranslated = TOOLS.filter((tool) => !TOOLS_EN[tool.name]).map(
  (tool) => tool.name,
);
if (untranslated.length > 0) {
  throw new Error(
    `tools.ts: нет английского описания для ${untranslated.join(", ")}`,
  );
}

const TOOLS_ENGLISH: Tool[] = TOOLS.map((tool) => ({
  ...tool,
  description: TOOLS_EN[tool.name],
}));

export function toolsFor(locale: Locale): Tool[] {
  return locale === "ru" ? TOOLS : TOOLS_ENGLISH;
}

/*
  Группируем в порядке TOOL_GROUPS, а не в порядке появления в массиве:
  порядок разделов на странице не должен зависеть от того, как отсортирован
  список сервисов.
*/
export function toolsByGroup(locale: Locale): [ToolGroup, Tool[]][] {
  const all = toolsFor(locale);
  return TOOL_GROUPS.map(
    (group) =>
      [group, all.filter((tool) => tool.group === group)] as [
        ToolGroup,
        Tool[],
      ],
  ).filter(([, tools]) => tools.length > 0);
}
