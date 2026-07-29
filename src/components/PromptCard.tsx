"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Copy, Lock } from "lucide-react";
import type { Prompt } from "@/lib/prompts";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import FavoriteButton from "@/components/FavoriteButton";

/*
  Подсвечиваем {переменные} акцентом: сразу видно, что заменять на своё,
  ещё до чтения текста.
*/
function highlightVars(text: string) {
  return text.split(/(\{[^{}]*\})/g).map((part, i) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span key={i} className="text-accent">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/*
  Заглушка под замком. Настоящий текст закрытого промта на клиент не
  уходит вовсе — размытие это лишь картинка, и через инструменты
  разработчика его читали бы как обычный текст.
*/
const VEIL = `Role: {specialist}, {years} years in {niche}.
Task: prepare {deliverable} for {audience}.

Context:
— channel: {channel}
— goal: {goal}
— constraints: {constraints}

Answer format:
1. {first block}
2. {second block}
3. {third block}

Tone: {tone}. Length: {length}.`;

interface Props {
  prompt: Prompt;
  /** PRO-промт у пользователя без подписки: текст заменён заглушкой. */
  locked?: boolean;
  favorited?: boolean;
  signedIn?: boolean;
  locale: Locale;
  t: Dictionary;
}

export default function PromptCard({
  prompt,
  locked = false,
  favorited = false,
  signedIn = false,
  locale,
  t,
}: Props) {
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

  return (
    <article
      id={prompt.id}
      className="flex flex-col rounded-card border border-line bg-surface p-5 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15.5px] font-semibold leading-snug tracking-[-0.015em] text-ink">
          {prompt.title}
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <FavoriteButton
            promptId={prompt.id}
            initial={favorited}
            signedIn={signedIn}
            locale={locale}
            addLabel={t.card.addFavorite}
            removeLabel={t.card.removeFavorite}
          />
          <span
            className={`rounded-chip px-2 py-1 font-mono text-[10px] tracking-[0.08em] ${
              prompt.tier === "pro"
                ? "border border-accent/40 text-accent"
                : "border border-line-strong text-faint"
            }`}
          >
            {prompt.tier === "pro" ? "PRO" : "FREE"}
          </span>
        </div>
      </div>

      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
        {prompt.summary}
      </p>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <span className="rounded-chip bg-sunken px-2 py-1 font-mono text-[10.5px] text-muted">
          {prompt.bestFor}
        </span>
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-chip bg-sunken px-2 py-1 font-mono text-[10.5px] text-faint"
          >
            {tag}
          </span>
        ))}
      </div>

      {locked ? (
        <div className="relative mt-4">
          <pre
            aria-hidden
            className="pointer-events-none max-h-72 select-none overflow-hidden whitespace-pre-wrap rounded-card border border-line bg-sunken p-3.5 font-mono text-[12px] leading-[1.65] text-muted blur-[5px]"
          >
            {VEIL}
          </pre>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-card bg-surface/55 px-5 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface text-accent">
              <Lock size={16} />
            </span>
            <p className="text-[12.5px] leading-relaxed text-muted">
              {t.card.lockedTitle}
            </p>
            <Link
              href={`/${locale}/pricing`}
              className="grad-fill rounded-chip px-4 py-2 text-[12.5px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              {t.card.lockedCta}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Текст промта. Кнопка — только иконка, иначе перекрывает текст. */}
          <div className="relative mt-4">
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-card border border-line bg-sunken p-3.5 pr-11 font-mono text-[12px] leading-[1.65] text-muted">
              {highlightVars(prompt.prompt)}
            </pre>
            <button
              type="button"
              onClick={copy}
              title={copied ? t.card.copied : t.card.copy}
              aria-label={copied ? t.card.copied : t.card.copy}
              className={`absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-chip transition-colors duration-200 active:scale-90 ${
                copied
                  ? "bg-accent-soft text-accent"
                  : "border border-line-strong bg-surface text-muted hover:text-ink"
              }`}
            >
              {copied ? <Check size={13} className="pop" /> : <Copy size={13} />}
            </button>
          </div>

          {/* Пример результата */}
          <details className="group mt-3.5">
            <summary className="inline-flex cursor-pointer select-none items-center gap-1.5 font-mono text-[11.5px] text-muted transition-colors duration-200 hover:text-ink">
              <ChevronDown
                size={13}
                className="shrink-0 transition-transform duration-300 ease-out group-open:rotate-180"
              />
              <span className="group-open:hidden">{t.card.showExample}</span>
              <span className="hidden group-open:inline">
                {t.card.hideExample}
              </span>
            </summary>
            <p className="example-body mt-2.5 whitespace-pre-wrap rounded-card border border-line bg-sunken p-3.5 text-[12.5px] leading-relaxed text-muted">
              {prompt.example}
            </p>
          </details>
        </>
      )}
    </article>
  );
}
