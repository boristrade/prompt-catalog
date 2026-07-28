"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Официальный четырёхцветный знак Google — своими цветами, не акцентом сайта. */
function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1z"
      />
      <path
        fill="#34A853"
        d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.6 28.1c-.4-1.3-.7-2.7-.7-4.1s.2-2.8.7-4.1v-5.7H4.3C2.8 17.1 2 20.4 2 24s.8 6.9 2.3 9.8l7.3-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.3 30 2 24 2 15.4 2 7.9 6.9 4.3 14.2l7.3 5.7c1.7-5.2 6.6-9.1 12.4-9.1z"
      />
    </svg>
  );
}

export default function GoogleSignIn({ next = "/" }: { next?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // origin берём из браузера: он совпадает и на localhost, и на проде.
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        setError("Не удалось начать вход. Попробуйте ещё раз.");
        setLoading(false);
      }
      // При успехе браузер уходит на Google — состояние сбрасывать не нужно.
    } catch {
      setError("Сервис авторизации недоступен.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2.5 rounded-chip border border-line-strong bg-surface px-4 py-3 text-[14px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.98] disabled:opacity-60"
      >
        <GoogleMark />
        {loading ? "Открываем Google…" : "Продолжить с Google"}
      </button>

      {error && (
        <p className="mt-3 text-[13px] text-[#f87171]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
