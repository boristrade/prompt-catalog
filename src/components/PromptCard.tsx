"use client";

import { useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import type { Prompt } from "@/lib/prompts";

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
      className="flex flex-col rounded-[10px] border border-graphite bg-onyx p-6 transition-colors hover:border-slate"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[17px] font-medium leading-snug text-white">
          {prompt.title}
        </h3>
        {prompt.tier === "pro" ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-copper/40 px-2.5 py-1 text-[11px] font-semibold text-copper">
            <Sparkles size={12} /> PRO
          </span>
        ) : (
          <span className="shrink-0 rounded-full border border-slate px-2.5 py-1 text-[11px] font-semibold text-fog">
            FREE
          </span>
        )}
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-fog">{prompt.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded-[2px] bg-carbon px-2 py-1 text-[11px] text-mist">
          ✦ {prompt.bestFor}
        </span>
        {prompt.tags.map((t) => (
          <span
            key={t}
            className="rounded-[2px] bg-carbon px-2 py-1 text-[11px] text-fog"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Текст промта */}
      <div className="relative mt-5">
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-[8px] border border-graphite bg-carbon p-4 pr-14 font-sans text-[13px] leading-relaxed text-silver">
          {prompt.prompt}
        </pre>
        <button
          onClick={copy}
          aria-label="Скопировать промт"
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
            copied
              ? "bg-copper text-black"
              : "bg-white/10 text-bone hover:bg-white/20"
          }`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Готово" : "Копировать"}
        </button>
      </div>

      {/* Пример результата */}
      <details className="group mt-4">
        <summary className="cursor-pointer select-none text-[13px] font-medium text-copper transition-opacity hover:opacity-80 [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Показать пример результата →</span>
          <span className="hidden group-open:inline">Скрыть пример ↑</span>
        </summary>
        <p className="mt-3 whitespace-pre-wrap rounded-[8px] border border-graphite border-dashed bg-obsidian p-4 text-[13px] leading-relaxed text-mist">
          {prompt.example}
        </p>
      </details>
    </article>
  );
}
