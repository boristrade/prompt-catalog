"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CreditCard, LogOut, User } from "lucide-react";

export interface SessionUser {
  email: string;
  name: string;
  avatarUrl: string | null;
}

/** Аватар с выпадающим меню и выходом. */
export default function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Меню пользователя"
        className="flex items-center gap-2 rounded-chip border border-line px-1.5 py-1.5 transition-colors duration-200 hover:border-line-strong"
      >
        {user.avatarUrl ? (
          // Аватар с домена Google — обычный img, чтобы не заводить
          // remotePatterns под каждый возможный CDN.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="grad-fill flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold">
            {initial}
          </span>
        )}
        <span className="max-w-[110px] truncate pr-1 text-[13px] text-ink">
          {user.name || user.email}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="slide-down absolute right-0 top-[calc(100%+8px)] w-60 overflow-hidden rounded-card border border-line bg-surface shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)]"
        >
          <div className="border-b border-line px-4 py-3">
            <div className="truncate text-[13px] font-medium text-ink">
              {user.name || "Аккаунт"}
            </div>
            <div className="mt-0.5 truncate text-[12px] text-muted">
              {user.email}
            </div>
          </div>

          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-[13px] text-muted transition-colors duration-200 hover:bg-sunken hover:text-ink"
          >
            <User size={14} />
            Кабинет и избранное
          </Link>

          <Link
            href="/pricing"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 border-b border-line px-4 py-3 text-left text-[13px] text-muted transition-colors duration-200 hover:bg-sunken hover:text-ink"
          >
            <CreditCard size={14} />
            Тарифы
          </Link>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-[13px] text-muted transition-colors duration-200 hover:bg-sunken hover:text-ink"
            >
              <LogOut size={14} />
              Выйти
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
