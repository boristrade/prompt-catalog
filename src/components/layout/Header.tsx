"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import ThemeToggle from "@/components/ThemeToggle";

const NAV = [
  { href: "/", label: "Главная" },
  ...CATEGORIES.map((c) => ({ href: `/prompts/${c.slug}`, label: c.nav })),
  { href: "/tools", label: "Инструменты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="text-[17px] font-semibold tracking-[-0.025em] text-ink"
        >
          Promp<span className="text-accent">Tom</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-chip px-2.5 py-1.5 text-[13.5px] transition-colors ${
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
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-chip bg-invert px-3.5 py-1.5 text-[13px] font-medium text-on-invert transition-opacity hover:opacity-85"
          >
            Войти
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-chip border border-line text-muted transition-colors duration-200 hover:text-ink active:scale-95"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
          >
            {open ? <X size={15} /> : <Menu size={15} />}
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
              className={`block border-b border-line py-2.5 text-[14.5px] last:border-0 ${
                pathname === item.href ? "text-ink" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-4 block w-full rounded-chip bg-invert py-2.5 text-center text-[13.5px] font-medium text-on-invert"
          >
            Войти
          </Link>
        </nav>
      )}
    </header>
  );
}
