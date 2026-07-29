import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";

export type Plan = "free" | "pro";

export interface Account {
  userId: string;
  plan: Plan;
  favorites: Set<string>;
}

/*
  Всё, что странице нужно знать о вошедшем: тариф и избранное.
  Одним вызовом, чтобы каталог не ходил в базу дважды за рендер.

  Гость — это null, а не «пустой аккаунт»: тогда вызывающий код обязан
  разобрать этот случай явно и не покажет чужому человеку PRO-промты.
*/
export async function getAccount(): Promise<Account | null> {
  if (!isSupabaseConfigured()) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const supabase = await createClient();

    const [profile, favorites] = await Promise.all([
      supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
      supabase
        .from("favorites")
        .select("prompt_id")
        .order("created_at", { ascending: false }),
    ]);

    return {
      userId: user.id,
      // Нет строки профиля — считаем бесплатным. Так безопаснее: сбой
      // запроса не должен раздавать платный доступ.
      plan: profile.data?.plan === "pro" ? "pro" : "free",
      favorites: new Set(
        (favorites.data ?? []).map((row) => row.prompt_id as string),
      ),
    };
  } catch {
    // База недоступна — сайт остаётся каталогом. Считаем гостем,
    // иначе упала бы вся страница вместо одной кнопки.
    return null;
  }
}

/** Избранное в порядке добавления — для списка в кабинете. */
export async function getFavoriteIds(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("favorites")
      .select("prompt_id")
      .order("created_at", { ascending: false });

    return (data ?? []).map((row) => row.prompt_id as string);
  } catch {
    return [];
  }
}
