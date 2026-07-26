"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const NAV = [
  { href: "/", label: "Главная" },
  ...CATEGORIES.map((c) => ({ href: `/prompts/${c.slug}`, label: c.nav })),
  { href: "/tools", label: "Полезные инструменты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-graphite bg-obsidian/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1216px] items-center justify-between px-5 md:px-8">
        {/* Логотип */}
        <Link href="/" className="font-display text-[22px] text-white">
          Promp<span className="text-copper">Tom</span>
        </Link>

        {/* Десктоп-навигация */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[2px] px-2.5 py-1.5 text-sm transition-colors ${
                pathname === item.href
                  ? "text-white"
                  : "text-fog hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {/* Заглушка — в Фазе 3 здесь появится имя пользователя / профиль */}
          <Link
            href="/login"
            className="rounded-full border border-white px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Войти
          </Link>
        </div>

        {/* Мобильное меню */}
        <button
          className="text-bone lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-graphite bg-obsidian px-5 pb-6 pt-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 text-[15px] ${
                pathname === item.href ? "text-white" : "text-fog"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-4 block w-full rounded-full border border-white py-2.5 text-center text-sm font-medium text-white"
          >
            Войти
          </Link>
        </nav>
      )}
    </header>
  );
}
