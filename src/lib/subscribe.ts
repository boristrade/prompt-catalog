"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sendSubscribeWelcome } from "@/lib/email";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import {
  looksLikeEmail,
  normaliseEmail,
  type SubscribeState,
} from "@/lib/email-address";

/*
  Подписка на пополнения каталога.

  Зачем она вообще: человек приходит из соцсетей, смотрит промты и
  уходит — и больше его не найти. Почта — единственный способ позвать его
  обратно, когда каталог пополнится, не покупая показ у той же соцсети
  второй раз.

  Пишет сюда только сервер и только служебным ключом. Публичного ключа у
  этой таблицы нет вовсе (см. миграцию 0008): список адресов, доступный
  из браузера, — это список адресов, доступный кому угодно.

  Ответ действия — короткое слово, а не готовая фраза. Переводит его
  форма, у неё под рукой словарь нужного языка; тащить сюда шесть
  переводов ради трёх исходов незачем.
*/

export async function subscribe(
  _prev: SubscribeState,
  form: FormData,
): Promise<SubscribeState> {
  /*
    Ловушка для роботов: поле спрятано от глаз и от читалок, человек его
    не заполнит. Заполненное — молча отвечаем «получилось» и ничего не
    пишем: сказать роботу правду значит подсказать ему, как обойти.
  */
  if (String(form.get("company") ?? "").length > 0) return { status: "ok" };

  const email = normaliseEmail(String(form.get("email") ?? ""));
  if (!looksLikeEmail(email)) return { status: "invalid" };

  const rawLocale = String(form.get("locale") ?? DEFAULT_LOCALE);
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const source = String(form.get("source") ?? "").slice(0, 40) || null;

  if (!isSupabaseConfigured()) return { status: "error" };

  try {
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, unsubscribed_at")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      /*
        Человек уже в списке. Если он когда-то отписался и подписывается
        снова — снимаем отметку: это его прямая просьба писать ему опять.
      */
      if (existing.unsubscribed_at) {
        await supabase
          .from("subscribers")
          .update({ unsubscribed_at: null, locale })
          .eq("id", existing.id);
        return { status: "ok" };
      }
      return { status: "already" };
    }

    const { data, error } = await supabase
      .from("subscribers")
      .insert({ email, locale, source })
      .select("token")
      .single();

    if (error || !data) return { status: "error" };

    /*
      Письмо уходит после записи, а не вместо неё, и его неудача не
      отменяет подписку: адрес уже сохранён, а Resend может быть выключен
      или временно недоступен. Внутри send() ошибки и так проглатываются.
    */
    await sendSubscribeWelcome({ to: email, locale, token: data.token });

    return { status: "ok" };
  } catch {
    return { status: "error" };
  }
}

/**
 * Отписка по токену из письма.
 * Возвращает false, если такой ссылки нет, — страница скажет об этом.
 */
export async function unsubscribeByToken(token: string): Promise<boolean> {
  const value = token.trim();
  // Токен — 48 шестнадцатеричных знаков. Всё прочее даже не спрашиваем.
  if (!/^[0-9a-f]{16,128}$/i.test(value)) return false;
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("token", value)
      .select("id")
      .maybeSingle();

    return Boolean(data) && !error;
  } catch {
    return false;
  }
}
