import Link from "next/link";
import { ChevronDown, Mail } from "lucide-react";
import { faqFor } from "@/lib/faq";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/contact";
import { LOCALES } from "@/lib/i18n/config";
import { localeAlternates, pageLocale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const items = faqFor(locale);
  return {
    title: t.footer.faq,
    // Первый вопрос как описание: он же и самый частый.
    description: items[0]?.q,
    alternates: localeAlternates(locale, "/faq"),
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const items = faqFor(locale);

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{t.footer.support}</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[44px]">
        {t.footer.faq}
      </h1>

      {/*
        Первый вопрос открыт: пустой список из одних заголовков выглядит
        так, будто страница не догрузилась.
      */}
      <div className="mt-10 max-w-3xl space-y-2.5">
        {items.map((item, i) => (
          <Reveal key={item.q} delay={Math.min(i, 6) * 40}>
            <details
              open={i === 0}
              className="group rounded-card border border-line bg-surface px-5 py-4 transition-[border-color] duration-200 hover:border-line-strong"
            >
              <summary className="flex cursor-pointer select-none items-start justify-between gap-4 text-[15px] font-medium leading-snug text-ink">
                {item.q}
                <ChevronDown
                  size={16}
                  className="mt-0.5 shrink-0 text-faint transition-transform duration-300 ease-out group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                {item.a}
              </p>
            </details>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-12 flex max-w-3xl flex-col items-start gap-4 rounded-card border border-line bg-sunken p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent">
              <Mail size={16} />
            </span>
            <p className="text-[13.5px] leading-relaxed text-muted">
              {t.footer.feedback}: {SUPPORT_EMAIL}
            </p>
          </div>
          <Link
            href={SUPPORT_MAILTO}
            className="grad-fill shrink-0 rounded-chip px-4 py-2.5 text-[13px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
          >
            {t.footer.feedback}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
