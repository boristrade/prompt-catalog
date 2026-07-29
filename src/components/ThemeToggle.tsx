"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export default function ThemeToggle({
  className = "",
  toLight,
  toDark,
}: {
  className?: string;
  toLight: string;
  toDark: string;
}) {
  // null до монтирования: на сервере тема неизвестна, иконку не рисуем,
  // иначе разметка разойдётся с клиентской.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("theme");
    } catch {
      // localStorage может быть недоступен — тогда просто идём от системы.
    }
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    setTheme(
      window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark",
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    // Класс включает кроссфейд цветов и снимается сразу после перехода,
    // чтобы не тормозить остальные анимации на странице.
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 320);

    setTheme(next);
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Выбор не сохранится, но текущая сессия переключится.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? toDark : toLight}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-chip border border-line text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink active:scale-95 ${className}`}
    >
      {theme === "light" ? (
        <Moon size={14} className="pop" />
      ) : theme === "dark" ? (
        <Sun size={14} className="pop" />
      ) : (
        <span className="block h-3.5 w-3.5" />
      )}
    </button>
  );
}
