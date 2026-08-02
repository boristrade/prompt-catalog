"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Lock } from "lucide-react";
import type { Prompt } from "@/lib/prompts";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { highlightVars } from "@/components/promptText";

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
    /*
      prompt.prompt здесь уже не пустой: сервер (veil в lib/prompts.ts)
      оставил настоящее начало текста, а не вырезал его целиком. Раньше
      на этом месте стоял один и тот же вымышленный шаблон под сплошным
      размытием — человек, ещё не решивший, платить ли, не видел ни
      строки из того, за что его просят заплатить. Теперь видно начало
      настоящего текста, а обрыв — там, где он действительно обрывается
      на сервере, а не нарисован полупрозрачной плашкой поверх текста.
    */
    return (
      <div className="relative">
        <pre className="max-h-64 overflow-hidden whitespace-pre-wrap rounded-card border border-line bg-sunken p-5 font-mono text-[12.5px] leading-[1.7] text-muted">
          {highlightVars(prompt.prompt)}
          <span aria-hidden>…</span>
        </pre>

        {/* Плавный переход к замку — иначе обрыв текста выглядел бы как
            обрезанная картинка, а не как «дальше только по подписке». */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-card bg-gradient-to-t from-surface via-surface/95 to-transparent"
        />

        <div className="relative mt-3 flex flex-col items-center gap-4 rounded-card border border-line bg-surface px-6 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-sunken text-accent">
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
