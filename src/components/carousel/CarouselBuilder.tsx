"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Image as ImageIcon, Plus, Share2, Trash2 } from "lucide-react";
import { FALLBACK, paletteFrom, type Palette } from "@/lib/carousel/palette";
import { H, W, drawSlide, type Deck, type Slide } from "@/lib/carousel/templates";
import type { Dictionary } from "@/lib/i18n/dictionaries";

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
  return { kind, eyebrow: "", title: "", body: "", code: "", takeaway: "" };
}

export default function CarouselBuilder({ t }: { t: Dictionary }) {
  const [palette, setPalette] = useState<Palette>(FALLBACK);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const [deck, setDeck] = useState<Deck>({
    handle: "@username",
    tagline: "",
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
    };

    img.src = url;
  }, []);

  /* Перерисовка всех слайдов. Превью — data-URL, их же отдаём на сохранение. */
  useEffect(() => {
    if (!ready) return;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const next = deck.slides.map((_, i) => {
      ctx.clearRect(0, 0, W, H);
      drawSlide(ctx, deck, palette, i, photo);
      return canvas.toDataURL("image/png");
    });

    setPreviews(next);
  }, [deck, palette, photo, ready]);

  function patch(index: number, field: keyof Slide, value: string) {
    setDeck((d) => ({
      ...d,
      slides: d.slides.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
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
      </div>

      {/* Настройки */}
      <div className="min-w-0 space-y-5">
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
              <div className="flex items-center justify-between gap-2">
                <select
                  value={slide.kind}
                  onChange={(e) => patch(i, "kind", e.target.value)}
                  className="rounded-chip border border-line bg-sunken px-2.5 py-1.5 text-[12.5px] text-ink"
                >
                  <option value="cover">{t.carousel.kindCover}</option>
                  <option value="statement">{t.carousel.kindStatement}</option>
                  <option value="prompt">{t.carousel.kindPrompt}</option>
                </select>
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
              ) : slide.kind === "statement" ? (
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
