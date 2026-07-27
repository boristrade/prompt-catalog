import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getPromptsByCategory } from "@/lib/prompts";
import PromptCard from "@/components/PromptCard";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  return { title: cat ? cat.title : "Каталог" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const prompts = getPromptsByCategory(cat.slug);
  const freeCount = prompts.filter((p) => p.tier === "free").length;

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">Каталог</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[44px]">
        {cat.title}
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {cat.description}
      </p>

      <div className="rise rise-3 mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11.5px] text-faint">
        <span>
          <span className="text-ink">{prompts.length}</span> промтов
        </span>
        <span className="text-line-strong">·</span>
        <span>
          <span className="text-ink">{freeCount}</span> бесплатно
        </span>
        <span className="text-line-strong">·</span>
        <span>копируются в один клик</span>
      </div>

      {prompts.length > 0 ? (
        <div className="mt-10 grid items-start gap-3 lg:grid-cols-2">
          {prompts.map((p, i) => (
            // Каскад только внутри пары соседних карточек — иначе нижние
            // ряды ждали бы слишком долго.
            <Reveal key={p.id} delay={(i % 2) * 70}>
              <PromptCard prompt={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-card border border-line bg-surface p-10 text-center text-[13.5px] text-muted">
          Промты для этого раздела скоро появятся.
        </div>
      )}
    </section>
  );
}
