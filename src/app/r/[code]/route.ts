import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { REF_COOKIE } from "@/middleware";
import { isLocale, matchLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

/*
  Реферальная ссылка: /r/ABC12345.

  Отдельным маршрутом, а не параметром ?ref=, ровно ради счётчика.
  Middleware работает на Edge и на каждый переход по сайту — ходить
  оттуда в базу значило бы замедлить все страницы ради одной цифры.
  Здесь же обычный серверный обработчик: посчитал и увёл дальше.

  Старый вид ссылки /ru?ref=КОД продолжает работать: те, что уже
  разосланы партнёрами, не должны перестать приводить людей. Просто
  переход по ним не попадает в счётчик.
*/
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code: raw } = await params;
  const code = raw.trim().toUpperCase();

  // Язык берём тот же, что выбрал бы сайт: свой сохранённый или по браузеру.
  const saved = request.cookies.get("locale")?.value;
  const locale =
    saved && isLocale(saved)
      ? saved
      : matchLocale(request.headers.get("accept-language"));

  const target = new URL(`/${locale ?? DEFAULT_LOCALE}`, request.url);
  const response = NextResponse.redirect(target);

  // Мусорный код просто уводим на главную: ни cookie, ни счётчика.
  if (!/^[A-Z0-9]{4,16}$/.test(code)) return response;

  response.cookies.set(REF_COOKIE, code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  /*
    Один переход на человека, а не на просмотр: если код в cookie уже
    тот же, значит этот же браузер уже приходил по этой ссылке. Иначе
    обновление страницы накручивало бы счётчик само.
  */
  const already = request.cookies.get(REF_COOKIE)?.value === code;

  if (!already && isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.rpc("count_referral_click", { p_code: code });
    } catch {
      // Счётчик — не повод не пустить человека на сайт: молча уводим
      // дальше, переход просто не попадёт в статистику.
    }
  }

  return response;
}
