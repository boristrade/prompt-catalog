import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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

  return NextResponse.redirect(`${origin}${next}`);
}
