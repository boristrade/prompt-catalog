import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Clock, Info } from "lucide-react";
import { getAccount } from "@/lib/account";
import { DONATELLO_URL, PERIODS, isPeriodId } from "@/lib/billing";
import CopyCode from "@/components/CopyCode";

export const dynamic = "force-dynamic";

export const metadata = { title: "Оплата" };

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: raw } = await searchParams;
  const period = raw && isPeriodId(raw) ? PERIODS[raw] : PERIODS.monthly;

  const account = await getAccount();
  // Код платежа привязан к аккаунту, поэтому без входа страница бессмысленна.
  if (!account) redirect(`/login?next=${encodeURIComponent(`/pay?period=${period.id}`)}`);

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <div className="mx-auto max-w-lg">
        <p className="eyebrow rise">Оплата</p>
        <h1 className="font-display rise rise-1 mt-4 text-[28px] text-ink md:text-[36px]">
          {period.name} — <span className="grad-text">${period.price}</span>
        </h1>
        <p className="rise rise-2 mt-3 text-[14px] leading-relaxed text-muted">
          Доступ откроется на {period.days} дней с момента зачисления.
        </p>

        <ol className="rise rise-3 mt-9 space-y-5">
          <li className="flex gap-4">
            <span className="grad-fill flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold">
              1
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14.5px] font-medium text-ink">
                Скопируйте свой код
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                Он привязан к вашему аккаунту — по нему мы поймём, кому
                открывать доступ.
              </p>
              <div className="mt-3">
                <CopyCode code={account.paymentCode ?? ""} />
              </div>
            </div>
          </li>

          <li className="flex gap-4">
            <span className="grad-fill flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold">
              2
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14.5px] font-medium text-ink">
                Переведите ${period.price} и вставьте код в комментарий
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                Поле комментария к платежу — единственное обязательное. Без
                кода платёж не привяжется к аккаунту.
              </p>
              <a
                href={DONATELLO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="grad-fill mt-3 inline-flex items-center gap-2 rounded-chip px-5 py-2.5 text-[13.5px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                Перейти к оплате
                <ArrowUpRight size={15} />
              </a>
            </div>
          </li>

          <li className="flex gap-4">
            <span className="grad-fill flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold">
              3
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14.5px] font-medium text-ink">
                Вернитесь в кабинет
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                Доступ откроется автоматически. Обычно это занимает несколько
                минут.
              </p>
              <Link
                href="/account"
                className="mt-3 inline-block rounded-chip border border-line-strong px-4 py-2 text-[13px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.97]"
              >
                В кабинет
              </Link>
            </div>
          </li>
        </ol>

        <div className="mt-10 flex items-start gap-3 rounded-card border border-line bg-sunken p-4">
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
            Забыли указать код или доступ не открылся за час — напишите на{" "}
            <a
              href="mailto:support@example.com"
              className="text-accent transition-opacity duration-200 hover:opacity-80"
            >
              support@example.com
            </a>
            , откроем вручную.
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
