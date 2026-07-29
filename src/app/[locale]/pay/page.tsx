import Link from "next/link";
import { redirect } from "next/navigation";
import { Bitcoin, Clock, Info } from "lucide-react";
import { getAccount } from "@/lib/account";
import { PERIODS, isPeriodId } from "@/lib/billing";
import { pageLocale } from "@/lib/i18n";
import PayButton from "@/components/PayButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await pageLocale(params);
  return { title: t.pay.eyebrow };
}

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const { period: raw } = await searchParams;
  const period = raw && isPeriodId(raw) ? PERIODS[raw] : PERIODS.monthly;

  // Счёт выставляется на конкретный аккаунт, поэтому без входа страница
  // бессмысленна — возвращаем сюда же после авторизации.
  const account = await getAccount();
  if (!account) {
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}/pay?period=${period.id}`)}`,
    );
  }

  const name = period.id === "yearly" ? t.pricing.yearName : t.pricing.proName;

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <div className="mx-auto max-w-md">
        <p className="eyebrow rise">{t.pay.eyebrow}</p>
        <h1 className="font-display rise rise-1 mt-4 text-[28px] text-ink md:text-[36px]">
          {name}
        </h1>

        <div className="rise rise-2 mt-7 rounded-card border border-violet/40 bg-surface p-7 shadow-[0_20px_60px_-40px_var(--glow)]">
          <div className="flex items-baseline gap-2">
            <span className="grad-text font-display text-[40px]">
              ${period.price}
            </span>
            <span className="text-[13px] text-faint">
              {period.id === "yearly" ? t.pricing.perYear : t.pricing.perMonth}
            </span>
          </div>

          <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
            {t.pay.accessFor} {period.days} {t.pay.days}
          </p>

          <div className="mt-6">
            <PayButton
              period={period.id}
              amount={period.price}
              payLabel={t.pay.payBtn}
              preparingLabel={t.pay.preparing}
              errInvoice={t.pay.errInvoice}
              errUnavailable={t.pay.errUnavailable}
            />
          </div>

          <div className="mt-4 flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-faint">
              <Bitcoin size={14} />
            </span>
            <p className="text-[12px] leading-relaxed text-faint">
              {t.pay.cryptoNote}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-card border border-line bg-sunken p-4">
          <span className="mt-0.5 shrink-0 text-faint">
            <Clock size={14} />
          </span>
          <p className="text-[12.5px] leading-relaxed text-muted">
            {t.pay.noRenew}
          </p>
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-card border border-line bg-sunken p-4">
          <span className="mt-0.5 shrink-0 text-faint">
            <Info size={14} />
          </span>
          <p className="text-[12.5px] leading-relaxed text-muted">
            {t.pay.supportPre}{" "}
            <a
              href="mailto:support@example.com"
              className="text-accent transition-opacity duration-200 hover:opacity-80"
            >
              support@example.com
            </a>{" "}
            {t.pay.supportPost}{" "}
            <span className="font-mono text-ink">{account.paymentCode}</span>,{" "}
            {t.pay.supportEnd}
          </p>
        </div>

        <p className="mt-8 text-center text-[13px] text-muted">
          <Link
            href={`/${locale}/pricing`}
            className="transition-colors duration-200 hover:text-accent"
          >
            {t.pay.backToPlans}
          </Link>
        </p>
      </div>
    </section>
  );
}
