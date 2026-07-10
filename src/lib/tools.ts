export interface Tool {
  name: string;
  url: string;
  category: string;
  description: string;
  pricing: "free" | "freemium" | "paid";
}

/*
  Подборка сервисов и нейросетей, сгруппированных по задачам.
  В Фазе 7 источником станет таблица tools в Supabase.
*/
export const TOOLS: Tool[] = [
  // Текст и ассистенты
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    category: "Текст и ассистенты",
    description: "Универсальный ассистент для текстов, идей, кода и анализа.",
    pricing: "freemium",
  },
  {
    name: "Claude",
    url: "https://claude.ai",
    category: "Текст и ассистенты",
    description: "Сильный собеседник для длинных текстов, разбора файлов и вдумчивых задач.",
    pricing: "freemium",
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    category: "Текст и ассистенты",
    description: "Ассистент Google с доступом к актуальному поиску и работе с изображениями.",
    pricing: "freemium",
  },
  {
    name: "Perplexity",
    url: "https://perplexity.ai",
    category: "Текст и ассистенты",
    description: "Поисковый AI со ссылками на источники — для ресёрча и фактов.",
    pricing: "freemium",
  },

  // Изображения
  {
    name: "Midjourney",
    url: "https://midjourney.com",
    category: "Изображения",
    description: "Лучшее качество генерации для концептов, визуалов и рекламы.",
    pricing: "paid",
  },
  {
    name: "Flux",
    url: "https://blackforestlabs.ai",
    category: "Изображения",
    description: "Фотореалистичная генерация с точной прорисовкой деталей и текста.",
    pricing: "freemium",
  },
  {
    name: "Leonardo AI",
    url: "https://leonardo.ai",
    category: "Изображения",
    description: "Генерация с контролем стиля и бесплатным дневным лимитом.",
    pricing: "freemium",
  },
  {
    name: "Adobe Firefly",
    url: "https://firefly.adobe.com",
    category: "Изображения",
    description: "Генерация внутри экосистемы Adobe, безопасная для коммерции.",
    pricing: "freemium",
  },

  // Дизайн и редактирование
  {
    name: "Figma AI",
    url: "https://figma.com",
    category: "Дизайн и редактирование",
    description: "Макеты интерфейсов с AI-помощниками прямо в редакторе.",
    pricing: "freemium",
  },
  {
    name: "Canva",
    url: "https://canva.com",
    category: "Дизайн и редактирование",
    description: "Быстрая графика, карточки и презентации с Magic Studio.",
    pricing: "freemium",
  },
  {
    name: "Photoroom",
    url: "https://photoroom.com",
    category: "Дизайн и редактирование",
    description: "Удаление фона и студийные фото товаров для маркетплейсов.",
    pricing: "freemium",
  },
  {
    name: "Upscayl",
    url: "https://upscayl.org",
    category: "Дизайн и редактирование",
    description: "Бесплатное увеличение разрешения изображений без потерь.",
    pricing: "free",
  },

  // Видео и UGC
  {
    name: "CapCut",
    url: "https://capcut.com",
    category: "Видео и UGC",
    description: "Монтаж вертикальных роликов, авто-субтитры и тренды для Reels/TikTok.",
    pricing: "freemium",
  },
  {
    name: "HeyGen",
    url: "https://heygen.com",
    category: "Видео и UGC",
    description: "AI-аватары и говорящие головы для UGC без съёмки.",
    pricing: "freemium",
  },
  {
    name: "ElevenLabs",
    url: "https://elevenlabs.io",
    category: "Видео и UGC",
    description: "Реалистичная озвучка и клонирование голоса на разных языках.",
    pricing: "freemium",
  },
  {
    name: "Runway",
    url: "https://runwayml.com",
    category: "Видео и UGC",
    description: "Генерация и редактирование видео нейросетью, эффекты и motion.",
    pricing: "freemium",
  },

  // Маркетинг и продажи
  {
    name: "MPStats",
    url: "https://mpstats.io",
    category: "Маркетинг и маркетплейсы",
    description: "Аналитика ниш, конкурентов и ключей для Wildberries и Ozon.",
    pricing: "paid",
  },
  {
    name: "Notion AI",
    url: "https://notion.so",
    category: "Маркетинг и маркетплейсы",
    description: "База знаний и контент-планы с AI-помощником внутри.",
    pricing: "freemium",
  },
];

export function toolsByCategory(): Record<string, Tool[]> {
  return TOOLS.reduce<Record<string, Tool[]>>((acc, tool) => {
    (acc[tool.category] ??= []).push(tool);
    return acc;
  }, {});
}
