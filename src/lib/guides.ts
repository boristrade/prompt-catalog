import type { Locale } from "@/lib/i18n/config";

/*
  Гайды — разборы, а не промты.

  Промт копируют и уносят, гайд читают. Поэтому у него другая структура:
  не текст с {переменными}, а разделы с абзацами, и своя страница на
  каждый — люди приходят на них из поиска по конкретному вопросу.

  Тексты на двух языках, как промты, FAQ и правовые документы: держать
  живые разборы на шести языках дороже, чем они того стоят, а устаревший
  гайд хуже отсутствующего.

  Структура намеренно совпадает с legal.ts — те же Section с массивом
  абзацев. Две почти одинаковые вёрстки разошлись бы при первой правке.
*/

export const GUIDES = [
  "how-to-write-prompts",
  "why-ai-answers-wrong",
  "claude-code-start",
  "claude-md",
] as const;

export type GuideSlug = (typeof GUIDES)[number];

export function isGuide(value: string): value is GuideSlug {
  return (GUIDES as readonly string[]).includes(value);
}

export interface Section {
  title: string;
  body: string[];
}

export interface Guide {
  title: string;
  /** Одной строкой: о чём и кому. Идёт в список и в описание для поиска. */
  summary: string;
  intro: string;
  /** Сколько читать. Считается руками — по числу абзацев, округляя вверх. */
  minutes: number;
  sections: Section[];
}

