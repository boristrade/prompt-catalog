"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Check, Mail } from "lucide-react";
import { subscribe } from "@/lib/subscribe";
import type { SubscribeState } from "@/lib/email-address";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/*
  Форма подписки на пополнения каталога.

  Обычная форма с серверным действием, а не запрос из скрипта: она
  работает и до того, как загрузился JS, и у того, у кого он выключен.
  Для формы, которая стоит в подвале каждой страницы, это не педантизм —
  это разница между «собрали адрес» и «человек нажал, ничего не
  случилось».

  Ответ действия — короткое слово, фразу подставляем здесь: словарь
  нужного языка уже под рукой у страницы.
*/

const START: SubscribeState = { status: "idle" };

export default function SubscribeForm({
  locale,
  t,
  source,
  compact = false,
}: {
  locale: Locale;
  t: Dictionary;
  /** Откуда пришёл адрес: видно, какое место работает. */
  source: string;
  /** Подвальный вид: без заголовка и описания, поле и кнопка в строку. */
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(subscribe, START);

  const message =
    state.status === "ok"
      ? t.subscribe.ok
      : state.status === "already"
        ? t.subscribe.already
        : state.status === "invalid"
          ? t.subscribe.invalid
          : state.status === "error"
            ? t.subscribe.error
            : "";

  const done = state.status === "ok" || state.status === "already";

  const field =
    "w-full min-w-0 rounded-chip border border-line bg-sunken px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors duration-200 placeholder:text-faint focus:border-violet";

  return (
    <div className={compact ? "" : "rounded-card border border-line bg-surface px-6 py-7 md:px-8"}>
      {!compact && (
        <>
          <h2 className="font-display text-balance text-[22px] leading-snug text-ink md:text-[26px]">
            {t.subscribe.title}
          </h2>
          <p className="mt-2.5 max-w-lg text-[14px] leading-relaxed text-muted">
            {t.subscribe.text}
          </p>
        </>
      )}

      {compact && (
        <span className="mb-2 block text-[13px] font-semibold text-ink">
          {t.subscribe.title}
        </span>
      )}

      <form action={action} className={compact ? "mt-2" : "mt-5"}>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="source" value={source} />

        {/*
          Ловушка для роботов. Спрятана и от глаз, и от читалок с экрана,
          и вынута из порядка обхода клавишей — человек её не встретит
          никак, а простой робот заполняет всё подряд.
        */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute h-0 w-0 overflow-hidden opacity-0"
        />

        {/* На 360px поле и кнопка в строку не влезают — переносим. */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">{t.subscribe.placeholder}</span>
            <input
              type="email"
              name="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder={t.subscribe.placeholder}
              className={field}
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="grad-fill inline-flex shrink-0 items-center gap-2 rounded-chip px-5 py-2.5 text-[13.5px] font-semibold shadow-[0_8px_24px_-10px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-60"
          >
            {done ? <Check size={14} /> : <Mail size={14} />}
            {t.subscribe.button}
          </button>
        </div>

        {message && (
          <p
            /*
              Читалка обязана объявить исход: человек, не видящий экрана,
              иначе не узнает ни об успехе, ни об опечатке в адресе.
            */
            role="status"
            className={`mt-2.5 text-[12.5px] leading-relaxed ${
              done ? "text-accent" : "text-muted"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-2 text-[12px] leading-relaxed text-faint">
          {t.subscribe.promise}{" "}
          <Link
            href={`/${locale}/legal/privacy`}
            className="underline underline-offset-2 transition-colors duration-200 hover:text-muted"
          >
            {t.footer.privacy}
          </Link>
        </p>
      </form>
    </div>
  );
}
