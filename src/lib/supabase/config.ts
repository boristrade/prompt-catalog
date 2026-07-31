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
  Значения переменных люди вбивают руками в форму на Vercel, поэтому
  сравнивать с одной-единственной строкой нельзя: «False», кавычки или
  случайный пробел молча ломают флаг, а понять это по сайту невозможно —
  просто ничего не меняется. Разбираем терпимо, неизвестное считаем
  незаданным, чтобы сработало значение по умолчанию.
*/
function flag(raw: string | undefined): boolean | undefined {
  const value = raw?.trim().toLowerCase().replace(/^["']|["']$/g, "");
  if (!value) return undefined;
  if (["true", "1", "yes", "on"].includes(value)) return true;
  if (["false", "0", "no", "off"].includes(value)) return false;
  return undefined;
}

/*
  Вход по ссылке на почту работает в Supabase сразу, а Google требует
  отдельной настройки в Google Cloud. Узнать со стороны сайта, включён ли
  провайдер, нельзя — поэтому спрашиваем явным флагом. Иначе кнопка Google
  висела бы всегда и падала бы с «Unsupported provider».
*/
export function isGoogleAuthEnabled(): boolean {
  return flag(process.env.NEXT_PUBLIC_GOOGLE_AUTH) === true;
}

/*
  Обратный по смыслу флаг: почта включена, пока её явно не выключили.
  Так свежий проект с одними ключами Supabase сразу пускает пользователей,
  а выключать приходится осознанно — например, когда свой SMTP ещё не
  настроен и письма уходят только на адрес владельца.
*/
export function isEmailAuthEnabled(): boolean {
  return flag(process.env.NEXT_PUBLIC_EMAIL_AUTH) !== false;
}

