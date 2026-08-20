import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy, Sparkles } from "lucide-react";
import { getCategory } from "@/lib/categories";
import {
  getPromptById,
  getPromptsByCategory,
  isLocked,
  veil,
} from "@/lib/prompts";
import { getAccount } from "@/lib/account";
import { MIN_SHOWN, copyCount } from "@/lib/prompt-copies";
import { pageLocale } from "@/lib/i18n";
import { categoryOgImage, pageMeta } from "@/lib/seo";
import { jsonLd, promptSchema } from "@/lib/schema";
import PromptBody from "@/components/PromptBody";
import PromptCard from "@/components/PromptCard";
import FavoriteButton from "@/components/FavoriteButton";
import Reveal from "@/components/Reveal";

/*
  Страница одного промта.

  Раньше промт существовал только якорем внутри страницы категории — а
  ищут не «промты для дизайнеров», а «промт для айдентики бренда». Здесь
  у каждого появляется собственный адрес, заголовок и описание: шесть
  входов в каталог превращаются в шесть десятков.

  Закрытый промт со страницы не исчезает: заголовок, задача и теги видны
  всем, а текста нет — его вырезает veil ещё на сервере. Так понятно, за
  что платить, и поисковику есть что показать.
*/
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; id: string }>;
}) {
  const { category, id } = await params;
  const { locale } = await pageLocale(params);

  const cat = getCategory(category);
  const prompt = getPromptById(id, locale);
  if (!cat || !prompt || prompt.category !== cat.slug) return {};

  return pageMeta({
    locale,
    path: `/prompts/${cat.slug}/${prompt.id}`,
    title: prompt.title,
    description: prompt.summary,
    image: categoryOgImage(cat.slug),
  });
}

export default async function PromptPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; id: string }>;
}) {
  const { category, id } = await params;
  const { locale, t } = await pageLocale(params);

  const cat = getCategory(category);
  if (!cat) notFound();

  const prompt = getPromptById(id, locale);
  /*
    Промт из другого раздела по этому адресу — это 404, а не «покажем всё
    равно». Иначе один промт был бы доступен по пяти адресам, и поисковик
    посчитал бы их дублями.
  */
  if (!prompt || prompt.category !== cat.slug) notFound();

  const account = await getAccount();
  const copies = await copyCount(prompt.id);
  const plan = account?.plan ?? "free";
  const locked = isLocked(prompt, plan);
  const visible = locked ? veil(prompt) : prompt;

  const related = getPromptsByCategory(cat.slug, locale)
    .filter((p) => p.id !== prompt.id)
    .slice(0, 4);

  return (
    <article className="pt-10 pb-20 md:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            promptSchema({
              locale,
              category: cat.slug,
              id: prompt.id,
              title: prompt.title,
              summary: prompt.summary,
              tags: prompt.tags,
              free: prompt.tier === "free",
            }),
          ),
        }}
      />

      <Link
        href={`/${locale}/prompts/${cat.slug}`}
        className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors duration-200 hover:text-ink"
      >
        <ArrowLeft size={14} />
        {t.categories[cat.slug].nav}
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="font-display max-w-2xl text-[26px] leading-tight text-ink md:text-[36px]">
          {prompt.title}
        </h1>

        <div className="flex shrink-0 items-center gap-2">
          <FavoriteButton
            promptId={prompt.id}
            initial={account?.favorites.has(prompt.id) ?? false}
            signedIn={Boolean(account)}
            locale={locale}
            addLabel={t.card.addFavorite}
            removeLabel={t.card.removeFavorite}
          />
          <span
            className={`rounded-chip px-2.5 py-1.5 font-mono text-[10.5px] tracking-[0.08em] ${
              prompt.tier === "pro"
                ? "border border-accent/40 text-accent"
                : "border border-line-strong text-faint"
            }`}
          >
            {prompt.tier === "pro" ? "PRO" : "FREE"}
          </span>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
        {prompt.summary}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-chip border border-line-strong bg-sunken px-2.5 py-1.5 font-mono text-[11px] text-muted">
          <Sparkles size={11} className="text-accent" />
          {t.detail.bestForLabel} {prompt.bestFor}
        </span>
        {/*
          Сколько раз промт забрали. Показываем не с первого раза:
          «скопировали 2 раза» — это не довод в пользу промта, а
          признание, что им никто не пользуется.
        */}
        {copies >= MIN_SHOWN && (
          <span className="inline-flex items-center gap-1.5 rounded-chip border border-line-strong bg-sunken px-2.5 py-1.5 font-mono text-[11px] text-muted">
            <Copy size={11} className="text-accent" />
            {copies.toLocaleString(locale)} {t.detail.copiedTimes}
          </span>
        )}
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-chip bg-sunken px-2.5 py-1.5 font-mono text-[11px] text-faint"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-10 max-w-3xl">
        <PromptBody prompt={visible} locked={locked} locale={locale} t={t} />
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">
            {t.detail.related}
          </h2>
          <div className="mt-6 grid items-start gap-3 lg:grid-cols-2">
            {related.map((p, i) => {
              const relatedLocked = isLocked(p, plan);
              return (
                <Reveal key={p.id} delay={(i % 2) * 70}>
                  <PromptCard
                    prompt={relatedLocked ? veil(p) : p}
                    locked={relatedLocked}
                    favorited={account?.favorites.has(p.id) ?? false}
                    signedIn={Boolean(account)}
                    locale={locale}
                    t={t}
                  />
                </Reveal>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
