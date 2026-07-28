import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/*
  Выход делаем POST-запросом, а не ссылкой: GET-ссылку может дёрнуть
  предзагрузка браузера или чужая страница, и пользователя выкинет
  из аккаунта без его ведома.
*/
export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(`${origin}/`, { status: 303 });
}
