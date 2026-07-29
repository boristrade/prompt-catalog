"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, Globe } from "lucide-react";
import {
  LOCALES,
  LOCALE_NAMES,
  LOCALE_SHORT,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n/config";

export default function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Закрываем по клику вне меню и по Escape — иначе оно «залипает».
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

  function choose(next: Locale) {
    setOpen(false);
    /*
      Обычный переход, а не router.push с сохранением состояния: язык
      меняет каждую строку на странице, и полная перерисовка честнее
      попытки подменить часть.
    */
    router.push(switchLocalePath(pathname, next));
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="inline-flex h-8 items-center gap-1.5 rounded-chip border border-line px-2.5 text-[12px] font-medium text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
      >
        <Globe size={13} />
        {LOCALE_SHORT[locale]}
      </button>

      {open && (
        <div
          role="menu"
          className="slide-down absolute right-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-card border border-line bg-surface py-1 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)]"
        >
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              role="menuitem"
              lang={code}
              onClick={() => choose(code)}
              className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-[13px] transition-colors duration-200 hover:bg-sunken ${
                code === locale ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {LOCALE_NAMES[code]}
              {code === locale && <Check size={13} className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
