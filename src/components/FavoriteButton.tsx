"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  promptId: string;
  /** Уже в избранном на момент отрисовки страницы. */
  initial: boolean;
  /** Гостю кнопка ведёт на вход, а не пытается писать в базу. */
  signedIn: boolean;
}

export default function FavoriteButton({ promptId, initial, signedIn }: Props) {
  const [active, setActive] = useState(initial);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function toggle() {
    if (!signedIn) {
      // Возвращаем человека к тому же промту, а не на главную.
      router.push(`/login?next=${encodeURIComponent(`/#${promptId}`)}`);
      return;
    }
    if (busy) return;

    // Переключаем сразу: ждать ответа базы ради сердечка — плохой обмен.
    const next = !active;
    setActive(next);
    setBusy(true);

    try {
      const supabase = createClient();
      const { error } = next
        ? // user_id проставит база из auth.uid() — клиенту его знать незачем.
          await supabase.from("favorites").insert({ prompt_id: promptId })
        : await supabase.from("favorites").delete().eq("prompt_id", promptId);

      if (error) setActive(!next);
    } catch {
      setActive(!next);
    } finally {
      setBusy(false);
    }
  }

  const label = active ? "Убрать из избранного" : "В избранное";

  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-chip border transition-[color,border-color,transform] duration-200 active:scale-90 ${
        active
          ? "border-violet/50 bg-accent-soft text-accent"
          : "border-line-strong text-faint hover:border-line-strong hover:text-ink"
      }`}
    >
      <Heart
        size={13}
        className={active ? "pop" : ""}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}
