import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { REF_COOKIE } from "@/middleware";

/*
  Общая точка возврата для обоих способов входа.

  Google и ссылка из письма по умолчанию приходят с параметром code —
  его меняем на сессию. Но code завязан на PKCE: секрет остаётся в том
  браузере, который начал вход, и при открытии письма на другом устройстве
  обмен не сработает. На этот случай поддерживаем и token_hash — он
  проверяется на сервере Supabase и от устройства не зависит.
*/
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Куда вернуть пользователя. Разрешаем только внутренние пути,
  // иначе параметр next стал бы открытым редиректом на чужой сайт.
  const nextParam = searchParams.get("next") ?? "/";
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";

  if (!isSupabaseConfigured() || (!code && !tokenHash)) {
    return NextResponse.redirect(`${origin}/login?error=config`);
  }

  const supabase = await createClient();

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        token_hash: tokenHash!,
        type: type ?? "email",
      });

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=exchange`);
  }

  /*
    Привязываем партнёра, чью ссылку человек открыл до регистрации.
    Момент выбран не случайно: здесь мы впервые знаем, кто это, и делаем
    это ровно один раз за вход, а не на каждой странице.

    Проверки «не привязывать себя к себе» и «не перебивать уже
    привязанного» живут в attach_referrer: cookie в браузере человек
    правит как хочет, а функция в базе — нет.
  */
  const ref = request.cookies.get(REF_COOKIE)?.value;
  if (ref) {
    try {
      await supabase.rpc("attach_referrer", { p_code: ref });
    } catch {
      // Партнёрская привязка не должна ломать вход: не вышло — человек
      // всё равно попадает на сайт, просто продажа никому не засчитается.
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
