import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { PROMPTS, countByCategory } from "@/lib/prompts";
import { TOOLS } from "@/lib/tools";
import Reveal from "@/components/Reveal";

const freeCount = PROMPTS.filter((p) => p.tier === "free").length;

const STATS = [
  { value: PROMPTS.length, label: "готовых промтов" },
  { value: freeCount, label: "бесплатно" },
  { value: CATEGORIES.length, label: "направления" },
  { value: TOOLS.length, label: "инструментов" },
];

const STEPS = [
  {
    t: "Выберите промт",
    d: "Найдите задачу в своём разделе — под каждым промтом есть пример результата.",
  },
  {
    t: "Подставьте своё",
    d: "Замените подсвеченные переменные в фигурных скобках на свой продукт и аудиторию.",
  },
  {
    t: "Копируйте и запускайте",
    d: "Один клик — и промт в буфере. Вставьте в ChatGPT, Claude или Midjourney.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20">
        <p className="eyebrow rise">Каталог AI-промтов</p>
        <h1 className="font-display rise rise-1 mt-4 max-w-2xl text-[38px] leading-[1.04] text-ink md:text-[60px]">
          Промты, которые работают
        </h1>
        <p className="rise rise-2 mt-5 max-w-xl text-[16.5px] leading-relaxed text-muted">
          Отобранные промты для дизайнеров, маркетологов, UGC-креаторов и
          продавцов маркетплейсов. С примерами результата и копированием в один
          клик.
        </p>
        <div className="rise rise-3 mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={`/prompts/${CATEGORIES[0].slug}`}
            className="rounded-chip bg-invert px-4 py-2.5 text-[13.5px] font-medium text-on-invert transition-[opacity,transform] duration-200 hover:opacity-85 active:scale-[0.97]"
          >
            Открыть каталог
          </Link>
          <Link
            href="/tools"
            className="rounded-chip border border-line-strong px-4 py-2.5 text-[13.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.97]"
          >
            Инструменты
          </Link>
        </div>
      </section>

      {/* Статистика */}
      <section className="pb-20">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-canvas px-5 py-6">
                <div className="font-display text-[30px] leading-none text-ink">
                  {s.value}
                </div>
                <div className="mt-2 font-mono text-[11px] text-faint">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Категории */}
      <section className="pb-20">
        <Reveal>
          <h2 className="font-display text-[26px] text-ink md:text-[34px]">
            Четыре направления
          </h2>
        </Reveal>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 70}>
              <Link
                href={`/prompts/${c.slug}`}
                className="group block rounded-card border border-line bg-surface p-5 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[15.5px] font-semibold tracking-[-0.015em] text-ink">
                    {c.nav}
                  </h3>
                  <ArrowRight
                    size={15}
                    className="shrink-0 text-faint transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-accent"
                  />
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                  {c.description}
                </p>
                <span className="mt-3.5 inline-block font-mono text-[11px] text-accent">
                  {countByCategory(c.slug)} промтов
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Как пользоваться */}
      <section className="pb-20">
        <Reveal>
          <h2 className="font-display text-[26px] text-ink md:text-[34px]">
            Как пользоваться
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-7 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.t} className="bg-canvas p-5">
                <div className="font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2.5 text-[15px] font-semibold tracking-[-0.015em] text-ink">
                  {step.t}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
