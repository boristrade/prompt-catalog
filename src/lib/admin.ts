import "server-only";
import { getCurrentUser } from "@/lib/supabase/server";

/*
  Кто пускается в админку.

  Список живёт в переменной окружения, а не в коде: репозиторий публичный,
  и личная почта владельца в нём — это подарок спамерам и подсказка тому,
  кто будет подбирать доступ. Заодно сменить админа можно без правки кода.

  ADMIN_EMAILS — через запятую, если админов несколько.
*/
function allowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/*
  Переменная не задана — админки нет ни у кого. Пустой список не должен
  случайно совпасть с пустой почтой и открыть панель первому встречному:
  ошибиться здесь можно ровно один раз.
*/
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = allowlist();
  if (list.length === 0) return false;
  return list.includes(email.trim().toLowerCase());
}

/**
 * Текущий пользователь, если он админ. Иначе null.
 * Вызывать в каждом действии заново — проверка на отрисовке страницы
 * ничего не гарантирует: действие приходит отдельным запросом.
 */
export async function currentAdmin(): Promise<{ id: string; email: string } | null> {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return { id: user.id, email: user.email ?? "" };
}
