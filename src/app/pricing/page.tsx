import Link from "next/link";
import { Check, Lock, Minus } from "lucide-react";
import { PROMPTS } from "@/lib/prompts";
import { getAccount } from "@/lib/account";
import { PERIODS, YEARLY_PER_MONTH, YEARLY_SAVING } from "@/lib/billing";
import Reveal from "@/components/Reveal";

/*
  Страница зависит от вошедшего пользователя: у него отмечается текущий
  тариф. Без этой строки Next пытается отдать её из предсборки, и один
  посетитель увидел бы состояние другого.
*/
export const dynamic = "force-dynamic";

export const metadata = { title: "Тарифы" };

const proCount = PROMPTS.filter((p) => p.tier === "pro").length;
const freeCount = PROMPTS.length - proCount;

// Цены и сроки живут в одном месте — их же читают страница оплаты и
// обработчик активации.
const MONTHLY = PERIODS.monthly.price;
const YEARLY = PERIODS.yearly.price;

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  /** Какой доступ даёт: закрытые промты открывает только pro. */
  grants: "free" | "pro";
  summary: string;
  note?: string;
  highlight?: string;
  features: { label: string; included: boolean }[];
}

const PRO_FEATURES = [
  { label: `Все ${PROMPTS.length} промтов`, included: true },
  { label: "Примеры результата к каждому", included: true },
  { label: "Копирование в один клик", included: true },
  { label: "Избранное", included: true },
  { label: `${proCount} PRO-промтов`, included: true },
  { label: "Новые подборки каждый месяц", included: true },
  { label: "Поддержка в течение дня", included: true },
];

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Бесплатный",
    price: "$0",
    period: "навсегда",
    grants: "free",
    summary: "Чтобы попробовать и понять, подходит ли вам такой формат.",
    features: [
      { label: `${freeCount} промтов из каталога`, included: true },
      { label: "Примеры результата к каждому", included: true },
      { label: "Копирование в один клик", included: true },
      { label: "Избранное", included: true },
      { label: `${proCount} PRO-промтов`, included: false },
      { label: "Новые подборки каждый месяц", included: false },
      { label: "Поддержка в течение дня", included: false },
    ],
  },
  {
    id: "pro-monthly",
    name: "PRO",
    price: `$${MONTHLY}`,
    period: "в месяц",
    grants: "pro",
    summary: "Весь каталог целиком. Отменить можно в любой момент.",
    features: PRO_FEATURES,
  },
  {
    id: "pro-yearly",
    name: "PRO на год",
    price: `$${YEARLY}`,
    period: "в год",
    grants: "pro",
    summary: "То же самое, но дешевле почти вдвое.",
    note: `${YEARLY_PER_MONTH} $ в месяц при оплате сразу за год`,
    highlight: `−${YEARLY_SAVING}%`,
    features: PRO_FEATURES,
  },
];

export default async function PricingPage() {
  const account = await getAccount();
  const plan = account?.plan ?? null;

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">Тарифы</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[44px]">
        Платите, только если <span className="grad-text">пригодилось</span>
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {freeCount} промтов из {PROMPTS.length} открыты без оплаты и без
        ограничений по времени. PRO нужен, когда бесплатных стало мало.
      </p>

      <div className="mt-12 grid items-start gap-4 md:grid-cols-3">
        {PLANS.map((p, i) => {
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
                  <h2 className="text-[17px] font-semibold text-ink">
                    {p.name}
                  </h2>
                  {/*
                    У бесплатного отмечаем текущий тариф. У платных этого не
                    делаем: база хранит дату окончания доступа, но не то, за
                    какой срок платили, — отметка на обеих карточках врала бы.
                  */}
                  {owned && !isPro && (
                    <span className="rounded-chip border border-line-strong px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-muted">
                      ВАШ ТАРИФ
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
                      {isPro ? "Доступ уже открыт" : "Тариф уже подключён"}
                    </div>
                  ) : isPro ? (
                    <Link
                      href={`/pay?period=${p.id === "pro-yearly" ? "yearly" : "monthly"}`}
                      className="grad-fill block rounded-chip px-4 py-3 text-center text-[13.5px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98]"
                    >
                      Оплатить
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="block rounded-chip border border-line-strong px-4 py-3 text-center text-[13.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.98]"
                    >
                      Начать бесплатно
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
            PRO-промты в каталоге закрыты замком. Заголовок, описание и метки
            видны всем — так понятно, за что платить, ещё до оплаты. Сам текст
            промта на бесплатном тарифе в браузер не отправляется вовсе.
          </p>
        </div>
      </Reveal>

      <p className="mt-6 text-center text-[12px] text-faint">
        Цены указаны в долларах США. Списание произойдёт в валюте вашей карты по
        курсу банка.
      </p>
    </section>
  );
}
