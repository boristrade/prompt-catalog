import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import {
  isLocked,
  promptsFor,
  searchPrompts,
  toolsAmong,
  usesTool,
  veil,
  type Prompt,
} from "@/lib/prompts";
import { getAccount } from "@/lib/account";
import { pageLocale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/seo";
import { addedOf } from "@/lib/prompt-dates";
import CatalogFilters, { chipClass, type Tier } from "@/components/CatalogFilters";
import PromptCard from "@/components/PromptCard";
import Reveal from "@/components/Reveal";
import SearchBox from "@/components/SearchBox";

/*
  Весь каталог на одной странице.

  Раньше единственным входом в каталог был раздел — «Промты для
  дизайнеров», «Промты для UGC». Человек, который ещё не понял, к какому
  разделу относится его задача, не находил ничего: разделы не гадают, а
  выбирают. Здесь то же самое, но без этого выбора — поиск и фильтры
  работают по всем промтам сразу, а раздел стал ещё одним фильтром, а не
  обязательным первым шагом.
*/
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  return pageMeta({
    locale,
    path: "/prompts",
    title: t.allPrompts.title,
    description: t.allPrompts.subtitle,
  });
}

export default async function AllPromptsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    tier?: string;
    tool?: string;
    category?: string;
    q?: string;
    sort?: string;
  }>;
}) {
  const { locale, t } = await pageLocale(params);
  const sp = await searchParams;

  const all = promptsFor(locale);

  const tier: Tier = sp.tier === "free" || sp.tier === "pro" ? sp.tier : "all";
  const query = (sp.q ?? "").trim();

  const category = sp.category && getCategory(sp.category) ? sp.category : null;
  const sort: Sort = sp.sort === "new" ? "new" : "default";

  /*
    Список нейросетей строим из уже отфильтрованного по разделу набора:
    выбрав «Для UGC», незачем предлагать Figma в списке фильтров — там
    её не встретить.
  */
  const scoped = category ? all.filter((p) => p.category === category) : all;
  const tools = toolsAmong(scoped);
  const tool = sp.tool && tools.some((name) => name === sp.tool) ? sp.tool : null;

  const found = searchPrompts(scoped, query)
    .filter((p) => (tier === "all" ? true : p.tier === tier))
    .filter((p) => (tool ? usesTool(p, tool) : true));

  /*
    Порядок по умолчанию — тот, в котором промты лежат в каталоге:
    внутри раздела они собраны по смыслу, а не по алфавиту, и трогать это
    незачем. «Сначала новые» переставляет по дате пополнения; промты
    одного пополнения сохраняют исходный порядок между собой, поэтому
    сортировка устойчивая, а не перетасовка.
  */
  const prompts =
    sort === "new"
      ? [...found].sort((a, b) => addedOf(b.id).localeCompare(addedOf(a.id)))
      : found;

  const freeCount = all.filter((p) => p.tier === "free").length;

  const account = await getAccount();
  const plan = account?.plan ?? "free";

  const categoryLabel = (p: Prompt) => t.categories[p.category].nav;

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{t.allPrompts.eyebrow}</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[44px]">
        {t.allPrompts.title}
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {t.allPrompts.subtitle}
      </p>

      <div className="rise rise-3 mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11.5px] text-faint">
        <span>
          <span className="text-ink">{all.length}</span> {t.catalog.prompts}
        </span>
        <span className="text-line-strong">·</span>
        <span>
          <span className="text-ink">{freeCount}</span> {t.catalog.free}
        </span>
        <span className="text-line-strong">·</span>
        <span>{t.catalog.oneClick}</span>
      </div>

      <div className="rise rise-3 mt-6">
        <SearchBox
          action={`/${locale}/prompts`}
          query={query}
          placeholder={t.catalog.searchPlaceholder}
          button={t.catalog.searchButton}
          hidden={{
            ...(tier !== "all" ? { tier } : {}),
            ...(tool ? { tool } : {}),
            ...(category ? { category } : {}),
            ...(sort !== "default" ? { sort } : {}),
          }}
        />
      </div>

      {/* Раздел — ещё одно измерение фильтра, а не обязательный первый шаг. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
          {t.allPrompts.section}
        </span>
        <a
          href={buildAllPromptsHref(locale, {
            tier,
            tool,
            query,
            category: null,
            sort,
          })}
          className={chipClass(category === null)}
        >
          {t.allPrompts.categoryAll}
        </a>
        {CATEGORIES.map((c) => (
          <a
            key={c.slug}
            href={buildAllPromptsHref(locale, {
              tier,
              tool: null,
              query,
              category: c.slug,
              sort,
            })}
            className={chipClass(category === c.slug)}
          >
            {t.categories[c.slug].nav}
          </a>
        ))}
      </div>

      {/*
        Порядок — рядом с разделом, а не среди фильтров: фильтры убирают
        промты из списка, а порядок только переставляет. Смешивать эти
        две вещи в один ряд значит путать «показать меньше» с «показать
        иначе».
      */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
          {t.allPrompts.sort}
        </span>
        <a
          href={buildAllPromptsHref(locale, {
            tier,
            tool,
            query,
            category,
            sort: "default",
          })}
          className={chipClass(sort === "default")}
        >
          {t.allPrompts.sortDefault}
        </a>
        <a
          href={buildAllPromptsHref(locale, {
            tier,
            tool,
            query,
            category,
            sort: "new",
          })}
          className={chipClass(sort === "new")}
        >
          {t.allPrompts.sortNew}
        </a>
      </div>

      <CatalogFilters
        base={`/${locale}/prompts`}
        tools={tools}
        tier={tier}
        tool={tool}
        t={t}
        persist={{
          ...(query ? { q: query } : {}),
          ...(category ? { category } : {}),
          ...(sort !== "default" ? { sort } : {}),
        }}
      />

      {prompts.length > 0 ? (
        <div className="mt-8 grid items-start gap-3 lg:grid-cols-2">
          {prompts.map((p, i) => {
            const locked = isLocked(p, plan);
            return (
              <Reveal key={p.id} delay={(i % 2) * 70}>
                <PromptCard
                  prompt={locked ? veil(p) : p}
                  locked={locked}
                  favorited={account?.favorites.has(p.id) ?? false}
                  signedIn={Boolean(account)}
                  locale={locale}
                  t={t}
                  categoryLabel={categoryLabel(p)}
                />
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-card border border-dashed border-line-strong bg-surface p-10 text-center text-[13.5px] text-muted">
          {t.filters.nothing}
        </div>
      )}
    </section>
  );
}

type Sort = "default" | "new";

/*
  Раздел живёт отдельным параметром, которого CatalogFilters не знает, —
  чипы раздела поэтому строят свой адрес сами, а не через её href().
  Тег и поиск при этом сохраняются: смена раздела не должна стирать то,
  что человек уже искал или выбрал по доступу.
*/
function buildAllPromptsHref(
  locale: string,
  params: {
    tier: Tier;
    tool: string | null;
    query: string;
    category: string | null;
    sort: Sort;
  },
): string {
  const search = new URLSearchParams();
  if (params.tier !== "all") search.set("tier", params.tier);
  if (params.tool) search.set("tool", params.tool);
  if (params.query) search.set("q", params.query);
  if (params.category) search.set("category", params.category);
  if (params.sort !== "default") search.set("sort", params.sort);

  const qs = search.toString();
  return `/${locale}/prompts${qs ? `?${qs}` : ""}`;
}
