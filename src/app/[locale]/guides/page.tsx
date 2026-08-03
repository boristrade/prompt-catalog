import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { allGuides } from "@/lib/guides";
import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import Reveal from "@/components/Reveal";

/*
  Список гайдов. Статика: тексты лежат в коде, от вошедшего не зависят —
  собирать страницу на каждый запрос незачем.
*/
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
    path: "/guides",
    title: t.guides.title,
    description: t.guides.subtitle,
  });
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const guides = allGuides(locale);

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{t.guides.eyebrow}</p>
      <h1 className="font-display rise rise-1 mt-4 max-w-2xl text-balance text-[30px] leading-tight text-ink md:text-[44px]">
        {t.guides.title}
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {t.guides.subtitle}
      </p>

      <div className="mt-10 grid items-start gap-3 lg:grid-cols-2">
        {guides.map(({ slug, guide }, i) => (
          <Reveal key={slug} delay={(i % 2) * 70}>
            <Link
              href={`/${locale}/guides/${slug}`}
              className="group flex h-full flex-col rounded-card border border-line bg-surface p-6 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong"
            >
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
                <Clock size={11} />
                {guide.minutes} {t.guides.minutes}
              </span>
              <h2 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink transition-colors duration-200 group-hover:text-accent">
                {guide.title}
              </h2>
              <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-muted">
                {guide.summary}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent">
                {t.guides.readMore}
                <ArrowRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
