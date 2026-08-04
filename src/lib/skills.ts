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

export type SkillTier = "free" | "pro";

/*
  Какие скилы входят в подписку. Список здесь, а не в шапке файла, и это
  намеренно: платность — решение владельца сайта, а шапку пишет автор
  скила, часто посторонний. Дай мы ей решать — присланный файл сам бы
  назначал себе цену.

  Умолчание — «бесплатно». Забытая строчка тут делает скил открытым, а не
  закрытым: ошибиться в сторону «отдали лишнее» неприятно, ошибиться в
  сторону «взяли деньги за то, что обещали даром» — хуже.
*/
const PRO_SKILLS: readonly string[] = [
  "remotion-video",
  "trendwatch",
  "viral-content-factory",
  "openmontage",
  "smm-producer",
  "carousel-conveyor",
];

export interface Skill extends SkillText {
  id: string;
  /** Имя папки в .claude/skills. Одна на все языки: это путь на диске. */
  folder: string;
  tier: SkillTier;
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
  «ключ: значение» между строками из трёх дефисов, и нужных нам полей в
  ней ровно три. Значение в несколько строк не поддерживается
  сознательно — агент такую шапку тоже читает построчно.

  Вложенные ключи пропускаем, и это не мелочь. Шапка бывает и с деревом:

      name: topview-skill
      author:
        name: Topview AI

