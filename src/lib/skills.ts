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

export interface Skill extends SkillText {
  id: string;
  /** Имя папки в .claude/skills. Одна на все языки: это путь на диске. */
  folder: string;
  /** Содержимое SKILL.md целиком. */
  file: string;
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

interface Found {
  id: string;
  file: string;
  /** Из шапки файла — на случай, если своего перевода нет. */
  fallback: SkillText;
}

function readSkills(): Found[] {
  if (!existsSync(DIR)) return [];

  const found: Found[] = [];
  for (const name of readdirSync(DIR).sort()) {
    if (!name.toLowerCase().endsWith(".md")) continue;

    const id = name.slice(0, -3);
    const file = readFileSync(join(DIR, name), "utf8");
    const head = frontMatter(file);

    found.push({
      id,
      file,
      fallback: {
        title: head.title || titleFrom(file, id),
        summary: head.description || "",
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
  return { ...text, id, folder: id, file: found.file };
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
