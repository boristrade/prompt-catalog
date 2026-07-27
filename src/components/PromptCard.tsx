"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import type { Prompt } from "@/lib/prompts";

/*
  Подсвечиваем {переменные} акцентом: сразу видно, что заменять на своё,
  ещё до чтения текста. Это единственное место, кроме рубрик и меток,
  где в системе «Graphite» появляется цвет.
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

export default function PromptCard({ prompt }: { prompt: Prompt }) {
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
        <span
          className={`shrink-0 rounded-chip px-2 py-1 font-mono text-[10px] tracking-[0.08em] ${
            prompt.tier === "pro"
              ? "border border-accent/40 text-accent"
              : "border border-line-strong text-faint"
          }`}
        >
          {prompt.tier === "pro" ? "PRO" : "FREE"}
        </span>
      </div>

      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
        {prompt.summary}
      </p>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <span className="rounded-chip bg-sunken px-2 py-1 font-mono text-[10.5px] text-muted">
          {prompt.bestFor}
        </span>
        {prompt.tags.map((t) => (
          <span
            key={t}
            className="rounded-chip bg-sunken px-2 py-1 font-mono text-[10.5px] text-faint"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Текст промта. Кнопка — только иконка, иначе она перекрывает текст. */}
      <div className="relative mt-4">
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-card border border-line bg-sunken p-3.5 pr-11 font-mono text-[12px] leading-[1.65] text-muted">
          {highlightVars(prompt.prompt)}
        </pre>
        <button
          type="button"
          onClick={copy}
          title={copied ? "Скопировано" : "Скопировать промт"}
          aria-label={copied ? "Скопировано" : "Скопировать промт"}
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
          <span className="group-open:hidden">Показать пример результата</span>
          <span className="hidden group-open:inline">Скрыть пример</span>
        </summary>
        <p className="example-body mt-2.5 whitespace-pre-wrap rounded-card border border-line bg-sunken p-3.5 text-[12.5px] leading-relaxed text-muted">
          {prompt.example}
        </p>
      </details>
    </article>
  );
}
