"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Код платежа с копированием: переписывать его руками с телефона больно. */
export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Буфер недоступен — код виден на экране, перепишут руками.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Скопировать код"
      className="flex w-full items-center justify-between gap-3 rounded-card border border-line-strong bg-sunken px-4 py-3 text-left transition-[border-color] duration-200 hover:border-violet/50"
    >
      <span className="font-mono text-[18px] tracking-[0.18em] text-ink">
        {code}
      </span>
      <span
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-chip transition-colors duration-200 ${
          copied
            ? "bg-accent-soft text-accent"
            : "border border-line-strong bg-surface text-muted"
        }`}
      >
        {copied ? <Check size={13} className="pop" /> : <Copy size={13} />}
      </span>
    </button>
  );
}
