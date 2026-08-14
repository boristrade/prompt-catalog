import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/*
  Блок про конструктор каруселей на главной.

  Стоит на месте бывших «трёх полок». Полки вели в разделы, до которых
  и так добираются из шапки и подвала, — а карусель делают прямо здесь и
  сейчас, и о ней иначе не узнают.

  Слева — что это и кнопка, справа — три слайда внахлёст. Слайды
  нарисованы вёрсткой, а не картинкой: они должны жить в обеих темах и
  оставаться чёткими на любом экране, а png пришлось бы отдавать в
  двойном разрешении и он всё равно мылился бы на ретине.
*/

/** Мини-слайд: пропорции 4:5, как в настоящем кадре карусели. */
function MiniSlide({
  index,
  title,
  className,
}: {
  index: string;
  title: string;
  className: string;
}) {
  return (
    <div
      aria-hidden
      className={`absolute aspect-[4/5] w-[42%] overflow-hidden rounded-card border border-line-strong bg-sunken p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex items-center justify-between font-mono text-[9px] text-accent">
        <span>{index}</span>
        <span className="text-faint">PROMPTOM</span>
      </div>
      <div className="mt-1 h-px w-full bg-line" />

      <div className="mt-5 text-[13px] font-bold leading-tight tracking-[-0.02em] text-ink">
        {title}
      </div>

      {/* Полоски вместо текста: настоящий текст на 46% ширины
          превратился бы в нечитаемую крошку. */}
      <div className="mt-3 space-y-1.5">
        <div className="h-1 w-full rounded-full bg-line-strong" />
        <div className="h-1 w-4/5 rounded-full bg-line-strong" />
      </div>

      <div className="mt-4 h-1 w-8 rounded-full bg-accent" />

      <div className="absolute bottom-3 left-4 font-mono text-[9px] text-faint">
        @username
      </div>
    </div>
  );
}

export default function CarouselPromo({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const points = [t.home.carouselPoint1, t.home.carouselPoint2, t.home.carouselPoint3];

  return (
    <section className="pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
        <Reveal>
          <h2 className="font-display text-balance text-[27px] leading-tight text-ink md:text-[32px]">
            {t.home.carouselTitle}
          </h2>
          <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-muted">
            {t.home.carouselText}
          </p>

          <ul className="mt-6 space-y-2.5">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Check size={12} />
                </span>
                <span className="min-w-0 text-[14px] leading-relaxed text-muted">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href={`/${locale}/carousel`}
            className="grad-fill shine group mt-8 inline-flex items-center gap-2 rounded-chip px-5 py-3 text-[14px] font-semibold shadow-[0_10px_30px_-10px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
          >
            {t.home.carouselCta}
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>

        {/*
          Стопка слайдов. Высота задана отношением сторон родителя, а не
          числом: при фиксированной высоте карточки на узком экране
          вылезали бы за край.

          Крайние карточки отступают от края на 6%, а не прижаты к нему.
          Поворот разносит углы шире самой карточки: при наклоне в 6° у
          кадра 4:5 угол уходит примерно на 3% ширины в каждую сторону, и
          прижатая к краю карточка оказывалась обрезанной — на телефоне
          это было видно сразу.
        */}
        <Reveal delay={120}>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[440px]">
            <MiniSlide
              index="01/06"
              title={t.home.carouselSlide1}
              className="left-[6%] top-[8%] -rotate-[6deg]"
            />
            <MiniSlide
              index="02/06"
              title={t.home.carouselSlide2}
              className="left-[29%] top-0 rotate-[2deg]"
            />
            <MiniSlide
              index="03/06"
              title={t.home.carouselSlide3}
              className="right-[6%] top-[10%] rotate-[6deg]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
