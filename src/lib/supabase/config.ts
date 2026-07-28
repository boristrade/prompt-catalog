/*
  Пока проект Supabase не подключён, переменных окружения нет.
  Сайт должен работать и в этом состоянии: каталог статичный и авторизация
  ему не нужна. Поэтому везде сначала спрашиваем isSupabaseConfigured().
*/

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

/*
  Вход по ссылке на почту работает в Supabase сразу, а Google требует
  отдельной настройки в Google Cloud. Узнать со стороны сайта, включён ли
  провайдер, нельзя — поэтому спрашиваем явным флагом. Иначе кнопка Google
  висела бы всегда и падала бы с «Unsupported provider».
*/
export function isGoogleAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true";
}

/** Базовый адрес сайта — нужен для redirect после входа через Google. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  // На Vercel адрес деплоя приходит в переменной окружения автоматически.
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
