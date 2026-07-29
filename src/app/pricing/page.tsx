import Link from "next/link";
import { Check, Lock, Minus } from "lucide-react";
import { PROMPTS } from "@/lib/prompts";
import { getAccount } from "@/lib/account";
import Reveal from "@/components/Reveal";

/*
  Страница зависит от вошедшего пользователя: избранное, тариф и замки на
  PRO-промтах у каждого свои. Без этой строки Next пытается отдать её из
  предсборки, и один посетитель увидел бы состояние другого.
*/
export const dynamic = "force-dynamic";

export const metadata = { title: "Тарифы" };

const proCount = PROMPTS.filter((p) => p.tier === "pro").length;
const freeCount = PROMPTS.length - proCount;

interface Plan {
  id: "free" | "pro";
  name: string;
  price: string;
  period: string;
  summary: string;
  features: { label: string; included: boolean }[];
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Бесплатный",
    price: "0 ₽",
    period: "навсегда",
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
    id: "pro",
    name: "PRO",
    price: "690 ₽",
    period: "в месяц",
    summary: "Весь каталог целиком и всё, что выйдет дальше.",
    features: [
      { label: `Все ${PROMPTS.length} промтов`, included: true },
      { label: "Примеры результата к каждому", included: true },
      { label: "Копирование в один клик", included: true },
      { label: "Избранное", included: true },
      { label: `${proCount} PRO-промтов`, included: true },
      { label: "Новые подборки каждый месяц", included: true },
      { label: "Поддержка в течение дня", included: true },
    ],
  },
];

export default async function PricingPage() {
  const account = await getAccount();
  const current = account?.plan ?? null;

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">Тарифы</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[44px]">
        Платите, только если <span className="grad-text">пригодилось</span>
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        Больше половины каталога открыто без оплаты и без ограничений по
        времени. PRO нужен, когда бесплатных промтов стало мало.
      </p>

      <div className="mt-12 grid items-start gap-4 md:grid-cols-2">
        {PLANS.map((plan, i) => {
          const active = current === plan.id;
          const isPro = plan.id === "pro";

          return (
            <Reveal key={plan.id} delay={i * 80}>
              <div
                className={`relative flex h-full flex-col rounded-card border p-7 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 ${
                  isPro
                    ? "border-violet/40 bg-surface shadow-[0_20px_60px_-40px_var(--glow)]"
                    : "border-line bg-surface hover:border-line-strong"
                }`}
              >
                {isPro && (
                  <span className="grad-fill absolute -top-2.5 right-6 rounded-chip px-2.5 py-1 font-mono text-[10px] tracking-[0.08em]">
                    ВЫГОДНО
                  </span>
                )}

                <div className="flex items-center gap-2.5">
                  <h2 className="text-[17px] font-semibold text-ink">
                    {plan.name}
                  </h2>
                  {active && (
                    <span className="rounded-chip border border-line-strong px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-muted">
                      ВАШ ТАРИФ
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className={`font-display text-[36px] ${isPro ? "grad-text" : "text-ink"}`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-[13px] text-faint">{plan.period}</span>
                </div>

                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                  {plan.summary}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
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
                  {active ? (
                    <div className="rounded-chip border border-line px-4 py-3 text-center text-[13.5px] text-muted">
                      Тариф уже подключён
                    </div>
                  ) : isPro ? (
                    /*
                      Оплата ещё не подключена. Живой кнопки здесь не будет,
                      пока она не начнёт списывать деньги: неработающая кнопка
                      «Оплатить» подрывает доверие сильнее, чем честная надпись.
                    */
                    <div className="rounded-chip border border-dashed border-line-strong px-4 py-3 text-center text-[13px] leading-relaxed text-muted">
                      Оплата скоро откроется. Напишите на{" "}
                      <a
                        href="mailto:support@example.com"
                        className="text-accent transition-opacity duration-200 hover:opacity-80"
                      >
                        support@example.com
                      </a>
                      , если нужен доступ прямо сейчас.
                    </div>
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

      <Reveal delay={160}>
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
    </section>
  );
}
