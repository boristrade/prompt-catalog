import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Layers,
  Megaphone,
  Palette,
  ShoppingBag,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { PROMPTS, countByCategory } from "@/lib/prompts";
import { TOOLS } from "@/lib/tools";
import Reveal from "@/components/Reveal";
import HeroVisual from "@/components/HeroVisual";

const freeCount = PROMPTS.filter((p) => p.tier === "free").length;

const STATS = [
  { icon: FileText, value: `${PROMPTS.length}`, label: "Готовых промтов" },
  { icon: Sparkles, value: `${freeCount}`, label: "Бесплатно" },
  { icon: Layers, value: `${CATEGORIES.length}`, label: "Направления" },
  { icon: Zap, value: `${TOOLS.length}`, label: "AI-сервисов" },
];

/* У каждого направления свой цвет иконки — как в референсе. */
const CATEGORY_STYLE: Record<
  CategorySlug,
  { Icon: typeof Palette; from: string; to: string }
> = {
  designers: { Icon: Palette, from: "#8b5cf6", to: "#c084fc" },
  marketers: { Icon: Megaphone, from: "#ec4899", to: "#f472b6" },
  ugc: { Icon: Video, from: "#06b6d4", to: "#22d3ee" },
  marketplaces: { Icon: ShoppingBag, from: "#3b82f6", to: "#60a5fa" },
};

const STEPS = [
  {
    t: "Найдите промт",
    d: "Выберите направление или пролистайте каталог до нужной задачи",
  },
  {
    t: "Скопируйте",
    d: "Одна кнопка — и промт целиком сохранится в буфер обмена",
  },
  {
    t: "Подставьте своё",
    d: "Замените подсвеченные переменные на свой продукт и аудиторию",
  },
  {
    t: "Получите результат",
    d: "Вставьте в ChatGPT, Claude или Midjourney и заберите готовое",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="glow relative pt-14 pb-14 md:pt-20 md:pb-16">
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,520px)]">
          {/* Левая колонка — текст */}
          <div>
            {/* Ширину переноса задаёт колонка сетки — получается 4 строки,
                как в референсе, без жёстких переносов в тексте. */}
            <h1 className="font-display rise text-[40px] leading-[1.07] text-ink md:text-[50px]">
              Лучшие промты для любых задач{" "}
              <span className="grad-text">с искусственным интеллектом</span>
            </h1>
            <p className="rise rise-2 mt-6 max-w-md text-[15.5px] leading-relaxed text-muted">
              Готовые промты для ChatGPT, Midjourney, Claude и других
              AI-сервисов. Экономьте время и получайте предсказуемый результат.
            </p>

            <div className="rise rise-3 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/prompts/${CATEGORIES[0].slug}`}
                className="grad-fill group inline-flex items-center gap-2 rounded-chip px-5 py-3 text-[14px] font-semibold shadow-[0_10px_30px_-10px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                Найти промт
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/tools"
                className="rounded-chip border border-line-strong px-5 py-3 text-[14px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.97]"
              >
                Как это работает?
              </Link>
            </div>

            <div className="rise rise-4 mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#7c3aed", "#a855f7", "#6366f1", "#c084fc"].map((c, i) => (
                  <span
                    key={c}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-canvas text-[11px] font-semibold text-white"
                    style={{ background: c }}
                  >
                    {["А", "М", "К", "Д"][i]}
                  </span>
                ))}
              </div>
              <div className="text-[13px] leading-tight">
                <div className="font-semibold text-ink">
                  {PROMPTS.length} промтов
                </div>
                <div className="text-muted">отобраны и проверены вручную</div>
              </div>
            </div>
          </div>

          {/* Правая колонка — визуал */}
          <div className="rise rise-2">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="pb-20">
        <Reveal>
          <div className="grid grid-cols-2 gap-y-6 rounded-card border border-line bg-surface px-6 py-7 sm:grid-cols-4 sm:divide-x sm:divide-line">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3.5 sm:justify-center"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon size={19} />
                </span>
                <div>
                  <div className="font-display text-[24px] leading-none text-ink">
                    {value}
                  </div>
                  <div className="mt-1.5 text-[12.5px] text-muted">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Категории */}
      <section className="pb-20">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-[27px] text-ink md:text-[32px]">
              Популярные направления
            </h2>
            <Link
              href="/tools"
              className="rounded-chip border border-line-strong px-4 py-2 text-[13px] font-medium text-ink transition-colors duration-200 hover:bg-surface"
            >
              Полезные инструменты
            </Link>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const { Icon, from, to } = CATEGORY_STYLE[c.slug];
            return (
              <Reveal key={c.slug} delay={i * 70}>
                <Link
                  href={`/prompts/${c.slug}`}
                  className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-1 hover:border-line-strong"
                >
                  <span
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] text-white"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
                      boxShadow: `0 12px 26px -14px ${from}`,
                    }}
                  >
                    <Icon size={21} />
                  </span>
                  <h3 className="text-[15.5px] font-semibold tracking-[-0.015em] text-ink">
                    {c.nav}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                    {c.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent">
                    {countByCategory(c.slug)} промтов
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Как это работает */}
      <section className="pb-20">
        <Reveal>
          <h2 className="font-display text-center text-[27px] text-ink md:text-[32px]">
            Как это работает?
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative mt-10 rounded-card border border-line bg-surface px-6 py-9">
            <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => {
                const last = i === STEPS.length - 1;
                return (
                  <li key={step.t} className="relative text-center">
                    {/* Стрелка к следующему шагу */}
                    {!last && (
                      <span
                        aria-hidden
                        className="absolute left-[calc(50%+30px)] right-[calc(-50%+30px)] top-[22px] hidden items-center lg:flex"
                      >
                        <span className="h-px flex-1 bg-line-strong" />
                        <ArrowRight size={12} className="-ml-1 text-violet" />
                      </span>
                    )}
                    <span
                      className={`relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full border bg-canvas font-display text-[15px] ${
                        last
                          ? "border-violet text-violet"
                          : "border-violet text-accent"
                      }`}
                    >
                      {last ? <Check size={17} /> : i + 1}
                    </span>
                    <h3 className="mt-4 text-[14.5px] font-semibold text-ink">
                      {step.t}
                    </h3>
                    <p className="mx-auto mt-2 max-w-[24ch] text-[13px] leading-relaxed text-muted">
                      {step.d}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      </section>

      {/* Финальный призыв — тёмная панель с градиентной кнопкой */}
      <section className="pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-card border border-violet/35 bg-[linear-gradient(115deg,rgba(124,58,237,0.18),rgba(168,85,247,0.06))] px-7 py-9 md:px-10 md:py-11">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
              <div>
                <h2 className="font-display max-w-lg text-[24px] leading-snug text-ink md:text-[30px]">
                  Готовы вывести свою работу с AI на новый уровень?
                </h2>
                <p className="mt-3 text-[14px] text-muted">
                  Присоединяйтесь к тем, кто уже экономит часы на каждой задаче
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href={`/prompts/${CATEGORIES[0].slug}`}
                  className="grad-fill group inline-flex items-center gap-2 rounded-chip px-5 py-3 text-[14px] font-semibold shadow-[0_12px_30px_-12px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
                >
                  Начать бесплатно
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
                <p className="mt-2.5 text-center text-[12.5px] text-muted">
                  {freeCount} промтов доступны без регистрации
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
