import Link from "next/link";
import { Instagram, Send, Youtube } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const SOCIALS = [
  { href: "https://t.me", label: "Telegram", Icon: Send },
  { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
];

export default function Footer({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const support = [
    { label: t.footer.pricing, href: `/${locale}/pricing` },
    { label: t.footer.account, href: `/${locale}/account` },
    { label: t.footer.faq, href: `/${locale}/tools` },
    { label: t.footer.feedback, href: "mailto:support@example.com" },
  ];

  const legal = [
    { label: t.footer.privacy, href: `/${locale}/login` },
    { label: t.footer.terms, href: `/${locale}/login` },
    { label: t.footer.agreement, href: `/${locale}/login` },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-sunken">
      <div className="mx-auto max-w-[1120px] px-5 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
          {/* Бренд */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grad-fill flex h-7 w-7 items-center justify-center rounded-[7px] text-[14px] font-bold">
                P
              </span>
              <span className="text-[17px] font-bold tracking-[-0.02em] text-ink">
                PrompTom
              </span>
            </div>
            <p className="mt-3.5 max-w-[32ch] text-[13.5px] leading-relaxed text-muted">
              {t.footer.tagline}
            </p>
          </div>

          {/* Навигация */}
          <div>
            <div className="text-[13px] font-semibold text-ink">
              {t.footer.catalog}
            </div>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${locale}/prompts/${c.slug}`}
                    className="text-[13.5px] text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {t.categories[c.slug].nav}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <div className="text-[13px] font-semibold text-ink">
              {t.footer.support}
            </div>
            <ul className="mt-4 space-y-2.5">
              {support.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="text-[13.5px] text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Правовая информация */}
          <div>
            <div className="text-[13px] font-semibold text-ink">
              {t.footer.legal}
            </div>
            <ul className="mt-4 space-y-2.5">
              {legal.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] leading-snug text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Соцсети */}
          <div>
            <div className="text-[13px] font-semibold text-ink">
              {t.footer.follow}
            </div>
            <div className="mt-4 flex items-center gap-2.5">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-chip border border-line bg-surface text-muted transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-violet hover:text-accent"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-center text-[12.5px] text-faint">
          © {new Date().getFullYear()} PrompTom. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
