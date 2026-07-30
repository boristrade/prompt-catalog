"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export interface NavMenuItem {
  href: string;
  label: string;
}

/*
  Выпадающее меню для группы ссылок в шапке — «Каталог», «Поддержка».
  Тот же паттерн закрытия по клику вне и по Escape, что в LanguageSwitcher:
  два независимых меню в одной шапке не должны вести себя по-разному.
*/
export default function NavMenu({
  label,
  items,
}: {
  label: string;
  items: NavMenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Пункт меню на текущей странице подсвечиваем — как и обычные ссылки в шапке.
  const activeInside = items.some((item) => item.href === pathname);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-chip px-2.5 py-1.5 text-[13.5px] transition-colors duration-200 ${
          activeInside ? "text-ink" : "text-muted hover:text-ink"
        }`}
      >
        {label}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="slide-down absolute left-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-card border border-line bg-surface py-1 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)]"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-[13px] transition-colors duration-200 hover:bg-sunken ${
                item.href === pathname ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
