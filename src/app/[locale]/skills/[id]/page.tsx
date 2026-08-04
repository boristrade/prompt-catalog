import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { SKILLS, skill } from "@/lib/skills";
import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { articleSchema, jsonLd } from "@/lib/schema";
import CopyFile from "@/components/CopyFile";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => SKILLS.map((id) => ({ locale, id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const { locale } = await pageLocale(params);

  const item = skill(locale, id);
  if (!item) return {};

  return pageMeta({
    locale,
    path: `/skills/${id}`,
    title: item.title,
    description: item.summary,
  });
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const { locale, t } = await pageLocale(params);

  const item = skill(locale, id);
  if (!item) notFound();

  return (
    <article className="pt-10 pb-20 md:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            articleSchema({
              locale,
              path: `/skills/${id}`,
              title: item.title,
              description: item.summary,
            }),
          ),
        }}
      />

      <Link
        href={`/${locale}/skills`}
        className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors duration-200 hover:text-ink"
      >
        <ArrowLeft size={14} />
        {t.skills.back}
      </Link>

      <h1 className="font-display mt-6 max-w-3xl text-balance text-[28px] leading-tight text-ink md:text-[40px]">
        {item.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="rounded-chip border border-line-strong bg-sunken px-2.5 py-1.5 font-mono text-[11px] text-muted">
          {item.folder}
        </span>
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-chip bg-sunken px-2.5 py-1.5 font-mono text-[11px] text-faint"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
        {item.summary}
      </p>

      {/*
        Разбор «что делает» и «зачем нужен» есть не у каждого скила: он
        пишется руками и по-русски, а сам файл — по-английски и для
        модели. Скил без разбора показывает то, что есть: описание из
        шапки, куда положить и сам файл.
      */}
      {item.what.length > 0 && (
        <div className="mt-12 max-w-3xl">
          <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
            {t.skills.whatTitle}
          </h2>
          <ul className="mt-3.5 space-y-2.5">
            {item.what.map((line) => (
              <li
                key={line}
                className="relative pl-5 text-[14px] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-violet"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.why && (
        <Reveal delay={40}>
          <div className="mt-10 max-w-3xl rounded-card border border-line bg-sunken p-6">
            <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-ink">
              {t.skills.whyTitle}
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
              {item.why}
            </p>
          </div>
        </Reveal>
      )}

      {/* Сначала куда положить, потом сам файл: скопировав текст, человек
          уже должен знать, что с ним делать. */}
      <Reveal delay={60}>
        <div className="mt-12 max-w-3xl">
          <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
            {t.skills.installTitle}
          </h2>
          <ol className="mt-5 space-y-3.5">
            {t.skills.installSteps.map((step, i) => (
              <li key={step} className="flex gap-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong bg-sunken font-mono text-[11px] text-accent">
                  {i + 1}
                </span>
                {/*
                  break-words, а не break-all. break-all рвёт по любому
                  символу и режет обычные слова посреди: «подключит скил
                  са / м». break-words трогает только то, что не влезает
                  целиком, — то есть длинный путь к папке, ради которого
                  перенос и нужен.
                */}
                <span className="min-w-0 break-words text-[14px] leading-relaxed text-muted">
                  {step.replace("{folder}", item.folder)}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex items-start gap-3 rounded-card border border-line bg-surface p-4">
            <span className="mt-0.5 shrink-0 text-accent">
              <Info size={15} />
            </span>
            <p className="min-w-0 break-words text-[13px] leading-relaxed text-muted">
              {t.skills.installNote}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-12 max-w-3xl">
          <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
            {t.skills.fileTitle}
          </h2>
          <div className="mt-5">
            <CopyFile
              content={item.file}
              copyLabel={t.skills.copy}
              copiedLabel={t.skills.copied}
            />
          </div>
        </div>
      </Reveal>
    </article>
  );
}
