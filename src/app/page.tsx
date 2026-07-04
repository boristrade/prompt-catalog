import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-32 md:pt-36 md:pb-40">
        <p className="text-[13px] font-semibold tracking-tight text-copper">
          Каталог AI-промтов
        </p>
        <h1 className="font-display mt-5 max-w-3xl text-[44px] leading-[1.05] text-white md:text-[72px]">
          Промты, которые работают. Проверено на практике.
        </h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-fog">
          Отобранные промты для дизайнеров, маркетологов, UGC-креаторов и
          продавцов маркетплейсов. Бесплатные и премиальные — с примерами
          результата.
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
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
