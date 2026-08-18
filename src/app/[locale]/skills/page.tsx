import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { allSkills } from "@/lib/skills";
import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import SkillCover from "@/components/SkillCover";

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
    path: "/skills",
    title: t.skills.title,
    description: t.skills.subtitle,
  });
}

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const skills = allSkills(locale);

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{t.skills.eyebrow}</p>
      <h1 className="font-display rise rise-1 mt-4 max-w-2xl text-balance text-[30px] leading-tight text-ink md:text-[44px]">
        {t.skills.title}
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {t.skills.subtitle}
      </p>

      <div className="mt-10 grid items-start gap-3 lg:grid-cols-2">
        {skills.map((item, i) => (
          <Reveal key={item.id} delay={(i % 2) * 70}>
            <Link
              href={`/${locale}/skills/${item.id}`}
              className="group flex h-full flex-col rounded-card border border-line bg-surface p-6 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-chip bg-accent-soft text-accent">
                  <Terminal size={16} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink transition-colors duration-200 group-hover:text-accent">
                    {item.title}
                  </h2>
                  {/* Имя папки — оно же имя скила: по нему человек узнаёт
                      свой скил в списке .claude/skills. Рядом тариф: под
                      замком у скила только файл, но узнать об этом до
                      перехода честнее, чем после. */}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-faint">
                      {item.folder}
                    </span>
                    <span
                      className={`rounded-chip px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.08em] ${
                        item.tier === "pro"
                          ? "border border-accent/40 text-accent"
                          : "border border-line-strong text-faint"
                      }`}
                    >
                      {item.tier === "pro" ? "PRO" : "FREE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Обложка есть не у всех — и это видно, в том и смысл:
                  карточка с движением в списке из двух десятков
                  одинаковых притягивает взгляд первой. */}
              {item.cover && <SkillCover cover={item.cover} className="mt-4" />}

              <p className="mt-3.5 flex-1 text-[13.5px] leading-relaxed text-muted">
                {item.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-chip bg-sunken px-2 py-1 font-mono text-[10.5px] text-faint"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent">
                {/* У закрытого скила файл скопировать нельзя — обещать
                    это на карточке значило бы соврать до перехода. */}
                {item.tier === "pro" ? t.skills.details : t.skills.copy}
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
