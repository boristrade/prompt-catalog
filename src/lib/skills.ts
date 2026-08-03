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

  Текст файла общий для всех языков и остаётся английским: инструкции
  внутри скила читает модель, и смешивать в них языки незачем. Переводим
  только то, что читает человек, — название, описание и разбор.
*/

export const SKILLS = [
  "commit-message",
  "self-review",
  "mobile-check",
  "dead-code",
] as const;

export type SkillId = (typeof SKILLS)[number];

export function isSkill(value: string): value is SkillId {
  return (SKILLS as readonly string[]).includes(value);
}

export interface SkillText {
  title: string;
  /** Одной строкой для карточки и описания в поиске. */
  summary: string;
  /** Когда он срабатывает и что делает. Абзацами. */
  what: string[];
  /** Зачем он вообще нужен — какая боль без него. */
  why: string;
  /*
    Теги переводятся вместе с остальным: «вёрстка» в английской карточке
    выглядела бы опечаткой, а не тегом.
  */
  tags: string[];
}

export interface Skill extends SkillText {
  id: SkillId;
  /** Имя папки в .claude/skills. Одна на все языки: это путь на диске. */
  folder: string;
  /** Содержимое SKILL.md целиком. */
  file: string;
}

/*
  Тексты файлов. Вынесены отдельно от переводов: файл один на все языки,
  а описание к нему — своё на каждом.
*/
const FILES: Record<SkillId, string> = {
  "commit-message": `---
name: commit-message
description: Write the commit message for the staged changes. Use when the user asks to commit, asks for a commit message, or says the work is ready to commit.
---

# Writing the commit message

Read the staged diff first — \`git diff --cached\`. Never write a message
from memory of what you did; write it from what is actually staged.

## The subject line

One line, imperative mood, no trailing full stop. Name the change, not
the files. "Fix the button that scrolled nowhere" beats "Update page.tsx".

Keep it under 72 characters so it doesn't wrap in \`git log\`.

## The body

Explain **why**, not what. The diff already says what changed; it cannot
say what was wrong before, or what would break if this were done
differently.

Answer these, in prose, only where they apply:

- What was broken or missing, described concretely enough that someone
  hitting the same problem would recognise it.
- Why this approach and not the obvious alternative.
- What is deliberately not covered, and why.

Wrap the body at 72 characters.

## What not to write

- Do not list the changed files. \`git show --stat\` does that better.
- Do not write "various fixes", "improvements", "refactoring" — these
  say nothing and make the history useless when someone bisects it.
- Do not restate the subject line in the body.
- Do not mention the tools or the model that produced the change.

## Before committing

Check that the staged diff contains only what belongs in this commit.
If it mixes two unrelated changes, say so and offer to split them.
`,

  "self-review": `---
name: self-review
description: Review your own changes before pushing. Use when the user asks to review the diff, asks whether the change is ready, or before opening a pull request.
---

# Reviewing your own diff

Read the full diff against the base branch before saying anything:
\`git diff origin/main...HEAD\`.

Review it as if someone else wrote it and you are the one who will be
paged when it breaks.

## What to look for, in order

**1. Does it do what was asked?**
Compare against the original request, not against your own plan. Scope
that quietly grew is as much a defect as scope that was dropped.

**2. What happens on the unhappy path?**
For every new branch: what if the value is null, the list is empty, the
network call fails, the user is not signed in? Name the specific line
and the specific input that breaks it.

**3. Does anything fail open?**
A missing key, an empty allowlist, an unset environment variable —
does the code then let everyone through, or no one? Letting everyone
through silently is the worse default and the harder bug to notice.

**4. Is anything now unreachable or duplicated?**
New code that shadows old code, a second place that must be kept in
sync with the first, an export nobody imports any more.

**5. Would this be visible if it broke?**
Changes that only fail somewhere the author never looks — a social
preview, a scheduled job, an email — deserve a test or a log line.

## How to report

Lead with the most serious finding. For each one give the file, the
line, and a concrete failing input — not "this could be unsafe" but
"if \`code\` is empty this returns every row".

If nothing survives that bar, say the diff looks fine. Do not invent
findings to look thorough.
`,

  "mobile-check": `---
name: mobile-check
description: Check pages on a narrow screen before committing UI work. Use when the user changes layout, adds a component, or asks whether something works on mobile.
---

# Checking a narrow screen

Never claim a layout works on mobile without looking at it. Take a
screenshot at 360px wide and read it.

## Running the check

Start the app, then drive a browser at 360×800. With Playwright:

\`\`\`js
const page = await browser.newPage({
  viewport: { width: 360, height: 800 },
  deviceScaleFactor: 2,
});
await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: "mobile.png" });
\`\`\`

Check both colour schemes — pass \`colorScheme: "dark"\` and \`"light"\` —
if the project has a theme toggle.

## What to look for

**Horizontal scroll is always a bug.** Detect it, don't eyeball it:

\`\`\`js
const overflows = await page.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth,
);
\`\`\`

The usual causes are long unbroken strings (URLs, emails, codes) and
fixed widths. Fix with \`break-all\` or \`truncate\` inside a \`min-w-0\`
parent, not by hiding overflow.

**Rows of buttons** must wrap. Without wrapping they run off the edge
at 360px and the last one becomes unreachable.

**Headings** should not break into single-word lines. \`text-wrap:
balance\` fixes most of it; if a word still doesn't fit, the type size
is too large for the viewport.

**Anything behind a \`lg:\` breakpoint is invisible on a phone.** If a
link or control lives only in a desktop-only block, it does not exist
for mobile users. Check that every action is reachable from the narrow
layout too.

**Tap targets** need roughly 44px of height. Text links crammed into a
row are hard to hit.

## Reporting

Show the screenshot. If something is wrong, say which element and at
what width it breaks — not "looks a bit tight".
`,

  "dead-code": `---
name: dead-code
description: Find code that nothing uses any more. Use when the user asks to clean up, mentions dead code, or after removing a feature.
---

# Finding dead code

Removing code is safe only when you have shown nothing reaches it.
Search before deleting, every time.

## Where to look

**Unused exports.** For each exported symbol, search the repository for
its name. One hit means only the definition — a candidate.

\`\`\`bash
rg -n "export (function|const|class|type|interface) (\\w+)" -o -r '$2' src | sort -u
\`\`\`

Then check each name. Beware of symbols reached dynamically, by string
key or through a barrel file — grep will not see those.

**Files nothing imports.** A module whose path appears in no import
statement anywhere.

**Branches that cannot be taken.** A condition on a value that is now
always the same, a case for an enum member that no longer exists.

**Assets nothing references.** Images, fonts and data files whose names
appear nowhere in the source.

## Before deleting anything

- Check the tests. Code used only by tests is not dead — it is either
  still needed or the test is stale, and those are different fixes.
- Check for dynamic access: \`obj[name]\`, \`import(path)\`, string keys in
  a lookup table.
- Check the framework's conventions. Files can be entry points by
  location alone and be imported nowhere.

## How to report

List each finding with the path, what it is, and the evidence that
nothing uses it — the search you ran and how many hits it returned.

Delete in a separate commit from any behaviour change, so a revert is
cheap if you were wrong.
`,
};

const RU: Record<SkillId, SkillText> = {
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

const EN: Record<SkillId, SkillText> = {
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

export function skill(locale: Locale, id: SkillId): Skill {
  const text = locale === "ru" ? RU[id] : EN[id];
  // Имя папки совпадает с id: путь на диске один на все языки.
  return { id, ...text, folder: id, file: FILES[id] };
}

export function allSkills(locale: Locale): Skill[] {
  return SKILLS.map((id) => skill(locale, id));
}
