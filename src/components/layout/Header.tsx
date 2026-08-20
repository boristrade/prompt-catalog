"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UserMenu, { type SessionUser } from "@/components/layout/UserMenu";
import Logo from "@/components/layout/Logo";

export default function Header({
  user,
  locale,
  t,
}: {
  user: SessionUser | null;
  locale: Locale;
  t: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /*
    wide — показывать ли пункт в строке наверху широкого экрана.

    В строку помещается около пяти пунктов, а их десять: на русском и
    украинском ряд перестаёт влезать уже на 1024px и выталкивает кнопки
    входа за край экрана — вместе с горизонтальной прокруткой на всех
    страницах сразу. Поэтому наверху остаётся то, ради чего на сайт
    приходят, а остальное живёт в подвале и в меню под аватаром.

    Мест ровно пять, и новый пункт наверху означает, что оттуда уходит
    другой. Проверять надо на украинском при 1024px: там слова длиннее
    всего, и ряд ломается первым.

    В меню телефона по-прежнему попадают все десять: там список
    вертикальный и в длине не ограничен, а терять пункт из-за нехватки
    места на чужом экране — это ровно та ошибка, из-за которой на
    телефоне однажды пропала админка.
  */
  const supportItems = [
    { href: `/${locale}/guides`, label: t.guides.nav, wide: true },
    { href: `/${locale}/skills`, label: t.skills.nav, wide: true },
    { href: `/${locale}/carousel`, label: t.carousel.nav, wide: true },
    // Пополнения каталога. Наверху места нет — ряд и так на пределе; в
    // меню телефона и в подвале ссылка есть, как у остальных разделов.
    { href: `/${locale}/new`, label: t.whatsNew.nav, wide: false },
    { href: `/${locale}/pricing`, label: t.footer.pricing, wide: true },
    // Кабинет и избранное открыты только вошедшему — у него они есть в
    // меню под аватаром, а гостю показывать их наверху незачем.
    { href: `/${locale}/account`, label: t.footer.account, wide: false },
    {
      href: `/${locale}/account#favorites`,
      label: t.account.favorites,
      wide: false,
    },
    // Партнёрская уступила место каруселям: мест в ряду пять, а не шесть.
    // Заработок интересен тем, кто уже пользуется сайтом, — они дойдут до
    // неё из подвала; карусели ищут с первого захода.
    { href: `/${locale}/partner`, label: t.partner.nav, wide: false },
    // Вопросы и обратная связь есть в подвале на каждой странице.
    { href: `/${locale}/faq`, label: t.footer.faq, wide: false },
    // Страница, а не mailto: в меню ссылка должна открывать что-то
    // видимое. mailto молчит, если почтового клиента по умолчанию нет.
    { href: `/${locale}/contact`, label: t.footer.feedback, wide: false },
  ];

  const nav = [
    { href: `/${locale}`, label: t.nav.home, full: t.nav.home, wide: true },
    ...supportItems.map((item) => ({ ...item, full: item.label })),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-5 md:px-8">
        <Logo locale={locale} />

        <nav className="hidden items-center gap-1 lg:flex">
          {nav
            .filter((item) => item.wide)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-chip px-2.5 py-1.5 text-[13.5px] transition-colors duration-200 ${
                  pathname === item.href
                    ? "text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher locale={locale} label={t.header.language} />
          <ThemeToggle toLight={t.header.toLight} toDark={t.header.toDark} />
          {user ? (
            <UserMenu user={user} locale={locale} t={t} />
          ) : (
            <>
              <Link
                href={`/${locale}/login`}
                className="rounded-chip border border-line-strong px-4 py-2 text-[13px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.97]"
              >
                {t.header.signIn}
              </Link>
              <Link
                href={`/${locale}/login`}
                className="grad-fill rounded-chip px-4 py-2 text-[13px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                {t.header.signUp}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher locale={locale} label={t.header.language} />
          <ThemeToggle toLight={t.header.toLight} toDark={t.header.toDark} />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-chip border border-line text-muted transition-colors duration-200 hover:text-ink active:scale-95"
            onClick={() => setOpen(!open)}
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
            aria-expanded={open}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="slide-down border-t border-line bg-canvas px-5 pb-5 pt-2 lg:hidden">
          {nav.map((item, i) => (
            <Link
              key={`${item.href}-${i}`}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block border-b border-line py-3 text-[14.5px] last:border-0 ${
                pathname === item.href ? "text-ink" : "text-muted"
              }`}
            >
              {item.full}
            </Link>
          ))}

          {user ? (
            <div className="mt-4 rounded-card border border-line p-3">
              <div className="truncate text-[13px] font-medium text-ink">
                {user.name || t.header.accountFallback}
              </div>
              <div className="mt-0.5 truncate text-[12px] text-muted">
                {user.email}
              </div>
              <div className="mt-3 space-y-2">
                {/*
                  Админка есть и на телефоне. На широком экране в неё ведёт
                  меню под аватаром, но оно спрятано за lg: — с телефона
                  владелец не попадал в неё вовсе, кроме как набрав адрес
                  руками.
                */}
                {user.isAdmin && (
                  <Link
                    href={`/${locale}/admin`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-chip border border-accent/40 py-2 text-[13px] font-medium text-accent"
                  >
                    <ShieldCheck size={14} />
                    Админка
                  </Link>
                )}
                <Link
                  href={`/${locale}/account`}
                  onClick={() => setOpen(false)}
                  className="block rounded-chip border border-line-strong py-2 text-center text-[13px] font-medium text-ink"
                >
                  {t.header.account}
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-chip border border-line-strong py-2 text-[13px] font-medium text-ink"
                  >
                    {t.header.logout}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <Link
              href={`/${locale}/login`}
              onClick={() => setOpen(false)}
              className="grad-fill mt-4 block w-full rounded-chip py-2.5 text-center text-[13.5px] font-semibold"
            >
              {t.header.signIn}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
