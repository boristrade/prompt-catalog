import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/*
  Клиент с сервисным ключом: обходит RLS и потому нужен ровно там, где
  сервер меняет чужие данные — например, открывает оплаченный доступ.

  Импорт "server-only" здесь не формальность: если этот файл случайно
  затянут в клиентский компонент, сборка упадёт. Иначе ключ, дающий
  полный доступ к базе, уехал бы в браузер каждому посетителю.
*/
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY не задан");

  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
