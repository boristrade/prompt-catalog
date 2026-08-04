import "server-only";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/lib/i18n/config";

/*
  Скилы для Claude Code.

  Скил — это папка с файлом SKILL.md в .claude/skills проекта. Агент
  читает описание из шапки файла и подключает инструкции сам, когда
  задача под них подходит. То есть это не промт, который копируют в чат
  каждый раз, а правило, которое живёт в проекте и срабатывает само.

  Отсюда и разница со страницей промта: копируют здесь целый файл, а не
  сообщение, и к нему нужна инструкция, куда его положить. Поэтому
  отдельный раздел, а не ещё одна категория каталога.

  Сами файлы лежат в content/skills и читаются при сборке — как PDF в
  pdf-guides.ts и обложки в covers.ts. Положил .md — скил появился на
  сайте: имя, описание и адрес страницы берутся из шапки самого файла,
  той самой, по которой его подключает и агент. Раньше текст файла
  хранился строкой прямо в этом модуле, и добавление скила означало
  правку кода в трёх местах.

  Текст файла общий для всех языков и остаётся английским: инструкции
  внутри скила читает модель, и смешивать в них языки незачем. Переводим
  только то, что читает человек, — название, описание и разбор.
*/

const DIR = join(process.cwd(), "content", "skills");

export interface SkillText {
  title: string;
  /** Одной строкой для карточки и описания в поиске. */
  summary: string;
  /** Когда он срабатывает и что делает. Абзацами. Может не быть. */
  what: string[];
  /** Зачем он вообще нужен — какая боль без него. Может не быть. */
  why: string;
  /*
    Теги переводятся вместе с остальным: «вёрстка» в английской карточке
    выглядела бы опечаткой, а не тегом.
  */
  tags: string[];
}

export interface SkillFile {
  /** Путь внутри папки скила: «SKILL.md», «references/scenarios.md». */
  path: string;
  text: string;
}

export interface Skill extends SkillText {
  id: string;
  /** Имя папки в .claude/skills. Одна на все языки: это путь на диске. */
  folder: string;
  /** Содержимое SKILL.md целиком. */
  file: string;
  /*
    Все файлы скила, SKILL.md первым. У большинства он один, но скил
    может ссылаться из инструкций на соседний файл — и тогда без него он
    не работает: агент прочитает «смотри references/scenarios.md» и не
    найдёт его. Поэтому показываем на странице всё, что есть в папке, а
    не только главный файл.
  */
  files: SkillFile[];
}

