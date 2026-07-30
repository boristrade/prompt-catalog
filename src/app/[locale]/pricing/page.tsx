import Link from "next/link";
import { Check, Lock, Minus } from "lucide-react";
import { PROMPTS } from "@/lib/prompts";
import { getAccount } from "@/lib/account";
import { PERIODS, YEARLY_PER_MONTH, YEARLY_SAVING } from "@/lib/billing";
import { localeAlternates, pageLocale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

/*
  Страница зависит от вошедшего пользователя: у него отмечается текущий
  тариф. Без этой строки Next пытается отдать её из предсборки, и один
  посетитель увидел бы состояние другого.
*/
export const dynamic = "force-dynamic";

const proCount = PROMPTS.filter((p) => p.tier === "pro").length;
const freeCount = PROMPTS.length - proCount;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  return {
    title: t.pricing.eyebrow,
    description: `${freeCount} ${t.pricing.subtitle1} ${PROMPTS.length} ${t.pricing.subtitle2}`,
    alternates: localeAlternates(locale, "/pricing"),
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const account = await getAccount();
  const plan = account?.plan ?? null;

  const proFeatures = [
    { label: `${t.pricing.featAll} ${PROMPTS.length} ${t.pricing.featPromptsWord}`, included: true },
    { label: t.pricing.featExamples, included: true },
    { label: t.pricing.featCopy, included: true },
    { label: t.pricing.featFavorites, included: true },
    { label: `${proCount} ${t.pricing.featPro}`, included: true },
    { label: t.pricing.featMonthly, included: true },
    { label: t.pricing.featSupport, included: true },
  ];

  const plans = [
    {
      id: "free",
      name: t.pricing.freeName,
      price: "$0",
      period: t.pricing.forever,
      grants: "free" as const,
      summary: t.pricing.freeSummary,
      note: undefined as string | undefined,
      highlight: undefined as string | undefined,
      features: [
        { label: `${freeCount} ${t.pricing.featFromCatalog}`, included: true },
        { label: t.pricing.featExamples, included: true },
        { label: t.pricing.featCopy, included: true },
        { label: t.pricing.featFavorites, included: true },
        { label: `${proCount} ${t.pricing.featPro}`, included: false },
        { label: t.pricing.featMonthly, included: false },
        { label: t.pricing.featSupport, included: false },
      ],
    },
    {
      id: "pro-monthly",
      name: t.pricing.proName,
      price: `$${PERIODS.monthly.price}`,
      period: t.pricing.perMonth,
      grants: "pro" as const,
      summary: t.pricing.proSummary,
      note: undefined,
      highlight: undefined,
      features: proFeatures,
    },
    {
      id: "pro-yearly",
      name: t.pricing.yearName,
      price: `$${PERIODS.yearly.price}`,
      period: t.pricing.perYear,
      grants: "pro" as const,
      summary: t.pricing.yearSummary,
      note: `${YEARLY_PER_MONTH} ${t.pricing.perMonthYear}`,
      highlight: `−${YEARLY_SAVING}%`,
      features: proFeatures,
    },
  ];

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{t.pricing.eyebrow}</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[44px]">
        {t.pricing.titleMain}{" "}
        <span className="grad-text">{t.pricing.titleAccent}</span>
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {freeCount} {t.pricing.subtitle1} {PROMPTS.length} {t.pricing.subtitle2}
      </p>

      <div className="mt-12 grid items-start gap-4 md:grid-cols-3">
        {plans.map((p, i) => {
          const isPro = p.grants === "pro";
          const owned = plan === p.grants;
          const featured = p.id === "pro-yearly";

          return (
            <Reveal key={p.id} delay={i * 70}>
              <div
                className={`relative flex h-full flex-col rounded-card border p-7 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 ${
                  featured
                    ? "border-violet/50 bg-surface shadow-[0_20px_60px_-40px_var(--glow)]"
                    : "border-line bg-surface hover:border-line-strong"
                }`}
              >
                {p.highlight && (
                  <span className="grad-fill absolute -top-2.5 right-6 rounded-chip px-2.5 py-1 font-mono text-[10px] tracking-[0.08em]">
                    {p.highlight}
                  </span>
                )}

                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-[17px] font-semibold text-ink">{p.name}</h2>
                  {/*
                    У бесплатного отмечаем текущий тариф. У платных этого не
                    делаем: база хранит дату окончания доступа, но не то, за
                    какой срок платили, — отметка на обеих карточках врала бы.
                  */}
                  {owned && !isPro && (
                    <span className="rounded-chip border border-line-strong px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-muted">
                      {t.pricing.yourPlan}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className={`font-display text-[36px] ${featured ? "grad-text" : "text-ink"}`}
                  >
                    {p.price}
                  </span>
                  <span className="text-[13px] text-faint">{p.period}</span>
                </div>

                {p.note && (
                  <p className="mt-1.5 font-mono text-[11.5px] text-accent">
                    {p.note}
                  </p>
                )}

                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                  {p.summary}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li
                      key={f.label}
                      className={`flex items-start gap-2.5 text-[13.5px] leading-relaxed ${
                        f.included ? "text-ink" : "text-faint"
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        {f.included ? (
                          <Check size={14} className="text-accent" />
                        ) : (
                          <Minus size={14} />
                        )}
                      </span>
                      {f.label}
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  {owned ? (
                    <div className="rounded-chip border border-line px-4 py-3 text-center text-[13.5px] text-muted">
                      {isPro ? t.pricing.accessOpen : t.pricing.planActive}
                    </div>
                  ) : isPro ? (
                    <Link
                      href={`/${locale}/pay?period=${p.id === "pro-yearly" ? "yearly" : "monthly"}`}
                      className="grad-fill block rounded-chip px-4 py-3 text-center text-[13.5px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98]"
                    >
                      {t.pricing.pay}
                    </Link>
                  ) : (
                    <Link
                      href={`/${locale}/login`}
                      className="block rounded-chip border border-line-strong px-4 py-3 text-center text-[13.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.98]"
                    >
                      {t.pricing.startFree}
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={210}>
        <div className="mt-12 flex items-start gap-3.5 rounded-card border border-line bg-sunken p-5">
          <span className="mt-0.5 shrink-0 text-faint">
            <Lock size={15} />
          </span>
          <p className="text-[13px] leading-relaxed text-muted">
            {t.pricing.lockNote}
          </p>
        </div>
      </Reveal>

      <p className="mt-6 text-center text-[12px] text-faint">
        {t.pricing.currencyNote}
      </p>
    </section>
  );
}
