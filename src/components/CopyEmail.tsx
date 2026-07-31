"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/*
  Адрес поддержки крупным текстом и кнопка «скопировать».

  Копирование может не сработать: буфер обмена закрыт для страниц без
  HTTPS и для старых браузеров. Поэтому сам адрес всегда остаётся на
  экране обычным текстом — его можно выделить пальцем и скопировать
  вручную. Кнопка здесь удобство, а не единственный способ.
*/
export default function CopyEmail({
  email,
  copyLabel,
  copiedLabel,
}: {
  email: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Буфер недоступен — адрес и так виден, человек скопирует руками.
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* select-all: одно нажатие выделяет адрес целиком, если кнопка
          копирования в этом браузере не работает. */}
      <span className="select-all break-all font-mono text-[17px] text-ink md:text-[20px]">
        {email}
      </span>

      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className={`inline-flex shrink-0 items-center gap-2 rounded-chip border px-4 py-2.5 text-[13px] font-medium transition-[color,border-color,transform] duration-200 active:scale-[0.97] ${
          copied
            ? "border-accent/50 text-accent"
            : "border-line-strong text-ink hover:bg-sunken"
        }`}
      >
        {copied ? <Check size={14} className="pop" /> : <Copy size={14} />}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