/*
  Разбор своими руками, без библиотеки: шапка скила — это несколько строк
  «ключ: значение» между строками из трёх дефисов, и ничего сложнее в ней
  не бывает. Значение в несколько строк не поддерживается сознательно —
  агент такую шапку тоже читает построчно.
*/
function frontMatter(file: string): Record<string, string> {
  if (!file.startsWith("---\n")) return {};

  const end = file.indexOf("\n---", 4);
  if (end < 0) return {};

  const fields: Record<string, string> = {};
  for (const line of file.slice(4, end).split("\n")) {
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    fields[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return fields;
}

/*
  Название для карточки, когда своего перевода нет: берём первый
  заголовок из самого файла — «# Writing the commit message». Он написан
  человеком и читается лучше, чем имя папки. Если заголовка нет, остаётся
  имя: «commit-message» → «Commit message».
*/
function titleFrom(file: string, id: string): string {
  const heading = file.match(/^# (.+)$/m)?.[1]?.trim();
  if (heading) return heading;

  const words = id.replace(/[-_]+/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/*
  Описание в шапке написано для модели, а не для карточки, и длины ему
  никто не задавал: у иного скила это абзац на тысячу символов, который
  на карточке вытеснит всё остальное. Режем по концу предложения, а если
  и первое предложение длинное — по слову, с многоточием, чтобы обрыв был
  виден и не выглядел потерянным текстом.
*/
const SUMMARY_LIMIT = 200;

function shorten(text: string): string {
  if (text.length <= SUMMARY_LIMIT) return text;

  const sentence = text.slice(0, SUMMARY_LIMIT).lastIndexOf(". ");
  if (sentence > 60) return text.slice(0, sentence + 1);

  const word = text.slice(0, SUMMARY_LIMIT).lastIndexOf(" ");
  return `${text.slice(0, word > 60 ? word : SUMMARY_LIMIT).trimEnd()}…`;
}

interface Found {
  id: string;
  file: string;
  files: SkillFile[];
  /** Из шапки файла — на случай, если своего перевода нет. */
  fallback: SkillText;
}

/*
  Скил из нескольких файлов лежит папкой: SKILL.md и всё, на что он из
  него ссылается. Собираем их в один список — SKILL.md первым, остальные
  по алфавиту, с путём относительно папки скила, потому что путь и есть
  инструкция, куда файл класть.

  Всё читается текстом. Картинка или архив в папке скила превратились бы
  в мусор на странице, поэтому на незнакомом расширении сборка падает:
  тихо пропустить файл — значит опубликовать скил, который у человека не
  заработает, и не сказать об этом ни слова.
*/
const TEXT_EXTENSIONS = [
  "md",
  "txt",
  "json",
  "yaml",
  "yml",
  "csv",
  "py",
  "js",
  "ts",
  "sh",
  "toml",
];

function readFolder(dir: string, prefix = ""): SkillFile[] {
  const files: SkillFile[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...readFolder(join(dir, entry.name), path));
      continue;
    }

    const ext = entry.name.slice(entry.name.lastIndexOf(".") + 1).toLowerCase();
    if (!TEXT_EXTENSIONS.includes(ext)) {
      throw new Error(
        `content/skills/${path}: файл с расширением .${ext} на странице ` +
          `показать нечем. Оставьте в папке скила только текстовые файлы ` +
          `(${TEXT_EXTENSIONS.join(", ")}).`,
      );
    }

    files.push({ path, text: readFileSync(join(dir, entry.name), "utf8") });
  }

  // SKILL.md — первым: с него читают и его кладут в папку в первую очередь.
  return files.sort((a, b) =>
    a.path === "SKILL.md" ? -1 : b.path === "SKILL.md" ? 1 : 0,
  );
}

function readSkills(): Found[] {
  if (!existsSync(DIR)) return [];

  const found: Found[] = [];
  for (const entry of readdirSync(DIR, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    let id: string;
    let files: SkillFile[];

    if (entry.isDirectory()) {
      id = entry.name;
      files = readFolder(join(DIR, entry.name));

      if (!files.some((item) => item.path === "SKILL.md")) {
        throw new Error(
          `content/skills/${id}: в папке скила нет SKILL.md — ` +
            `Claude Code подключает скил именно по нему`,
        );
      }
    } else if (entry.name.toLowerCase().endsWith(".md")) {
      id = entry.name.slice(0, -3);
      files = [
        { path: "SKILL.md", text: readFileSync(join(DIR, entry.name), "utf8") },
      ];
    } else {
      continue;
    }

    const file = files[0].text;
    const head = frontMatter(file);

    found.push({
      id,
      file,
      files,
      fallback: {
        title: head.title || titleFrom(file, id),
        summary: shorten(head.description || ""),
        what: [],
        why: "",
        tags: head.tags
          ? head.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      },
    });
  }

  /*
    Сначала те, для которых написан разбор, — в порядке этого разбора;
    затем остальные по алфавиту. Новый файл попадает в конец списка, а не
    втискивается в середину по имени.
  */
  const order = Object.keys(RU);
  return found.sort((a, b) => {
    const ai = order.indexOf(a.id);
    const bi = order.indexOf(b.id);
    if (ai !== bi)
      return (ai < 0 ? order.length : ai) - (bi < 0 ? order.length : bi);
    return a.id.localeCompare(b.id);
  });
}

/*
  Разбор на человеческом языке — необязательный. Скил без него
  публикуется как есть: название и описание берутся из шапки файла, а
  страница показывает, куда его положить, и сам файл. Разбор добавляет к
  этому «что делает» и «зачем нужен» — то, чего в шапке нет и что
  по-английски объяснено модели, а не читателю.
*/
const RU: Record<string, SkillText> = {
  "smm-producer": {
    title: "SMM-продюсер личного бренда",
    summary:
      "Ведёт по шести шагам: разбор профиля, распаковка, контент-план на месяц, сценарии, лид-магниты.",
    what: [
      "Срабатывает на «разбери мой профиль», «контент-план», «идеи для рилс», «упаковка блога» — даже если слова «SMM» не прозвучало.",
      "Разбирает профиль по пяти критериям и даёт быстрые правки на один вечер — готовыми формулировками, а не задачами вида «переписать bio».",
      "Распаковывает вас как эксперта тремя блоками вопросов и собирает позиционирование и контентные столпы, из которых потом растёт весь план.",
      "Делает план на четыре недели таблицей, где у каждой единицы одна цель из трёх: охват, доверие или продажа. За балансом следит сам.",
      "Пишет сценарии Reels, каруселей и сторис и предлагает три лид-магнита разной глубины — от чек-листа до разбора.",
    ],
    why: "Соблазн получить всё сразу — главная причина, по которой контент-планы не работают: план, выданный до распаковки, написан для всех и ни для кого. Скил устроен так, чтобы этого не дать: один шаг за раз, вопросы блоками по два-три, и следующий шаг не начинается без ответа на предыдущий. Отдельно он не глотает размытые ответы вроде «помогаю людям стать счастливее» — переспрашивает на конкретику.",
    tags: ["инстаграм", "контент"],
  },
  "carousel-conveyor": {
    title: "Карусели для Reels и TikTok",
    summary:
      "Собирает карусели вокруг одного персонажа: лицо генерируется один раз, подписи накладываются кодом и бесплатно.",
    what: [
      "Срабатывает, когда вы просите собрать карусели для персонажа, завести нового или запланировать посты.",
      "Сначала заводит персонажа: одно опорное селфи и около шести сцен на его основе. Это единственное место, где тратятся деньги, — примерно 0,6 доллара на персонажа.",
      "Дальше карусели собираются из этих же фотографий, а текст накладывается поверх кодом. Переписать подпись, сменить @-подпись или пересобрать раскладку ничего не стоит.",
      "Каждая сцена делается из оригинального селфи, а не из предыдущей сцены: правка правки уводит лицо в сторону, и через несколько шагов персонаж перестаёт быть узнаваемым.",
      "Перед публикацией показывает готовые слайды и ждёт одобрения — проверяется, что лицо на всех слайдах одно и то же. Каждый пост помечается как сделанный с помощью ИИ.",
    ],
    why: "В таком конвейере дорого стоит только генерация лиц, и заманчиво платить за неё каждый раз заново. Скил устроен наоборот: лицо покупается один раз на персонажа, а подписи, раскладка и расписание делаются кодом бесплатно. Второе, ради чего он нужен, — запрет публиковать непроверенное: уехавшее между слайдами лицо видно только глазами, поэтому слайды сначала показываются вам.",
    tags: ["контент", "соцсети"],
  },
  "commit-message": {
    title: "Сообщение коммита",
    summary:
      "Пишет сообщение по тому, что реально в индексе, и объясняет почему, а не что.",
    what: [
      "Срабатывает, когда вы просите закоммитить или написать сообщение к коммиту.",
      "Сначала читает сам диф из индекса, а не полагается на память о том, что делал. Заголовок — до 72 символов, повелительным наклонением, без точки.",
      "В теле объясняет, что было сломано и почему выбран такой способ. Список изменённых файлов не пишет: это лучше показывает git show --stat.",
      "Если в индексе смешаны две несвязанные правки, скажет об этом и предложит разделить.",
    ],
    why: "История коммитов нужна не сегодня, а через полгода, когда вы ищете, откуда взялась ошибка. «Различные исправления» в этот момент бесполезны, а «почему» — единственное, чего нельзя восстановить из дифа.",
    tags: ["git", "коммиты"],
  },
  "self-review": {
    title: "Ревью своих изменений",
    summary:
      "Проверяет диф перед пушем: несчастливые пути, тихие отказы, дубли.",
    what: [
      "Срабатывает перед пул-реквестом или когда вы спрашиваете, готово ли.",
      "Читает диф целиком относительно основной ветки и смотрит на него как человек, которого разбудят ночью, если это сломается.",
      "Проверяет по порядку: сделано ли то, о чём просили; что будет на пустом значении и упавшем запросе; не открывается ли что-то всем при отсутствии ключа; не появилось ли второе место, которое надо держать в синхроне.",
      "Отдельно ищет поломки, которые не видно на экране: превью для мессенджеров, задачи по расписанию, письма.",
    ],
    why: "Самая дорогая ошибка — та, что выглядит как работающая функция. Скил заставляет пройти по несчастливым путям, которые при обычном чтении дифа пропускают, потому что глаз следит за замыслом, а не за краями.",
    tags: ["ревью", "качество"],
  },
  "mobile-check": {
    title: "Проверка на узком экране",
    summary:
      "Снимает страницу на 360px и ловит горизонтальную прокрутку, обрывы и недостижимые кнопки.",
    what: [
      "Срабатывает, когда вы трогаете вёрстку или спрашиваете, как это выглядит на телефоне.",
      "Запускает браузер шириной 360px, снимает скриншот и смотрит на него — вместо того чтобы утверждать, что «должно быть нормально».",
      "Горизонтальную прокрутку ищет кодом, а не глазами: сравнивает scrollWidth с шириной окна.",
      "Отдельно проверяет то, что спрятано за lg:. Ссылка, живущая только в широком меню, на телефоне не существует вовсе.",
    ],
    why: "Сломанную мобильную вёрстку видно только с телефона, а разработчик смотрит с ноутбука. Так теряются целые кнопки: они есть в коде, их видно в браузере, и их нет у половины пользователей.",
    tags: ["вёрстка", "мобильные"],
  },
  "dead-code": {
    title: "Поиск мёртвого кода",
    summary:
      "Находит неиспользуемые экспорты, файлы и ветки — и доказывает, что они не нужны.",
    what: [
      "Срабатывает при уборке или после удаления функциональности.",
      "Ищет экспорты с единственным упоминанием, файлы, которые никто не импортирует, недостижимые ветки условий и картинки, на которые нет ссылок.",
      "Перед удалением проверяет обращения по строковому ключу и динамические импорты — их поиск по тексту не видит.",
      "Удаляет отдельным коммитом от правок поведения, чтобы откат стоил дёшево.",
    ],
    why: "Мёртвый код опаснее, чем кажется: его читают при разборе, на него ориентируются, его правят вместе с живым. А удалять на глаз рискованно — поэтому скил требует показать доказательство, а не догадку.",
    tags: ["уборка", "рефакторинг"],
  },
};

const EN: Record<string, SkillText> = {
  "smm-producer": {
    title: "Personal brand producer",
    summary:
      "Six steps: profile audit, positioning, a month of content, scripts, lead magnets. The skill itself is in Russian.",
    what: [
      "Triggers on “audit my profile”, “content plan”, “Reels ideas”, “package my blog” — even when the letters SMM are never said.",
      "Audits the profile against five criteria and gives fixes doable in one evening — written out ready to paste, not tasks like “rewrite the bio”.",
      "Unpacks you as an expert through three blocks of questions, then builds the positioning line and the content pillars everything else grows from.",
      "Produces a four-week plan as a table where every item has exactly one goal — reach, trust or sale — and keeps the mix balanced itself.",
      "Writes Reels, carousel and Stories scripts, then offers three lead magnets of different depth, from a checklist to a full teardown.",
    ],
    why: "Wanting everything at once is the main reason content plans fail: a plan handed over before the unpacking is written for everyone and therefore for no one. The skill is built to refuse that — one step at a time, questions in blocks of two or three, and no next step until the previous one is answered. It also refuses to swallow vague answers like “I help people be happier” and asks for specifics instead.",
    tags: ["instagram", "content"],
  },
  "carousel-conveyor": {
    title: "Carousels for Reels and TikTok",
    summary:
      "Builds carousels around one recurring character: the face is generated once, captions are composited in code for free.",
    what: [
      "Triggers when you ask to build carousels for a character, stand up a new one, or schedule posts.",
      "Sets the character up first: one anchor selfie and about six scenes made from it. That is the only place money is spent — roughly $0.60 per character.",
      "Every carousel then reuses those photos, with the text composited on top in code. Rewriting a caption, changing the @handle or redoing the layout costs nothing.",
      "Each scene is edited from the original selfie, never from another scene: editing an edit drifts the face, and after a few hops the character stops being recognisable.",
      "Before anything is published it shows the finished slides and waits for approval — the check is that the face is the same on every slide. Every post is flagged as AI-generated.",
    ],
    why: "In this kind of pipeline only face generation costs real money, and it is tempting to pay for it again every time. The skill does the opposite: the face is bought once per character, while captions, layout and scheduling are done in code for free. The other reason it exists is the ban on publishing unreviewed work: a face that drifted between slides is visible only to the eye, so the slides go to you first.",
    tags: ["content", "social"],
  },
  "commit-message": {
    title: "Commit message",
    summary:
      "Writes the message from what is actually staged, and explains why rather than what.",
    what: [
      "Triggers when you ask to commit or ask for a commit message.",
      "Reads the staged diff first instead of trusting its memory of what it did. Subject under 72 characters, imperative, no full stop.",
      "The body explains what was broken and why this approach. It does not list changed files — git show --stat does that better.",
      "If the staged changes mix two unrelated things, it says so and offers to split them.",
    ],
    why: "Commit history matters six months later, when you're hunting where a bug came from. “Various fixes” is useless at that moment, and the why is the one thing a diff can never tell you.",
    tags: ["git", "commits"],
  },
  "self-review": {
    title: "Review your own diff",
    summary:
      "Checks the diff before pushing: unhappy paths, silent failures, duplication.",
    what: [
      "Triggers before a pull request or when you ask whether the change is ready.",
      "Reads the whole diff against the base branch and looks at it as the person who'll be paged when it breaks.",
      "Works in order: does it do what was asked; what happens on an empty value or a failed call; does anything fail open when a key is missing; is there now a second place that must stay in sync.",
      "Looks specifically for breakage nobody sees on screen: social previews, scheduled jobs, emails.",
    ],
    why: "The most expensive bug is the one that looks like a working feature. This forces a walk down the unhappy paths that normal diff-reading skips, because the eye follows the intent rather than the edges.",
    tags: ["review", "quality"],
  },
  "mobile-check": {
    title: "Narrow screen check",
    summary:
      "Screenshots the page at 360px and catches horizontal scroll, clipping and unreachable buttons.",
    what: [
      "Triggers when you touch layout or ask how something looks on a phone.",
      "Runs a browser 360px wide, takes a screenshot and reads it — instead of asserting it “should be fine”.",
      "Detects horizontal scroll in code rather than by eye: compares scrollWidth against the window width.",
      "Specifically checks anything hidden behind lg:. A link that lives only in the desktop menu doesn't exist on a phone.",
    ],
    why: "Broken mobile layout is only visible from a phone, and developers look from a laptop. That's how whole buttons go missing: they're in the code, they're in the browser, and they're absent for half the users.",
    tags: ["layout", "mobile"],
  },
  "dead-code": {
    title: "Dead code hunt",
    summary:
      "Finds unused exports, files and branches — and proves they're unused before deleting.",
    what: [
      "Triggers during cleanup or after a feature is removed.",
      "Looks for exports with a single mention, files nothing imports, unreachable branches and assets nothing references.",
      "Before deleting, checks for string-key access and dynamic imports — a text search doesn't see those.",
      "Deletes in a commit separate from behaviour changes, so reverting is cheap if it was wrong.",
    ],
    why: "Dead code is more dangerous than it looks: people read it while investigating, orient by it, and maintain it alongside the live code. Deleting on a hunch is risky — so this demands evidence, not a guess.",
    tags: ["cleanup", "refactoring"],
  },
};

const FOUND = readSkills();

/** Адреса всех скилов — для карты сайта и generateStaticParams. */
export const SKILLS = FOUND.map((item) => item.id);

export function isSkill(value: string): boolean {
  return SKILLS.includes(value);
}

/** Скил по адресу или undefined, если такого файла нет. */
export function skill(locale: Locale, id: string): Skill | undefined {
  const found = FOUND.find((item) => item.id === id);
  if (!found) return undefined;

  const text = (locale === "ru" ? RU : EN)[id] ?? found.fallback;
  // Имя папки совпадает с id: путь на диске один на все языки.
  return { ...text, id, folder: id, file: found.file, files: found.files };
}

export function allSkills(locale: Locale): Skill[] {
  return FOUND.map((item) => skill(locale, item.id)!);
}

/*
  Имя внутри файла обязано совпадать с именем файла: по имени файла
  строится адрес страницы и имя папки в инструкции «куда положить», а по
  имени внутри шапки скил подключает Claude Code. Разойдись они — на
  сайте была бы одна инструкция, а у человека в проекте другое имя, и
  скил молча не сработал бы. Пусть лучше падает сборка.
*/
for (const item of FOUND) {
  const declared = frontMatter(item.file).name;
  if (declared !== item.id) {
    throw new Error(
      `content/skills/${item.id}.md: в шапке name: ${declared ?? "(нет)"}, ` +
        `а файл называется ${item.id}.md — имена должны совпадать`,
    );
  }
}
