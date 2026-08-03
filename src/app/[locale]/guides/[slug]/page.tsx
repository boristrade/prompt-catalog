import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { GUIDES, guide, isGuide } from "@/lib/guides";
import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { articleSchema, jsonLd } from "@/lib/schema";
import Reveal from "@/components/Reveal";

/*
  Страница одного гайда. Разметка та же, что у правовых документов:
  заголовок, вступление, разделы с абзацами. Две почти одинаковые
  вёрстки разошлись бы при первой правке, поэтому держим их похожими
  сознательно.
*/
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    GUIDES.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const { locale } = await pageLocale(params);
  if (!isGuide(slug)) return {};

  const item = guide(locale, slug);
  return pageMeta({
    locale,
    path: `/guides/${slug}`,
    title: item.title,
    description: item.summary,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const { locale, t } = await pageLocale(params);
  if (!isGuide(slug)) notFound();

  const item = guide(locale, slug);

  return (
    <article className="pt-10 pb-20 md:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            articleSchema({
              locale,
              path: `/guides/${slug}`,
              title: item.title,
              description: item.summary,
            }),
          ),
        }}
      />

      <Link
        href={`/${locale}/guides`}
        className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors duration-200 hover:text-ink"
      >
        <ArrowLeft size={14} />
        {t.guides.back}
      </Link>

      <h1 className="font-display mt-6 max-w-3xl text-balance text-[28px] leading-tight text-ink md:text-[40px]">
        {item.title}
      </h1>

      <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11.5px] text-faint">
        <Clock size={12} />
        {item.minutes} {t.guides.minutes}
      </span>

      <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
        {item.intro}
      </p>

      <div className="mt-12 max-w-3xl space-y-9">
        {item.sections.map((section, i) => (
          <Reveal key={section.title} delay={Math.min(i, 6) * 50}>
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
                {section.title}
              </h2>
              <ul className="mt-3.5 space-y-2.5">
                {section.body.map((line) => (
                  <li
                    key={line}
                    className="relative pl-5 text-[14px] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-violet"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </article>
  );
}