  Разбирая всё подряд, мы прочли бы второе «name» как имя скила — и
  сборка упала бы с жалобой, что оно не совпадает с именем файла, хотя
  совпадает. Верхний уровень отличается от вложенного только отступом,
  по нему и отсекаем; строки списка («- ...») там же.
*/
function frontMatter(file: string): Record<string, string> {
  if (!file.startsWith("---\n")) return {};

  const end = file.indexOf("\n---", 4);
  if (end < 0) return {};

  const fields: Record<string, string> = {};
  for (const line of file.slice(4, end).split("\n")) {
    if (/^[\s-]/.test(line)) continue;

    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    fields[line.slice(0, colon).trim()] = unquote(line.slice(colon + 1).trim());
  }
  return fields;
}

/*
  Значение в шапке можно писать и в кавычках: описание с двоеточием
  внутри без них — уже не YAML, и авторы скилов их ставят. Кавычки нужны
  формату, а не читателю: оставь мы их как есть — карточка начиналась бы
  с кавычки и ею же заканчивалась.
*/
function unquote(value: string): string {
  const first = value[0];
  if (
    value.length > 1 &&
    (first === '"' || first === "'") &&
    value.endsWith(first)
  ) {
    return value.slice(1, -1);
  }
  return value;
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
  "remotion-video": {
    title: "Remotion: видео кодом на React",
    summary:
      "Каждый кадр — React-компонент. Титры, субтитры, переходы, 3D и звук собираются в коде и рендерятся в файл.",
    what: [
      "Срабатывает на «сделай видео из кода», «добавь субтитры», «анимируй текст», «сделай моушн-графику», «видео из картинок».",
      "Всё движение задаётся номером кадра, а не CSS: анимации через классы в рендер не попадают, и скил это запрещает прямо.",
      "Знает весь набор пакетов: субтитры в стиле TikTok с подсветкой слова, переходы, шрифты Google, Lottie, три-дэ, визуализация звука, световые блики, гифки.",
      "Считает раскладку по правилам, а не на глаз: безопасные поля, минимальные кегли, одна смысловая точка на сцену — тесноту лечит временем, а не уменьшением шрифта.",
      "Умеет расшифровать звук через whisper и разложить его на подписи по словам, а длину ролика вычислить из длины озвучки.",
    ],
    why: "Видео, собранное руками в редакторе, нельзя пересобрать с другими данными: поменялась цифра — открывай проект и двигай слои. Здесь ролик — это программа: те же сцены с другим текстом рендерятся заново одной командой, а сто роликов по шаблону отличаются только входными данными. Отсюда и главное ограничение, из-за которого чаще всего всё ломается: анимация обязана зависеть от номера кадра, иначе при рендере она просто не сыграет.",
    tags: ["видео", "код"],
  },
  trendwatch: {
    title: "Разбор вирусных роликов конкурентов",
    summary:
      "Разбирает чужие залетевшие видео по семи осям и превращает разбор в идеи под ваш продукт.",
    what: [
      "Срабатывает на «что сейчас заходит в TikTok», «разбери конкурента», «придумай хуки для рилс».",
      "Сначала ищет сам — магазин приложений, поиск, профили конкурентов, — и только потом спрашивает то, чего не найти: цели, KPI, голос бренда.",
      "Каждое видео разбирается отдельно на семь частей: чем остановлен скролл в первые полторы секунды, чем зацепил хук, формат, обещание, звук и его свежесть, призыв и о чём пишут в комментариях.",
      "Отделяет заслугу формата от заслуги блогера: пятьсот тысяч просмотров у миллионника ничего не доказывают, а пятьдесят тысяч у пятитысячника доказывают многое. В работу идут только первые.",
      "Копит опыт в отдельном файле: что пробовали, что вышло, чему научились. С каждым разом отсекает то, что у вас уже не сработало.",
    ],
    why: "Смотреть на чужие вирусные видео и повторять их целиком — самый быстрый способ потратить месяц впустую: повторяется обычно то, что видно, а работает то, что не видно. Скил разбирает ролик на части и отделяет три вещи, которые постоянно путают: формат, аудиторию блогера и оплаченный охват. И он помнит ваши прошлые попытки — поэтому со временем перестаёт предлагать то, что у вас уже не полетело.",
    tags: ["тикток", "продвижение"],
  },
  "viral-content-factory": {
    title: "Фабрика каруселей и видео-примерок",
    summary:
      "Собирает карусели и ролики с переодеванием для TikTok и Instagram вокруг придуманных персонажей.",
    what: [
      "Срабатывает, когда нужно собрать новую карусель, ролик с переодеванием или расширить библиотеку контента под персонажа.",
      "Начинает с вопросов: что за продукт, кто персонажи, есть ли референсы и ключи. Без этого не генерирует.",
      "Карусели — семь-восемь слайдов на тему, в трёх узнаваемых стилях: съёмка «как с телефона», редакционная инфографика и отдельный стиль для персонажей-животных.",
      "Ролики с переодеванием строятся от одного опорного кадра: человек в чёрном костюме без лица, и каждый следующий кадр — правка этого же кадра, иначе фон и фигура уплывают.",
      "Держит список того, на чём такие картинки обычно ломаются — лишние пальцы, поехавший текст, слетевший костюм — и правит отдельный кадр, а не пересобирает всю партию.",
    ],
    why: "Главная беда такого конвейера — незаметная рассинхронизация: фон чуть другой, фигура чуть другая, и склейка перестаёт читаться как один человек. Здесь всё держится на одном опорном кадре и списке проверок перед сборкой. Плюс банк хуков на девять категорий — не «идеи для контента», а формулы с объяснением, почему каждая работает.",
    tags: ["контент", "соцсети"],
  },
  "topview-skill": {
    title: "Topview: видео, картинки и голос через API",
    summary:
      "Официальный клиент Topview: аватары, генерация видео и картинок, озвучка и клонирование голоса из одного места.",
    what: [
      "Срабатывает на просьбы сделать видео с говорящим аватаром, оживить картинку, сгенерировать или отредактировать изображение, убрать фон, озвучить текст.",
      "Сам выбирает инструмент по задаче, а не заставляет человека знать API: есть дерево решений от «что нужно на выходе» до конкретного скрипта и модели.",
      "Считает стоимость до запуска и переспрашивает про параметры, которые заметно влияют на результат, — длительность, соотношение сторон, модель, голос.",
      "Перед первой генерацией показывает весь план и спрашивает, подтверждать ли каждый следующий запуск или дальше работать самому.",
      "Отвечает по-человечески: без терминала, переменных окружения и сырых ответов сервера. Ссылка на результат первой строкой.",
      "Требует ключа Topview и работает только с их серверами.",
    ],
    why: "Собрать то же самое напрямую через API можно, но тогда человеку придётся знать, чем i2v отличается от omni и какая модель сколько стоит. Скил переворачивает порядок: начинает с того, что нужно на выходе, и сам доходит до инструмента и параметров. Отдельно ценно, что он считает деньги до запуска и показывает план — генерация видео стоит заметно дороже картинки, и узнавать об этом после списания неприятно.",
    tags: ["видео", "апи"],
  },
  "split-screen-script": {
    title: "Сплит-скрин сценарии для Reels",
    summary:
      "Раскладывает текст по тайм-кодам в таблицу: сверху B-roll, снизу речь аватара, рядом звуки и музыка.",
    what: [
      "Срабатывает на «распиши сценарий», «сделай раскадровку», «подбери B-roll под текст», «сценарий для рилс по секундам».",
      "Отдаёт готовую таблицу без предисловий: тайм-код, верхний экран, нижний экран, звук.",
      "Верхний экран буквально показывает то, о чём говорит аватар: сказал «деньги» — летят купюры, сказал «клиент ушёл» — уходящий силуэт. Плюс указания по эффектам.",
      "Держит четыре обязательные фазы — зацепка, разворот темы, польза по шагам, призыв — и укладывается в тридцать-шестьдесят секунд с шагом в две-пять секунд.",
      "На каждое движение сверху прописывает звук и отмечает, что делает музыка: нарастает, бьёт, затухает.",
    ],
    why: "Двухэкранный ролик разваливается ровно в одном месте: верхний экран живёт своей жизнью и не иллюстрирует речь. Тогда зритель смотрит картинку, не слышит текст и уходит. Здесь верх привязан к низу пословно и по секундам, а звук расписан на каждое движение — то, что обычно доделывают на монтаже наугад и потому не доделывают вовсе.",
    tags: ["сценарии", "рилс"],
  },
  openmontage: {
    title: "OpenMontage: видео из описания",
    summary:
      "Агент сам исследует тему, пишет сценарий, добывает материал, монтирует и рендерит готовый ролик.",
    what: [
      "Срабатывает на «сделай видео о…», «создай ролик», «смонтируй», «сгенерируй анимацию» — и на просьбы про озвучку и субтитры.",
      "Двенадцать сценариев работы: анимационный explainer, документальный монтаж из архивов, кинематографический тизер, говорящая голова, нарезка длинного видео на клипы, дубляж и субтитры.",
      "Каждый проходит один и тот же путь: исследование, замысел, сценарий, план сцен, материалы, монтаж, сборка. Не «сгенерировать и склеить».",
      "Работает и без единого платного ключа: офлайн-озвучка Piper, архивы Archive.org, NASA и Wikimedia, сборка на FFmpeg. С ключами подключаются генераторы видео, изображений, голоса и музыки.",
      "Считает деньги до запуска и держит лимит, а перед показом проверяет результат сам: если обещали движение, а вышел слайдшоу из статичных картинок, видео не отдаётся.",
    ],
    why: "Собрать ролик из нейросетей поодиночке можно и без всякого скила — и получится «анимированный PowerPoint», потому что каждый инструмент отвечает за свой кусок и ни один не отвечает за целое. Здесь целое собрано в один путь от исследования до рендера, с двумя проверками, которых обычно нет: сметой до запуска и разбором готового файла после. Это не генератор видео, а порядок работы, в котором генераторы — только инструменты.",
    tags: ["видео", "монтаж"],
  },
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
  "remotion-video": {
    title: "Remotion: video as React code",
    summary:
      "Every frame is a React component. Titles, captions, transitions, 3D and audio are written in code and rendered to a file.",
    what: [
      "Triggers on “make a video from code”, “add subtitles”, “animate this text”, “motion graphics”, “video from images”.",
      "All motion is driven by the frame number, never by CSS: class-based animations never make it into the render, and the skill forbids them outright.",
      "Covers the whole package set: TikTok-style captions with word highlighting, transitions, Google fonts, Lottie, 3D, audio visualisation, light leaks, GIFs.",
      "Lays out scenes by rule rather than by eye: safe margins, minimum type sizes, one focal point per scene — crowding is solved with time, not by shrinking the text.",
      "Can transcribe audio with whisper into word-level captions, and derive the video's length from the length of the voice-over.",
    ],
    why: "A video cut by hand in an editor can't be rebuilt with different data: change one number and you're back in the project moving layers. Here a video is a program — the same scenes with new text re-render with one command, and a hundred videos from one template differ only by their input. Hence the one constraint that breaks people most often: animation must depend on the frame number, or it simply won't play in the render.",
    tags: ["video", "code"],
  },
  trendwatch: {
    title: "Reverse-engineering competitors' viral videos",
    summary:
      "Breaks down other people's hits along seven axes and turns the analysis into hooks for your own product.",
    what: [
      "Triggers on “what's working on TikTok right now”, “analyse this competitor”, “give me hooks for Reels”.",
      "Researches first — app store, search, competitor profiles — and only then asks for what no tool can return: goals, KPIs, brand voice.",
      "Each video is decomposed into seven parts: what stopped the scroll in the first 1.5 seconds, what the hook promised, the format, the message, the sound and how fresh it is, the CTA, and what the comments reveal.",
      "Separates credit due to the format from credit due to the creator: 500k views on a 2M-follower account proves nothing, 50k on a 5k account proves a lot. Only the latter feeds ideation.",
      "Accumulates a log of what was tried, what happened and what was learned — so over time it stops suggesting what already failed for you.",
    ],
    why: "Watching someone's viral video and copying it wholesale is the fastest way to waste a month: what gets copied is what's visible, and what works is what isn't. The skill takes a video apart and separates the three things people constantly conflate — the format, the creator's own audience, and paid amplification. And it remembers your past attempts, so it gets sharper with use.",
    tags: ["tiktok", "growth"],
  },
  "viral-content-factory": {
    title: "Carousel and outfit-change factory",
    summary:
      "Builds carousels and outfit-change videos for TikTok and Instagram around invented characters.",
    what: [
      "Triggers when you need a new carousel, an outfit-change video, or more content for an existing character.",
      "Starts with questions: what the product is, who the characters are, what references and keys exist. It won't generate before that.",
      "Carousels are seven or eight slides per topic, in three recognisable styles: shot-on-a-phone, editorial infographic, and a separate one for animal characters.",
      "Outfit-change videos are built from a single anchor frame — a faceless figure in a black morph suit — and every later frame edits that same anchor, otherwise the background and body drift.",
      "Keeps a checklist of how these images usually fail — extra fingers, garbled text, the suit disappearing — and regenerates the one bad frame rather than the whole batch.",
    ],
    why: "The failure mode of this kind of pipeline is quiet drift: the background is slightly off, the body is slightly off, and the cut stops reading as one person. Everything here hangs off one anchor frame plus a checklist run before assembly. On top of that there's a hook bank across nine categories — not “content ideas” but formulas with the reason each one works.",
    tags: ["content", "social"],
  },
  "topview-skill": {
    title: "Topview: video, images and voice over an API",
    summary:
      "The official Topview client: avatars, video and image generation, text-to-speech and voice cloning from one place.",
    what: [
      "Triggers on asking for a talking-avatar video, animating an image, generating or editing an image, removing a background, or voicing a script.",
      "Picks the tool from the task rather than making you know the API: there's a decision tree from “what do you need out” down to the specific script and model.",
      "Estimates the cost before running and asks about the parameters that visibly change the result — duration, aspect ratio, model, voice.",
      "Before the first generation it shows the whole plan and asks whether to confirm each later run or carry on unattended.",
      "Replies in plain language: no terminals, no environment variables, no raw server output. The result link comes first.",
      "Needs a Topview key and talks only to their servers.",
    ],
    why: "You could wire the same calls yourself, but then you have to know how i2v differs from omni and what each model costs. The skill inverts the order: it starts from the output you want and works down to the tool and its parameters. The cost estimate and the up-front plan matter especially — video costs noticeably more than an image, and finding that out after the charge is unpleasant.",
    tags: ["video", "api"],
  },
  "split-screen-script": {
    title: "Split-screen scripts for Reels",
    summary:
      "Lays a script out on a timeline table: B-roll on top, the avatar's speech below, sound and music alongside. Written in Russian.",
    what: [
      "Triggers on “break this script down”, “make a storyboard”, “find B-roll for this text”, “a Reels script second by second”.",
      "Returns the finished table with no preamble: timecode, top screen, bottom screen, sound.",
      "The top screen literally shows what the avatar is saying: “money” and banknotes fly, “the client left” and a silhouette walks out. With effect notes alongside.",
      "Holds to four mandatory phases — hook, context, step-by-step value, call to action — inside 30–60 seconds, in steps of two to five.",
      "Every movement up top gets a sound effect, and the music is marked as rising, hitting or fading.",
    ],
    why: "A two-screen video falls apart in exactly one place: the top screen lives its own life and stops illustrating the speech. The viewer then watches the picture, stops hearing the words and leaves. Here the top is tied to the bottom word by word and second by second, and the sound is written out for every movement — the part usually left to guesswork at the edit and therefore left undone.",
    tags: ["scripts", "reels"],
  },
  openmontage: {
    title: "OpenMontage: video from a description",
    summary:
      "The agent researches the topic, writes the script, sources the footage, edits and renders the finished video.",
    what: [
      "Triggers on “make a video about…”, “create a clip”, “edit this”, “generate an animation” — and on requests for voice-over or subtitles.",
      "Twelve ways of working: animated explainer, documentary montage from public archives, cinematic teaser, talking head, cutting a long video into clips, dubbing and subtitles.",
      "Each goes through the same route: research, proposal, script, scene plan, assets, edit, compose. Not “generate and stitch”.",
      "Runs with no paid keys at all: offline Piper voice-over, Archive.org, NASA and Wikimedia footage, FFmpeg for assembly. Keys add video, image, voice and music generation.",
      "Costs are estimated before the run and capped, and the result is reviewed before you see it: if the promise was motion and the output is a slideshow of stills, the video is not delivered.",
      "The skill itself is written in Russian.",
    ],
    why: "You can wire the models together by hand without any skill — and you get an animated PowerPoint, because each tool owns its own piece and nothing owns the whole. Here the whole is one route from research to render, with two checks you rarely get otherwise: a cost estimate before the run and an inspection of the finished file after. This isn't a video generator; it's an order of work in which generators are only tools.",
    tags: ["video", "editing"],
  },
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
  return {
    ...text,
    id,
    folder: id,
    tier: PRO_SKILLS.includes(id) ? "pro" : "free",
    file: found.file,
    files: found.files,
  };
}

export function allSkills(locale: Locale): Skill[] {
  return FOUND.map((item) => skill(locale, item.id)!);
}

export function isSkillLocked(item: Skill, plan: "free" | "pro"): boolean {
  return item.tier === "pro" && plan !== "pro";
}

/*
  Прячем сам файл, а не страницу.

  Всё, ради чего на страницу приходят из поиска, остаётся открытым:
  название, описание, разбор «что делает» и «зачем нужен», инструкция
  куда положить. Под замок уходит ровно то, что покупают, — текст файла.

  Начало файла при этом видно, как и у промтов: обрыв настоящий, он
  сделан здесь, на сервере, а не нарисован размытием поверх готового
  текста. Человек, ещё не решивший платить, должен увидеть хоть строку
  того, за что его просят заплатить, — иначе он платит за кота в мешке.

  Режем по границе строки: файл — это разметка, и обрыв посреди строки
  выглядел бы как испорченный файл, а не как «дальше по подписке».

  Показываем не начало файла, а начало инструкций — шапку пропускаем.
  Она бывает на семьсот символов, целиком занимает видимую часть окна, и
  человек упирается в замок, прочитав ровно то, что и так написано на
  странице заголовком и описанием. Покупают не шапку.
*/
const PREVIEW_CHARS = 900;

export function veilSkill(item: Skill): Skill {
  const cut = (text: string) => {
    const header = text.startsWith("---\n") ? text.indexOf("\n---", 4) : -1;
    const from = header < 0 ? 0 : text.indexOf("\n", header + 4) + 1;

    const limit = Math.min(PREVIEW_CHARS, Math.floor((text.length - from) / 2));
    const head = text.slice(from, from + limit);
    const lastLine = head.lastIndexOf("\n");
    return (lastLine > 0 ? head.slice(0, lastLine) : head).trimStart();
  };

  const files = item.files.map((file) => ({ ...file, text: cut(file.text) }));
  return { ...item, file: files[0].text, files };
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
