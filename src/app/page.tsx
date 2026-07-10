import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { PROMPTS, countByCategory } from "@/lib/prompts";
import { TOOLS } from "@/lib/tools";

const freeCount = PROMPTS.filter((p) => p.tier === "free").length;

const STATS = [
  { value: `${PROMPTS.length}`, label: "готовых промтов" },
  { value: `${freeCount}`, label: "бесплатно" },
  { value: `${CATEGORIES.length}`, label: "направления" },
  { value: `${TOOLS.length}`, label: "инструментов" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-20 md:pt-36 md:pb-24">
        <p className="text-[13px] font-semibold tracking-tight text-copper">
          Каталог AI-промтов
        </p>
        <h1 className="font-display mt-5 max-w-3xl text-[44px] leading-[1.05] text-white md:text-[72px]">
          Промты, которые работают. Проверено на практике.
        </h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-fog">
          Отобранные промты для дизайнеров, маркетологов, UGC-креаторов и
          продавцов маркетплейсов. Бесплатные и премиальные — с примерами
          результата и копированием в один клик.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href={`/prompts/${CATEGORIES[0].slug}`}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-85"
          >
            Смотреть каталог
          </Link>
          <Link
            href="/tools"
            className="rounded-full border border-white px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Полезные инструменты
          </Link>
        </div>
      </section>

      {/* Статистика */}
      <section className="pb-24">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-graphite bg-graphite sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-onyx px-6 py-8 text-center">
              <div className="font-display text-[36px] leading-none text-white md:text-[44px]">
                {s.value}
              </div>
              <div className="mt-2 text-[13px] text-fog">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Категории */}
      <section className="pb-24">
        <h2 className="font-display text-[32px] text-white md:text-[44px]">
          Четыре направления
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/prompts/${c.slug}`}
              className="group rounded-[10px] border border-graphite bg-onyx p-6 transition-colors hover:border-slate"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">{c.nav}</h3>
                <ArrowRight
                  size={18}
                  className="text-steel transition-transform group-hover:translate-x-1 group-hover:text-copper"
                />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                {c.description}
              </p>
              <span className="mt-4 inline-block text-[13px] font-medium text-copper">
                {countByCategory(c.slug)} промтов →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Как это работает */}
      <section className="pb-24">
        <h2 className="font-display text-[32px] text-white md:text-[44px]">
          Как пользоваться
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Выберите промт",
              d: "Найдите нужную задачу в своём разделе — под каждой есть пример результата.",
            },
            {
              n: "02",
              t: "Подставьте своё",
              d: "Замените {переменные} в фигурных скобках на свой продукт и аудиторию.",
            },
            {
              n: "03",
              t: "Копируйте и запускайте",
              d: "Один клик — и промт в буфере. Вставьте в ChatGPT, Claude или Midjourney.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-[10px] border border-graphite bg-onyx p-6"
            >
              <div className="font-display text-[22px] text-copper">
                {step.n}
              </div>
              <h3 className="mt-3 text-lg font-medium text-white">{step.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{step.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
