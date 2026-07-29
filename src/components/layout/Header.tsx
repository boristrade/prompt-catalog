"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu, { type SessionUser } from "@/components/layout/UserMenu";

// В шапке нужны короткие подписи: «Для дизайнеров» и т.п. переносят строку.
const NAV = [
  { href: "/", label: "Главная" },
  ...CATEGORIES.map((c) => ({
    href: `/prompts/${c.slug}`,
    label: c.nav.replace(/^Для /, ""),
    full: c.nav,
  })),
  { href: "/tools", label: "Инструменты" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grad-fill flex h-7 w-7 items-center justify-center rounded-[7px] text-[14px] font-bold">
        P
      </span>
      <span className="text-[17px] font-bold tracking-[-0.02em] text-ink">
        PrompTom
      </span>
    </Link>
  );
}

export default function Header({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-5 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
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

        <div className="hidden items-center gap-2.5 lg:flex">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-chip border border-line-strong px-4 py-2 text-[13px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.97]"
              >
                Войти
              </Link>
              <Link
                href="/login"
                className="grad-fill rounded-chip px-4 py-2 text-[13px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-chip border border-line text-muted transition-colors duration-200 hover:text-ink active:scale-95"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="slide-down border-t border-line bg-canvas px-5 pb-5 pt-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block border-b border-line py-3 text-[14.5px] last:border-0 ${
                pathname === item.href ? "text-ink" : "text-muted"
              }`}
            >
              {/* В выпадающем меню места хватает — показываем полное название */}
              {"full" in item ? item.full : item.label}
            </Link>
          ))}

          {user ? (
            <div className="mt-4 rounded-card border border-line p-3">
              <div className="truncate text-[13px] font-medium text-ink">
                {user.name || "Аккаунт"}
              </div>
              <div className="mt-0.5 truncate text-[12px] text-muted">
                {user.email}
              </div>
              <form action="/auth/signout" method="post" className="mt-3">
                <button
                  type="submit"
                  className="w-full rounded-chip border border-line-strong py-2 text-[13px] font-medium text-ink"
                >
                  Выйти
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="grad-fill mt-4 block w-full rounded-chip py-2.5 text-center text-[13.5px] font-semibold"
            >
              {/* Без названия способа: их набор задаётся переменными
                  окружения, и «через Google» врало бы при выключенном Google. */}
              Войти
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
