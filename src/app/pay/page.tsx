import Link from "next/link";
import { redirect } from "next/navigation";
import { Bitcoin, Clock, Info } from "lucide-react";
import { getAccount } from "@/lib/account";
import { PERIODS, isPeriodId } from "@/lib/billing";
import PayButton from "@/components/PayButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Оплата" };

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: raw } = await searchParams;
  const period = raw && isPeriodId(raw) ? PERIODS[raw] : PERIODS.monthly;

  // Счёт выставляется на конкретный аккаунт, поэтому без входа страница
  // бессмысленна — возвращаем сюда же после авторизации.
  const account = await getAccount();
  if (!account) {
    redirect(`/login?next=${encodeURIComponent(`/pay?period=${period.id}`)}`);
  }

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <div className="mx-auto max-w-md">
        <p className="eyebrow rise">Оплата</p>
        <h1 className="font-display rise rise-1 mt-4 text-[28px] text-ink md:text-[36px]">
          {period.name}
        </h1>

        <div className="rise rise-2 mt-7 rounded-card border border-violet/40 bg-surface p-7 shadow-[0_20px_60px_-40px_var(--glow)]">
          <div className="flex items-baseline gap-2">
            <span className="grad-text font-display text-[40px]">
              ${period.price}
            </span>
            <span className="text-[13px] text-faint">{period.period}</span>
          </div>

          <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
            Доступ ко всему каталогу на {period.days} дней. Откроется сразу
            после подтверждения оплаты.
          </p>

          <div className="mt-6">
            <PayButton period={period.id} amount={period.price} />
          </div>

          <div className="mt-4 flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-faint">
              <Bitcoin size={14} />
            </span>
            <p className="text-[12px] leading-relaxed text-faint">
              Оплата криптовалютой через NOWPayments. Поддерживаются USDT, BTC,
              ETH и ещё три сотни монет — выберете на следующем шаге.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-card border border-line bg-sunken p-4">
          <span className="mt-0.5 shrink-0 text-faint">
            <Clock size={14} />
          </span>
          <p className="text-[12.5px] leading-relaxed text-muted">
            Подписка не продлевается сама — деньги повторно не спишутся. Когда
            срок подойдёт к концу, продлите тем же способом.
          </p>
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-card border border-line bg-sunken p-4">
          <span className="mt-0.5 shrink-0 text-faint">
            <Info size={14} />
          </span>
          <p className="text-[12.5px] leading-relaxed text-muted">
            Оплатили, а доступ не открылся за полчаса — напишите на{" "}
            <a
              href="mailto:support@example.com"
              className="text-accent transition-opacity duration-200 hover:opacity-80"
            >
              support@example.com
            </a>{" "}
            и укажите код{" "}
            <span className="font-mono text-ink">{account.paymentCode}</span>,
            откроем вручную.
          </p>
        </div>

        <p className="mt-8 text-center text-[13px] text-muted">
          <Link
            href="/pricing"
            className="transition-colors duration-200 hover:text-accent"
          >
            Вернуться к тарифам
          </Link>
        </p>
      </div>
    </section>
  );
}