const RU: Record<GuideSlug, Guide> = {
  "how-to-write-prompts": {
    title: "Как писать промты, чтобы получалось",
    summary:
      "Четыре части хорошего промта и разбор, почему «сделай красиво» никогда не работает.",
    intro:
      "Нейросеть не читает мысли и не догадывается о контексте. Она выполняет то, что написано, — и если написано расплывчато, расплывчатым будет и ответ. Вот из чего состоит промт, который срабатывает с первого раза.",
    minutes: 6,
    sections: [
      {
        title: "Роль: кем должна быть модель",
        body: [
          "«Ты — арт-директор брендингового агентства» работает лучше, чем просто «придумай логотип». Роль задаёт словарь, уровень детализации и то, о чём модель вообще вспомнит.",
          "Без роли модель отвечает усреднённо — так, как ответил бы кто угодно. С ролью она достаёт специфические знания: арт-директор заговорит про сетку и кегль, маркетолог — про воронку и оффер.",
          "Роль стоит уточнять опытом: «дизайнер с десятью годами в упаковке» даст другой ответ, чем просто «дизайнер».",
        ],
      },
      {
        title: "Задача: что именно сделать",
        body: [
          "Плохо: «напиши текст для сайта». Хорошо: «напиши заголовок первого экрана длиной до 60 символов».",
          "Глагол должен быть один и однозначный: разбери, придумай, перепиши, сравни. «Помоги с текстом» — не задача, это приглашение к разговору.",
          "Если задач несколько, разбейте на пункты и пронумеруйте. Модель выполнит их по порядку и ничего не потеряет.",
        ],
      },
      {
        title: "Контекст: что модель не знает без вас",
        body: [
          "Продукт, аудитория, площадка, ограничения. Всё, что вы держите в голове и считаете очевидным, для модели не существует.",
          "Самая частая ошибка — не дать контекст и потом удивляться общему ответу. Модель не спросит, она додумает.",
          "Контекст удобно давать списком с двоеточиями: «Продукт: {что}. Аудитория: {кто}. Площадка: {где}». Так его легко менять, не переписывая весь промт.",
        ],
      },
      {
        title: "Формат: как должен выглядеть ответ",
        body: [
          "«Выдай списком из пяти пунктов, у каждого — заголовок и одно предложение пояснения». Без этого модель сама решит, что вам нужно, и решит неудачно.",
          "Формат заодно ограничивает объём. «Не длиннее 500 символов» экономит вам минуту чтения на каждом ответе.",
          "Полезно сказать, чего в ответе быть не должно: «без вступления», «не объясняй, что ты делаешь», «сразу к делу».",
        ],
      },
      {
        title: "Что убивает промт",
        body: [
          "Вежливость. «Пожалуйста, не мог бы ты» не улучшает ответ, а размывает задачу.",
          "Несколько разных задач в одном абзаце. Модель выполнит первую и смажет остальные.",
          "Оценочные слова без критерия: «красиво», «профессионально», «цепляюще». Замените на проверяемое: «до 60 символов», «без канцелярита», «с числом в первой строке».",
          "Отсутствие примера. Если вы знаете, как выглядит хороший ответ, — покажите его. Один пример заменяет три абзаца объяснений.",
        ],
      },
      {
        title: "Проверка перед отправкой",
        body: [
          "Прочитайте промт глазами человека, который не знает вашего проекта. Всё ли понятно? Если нет — не поймёт и модель.",
          "Есть ли в промте хоть одно слово, которое можно понять двояко? Уберите или уточните.",
          "Понятно ли из промта, как будет выглядеть готовый ответ? Если нет — допишите формат.",
        ],
      },
    ],
  },

  "why-ai-answers-wrong": {
    title: "Почему нейросеть отвечает не то",
    summary:
      "Пять причин, по которым ответ выходит бесполезным, и что менять в каждом случае.",
    intro:
      "Чаще всего дело не в модели, а в запросе. Вот пять типичных случаев — по симптому легко узнать свой и понять, что чинить.",
    minutes: 5,
    sections: [
      {
        title: "Ответ общий и водянистый",
        body: [
          "Симптом: получаете абзацы, которые подошли бы любому бизнесу в любой нише.",
          "Причина: нет контекста. Модель не знает ваш продукт и отвечает усреднённо.",
          "Что делать: добавьте конкретику — что продаёте, кому, чем отличаетесь. Чем уже вход, тем точнее выход.",
        ],
      },
      {
        title: "Ответ длинный, а нужного в нём мало",
        body: [
          "Симптом: три экрана текста, из которых полезны две строки.",
          "Причина: не задан формат и объём. Модель по умолчанию склонна объяснять и раскладывать.",
          "Что делать: «Списком, пять пунктов, каждый до одного предложения. Без вступления и вывода».",
        ],
      },
      {
        title: "Модель отвечает не на тот вопрос",
        body: [
          "Симптом: вы спросили про одно, ответ про соседнее.",
          "Причина: в промте несколько задач сразу, и модель выбрала не ту, что вам важна.",
          "Что делать: одна задача — один запрос. Остальное следующим сообщением.",
        ],
      },
      {
        title: "Ответ правдоподобный, но неверный",
        body: [
          "Симптом: цифры, ссылки и цитаты, которых не существует.",
          "Причина: модель заполняет пробел похожим на правду, если её не остановить.",
          "Что делать: прямо разрешите не знать — «если данных нет, так и напиши, не придумывай». И проверяйте всё, что выглядит как факт: даты, числа, названия.",
        ],
      },
      {
        title: "Каждый раз получается по-разному",
        body: [
          "Симптом: один и тот же промт даёт то хороший, то плохой результат.",
          "Причина: промт допускает разные прочтения, и модель каждый раз выбирает своё.",
          "Что делать: добавьте пример желаемого ответа прямо в промт. Это самый сильный способ сузить разброс.",
        ],
      },
    ],
  },

  "claude-code-start": {
    title: "Claude Code: с чего начать",
    summary:
      "Что это такое, как поставить и какие три вещи стоит сделать в первый день.",
    intro:
      "Claude Code — это Claude, который работает прямо в вашем проекте: читает файлы, правит код, запускает команды и коммитит. Не подсказка в редакторе, а исполнитель, которому ставят задачу словами.",
    minutes: 5,
    sections: [
      {
        title: "Чем отличается от чата",
        body: [
          "В чате вы копируете код туда-обратно. Здесь агент сам открывает файлы, находит нужное место и правит.",
          "Он видит весь проект целиком, а не тот кусок, что вы вставили. Поэтому понимает, где ещё аукнется правка.",
          "Он умеет проверять себя: запустить тесты, собрать проект, открыть страницу в браузере и посмотреть, что получилось.",
        ],
      },
      {
        title: "Установка",
        body: [
          "Нужен Node.js 18 или новее. Ставится одной командой: npm install -g @anthropic-ai/claude-code",
          "Дальше заходите в папку проекта и запускаете claude. При первом запуске попросит войти в аккаунт.",
          "Есть и без установки: claude.ai/code открывается в браузере и работает с вашими репозиториями на GitHub.",
        ],
      },
      {
        title: "Первое, что стоит сделать",
        body: [
          "Попросите объяснить проект: «разберись, что здесь за проект, и расскажи коротко». Так вы увидите, насколько он понимает вашу кодовую базу, и заодно получите описание, которое пригодится вам самим.",
          "Заведите CLAUDE.md — файл с правилами проекта, который агент читает в начале каждой сессии. Про него отдельный гайд.",
          "Дайте маленькую настоящую задачу, а не выдуманную. Починить known баг лучше показывает возможности, чем «напиши функцию сортировки».",
        ],
      },
      {
        title: "Как ставить задачи",
        body: [
          "Говорите о результате, а не о шагах. «Сделай, чтобы кнопка вела в раздел ниже» лучше, чем «открой page.tsx, найди строку 114».",
          "Просите проверять: «прогони тесты», «покажи скриншот на телефоне». Агент умеет это сам, но не всегда догадается, что вам это важно.",
          "Не бойтесь отменять. Не понравилось — скажите «отмени», это дешевле, чем править чужую правку.",
        ],
      },
      {
        title: "Чего ждать не стоит",
        body: [
          "Он не читает ваши мысли о продукте. Решения о том, что строить, остаются за вами.",
          "Он ошибается — как и человек. Поэтому просите проверять результат, а не верьте отчёту на слово.",
          "Он не заменяет знание проекта. Чем лучше вы объясните контекст, тем меньше придётся переделывать.",
        ],
      },
    ],
  },

  "claude-md": {
    title: "CLAUDE.md: как объяснить агенту ваш проект",
    summary:
      "Файл, который агент читает в начале каждой сессии. Что в него класть и чего в нём быть не должно.",
    intro:
      "CLAUDE.md лежит в корне проекта и подгружается автоматически. Это место для правил, которые иначе пришлось бы повторять в каждой задаче — и которые агент нарушит, если их не написать.",
    minutes: 5,
    sections: [
      {
        title: "Что туда писать",
        body: [
          "Чего в проекте нет. «Не используем styled-components», «нет shadcn/ui» — иначе агент притащит это из готового сниппета, потому что так принято в интернете.",
          "Неочевидные ловушки. Места, где легко ошибиться и где ошибка не видна сразу: дублирующаяся вёрстка, файлы, которые обязаны меняться парой, порядок запуска миграций.",
          "Команды проверки. Что запустить перед коммитом: типы, тесты, сборка. Тогда агент проверит себя сам, без напоминаний.",
          "Правила про деньги и доступ, если они есть. Это то место, где ошибка стоит дороже всего.",
        ],
      },
      {
        title: "Чего писать не надо",
        body: [
          "Того, что видно из кода. Список папок и названия компонентов агент прочитает сам, и они устареют быстрее, чем вы их обновите.",
          "Общих слов вроде «пиши чистый код» и «следуй лучшим практикам». Это не правило, а пожелание, и проверить его нельзя.",
          "Длинных описаний архитектуры. Файл читается каждый раз, и чем он длиннее, тем хуже работает. Держите в пределах экрана-двух.",
          "Секретов. Ключи, пароли, адреса внутренних сервисов — никогда.",
        ],
      },
      {
        title: "Как понять, что правило нужно",
        body: [
          "Если вы объяснили одно и то же дважды в разных задачах — это кандидат в CLAUDE.md.",
          "Если агент сделал что-то не так и вы поправили — запишите не саму правку, а правило, из которого она следует.",
          "Хорошее правило объясняет почему, а не только что. «Ряды кнопок — flex-wrap, иначе на 360px они уезжают за край» работает лучше, чем «используй flex-wrap».",
        ],
      },
      {
        title: "Пример структуры",
        body: [
          "Короткое описание проекта: что это и на чём сделано. Две-три строки.",
          "Раздел про то, чего в проекте нет.",
          "Разделы про узкие места — по одному на каждую область, где легко ошибиться.",
          "Команды проверки перед коммитом.",
        ],
      },
    ],
  },
};

