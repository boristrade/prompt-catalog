"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent";

export default function EmailSignIn({ next = "/" }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // origin из браузера подходит и на localhost, и на проде.
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        // Частый случай — защита от спама: письмо на этот адрес уже уходило.
        setError(
          error.status === 429
            ? "Письмо уже отправлено. Подождите минуту и попробуйте снова."
            : "Не удалось отправить письмо. Проверьте адрес и попробуйте ещё раз.",
        );
        setStatus("idle");
        return;
      }

      setStatus("sent");
    } catch {
      setError("Сервис авторизации недоступен.");
      setStatus("idle");
    }
  }

  /*
    Supabase намеренно не сообщает, есть ли такой пользователь: иначе форму
    входа можно было бы использовать для проверки чужих адресов. Поэтому
    экран после отправки один и тот же и для новых, и для существующих.
  */
  if (status === "sent") {
    return (
      <div className="rounded-card border border-line-strong bg-sunken p-5 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-accent">
          <Mail size={17} />
        </div>
        <p className="mt-3.5 text-[13.5px] leading-relaxed text-ink">
          Ссылка отправлена на <span className="font-medium">{email}</span>
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
          Откройте письмо и нажмите на ссылку — вход произойдёт сам. Если письма
          нет, загляните в «Спам».
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-[12.5px] text-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
        >
          Указать другой адрес
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={send} noValidate={false}>
      <label
        htmlFor="email"
        className="block text-[12.5px] font-medium text-muted"
      >
        Почта
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2 w-full rounded-chip border border-line-strong bg-canvas px-4 py-3 text-[14px] text-ink outline-none transition-[border-color] duration-200 placeholder:text-faint focus:border-violet"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="grad-fill mt-3 w-full rounded-chip px-4 py-3 text-[14px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      >
        {status === "sending" ? "Отправляем…" : "Получить ссылку для входа"}
      </button>

      <p className="mt-2.5 text-[12px] leading-relaxed text-faint">
        Пароль не нужен — пришлём ссылку на почту.
      </p>

      {error && (
        <p className="mt-3 text-[13px] text-[#f87171]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
