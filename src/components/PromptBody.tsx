"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Lock } from "lucide-react";
import type { Prompt } from "@/lib/prompts";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { VEIL, highlightVars } from "@/components/promptText";

/*
  Текст промта на отдельной странице.

  От карточки отличается тем, что здесь текст — главное на экране: он не
  обрезан по высоте, кнопка копирования подписана словом, а пример
  результата открыт сразу, а не спрятан под раскрывашку. В каталоге
  экономия места важнее, тут — наоборот.
*/
export default function PromptBody({
  prompt,
  locked,
  locale,
  t,
}: {
  prompt: Prompt;
  locked: boolean;
  locale: Locale;
  t: Dictionary;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Буфер обмена недоступен (нет HTTPS / старый браузер) — тихо игнорируем.
    }
  }

  if (locked) {
    return (
      <div className="relative">
        <pre
          aria-hidden
          className="pointer-events-none max-h-80 select-none overflow-hidden whitespace-pre-wrap rounded-card border border-line bg-sunken p-5 font-mono text-[12.5px] leading-[1.7] text-muted blur-[5px]"
        >
          {VEIL}
        </pre>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-card bg-surface/60 px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-surface text-accent">
            <Lock size={18} />
          </span>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-muted">
            {t.card.lockedTitle}
          </p>
          <Link
            href={`/${locale}/pricing`}
            className="grad-fill rounded-chip px-5 py-2.5 text-[13.5px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
          >
            {t.card.lockedCta}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
          {t.detail.promptTitle}
        </h2>
        <button
          type="button"
          onClick={copy}
          className={`inline-flex shrink-0 items-center gap-2 rounded-chip border px-4 py-2 text-[13px] font-medium transition-[color,border-color,transform] duration-200 active:scale-[0.97] ${
            copied
              ? "border-accent/50 text-accent"
              : "border-line-strong text-ink hover:bg-sunken"
          }`}
        >
          {copied ? <Check size={14} className="pop" /> : <Copy size={14} />}
          {copied ? t.card.copied : t.card.copy}
        </button>
      </div>

      <pre className="mt-4 select-all whitespace-pre-wrap rounded-card border border-line bg-sunken p-5 font-mono text-[12.5px] leading-[1.7] text-muted">
        {highlightVars(prompt.prompt)}
      </pre>
      <p className="mt-2.5 text-[12.5px] text-faint">{t.detail.variables}</p>

      <h2 className="mt-10 text-[17px] font-semibold tracking-[-0.015em] text-ink">
        {t.detail.exampleTitle}
      </h2>
      <p className="example-body mt-4 whitespace-pre-wrap rounded-card border border-line bg-sunken p-5 text-[13px] leading-relaxed text-muted">
        {prompt.example}
      </p>
    </>
  );
}