const EN: Record<GuideSlug, Guide> = {
  "how-to-write-prompts": {
    title: "How to write prompts that actually work",
    summary:
      "The four parts of a good prompt, and why “make it look nice” never works.",
    intro:
      "A model doesn't read minds and doesn't guess at context. It does what the text says — and if the text is vague, so is the answer. Here's what a prompt that lands on the first try is made of.",
    minutes: 6,
    sections: [
      {
        title: "Role: who the model should be",
        body: [
          "“You are the art director of a branding agency” works better than “design a logo”. The role sets the vocabulary, the level of detail, and what the model even thinks to mention.",
          "Without a role the model answers like anyone would — averaged out. With one it reaches for specifics: an art director talks about grid and type size, a marketer about funnel and offer.",
          "Sharpen the role with experience: “a designer with ten years in packaging” gives a different answer than “a designer”.",
        ],
      },
      {
        title: "Task: what exactly to do",
        body: [
          "Bad: “write some copy for the site.” Good: “write a hero headline of no more than 60 characters.”",
          "Use one unambiguous verb: break down, come up with, rewrite, compare. “Help me with the copy” isn't a task, it's an invitation to chat.",
          "If there are several tasks, split and number them. The model will work through them in order and lose nothing.",
        ],
      },
      {
        title: "Context: what the model can't know without you",
        body: [
          "Product, audience, platform, constraints. Everything you hold in your head and treat as obvious does not exist for the model.",
          "The most common mistake is giving no context and then being surprised by a generic answer. The model won't ask — it will fill in the blank.",
          "Context is easiest to give as a labelled list: “Product: {what}. Audience: {who}. Platform: {where}.” That way it's easy to change without rewriting the prompt.",
        ],
      },
      {
        title: "Format: what the answer should look like",
        body: [
          "“Give me a list of five, each with a heading and one sentence of explanation.” Without this the model decides for you, and decides badly.",
          "Format also caps length. “No longer than 500 characters” saves you a minute of reading on every answer.",
          "It helps to say what shouldn't be there: “no preamble”, “don't explain what you're doing”, “straight to it”.",
        ],
      },
      {
        title: "What kills a prompt",
        body: [
          "Politeness. “Could you please possibly” doesn't improve the answer, it blurs the task.",
          "Several different tasks in one paragraph. The model does the first and smears the rest.",
          "Judgement words with no criterion: “nice”, “professional”, “catchy”. Replace them with something checkable: “under 60 characters”, “no corporate speak”, “a number in the first line”.",
          "No example. If you know what a good answer looks like, show one. A single example replaces three paragraphs of explanation.",
        ],
      },
      {
        title: "A check before you send",
        body: [
          "Read the prompt as someone who doesn't know your project. Is everything clear? If not, the model won't get it either.",
          "Is there a single word in it that could be read two ways? Remove it or pin it down.",
          "Can you tell from the prompt what the finished answer will look like? If not, add the format.",
        ],
      },
    ],
  },

  "why-ai-answers-wrong": {
    title: "Why the AI answers the wrong thing",
    summary:
      "Five reasons an answer comes out useless, and what to change in each case.",
    intro:
      "Usually it isn't the model, it's the request. Here are five typical cases — the symptom makes it easy to spot yours and see what to fix.",
    minutes: 5,
    sections: [
      {
        title: "The answer is generic and watery",
        body: [
          "Symptom: paragraphs that would suit any business in any niche.",
          "Cause: no context. The model doesn't know your product, so it answers on average.",
          "Fix: add specifics — what you sell, to whom, what makes you different. The narrower the input, the sharper the output.",
        ],
      },
      {
        title: "The answer is long but thin",
        body: [
          "Symptom: three screens of text with two useful lines in them.",
          "Cause: no format and no length given. By default the model leans towards explaining and unpacking.",
          "Fix: “A list of five, each one sentence. No intro, no conclusion.”",
        ],
      },
      {
        title: "The model answers a different question",
        body: [
          "Symptom: you asked about one thing, the answer is about its neighbour.",
          "Cause: several tasks in one prompt, and the model picked the one you cared about least.",
          "Fix: one task, one request. The rest goes in the next message.",
        ],
      },
      {
        title: "The answer looks right and isn't",
        body: [
          "Symptom: numbers, links and quotes that don't exist.",
          "Cause: the model fills a gap with something plausible unless you stop it.",
          "Fix: explicitly allow it not to know — “if you don't have the data, say so, don't invent it”. And check anything that looks like a fact: dates, numbers, names.",
        ],
      },
      {
        title: "It comes out different every time",
        body: [
          "Symptom: the same prompt gives a good result, then a bad one.",
          "Cause: the prompt allows several readings, and the model picks a new one each time.",
          "Fix: put an example of the answer you want into the prompt. It's the strongest way to narrow the spread.",
        ],
      },
    ],
  },

  "claude-code-start": {
    title: "Claude Code: where to start",
    summary:
      "What it is, how to install it, and the three things worth doing on day one.",
    intro:
      "Claude Code is Claude working inside your project: it reads files, edits code, runs commands and commits. Not a hint in your editor — someone you brief in words.",
    minutes: 5,
    sections: [
      {
        title: "How it differs from a chat",
        body: [
          "In a chat you copy code back and forth. Here the agent opens the files itself, finds the right spot and edits it.",
          "It sees the whole project, not the fragment you pasted. So it knows where else a change will land.",
          "It can check itself: run the tests, build the project, open a page in a browser and look at the result.",
        ],
      },
      {
        title: "Installing",
        body: [
          "You need Node.js 18 or newer. One command: npm install -g @anthropic-ai/claude-code",
          "Then go to your project folder and run claude. On first launch it asks you to sign in.",
          "There's also a no-install route: claude.ai/code runs in the browser and works with your GitHub repositories.",
        ],
      },
      {
        title: "The first thing worth doing",
        body: [
          "Ask it to explain the project: “work out what this project is and tell me briefly”. You'll see how well it understands your codebase and get a description that's useful to you too.",
          "Create a CLAUDE.md — a file of project rules the agent reads at the start of every session. There's a separate guide on it.",
          "Give it a small real task, not an invented one. Fixing a known bug shows what it can do far better than “write a sorting function”.",
        ],
      },
      {
        title: "How to brief it",
        body: [
          "Talk about the outcome, not the steps. “Make the button scroll to the section below” beats “open page.tsx, find line 114”.",
          "Ask it to verify: “run the tests”, “show me a screenshot on mobile”. It can do this itself, but it won't always guess that you care.",
          "Don't hesitate to undo. If you don't like it, say “revert” — that's cheaper than editing someone else's edit.",
        ],
      },
      {
        title: "What not to expect",
        body: [
          "It doesn't read your mind about the product. What to build stays your call.",
          "It makes mistakes, like anyone. So ask it to verify the result rather than trusting the report.",
          "It doesn't replace knowing your project. The better you explain the context, the less you'll redo.",
        ],
      },
    ],
  },

  "claude-md": {
    title: "CLAUDE.md: explaining your project to the agent",
    summary:
      "The file the agent reads at the start of every session. What belongs in it and what doesn't.",
    intro:
      "CLAUDE.md sits in the project root and loads automatically. It's the place for rules you'd otherwise repeat in every task — and that the agent will break if you don't write them down.",
    minutes: 5,
    sections: [
      {
        title: "What to put in it",
        body: [
          "What the project does not use. “No styled-components”, “no shadcn/ui” — otherwise the agent brings them in from a ready-made snippet, because that's what the internet does.",
          "Non-obvious traps. Places where it's easy to get it wrong and where the mistake isn't visible right away: duplicated markup, files that must change in pairs, the order migrations run in.",
          "The commands that check the work. What to run before committing: types, tests, build. Then the agent checks itself without being reminded.",
          "Rules about money and access, if you have them. That's where a mistake costs the most.",
        ],
      },
      {
        title: "What to leave out",
        body: [
          "Anything visible from the code. The agent will read your folder names and components itself, and they'll go stale faster than you update them.",
          "Generalities like “write clean code” and “follow best practices”. That's a wish, not a rule, and nothing can be checked against it.",
          "Long architecture write-ups. The file is read every time, and the longer it is the worse it works. Keep it to a screen or two.",
          "Secrets. Keys, passwords, internal hostnames — never.",
        ],
      },
      {
        title: "How to tell a rule is needed",
        body: [
          "If you've explained the same thing twice across different tasks, it belongs in CLAUDE.md.",
          "If the agent did something wrong and you corrected it, write down not the correction but the rule behind it.",
          "A good rule says why, not just what. “Rows of buttons need flex-wrap, otherwise they run off the edge at 360px” works better than “use flex-wrap”.",
        ],
      },
      {
        title: "A sample structure",
        body: [
          "A short description of the project: what it is and what it's built on. Two or three lines.",
          "A section on what the project doesn't use.",
          "A section per area where it's easy to get things wrong.",
          "The commands to run before committing.",
        ],
      },
    ],
  },
};

export function guide(locale: Locale, slug: GuideSlug): Guide {
  return locale === "ru" ? RU[slug] : EN[slug];
}

export function allGuides(locale: Locale): { slug: GuideSlug; guide: Guide }[] {
  return GUIDES.map((slug) => ({ slug, guide: guide(locale, slug) }));
}
