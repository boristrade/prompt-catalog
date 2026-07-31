import Link from "next/link";
import { X } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/*
  Фильтры каталога.

  Сделаны ссылками, а не кнопками с состоянием в памяти: выбор попадает в
  адрес, поэтому подборку «только бесплатные для Midjourney» можно
  переслать, сохранить в закладки и вернуться к ней. Ещё это значит, что
  фильтры работают до загрузки скриптов и на любом устройстве — страница
  и так рисуется на сервере.
*/

export type Tier = "all" | "free" | "pro";

function chipClass(active: boolean): string {
  return `rounded-chip border px-3.5 py-2 text-[12.5px] transition-[color,border-color] duration-200 ${
    active
      ? "border-violet/50 bg-accent-soft text-accent"
      : "border-line text-muted hover:border-line-strong hover:text-ink"
  }`;
}

export default function CatalogFilters({
  base,
  tools,
  tier,
  tool,
  t,
}: {
  /** Адрес раздела без параметров. */
  base: string;
  tools: string[];
  tier: Tier;
  tool: string | null;
  t: Dictionary;
}) {
  // Ссылка, меняющая один параметр и сохраняющая второй.
  function href(next: { tier?: Tier; tool?: string | null }): string {
    const tierValue = next.tier ?? tier;
    const toolValue = next.tool === undefined ? tool : next.tool;

    const query = new URLSearchParams();
    if (tierValue !== "all") query.set("tier", tierValue);
    if (toolValue) query.set("tool", toolValue);

    const search = query.toString();
    return search ? `${base}?${search}` : base;
  }

  const tiers: { value: Tier; label: string }[] = [
    { value: "all", label: t.filters.all },
    { value: "free", label: t.filters.freeOnly },
    { value: "pro", label: t.filters.proOnly },
  ];

  const filtered = tier !== "all" || tool !== null;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
          {t.filters.access}
        </span>
        {tiers.map((item) => (
          <Link
            key={item.value}
            href={href({ tier: item.value })}
            scroll={false}
            className={chipClass(tier === item.value)}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Раздел с одной нейросетью фильтровать не по чему — строку прячем. */}
      {tools.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
            {t.filters.tool}
          </span>
          <Link
            href={href({ tool: null })}
            scroll={false}
            className={chipClass(tool === null)}
          >
            {t.filters.all}
          </Link>
          {tools.map((name) => (
            <Link
              key={name}
              href={href({ tool: name })}
              scroll={false}
              className={chipClass(tool === name)}
            >
              {name}
            </Link>
          ))}
        </div>
      )}

      {filtered && (
        <Link
          href={base}
          scroll={false}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted transition-colors duration-200 hover:text-ink"
        >
          <X size={13} />
          {t.filters.reset}
        </Link>
      )}
    </div>
  );
}
