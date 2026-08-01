import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeDollarSign, TrendingUp, Users, Wallet } from "lucide-react";
import { currentAdmin } from "@/lib/admin";
import { listPartners } from "@/lib/admin-data";
import { markPaidOut } from "@/lib/admin-actions";
import { COMMISSION_PERCENT } from "@/lib/billing";
import { pageLocale } from "@/lib/i18n";

/*
  Партнёры и выплаты.

  Отдельной страницей, а не блоком в общей админке: списки живут своей
  жизнью — в одном разбирают доступы, в другом деньги, и мешать их в одну
  простыню значит каждый раз пролистывать чужое.
*/
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  // Заголовок только своему: Next считает метаданные и для notFound(),
  // и по нему посторонний узнал бы, что адрес рабочий.
  const admin = await currentAdmin();
  return {
    title: admin ? "Партнёры" : undefined,
    robots: { index: false, follow: false },
  };
}

export default async function AdminPartnersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ msg?: string }>;
}) {
  const { locale } = await pageLocale(params);

  const admin = await currentAdmin();
  if (!admin) notFound();

  const sp = await searchParams;
  const partners = await listPartners();

  const money = (value: number) => `$${value.toFixed(2)}`;
  const totalEarned = partners.reduce((sum, p) => sum + p.earned, 0);
  const totalPending = partners.reduce((sum, p) => sum + p.pending, 0);
  const totalSales = partners.reduce((sum, p) => sum + p.sales, 0);

  const cards = [
    { icon: Users, label: "Партнёров", value: String(partners.length) },
    { icon: TrendingUp, label: "Продаж по ссылкам", value: String(totalSales) },
    { icon: BadgeDollarSign, label: "Начислено всего", value: money(totalEarned) },
    { icon: Wallet, label: "К выплате", value: money(totalPending) },
  ];

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <Link
        href={`/${locale}/admin`}
        className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors duration-200 hover:text-ink"
      >
        <ArrowLeft size={14} />
        Пользователи
      </Link>

      <h1 className="font-display mt-6 text-[30px] text-ink md:text-[40px]">
        Партнёры
      </h1>
      <p className="mt-3 text-[13.5px] text-muted">
        Ставка {COMMISSION_PERCENT}% с каждой оплаты. Выплаты вручную —
        отметьте после перевода.
      </p>

      {sp.msg && (
        <div className="mt-6 rounded-card border border-violet/40 bg-surface px-5 py-3.5 text-[13.5px] text-ink">
          {sp.msg}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
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

      <div className="mt-6 space-y-3">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className={`rounded-card border bg-surface p-5 ${
              partner.pending > 0 ? "border-violet/35" : "border-line"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-ink">
                  {partner.email || "— без почты —"}
                </div>
                <div className="mt-1 text-[12.5px] text-muted">
                  {partner.sales} продаж · начислено {money(partner.earned)}
                </div>
                <div className="mt-2 font-mono text-[11.5px] tracking-[0.08em] text-faint">
                  {partner.code || "код не выдан"}
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-chip border px-3 py-1.5 font-mono text-[12px] ${
                  partner.pending > 0
                    ? "border-accent/40 text-accent"
                    : "border-line-strong text-muted"
                }`}
              >
                <Wallet size={12} />
                {money(partner.pending)}
              </span>
            </div>

            {partner.pending > 0 && (
              <div className="mt-4 border-t border-line pt-4">
                <form action={markPaidOut}>
                  <input type="hidden" name="id" value={partner.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="section" value="partners" />
                  <button
                    type="submit"
                    className="rounded-chip border border-line-strong px-3.5 py-2 text-[12.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.97]"
                  >
                    Отметить выплаченным
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}

        {partners.length === 0 && (
          <div className="rounded-card border border-dashed border-line-strong bg-surface p-10 text-center text-[13.5px] text-muted">
            Продаж по партнёрским ссылкам пока не было.
          </div>
        )}
      </div>
    </section>
  );
}
