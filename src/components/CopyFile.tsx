"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/*
  Файл скила с кнопкой копирования.

  От PromptBody отличается тем, что здесь копируют не сообщение для чата,
  а содержимое файла целиком — вместе с шапкой из трёх дефисов. Поэтому
  текст не обрезан по высоте и не подсвечен по {переменным}: менять в нём
  ничего не нужно, его кладут как есть.

  Сам текст остаётся выделяемым: буфер обмена закрыт для страниц без
  HTTPS и для старых браузеров, и кнопка не должна быть единственным
  способом забрать файл.
*/
export default function CopyFile({
  content,
  copyLabel,
  copiedLabel,
}: {
  content: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Буфер недоступен — текст на экране, выделяется вручную.
    }
  }

  return (
    <div className="relative">
      {/*
        Кнопка липнет к верху при прокрутке длинного файла: у самых
        больших скилов она иначе уезжает вверх, и до неё приходится
        листать обратно.
      */}
      <div className="sticky top-20 z-10 flex justify-end px-3 pt-3">
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className={`inline-flex items-center gap-2 rounded-chip border px-3.5 py-2 text-[12.5px] font-medium backdrop-blur-sm transition-[color,border-color,transform] duration-200 active:scale-[0.97] ${
            copied
              ? "border-accent/50 bg-surface/90 text-accent"
              : "border-line-strong bg-surface/90 text-ink hover:bg-sunken"
          }`}
        >
          {copied ? <Check size={14} className="pop" /> : <Copy size={14} />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>

      <pre className="-mt-11 max-h-[520px] select-all overflow-auto whitespace-pre-wrap rounded-card border border-line bg-sunken p-5 pt-14 font-mono text-[12px] leading-[1.7] text-muted">
        {content}
      </pre>
    </div>
  );
}
