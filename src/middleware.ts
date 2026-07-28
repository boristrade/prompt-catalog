import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

/*
  Токен доступа живёт около часа. Без обновления сессия слетала бы,
  и пользователь «разлогинивался» сам собой. Middleware продлевает её
  на каждом переходе и переписывает cookie в ответ.
*/
export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    // Сам вызов и продлевает сессию — результат здесь не нужен.
    await supabase.auth.getUser();
  } catch {
    // Недоступность Supabase не должна ронять навигацию по сайту:
    // каталог статичный и авторизации не требует.
  }

  return response;
}

export const config = {
  matcher: [
    // Пропускаем статику и картинки: там сессия ни к чему.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
