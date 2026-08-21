"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Image as ImageIcon,
  Plus,
  Share2,
  Trash2,
  Undo2,
} from "lucide-react";
import {
  FALLBACK,
  paletteFrom,
  paletteFromAccent,
  type Palette,
} from "@/lib/carousel/palette";
import {
  FRAMES,
  drawSlide,
  type Deck,
  type FrameId,
  type Slide,
} from "@/lib/carousel/templates";
import {
  DECK_KEY,
  PALETTE_KEY,
  PHOTO_KEY,
  parseDeck,
  parsePalette,
  slideKey,
} from "@/lib/carousel/storage";
import type { Niche } from "@/lib/carousel/niches";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/*
  Конструктор каруселей.

  Всё происходит в браузере: фотография не уходит на сервер, слайды
  рисуются канвасом, готовые картинки отдаются через окно «Поделиться».
  Ни одного запроса наружу — поэтому нет ни счёта за трафик, ни вопросов
  о том, где лежат чужие лица.
*/

/** Шрифты для канваса. Без ожидания загрузки первый кадр рисуется системным. */
const FONTS = [
  "700 92px Inter",
  "700 38px Inter",
  "400 36px Inter",
  "500 26px 'JetBrains Mono'",
  "400 31px 'JetBrains Mono'",
];

const MONO_CSS =
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap";

function emptySlide(kind: Slide["kind"]): Slide {
  // Обложка без фотографии — пустой тёмный прямоугольник, поэтому у неё
  // подложка включена сразу, а у остальных это выбор человека.
  return {
    kind,
    eyebrow: "",
    title: "",
    body: "",
    code: "",
    takeaway: "",
    photo: kind === "cover",
  };
}

/*
  Готовые цвета на случай, когда фотографии ещё нет или её оттенок
  человеку не нравится. Шесть — это ровно два ряда по три на узком
  экране; больше превращается в палитру, в которой надо выбирать.
*/
const SWATCHES = ["#a78bfa", "#f472b6", "#fb923c", "#34d399", "#38bdf8", "#facc15"];

