import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/** Серверный клиент, читающий сессию из cookie. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // В серверных компонентах запись cookie запрещена — сессию
          // всё равно обновит middleware, поэтому молча пропускаем.
        }
      },
    },
  });
}

/**
 * Текущий пользователь или null.
 * Всегда через getUser(): он проверяет токен на сервере Supabase,
 * в отличие от getSession(), которому нельзя доверять на сервере.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    // Запрос идёт из корневого layout: если Supabase недоступен,
    // без этой защиты упал бы весь сайт, а не только вход.
    return null;
  }
}
