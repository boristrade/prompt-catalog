"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/*
  Партнёрская ссылка с кнопкой копирования.

  Сама ссылка остаётся видимым текстом с select-all: буфер обмена закрыт
  для страниц без HTTPS и для старых браузеров, и кнопка не должна быть
  единственным способом её забрать — партнёру без ссылки программа
  бесполезна.
*/
export default function CopyLink({
  link,
  copyLabel,
  copiedLabel,
}: {
  link: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Буфер недоступен — ссылка и так на экране, выделяется касанием.
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="select-all break-all font-mono text-[13.5px] text-ink md:text-[15px]">
        {link}
      </span>

      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-chip border px-4 py-2.5 text-[13px] font-medium transition-[color,border-color,transform] duration-200 active:scale-[0.97] ${
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
