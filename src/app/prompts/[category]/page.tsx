import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

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

      {/* Сетка карточек появится в Фазе 4 (данные из Supabase) */}
      <div className="mt-14 rounded-[10px] border border-graphite bg-onyx p-10 text-center text-sm text-fog">
        Каталог этого раздела подключается в Фазе 4.
      </div>
    </section>
  );
}
