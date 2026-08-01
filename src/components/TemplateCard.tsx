"use client";

import { useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/*
  Карточка шаблона в бегущей ленте: картинка-результат сверху, кнопка
  «скопировать промт» снизу.

  Клиентская она только ради буфера обмена — сам список приходит с
  сервера. Текст промта уже лежит в разметке: он бесплатный и нужен
  целиком, прятать его незачем (в отличие от PRO-промтов каталога, где
  текст вырезается на сервере).
*/
export default function TemplateCard({
  title,
  summary,
  bestFor,
  prompt,
  image,
  t,
}: {
  title: string;
  summary: string;
  bestFor: string;
  prompt: string;
  image?: string;
  t: Dictionary;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Буфер недоступен (нет HTTPS / старый браузер) — тихо игнорируем.
    }
  }

  return (
    <article className="flex w-[260px] shrink-0 flex-col overflow-hidden rounded-card border border-line bg-surface transition-[border-color] duration-200 hover:border-line-strong sm:w-[300px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sunken">
        {image ? (
          /* Обычный img: файл лежит рядом, а next/image здесь дал бы
             лишний слой ради картинки фиксированного размера. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          /* Пока примера нет — честная заглушка, а не пустая рамка. */
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(150deg,rgba(124,58,237,0.16),rgba(168,85,247,0.05))] px-5 text-center">
            <Sparkles size={18} className="text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
              {t.templates.soon}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[14.5px] font-semibold leading-snug tracking-[-0.015em] text-ink">
          {title}
        </h3>
        <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-muted">
          {summary}
        </p>

        <span className="mt-3 inline-flex w-fit rounded-chip bg-sunken px-2 py-1 font-mono text-[10.5px] text-faint">
          {bestFor}
        </span>

        <button
          type="button"
          onClick={copy}
          className={`mt-3.5 inline-flex items-center justify-center gap-2 rounded-chip border px-4 py-2.5 text-[12.5px] font-medium transition-[color,border-color,transform] duration-200 active:scale-[0.97] ${
            copied
              ? "border-accent/50 text-accent"
              : "border-line-strong text-ink hover:bg-sunken"
          }`}
        >
          {copied ? <Check size={13} className="pop" /> : <Copy size={13} />}
          {copied ? t.templates.copied : t.templates.copy}
        </button>
      </div>
    </article>
  );
}
