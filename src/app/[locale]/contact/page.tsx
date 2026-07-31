import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_MAILTO, contactCopy } from "@/lib/contact";
import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import CopyEmail from "@/components/CopyEmail";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await pageLocale(params);
  const c = contactCopy(locale);
  return pageMeta({
    locale,
    path: "/contact",
    title: c.title,
    description: `${c.intro} ${SUPPORT_EMAIL}`,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await pageLocale(params);
  const c = contactCopy(locale);

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{c.eyebrow}</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[44px]">
        {c.title}
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {c.intro}
      </p>

      <Reveal>
        <div className="mt-10 max-w-2xl rounded-card border border-violet/40 bg-surface p-6 shadow-[0_20px_60px_-40px_var(--glow)]">
          <span className="flex items-center gap-2.5 text-[12.5px] text-muted">
            <Mail size={14} className="text-accent" />
            {c.emailLabel}
          </span>

          <div className="mt-4">
            <CopyEmail
              email={SUPPORT_EMAIL}
              copyLabel={c.copy}
              copiedLabel={c.copied}
            />
          </div>

          {/*
            Кнопка письма — под адресом, а не вместо него: mailto молчит,
            если почтового клиента по умолчанию нет, и без видимого адреса
            это был бы тупик.
          */}
          <Link
            href={SUPPORT_MAILTO}
            className="grad-fill mt-5 block rounded-chip py-3 text-center text-[13.5px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
          >
            {c.write}
          </Link>

          <p className="mt-4 text-[12.5px] leading-relaxed text-faint">
            {c.reply}
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 max-w-2xl">
          <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
            {c.includeTitle}
          </h2>
          <ul className="mt-3.5 space-y-2.5">
            {c.include.map((line) => (
              <li
                key={line}
                className="relative pl-5 text-[14px] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-violet"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div className="mt-10 flex max-w-2xl flex-wrap items-center gap-2 rounded-card border border-line bg-sunken px-5 py-4 text-[13.5px] text-muted">
          {c.faqNote}
          <Link
            href={`/${locale}/faq`}
            className="inline-flex items-center gap-1.5 font-medium text-accent transition-opacity duration-200 hover:opacity-80"
          >
            {c.faqLink}
            <ArrowRight size={13} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
