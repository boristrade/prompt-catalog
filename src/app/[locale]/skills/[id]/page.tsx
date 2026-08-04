import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Info, Lock } from "lucide-react";
import { SKILLS, isSkillLocked, skill, veilSkill } from "@/lib/skills";
import { getAccount } from "@/lib/account";
import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { articleSchema, jsonLd } from "@/lib/schema";
import CopyFile from "@/components/CopyFile";
import Reveal from "@/components/Reveal";

/*
  Страница зависит от вошедшего: у оплатившего файл открыт, у остальных
  обрезан. Без этой строчки Next собрал бы её один раз на сборке — когда
  никто не вошёл, — и подписчик получал бы ту же закрытую версию, что и
  гость, навсегда. Ровно так же помечены страницы промтов.
*/
export const dynamic = "force-dynamic";

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

  const full = skill(locale, id);
  if (!full) notFound();

  /*
    Под замком только файл. Название, описание, разбор и инструкция
    «куда положить» открыты всем — по ним на страницу приходят из
    поиска, и прятать их значило бы спрятать саму страницу.
  */
  const account = await getAccount();
  const locked = isSkillLocked(full, account?.plan ?? "free");
  const item = locked ? veilSkill(full) : full;

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
              free: full.tier === "free",
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
        <span
          className={`rounded-chip px-2.5 py-1.5 font-mono text-[10.5px] tracking-[0.08em] ${
            full.tier === "pro"
              ? "border border-accent/40 text-accent"
              : "border border-line-strong text-faint"
          }`}
        >
          {full.tier === "pro" ? "PRO" : "FREE"}
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
                  {/*
                    Второй шаг у скила из нескольких файлов другой: класть
                    надо не один SKILL.md, а всю папку с вложенностью.
                    Инструкция «положите файл SKILL.md» увела бы человека
                    в скил, который сошлётся на соседний файл и не найдёт
                    его.
                  */}
                  {i === 1 && item.files.length > 1
                    ? t.skills.installStepFiles
                    : step.replace("{folder}", item.folder)}
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
            {item.files.length > 1 ? t.skills.filesTitle : t.skills.fileTitle}
          </h2>

          {/*
            У скила из нескольких файлов над каждым подписан его путь
            внутри папки: путь — это и есть инструкция, куда файл класть,
            и без него «references/scenarios.md» превратилось бы в ещё
            один безымянный кусок текста.
          */}
          {item.files.map((file, i) => (
            <div key={file.path} className={i === 0 ? "mt-5" : "mt-8"}>
              {item.files.length > 1 && (
                <div className="mb-2.5 min-w-0 break-all font-mono text-[12px] text-faint">
                  {item.folder}/{file.path}
                </div>
              )}

              {locked ? (
                /*
                  file.text здесь уже обрезан на сервере (veilSkill), а не
                  спрятан размытием поверх целого текста: под замком лежит
                  то, чего в странице нет вовсе. Видное начало — настоящее,
                  чтобы человек решал, платить ли, посмотрев на сам файл, а
                  не на замок.
                */
                <div className="relative">
                  <pre className="max-h-64 overflow-hidden whitespace-pre-wrap rounded-card border border-line bg-sunken p-5 font-mono text-[12px] leading-[1.7] text-muted">
                    {file.text}
                    <span aria-hidden>{"\n…"}</span>
                  </pre>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-card bg-gradient-to-t from-surface via-surface/95 to-transparent"
                  />
                </div>
              ) : (
                <CopyFile
                  content={file.text}
                  copyLabel={t.skills.copy}
                  copiedLabel={t.skills.copied}
                />
              )}
            </div>
          ))}

          {locked && (
            <div className="relative mt-3 flex flex-col items-center gap-4 rounded-card border border-line bg-surface px-6 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-sunken text-accent">
                <Lock size={18} />
              </span>
              <p className="max-w-sm text-[13.5px] leading-relaxed text-muted">
                {t.skills.lockedTitle}
              </p>
              <Link
                href={`/${locale}/pricing`}
                className="grad-fill rounded-chip px-5 py-2.5 text-[13.5px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                {t.card.lockedCta}
              </Link>
            </div>
          )}
        </div>
      </Reveal>
    </article>
  );
}
