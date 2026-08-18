import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PERIODS, COMMISSION_PERCENT, commissionOf } from "@/lib/billing";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/*
  Партнёрская программа на главной.

  Стоит после «Как это работает» и перед финальным призывом, и это не
  вопрос вкуса. Рекламировать сайт станет только тот, кто уже понял, что
  здесь есть: наверху страницы «зарабатывайте 30%» читается как схема
  заработка, и человек, пришедший за промтом, уходит. Досюда же доходит
  тот, кто посмотрел каталог, конструктор и примеры, — ему предложение
  говорит что-то настоящее.

  Обычная рамка, а не градиентная плашка. Финальный призыв ниже —
  сильнейшее место страницы, и две одинаковые панели подряд растащили бы
  внимание вместо того, чтобы усилить друг друга.

  Деньги названы суммой, а не одной долей. «30%» — это про арифметику,
  «$2,40 с месячного доступа» — про то, что человек получит. Считаются
  они из тех же цен и той же ставки, что и начисление в базе: разъехаться
  цифре на главной и цифре в кошельке негде.
*/

export default function PartnerPromo({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const money = (value: number) => `$${value.toFixed(2).replace(/\.00$/, "")}`;

  const rates = [
    {
      value: money(commissionOf(PERIODS.monthly.price)),
      label: t.home.partnerMonthly,
    },
    {
      value: money(commissionOf(PERIODS.yearly.price)),
      label: t.home.partnerYearly,
    },
  ];

  const steps = [
    t.home.partnerStep1,
    t.home.partnerStep2,
    t.home.partnerStep3,
  ];

  return (
    <section className="pb-20">
      <Reveal>
        <div className="rounded-card border border-line bg-surface px-6 py-8 md:px-9 md:py-10">
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <h2 className="font-display text-balance text-[24px] leading-snug text-ink md:text-[30px]">
                {t.home.partnerTitle}
              </h2>
              <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-muted">
                {t.home.partnerText.replace(
                  "{percent}",
                  String(COMMISSION_PERCENT),
                )}
              </p>

              {/* Нумерованный список: три шага — это порядок, а не набор. */}
              <ol className="mt-6 space-y-2.5">
                {steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[11px] text-accent">
                      {i + 1}
                    </span>
                    <span className="min-w-0 text-[13.5px] leading-relaxed text-muted">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="min-w-0">
              {/* Две суммы рядом и на телефоне: в одну колонку они
                  растянули бы блок на лишний экран прокрутки. */}
              <div className="grid grid-cols-2 gap-3">
                {rates.map((rate) => (
                  <div
                    key={rate.label}
                    className="min-w-0 rounded-card border border-line bg-sunken px-4 py-4"
                  >
                    <div className="font-display text-[26px] leading-none text-ink">
                      {rate.value}
                    </div>
                    <div className="mt-2 text-[12px] leading-snug text-muted">
                      {rate.label}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={`/${locale}/partner`}
                className="grad-fill group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-chip px-5 py-3 text-[14px] font-semibold shadow-[0_10px_30px_-12px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                {t.home.partnerCta}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <p className="mt-2.5 text-center text-[12px] leading-relaxed text-faint">
                {t.home.partnerNote}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
