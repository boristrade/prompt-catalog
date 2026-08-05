import Link from "next/link";
import { Instagram, Mail, Send, Youtube } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { LogoMark, LogoWord } from "@/components/layout/Logo";
import { SUPPORT_EMAIL, activeSocials, type SocialKey } from "@/lib/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* Значок и подпись для каждой сети. Сами адреса — в lib/contact.ts. */
const SOCIAL_ICONS: Record<SocialKey, { label: string; Icon: typeof Send }> = {
  telegram: { label: "Telegram", Icon: Send },
  youtube: { label: "YouTube", Icon: Youtube },
  instagram: { label: "Instagram", Icon: Instagram },
};

export default function Footer({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const support = [
    { label: t.guides.nav, href: `/${locale}/guides` },
    { label: t.skills.nav, href: `/${locale}/skills` },
    { label: t.footer.pricing, href: `/${locale}/pricing` },
    { label: t.footer.account, href: `/${locale}/account` },
    { label: t.partner.nav, href: `/${locale}/partner` },
    { label: t.footer.faq, href: `/${locale}/faq` },
    { label: t.footer.feedback, href: `/${locale}/contact` },
  ];

  const socials = activeSocials();

  const legal = [
    { label: t.footer.privacy, href: `/${locale}/legal/privacy` },
    { label: t.footer.terms, href: `/${locale}/legal/terms` },
    { label: t.footer.agreement, href: `/${locale}/legal/agreement` },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-sunken">
      <div className="mx-auto max-w-[1120px] px-5 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-4">
          {/* Бренд */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <LogoMark className="h-8 w-8 shrink-0" />
              <LogoWord className="text-[17px]" />
            </div>
            <p className="mt-3.5 max-w-[32ch] text-[13.5px] leading-relaxed text-muted">
              {t.footer.tagline}
            </p>

            {/*
              Почта поддержки прямо в подвале: её ищут именно здесь, а
              до этого она жила только на отдельной странице.

              Ведём на страницу обратной связи, а не в mailto. mailto
              срабатывает, только если в системе назначен почтовый клиент;
              с телефона, где почтой пользуются через сайт, и внутри
              встроенных браузеров нажатие не делает ничего — человек
              решает, что связаться не с кем. На странице адрес показан
              текстом, который можно скопировать.

              break-all для адреса: на 360px длинная почта иначе
              распирает колонку и уводит страницу вбок.
            */}
            <Link
              href={`/${locale}/contact`}
              className="group mt-4 flex items-start gap-2 text-[13.5px] text-muted transition-colors duration-200 hover:text-accent"
            >
              <Mail
                size={15}
                className="mt-0.5 shrink-0 text-accent"
                aria-hidden
              />
              <span className="min-w-0 break-all">{SUPPORT_EMAIL}</span>
            </Link>

            {/*
              Значки соцсетей — здесь, а не отдельной колонкой: их два-три
              штуки, и колонка ради трёх значков смотрелась пустой. Пока
              ни одного адреса не задано, блока нет вовсе.
            */}
            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-2.5">
                {socials.map(({ key, href }) => {
                  const { label, Icon } = SOCIAL_ICONS[key];
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-chip border border-line bg-surface text-muted transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-violet hover:text-accent"
                    >
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            )}
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
        </div>

        <div className="mt-12 border-t border-line pt-6 text-center text-[12.5px] text-faint">
          © {new Date().getFullYear()} PrompTom. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