export default function CarouselBuilder({
  t,
  niches,
  locale,
  pro,
}: {
  t: Dictionary;
  niches: Niche[];
  locale: Locale;
  /** Оплачен ли доступ: у оплатившего с последнего кадра снимается метка. */
  pro: boolean;
}) {
  const [palette, setPalette] = useState<Palette>(FALLBACK);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [niche, setNiche] = useState(niches[0]?.id ?? "");
  const [applied, setApplied] = useState("");
  const [loaded, setLoaded] = useState(false);

  /* Что было до нажатия «Применить». null — возвращать нечего. */
  const [undo, setUndo] = useState<Slide[] | null>(null);

  /*
    Отпечаток фотографии для ключа слайда. Сам объект картинки для этого
    не годится: он у каждой загрузки новый, и слайды перерисовывались бы
    даже при том же снимке.
  */
  const [photoToken, setPhotoToken] = useState("");

  /* Готовые кадры по ключу слайда. Ref, а не state: это склад, не вид. */
  const drawn = useRef<Map<string, string>>(new Map());

  const current = niches.find((item) => item.id === niche) ?? niches[0];

  const [deck, setDeck] = useState<Deck>({
    handle: "@username",
    tagline: "",
    format: "post",
    slides: [
      {
        ...emptySlide("cover"),
        eyebrow: "AI · промты",
        title: "Я написал 400 промтов. Работают 5",
        takeaway: "копируй как есть →",
      },
      {
        ...emptySlide("statement"),
        eyebrow: "почему большинство не работает",
        title: "Промт — это не заклинание.",
        body: "Он работает, когда даёт модели три вещи: роль, ограничение и критерий, по которому она поймёт, что справилась.",
        takeaway: "Роль · Ограничение · Критерий",
      },
      {
        ...emptySlide("prompt"),
        eyebrow: "промт · 1",
        title: "Мой голос, не средний",
        code: "Вот 3 моих текста. Выпиши правила моего стиля списком, покажи их мне — и только потом пиши.",
        takeaway: "Текст перестаёт пахнуть нейросетью",
      },
    ],
  });

  /*
    Моношрифт подключаем только здесь, а не в общем макете: он нужен
    одной странице, и тянуть его на весь сайт ради неё незачем.

    Ждём загрузки до первой отрисовки: канвас не умеет ждать шрифт сам —
    он молча возьмёт системный, и первый кадр выйдет другим, чем все
    следующие.
  */
  useEffect(() => {
    let alive = true;

    if (!document.querySelector(`link[href="${MONO_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = MONO_CSS;
      document.head.appendChild(link);
    }

    Promise.all(FONTS.map((font) => document.fonts.load(font)))
      .catch(() => undefined)
      .then(() => alive && setReady(true));

    return () => {
      alive = false;
    };
  }, []);

  /*
    Восстановление прошлого захода.

    Читаем один раз при появлении и до первой отрисовки. Текст, палитра
    и фото лежат под разными ключами нарочно: текст перезаписывается на
    каждую правку и должен быть мелким, а фото пишется один раз и весит
    сотни килобайт. В одном ключе каждая нажатая буква тащила бы за
    собой весь снимок.
  */
  useEffect(() => {
    const saved = parseDeck(localStorage.getItem(DECK_KEY));
    if (saved) setDeck(saved);

    const savedPalette = parsePalette(localStorage.getItem(PALETTE_KEY));
    if (savedPalette) setPalette(savedPalette);

    const savedPhoto = localStorage.getItem(PHOTO_KEY);
    if (savedPhoto) {
      const img = new Image();
      img.onload = () => {
        setPhoto(img);
        setPhotoToken(savedPhoto.length.toString());
      };
      img.src = savedPhoto;
    }

    setLoaded(true);
  }, []);

  /* Текст — на каждую правку. Он мелкий, запись почти ничего не стоит. */
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(DECK_KEY, JSON.stringify(deck));
      localStorage.setItem(PALETTE_KEY, JSON.stringify(palette));
    } catch {
      // Хранилище переполнено или запрещено — работать это не мешает,
      // просто следующий заход начнётся с чистого листа.
    }
  }, [deck, palette, loaded]);

  /* Фото: цвет достаём из уменьшенной копии, полный кадр держим для обложки. */
  const onPhoto = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const small = document.createElement("canvas");
      // 160 пикселей по длинной стороне: оттенок тот же, работы в сотни
      // раз меньше, и на телефоне это мгновенно.
      const scale = 160 / Math.max(img.naturalWidth, img.naturalHeight);
      small.width = Math.max(1, Math.round(img.naturalWidth * scale));
      small.height = Math.max(1, Math.round(img.naturalHeight * scale));

      const sctx = small.getContext("2d", { willReadFrequently: true });
      if (sctx) {
        sctx.drawImage(img, 0, 0, small.width, small.height);
        setPalette(paletteFrom(sctx.getImageData(0, 0, small.width, small.height).data));
      }

      setPhoto(img);

      /*
        Копия для хранилища — ужатая и в jpeg. Снимок с телефона весит
        несколько мегабайт и в localStorage не влезет вовсе, а для
        обложки 1200 пикселей по длинной стороне хватает с запасом:
        кадр всё равно 1080 в ширину.
      */
      try {
        const keep = document.createElement("canvas");
        const k = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
        keep.width = Math.round(img.naturalWidth * k);
        keep.height = Math.round(img.naturalHeight * k);
        keep.getContext("2d")?.drawImage(img, 0, 0, keep.width, keep.height);

        const data = keep.toDataURL("image/jpeg", 0.82);
        localStorage.setItem(PHOTO_KEY, data);
        setPhotoToken(data.length.toString());
      } catch {
        // Не влезло — фото просто не переживёт перезагрузку. Текст
        // переживёт, а это главное.
        setPhotoToken(String(Date.now()));
      }
    };

    img.src = url;
  }, []);

  /*
    Перерисовка.

    Две вещи, без которых ввод текста залипал.

    Первая — пауза. Превращение кадра 1080×1350 в картинку стоит около
    четверти секунды на среднем телефоне, а рисовалось это на каждое
    нажатие клавиши. Ждём, пока человек перестанет печатать.

    Вторая — рисуем только изменившиеся слайды. Ключ слайда собирается
    в slideKey и включает всё, что печатается в кадре: правят один
    заголовок — перерисовывается один кадр, а не шесть.
  */
  useEffect(() => {
    if (!ready) return;

    const timer = setTimeout(() => {
      const frame = FRAMES[deck.format] ?? FRAMES.post;
      const canvas = document.createElement("canvas");
      canvas.width = frame.w;
      canvas.height = frame.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cache = drawn.current;
      const keys = deck.slides.map((_, i) =>
        slideKey(deck, palette, i, photoToken, pro),
      );

      const next = keys.map((key, i) => {
        const hit = cache.get(key);
        if (hit) return hit;

        ctx.clearRect(0, 0, frame.w, frame.h);
        drawSlide(ctx, deck, palette, i, photo, pro);
        const url = canvas.toDataURL("image/png");
        cache.set(key, url);
        return url;
      });

      // Чистим всё, что больше не на экране: каждая картинка — это
      // мегабайт строки, и копить их незачем.
      for (const key of [...cache.keys()]) {
        if (!keys.includes(key)) cache.delete(key);
      }

      setPreviews(next);
    }, 250);

    return () => clearTimeout(timer);
  }, [deck, palette, photo, photoToken, pro, ready]);

  function patch(index: number, field: keyof Slide, value: string | boolean) {
    setDeck((d) => ({
      ...d,
      slides: d.slides.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  }

  /*
    Перестановка слайдов.

    Порядок в карусели — половина смысла: вывод, попавший вторым,
    работает хуже, чем тот же вывод в конце. Раньше поменять его можно
    было только перепечатав два слайда целиком.

    Стрелками, а не перетаскиванием: перетаскивание на телефоне спорит с
    прокруткой страницы, а список слайдов и так длинный.
  */
  function move(index: number, to: number) {
    setDeck((d) => {
      if (to < 0 || to >= d.slides.length) return d;
      const slides = [...d.slides];
      const [moved] = slides.splice(index, 1);
      slides.splice(to, 0, moved);
      return { ...d, slides };
    });
  }

  async function toFile(dataUrl: string, name: string) {
    const blob = await (await fetch(dataUrl)).blob();
    return new File([blob], name, { type: "image/png" });
  }

  /*
    Выгрузка.

    На iPhone скачать десять файлов подряд нельзя — Safari отменит всё,
    кроме первого, и человек решит, что кнопка сломана. Родное окно
    «Поделиться» с массивом файлов работает и ведёт сразу в фотоплёнку
    или в Instagram. Скачивание оставлено запасным путём для компьютера.
  */
  async function shareAll() {
    setBusy(true);
    try {
      const files = await Promise.all(
        previews.map((url, i) => toFile(url, `slide-${i + 1}.png`)),
      );

      if (navigator.canShare?.({ files })) {
        await navigator.share({ files });
        return;
      }

      for (const [i, url] of previews.entries()) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `slide-${i + 1}.png`;
        a.click();
      }
    } catch {
      // Человек закрыл окно «Поделиться» — это не ошибка.
    } finally {
      setBusy(false);
    }
  }

  function saveOne(index: number) {
    const a = document.createElement("a");
    a.href = previews[index];
    a.download = `slide-${index + 1}.png`;
    a.click();
  }

  const field =
    "w-full rounded-chip border border-line bg-sunken px-3 py-2 text-[13.5px] text-ink outline-none transition-colors duration-200 focus:border-violet";

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      {/* Превью */}
      <div className="min-w-0">
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {previews.map((url, i) => (
            <figure
              key={i}
              className="w-[78%] shrink-0 snap-center lg:w-auto lg:shrink"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="w-full rounded-card border border-line"
              />
              <figcaption className="mt-2 flex items-center justify-between">
                <span className="font-mono text-[11px] text-faint">
                  {String(i + 1).padStart(2, "0")}/
                  {String(previews.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => saveOne(i)}
                  className="inline-flex items-center gap-1.5 rounded-chip border border-line-strong px-3 py-1.5 text-[12px] text-ink transition-colors duration-200 hover:bg-surface"
                >
                  <Download size={12} />
                  {t.carousel.save}
                </button>
              </figcaption>
            </figure>
          ))}
        </div>

        <button
          type="button"
          onClick={shareAll}
          disabled={busy || previews.length === 0}
          className="grad-fill shine mt-4 inline-flex w-full items-center justify-center gap-2 rounded-chip px-5 py-3.5 text-[14px] font-semibold shadow-[0_10px_30px_-10px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        >
          <Share2 size={16} />
          {t.carousel.shareAll}
        </button>
        <p className="mt-2 text-center text-[12.5px] text-muted">
          {t.carousel.shareHint}
        </p>
        {/* Про сохранение говорим вслух: иначе человек не рискнёт закрыть
            страницу и будет держать вкладку открытой на всякий случай. */}
        <p className="mt-1 text-center text-[12px] text-faint">
          {t.carousel.saved}
        </p>

        {/*
          Про метку говорим здесь, рядом с кнопкой выгрузки, а не мелким
          шрифтом где-то ниже: человек должен узнать о ней до того, как
          отправит карусель в ленту, а не после.

          Оплатившему не показываем вовсе — ему нечего убирать.
        */}
        {!pro && (
          <p className="mt-3 text-center text-[12px] leading-relaxed text-faint">
            {t.carousel.markNote}{" "}
            <Link
              href={`/${locale}/pricing`}
              className="text-accent underline underline-offset-2"
            >
              {t.carousel.markCta}
            </Link>
          </p>
        )}
      </div>

      {/* Настройки */}
      <div className="min-w-0 space-y-5">
        {/*
          Ниша и готовые тексты стоят выше остального нарочно.

          Пустые поля — самая частая причина закрыть конструктор, ничего
          не сделав: фото загрузили, а что писать — не придумали. Готовый
          набор снимает именно эту остановку, поэтому он должен
          попадаться раньше, чем поля для ручного ввода.

          Ник и фото при этом не трогаются: они уже введены, и терять их
          при выборе текста человек не ожидает.
        */}
        <div>
          <span className="text-[13px] font-semibold text-ink">
            {t.carousel.niche}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {niches.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setNiche(item.id)}
                aria-pressed={item.id === niche}
                className={`rounded-chip border px-3 py-1.5 text-[12.5px] transition-colors duration-200 ${
                  item.id === niche
                    ? "border-violet bg-accent-soft text-accent"
                    : "border-line text-muted hover:text-ink"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          <span className="mt-2 block text-[12px] leading-relaxed text-faint">
            {t.carousel.nicheHint}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold text-ink">
              {t.carousel.texts}
            </span>

            {/*
              Возврат вместо вопроса «вы уверены?».

              «Применить» затирает всё набранное молча — человек мог
              полчаса править текст и нажать другой набор из
              любопытства. Спрашивать подтверждение на каждое нажатие
              значит мешать тем, кто просто перебирает варианты; кнопка
              возврата не мешает никому и чинит ровно тот случай, когда
              нажали зря.
            */}
            {undo && (
              <button
                type="button"
                onClick={() => {
                  setDeck((d) => ({ ...d, slides: undo }));
                  setUndo(null);
                  setApplied("");
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-chip border border-line-strong px-3 py-1.5 text-[12px] text-ink transition-colors duration-200 hover:bg-surface"
              >
                <Undo2 size={12} />
                {t.carousel.undo}
              </button>
            )}
          </div>
          {/* Список длинный: десять на нишу. Прокручиваем его сам, чтобы
              настройки ниже оставались в пределах досягаемости. */}
          <ul className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
            {current?.decks.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-3 py-2.5"
              >
                <span className="min-w-0 text-[13px] leading-snug text-ink">
                  {item.title}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    // Ник, подпись и фото остаются: меняется только текст.
                    setUndo(deck.slides);
                    setDeck((d) => ({ ...d, slides: item.slides }));
                    setApplied(item.id);
                  }}
                  className={`shrink-0 rounded-chip px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-200 ${
                    applied === item.id
                      ? "border border-violet text-accent"
                      : "grad-fill"
                  }`}
                >
                  {applied === item.id ? "✓" : t.carousel.apply}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <label className="block">
          <span className="text-[13px] font-semibold text-ink">
            {t.carousel.photo}
          </span>
          <div className="mt-2 flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-chip border border-line"
              style={{ background: palette.accent }}
            >
              <ImageIcon size={16} className="text-[#0d0c0b]" />
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onPhoto(file);
              }}
              className="min-w-0 flex-1 text-[12.5px] text-muted file:mr-3 file:rounded-chip file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-[12.5px] file:text-ink"
            />
          </div>
          <span className="mt-2 block text-[12px] leading-relaxed text-faint">
            {t.carousel.photoHint}
          </span>
        </label>

        {/*
          Цвет руками.

          Оттенок из фотографии угадывает не всегда: на снимке с белой
          стеной брать нечего, а у человека может быть свой фирменный
          цвет. Свечение и акцент считаются из одного тона — иначе
          подобранная вручную пара разъезжается и кадр выглядит грязным.
        */}
        <div>
          <span className="text-[13px] font-semibold text-ink">
            {t.carousel.color}
          </span>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setPalette(paletteFromAccent(hex))}
                aria-label={hex}
                aria-pressed={palette.accent.toLowerCase() === hex}
                className="h-9 w-9 rounded-chip border border-line transition-transform duration-200 active:scale-95"
                style={{ background: hex }}
              />
            ))}
            {/* Родное окно выбора цвета: на телефоне оно системное и
                привычнее любой самодельной палитры. */}
            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-chip border border-line-strong px-3 text-[12.5px] text-ink">
              <span
                className="h-4 w-4 rounded-full border border-line"
                style={{ background: palette.accent }}
              />
              {t.carousel.colorOwn}
              <input
                type="color"
                value={palette.accent}
                onChange={(e) => setPalette(paletteFromAccent(e.target.value))}
                className="sr-only"
              />
            </label>
          </div>
          <span className="mt-2 block text-[12px] leading-relaxed text-faint">
            {t.carousel.colorHint}
          </span>
        </div>

        {/*
          Формат. 4:5 — самый крупный кадр, который Instagram не режет в
          ленте; 9:16 — под TikTok и сторис, где 4:5 показывают с полями
          сверху и снизу.
        */}
        <div>
          <span className="text-[13px] font-semibold text-ink">
            {t.carousel.format}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(FRAMES) as FrameId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setDeck((d) => ({ ...d, format: id }))}
                aria-pressed={deck.format === id}
                className={`rounded-chip border px-3 py-1.5 text-[12.5px] transition-colors duration-200 ${
                  deck.format === id
                    ? "border-violet bg-accent-soft text-accent"
                    : "border-line text-muted hover:text-ink"
                }`}
              >
                {id === "post" ? t.carousel.formatPost : t.carousel.formatStory}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block min-w-0">
            <span className="text-[13px] font-semibold text-ink">
              {t.carousel.handle}
            </span>
            <input
              value={deck.handle}
              onChange={(e) => setDeck((d) => ({ ...d, handle: e.target.value }))}
              className={`mt-2 ${field}`}
            />
          </label>
          <label className="block min-w-0">
            <span className="text-[13px] font-semibold text-ink">
              {t.carousel.tagline}
            </span>
            <input
              value={deck.tagline}
              onChange={(e) => setDeck((d) => ({ ...d, tagline: e.target.value }))}
              className={`mt-2 ${field}`}
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="text-[13px] font-semibold text-ink">
            {t.carousel.slides}
          </div>

          {deck.slides.map((slide, i) => (
            <div
              key={i}
              className="space-y-2 rounded-card border border-line bg-surface p-3.5"
            >
              {/* Ряд кнопок обязан переноситься: на 360px четыре штуки
                  рядом с выпадающим списком за край уезжают. */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <select
                  value={slide.kind}
                  onChange={(e) => patch(i, "kind", e.target.value)}
                  className="rounded-chip border border-line bg-sunken px-2.5 py-1.5 text-[12.5px] text-ink"
                >
                  <option value="cover">{t.carousel.kindCover}</option>
                  <option value="statement">{t.carousel.kindStatement}</option>
                  <option value="prompt">{t.carousel.kindPrompt}</option>
                  <option value="final">{t.carousel.kindFinal}</option>
                </select>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    aria-label={t.carousel.moveUp}
                    className="rounded-chip border border-line-strong p-1.5 text-muted transition-colors duration-200 hover:text-ink disabled:opacity-40"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    disabled={i === deck.slides.length - 1}
                    aria-label={t.carousel.moveDown}
                    className="rounded-chip border border-line-strong p-1.5 text-muted transition-colors duration-200 hover:text-ink disabled:opacity-40"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeck((d) => ({
                        ...d,
                        slides: d.slides.filter((_, j) => j !== i),
                      }))
                    }
                    aria-label={t.carousel.remove}
                    className="rounded-chip border border-line-strong p-1.5 text-muted transition-colors duration-200 hover:text-ink"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/*
                Фотография не только на обложке.

                Один снимок на десять слайдов делает карусель плоской:
                видно, что это шаблон. Тот же снимок под парой слайдов в
                середине связывает набор — а под всеми подряд мешает
                читать, поэтому это флажок у каждого слайда, а не общая
                настройка.
              */}
              <label className="flex items-center gap-2 text-[12.5px] text-muted">
                <input
                  type="checkbox"
                  checked={slide.photo}
                  onChange={(e) => patch(i, "photo", e.target.checked)}
                  className="h-4 w-4 accent-[var(--c-accent)]"
                />
                {t.carousel.usePhoto}
              </label>

              <input
                value={slide.eyebrow}
                onChange={(e) => patch(i, "eyebrow", e.target.value)}
                placeholder={t.carousel.fieldEyebrow}
                className={field}
              />
              <textarea
                value={slide.title}
                onChange={(e) => patch(i, "title", e.target.value)}
                placeholder={t.carousel.fieldTitle}
                rows={2}
                className={field}
              />
              {slide.kind === "prompt" ? (
                <textarea
                  value={slide.code}
                  onChange={(e) => patch(i, "code", e.target.value)}
                  placeholder={t.carousel.fieldCode}
                  rows={3}
                  className={`${field} font-mono text-[12.5px]`}
                />
              ) : slide.kind === "statement" || slide.kind === "final" ? (
                <textarea
                  value={slide.body}
                  onChange={(e) => patch(i, "body", e.target.value)}
                  placeholder={t.carousel.fieldBody}
                  rows={3}
                  className={field}
                />
              ) : null}
              <input
                value={slide.takeaway}
                onChange={(e) => patch(i, "takeaway", e.target.value)}
                placeholder={t.carousel.fieldTakeaway}
                className={field}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setDeck((d) => ({
                ...d,
                slides: [...d.slides, emptySlide("statement")],
              }))
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-chip border border-line-strong px-4 py-2.5 text-[13px] font-medium text-ink transition-colors duration-200 hover:bg-surface"
          >
            <Plus size={14} />
            {t.carousel.add}
          </button>
        </div>
      </div>
    </div>
  );
}
