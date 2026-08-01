import Link from "next/link";
import { BadgeDollarSign, Link2, TrendingUp, Wallet } from "lucide-react";
import { PERIODS, COMMISSION_PERCENT, commissionOf } from "@/lib/billing";
import { SUPPORT_MAILTO } from "@/lib/contact";
import { getPartnerStats } from "@/lib/partner";
import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import CopyLink from "@/components/CopyLink";
import Reveal from "@/components/Reveal";

/*
  Партнёрская программа.

  Страница зависит от вошедшего: у каждого своя ссылка и свой заработок.
  Отдавать её из предсборки нельзя — один партнёр увидел бы чужие цифры.
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
    path: "/partner",
    title: t.partner.eyebrow,
    description: t.partner.subtitle,
  });
}

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const stats = await getPartnerStats(locale);

  const title = t.partner.title.replace("{percent}", String(COMMISSION_PERCENT));
  const step3 = t.partner.step3.replace("{percent}", String(COMMISSION_PERCENT));

  const money = (value: number) =>
    `$${value.toFixed(2).replace(/\.00$/, "")}`;

  const cards = stats
    ? [
        { icon: TrendingUp, label: t.partner.statSales, value: String(stats.sales) },
        { icon: BadgeDollarSign, label: t.partner.statEarned, value: money(stats.earned) },
        { icon: Wallet, label: t.partner.statPending, value: money(stats.pending) },
        { icon: Link2, label: t.partner.statPaid, value: money(stats.paidOut) },
      ]
    : [];

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{t.partner.eyebrow}</p>
      <h1 className="font-display rise rise-1 mt-4 max-w-3xl text-[30px] leading-tight text-ink md:text-[44px]">
        {title}
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {t.partner.subtitle}
      </p>

      {stats ? (
        <>
          <Reveal>
            <div className="mt-10 rounded-card border border-violet/40 bg-surface p-6 shadow-[0_20px_60px_-40px_var(--glow)]">
              <span className="flex items-center gap-2.5 text-[12.5px] text-muted">
                <Link2 size={14} className="text-accent" />
                {t.partner.yourLink}
              </span>
              <div className="mt-4">
                <CopyLink
                  link={stats.link}
                  copyLabel={t.partner.copy}
                  copiedLabel={t.partner.copied}
                />
              </div>
            </div>
          </Reveal>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-card border border-line bg-surface p-4"
              >
                <span className="flex items-center gap-2 text-[12px] text-muted">
                  <card.icon size={13} className="text-accent" />
                  {card.label}
                </span>
                <div className="mt-2 font-mono text-[22px] text-ink">
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {stats.sales === 0 && (
            <p className="mt-4 text-[13px] leading-relaxed text-faint">
              {t.partner.empty}
            </p>
          )}
        </>
      ) : (
        /* Гостю показываем условия целиком, а вместо статистики — вход. */
        <Reveal>
          <div className="mt-10 flex max-w-2xl flex-col gap-4 rounded-card border border-violet/40 bg-surface p-6 shadow-[0_20px_60px_-40px_var(--glow)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[14.5px] font-semibold text-ink">
                {t.partner.guestTitle}
              </div>
              <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">
                {t.partner.guestText}
              </p>
            </div>
            <Link
              href={`/${locale}/login?next=${encodeURIComponent(`/${locale}/partner`)}`}
              className="grad-fill shrink-0 rounded-chip px-5 py-2.5 text-center text-[13.5px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              {t.partner.guestCta}
            </Link>
          </div>
        </Reveal>
      )}

      {/* Сколько это в деньгах — числа считаются из тарифов, не вписаны руками. */}
      <Reveal delay={60}>
        <div className="mt-14">
          <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">
            {t.partner.ratesTitle}
          </h2>
          <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-2">
            {(["monthly", "yearly"] as const).map((period) => (
              <div
                key={period}
                className="rounded-card border border-line bg-surface p-5"
              >
                <div className="font-mono text-[26px] text-ink">
                  ${commissionOf(PERIODS[period].price).toFixed(2)}
                </div>
                <p className="mt-1.5 text-[13px] text-muted">
                  {period === "monthly"
                    ? t.partner.perMonthly
                    : t.partner.perYearly}{" "}
                  <span className="text-faint">
                    (${PERIODS[period].price})
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-12 max-w-2xl">
          <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">
            {t.partner.howTitle}
          </h2>
          <ol className="mt-5 space-y-3.5">
            {[t.partner.step1, t.partner.step2, step3, t.partner.step4].map(
              (step, i) => (
                <li key={step} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong bg-sunken font-mono text-[11px] text-accent">
                    {i + 1}
                  </span>
                  <span className="text-[14px] leading-relaxed text-muted">
                    {step}
                  </span>
                </li>
              ),
            )}
          </ol>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div className="mt-12 max-w-2xl">
          <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">
            {t.partner.rulesTitle}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {t.partner.rules.map((rule) => (
              <li
                key={rule}
                className="relative pl-5 text-[14px] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-violet"
              >
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={180}>
        <div className="mt-12 flex max-w-2xl flex-col items-start gap-4 rounded-card border border-line bg-sunken p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[14.5px] font-semibold text-ink">
              {t.partner.payoutTitle}
            </div>
            <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">
              {t.partner.payoutText}
            </p>
          </div>
          <Link
            href={SUPPORT_MAILTO}
            className="shrink-0 rounded-chip border border-line-strong px-5 py-2.5 text-center text-[13.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.97]"
          >
            {t.partner.payoutCta}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
