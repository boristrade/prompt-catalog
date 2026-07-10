import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getPromptsByCategory } from "@/lib/prompts";
import PromptCard from "@/components/PromptCard";

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
    <section className="pt-20 pb-24 md:pt-28">
      <p className="text-[13px] font-semibold tracking-tight text-copper">
        Каталог
      </p>
      <h1 className="font-display mt-4 text-[36px] text-white md:text-[52px]">
        {cat.title}
      </h1>
      <p className="mt-4 max-w-xl text-lg font-light text-fog">
        {cat.description}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fog">
        <span>
          <span className="font-semibold text-white">{prompts.length}</span>{" "}
          промтов
        </span>
        <span className="h-1 w-1 rounded-full bg-slate" />
        <span>
          <span className="font-semibold text-white">{freeCount}</span>{" "}
          бесплатно
        </span>
        <span className="h-1 w-1 rounded-full bg-slate" />
        <span>Копируются в один клик</span>
      </div>

      {prompts.length > 0 ? (
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {prompts.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      ) : (
        <div className="mt-14 rounded-[10px] border border-graphite bg-onyx p-10 text-center text-sm text-fog">
          Промты для этого раздела скоро появятся.
        </div>
      )}
    </section>
  );
}
