import { getAccount } from "@/lib/account";
import { isLocked, promptsFor, veil, type Prompt } from "@/lib/prompts";
import { ADDED, addedOf } from "@/lib/prompt-dates";
import { pageLocale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/seo";
import { counted } from "@/lib/plural";
import PromptCard from "@/components/PromptCard";
import Reveal from "@/components/Reveal";

/*
  Что нового.

  Каталог из двух сотен промтов ничем не показывает, что в нём
  изменилось: вернувшийся человек видит ту же стену карточек и уходит,
  не найдя причины остаться. Здесь только последние пополнения, разбитые
  по дням, — за минуту видно, стоит ли смотреть дальше.

  Страница зависит от вошедшего: у оплатившего промты открыты, у
  остальных закрыты, как и везде в каталоге.
*/
export const dynamic = "force-dynamic";

/** Сколько последних пополнений показываем. Больше — это уже каталог. */
const BATCHES = 3;

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
    path: "/new",
    title: t.whatsNew.title,
    description: t.whatsNew.subtitle,
  });
}

export default async function WhatsNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);

  const days = [...new Set(Object.values(ADDED))].sort().reverse().slice(0, BATCHES);

  const all = promptsFor(locale);
  const batches = days
    .map((day) => ({
      day,
      prompts: all.filter((p) => addedOf(p.id) === day),
    }))
    .filter((batch) => batch.prompts.length > 0);

  const account = await getAccount();
  const plan = account?.plan ?? "free";

  const card = (p: Prompt, i: number) => {
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
          categoryLabel={t.categories[p.category].nav}
          /* Здесь новое всё: значок на каждой карточке ничего не сообщал
             бы, а дата пополнения и так стоит заголовком выше. */
          showFresh={false}
        />
      </Reveal>
    );
  };

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{t.whatsNew.eyebrow}</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[44px]">
        {t.whatsNew.title}
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {t.whatsNew.subtitle}
      </p>

      {batches.length === 0 ? (
        <p className="mt-10 text-[14px] text-muted">{t.whatsNew.empty}</p>
      ) : (
        batches.map((batch) => (
          <div key={batch.day} className="mt-12">
            {/*
              Дата словами, а не «2026-08-14»: числом её читают только
              программисты. Формат берётся из языка страницы, поэтому у
              немца выйдет «14. August», а не «August 14».
            */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">
                {new Date(`${batch.day}T00:00:00Z`).toLocaleDateString(locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </h2>
              <span className="font-mono text-[11.5px] text-faint">
                {counted(locale, batch.prompts.length, t.catalog.promptWord)}
              </span>
            </div>

            <div className="mt-5 grid items-start gap-3 lg:grid-cols-2">
              {batch.prompts.map(card)}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
