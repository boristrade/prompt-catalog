import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { isLocale, matchLocale } from "@/lib/i18n/config";

/** Заголовок, из которого корневой layout узнаёт язык страницы. */
export const LOCALE_HEADER = "x-locale";

/*
  Язык живёт в адресе: /fr/pricing. Так страницу можно переслать и
  проиндексировать на каждом языке отдельно — с одним адресом на все
  языки поисковик увидел бы только одну версию.

  Выбор запоминается в cookie: вернувшись, человек попадает на свой
  язык, а не на угаданный по заголовкам браузера.
*/
const COOKIE = "locale";
const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
} as const;

function localeFromPath(pathname: string): string | null {
  const first = pathname.split("/")[1];
  return first && isLocale(first) ? first : null;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const current = localeFromPath(pathname);

  // Языка в адресе нет — уводим на подходящий и запоминаем выбор.
  if (!current) {
    const saved = request.cookies.get(COOKIE)?.value;
    const locale =
      saved && isLocale(saved)
        ? saved
        : matchLocale(request.headers.get("accept-language"));

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    url.search = search;

    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(COOKIE, locale, COOKIE_OPTIONS);
    return redirect;
  }

  /*
    Язык в адресе есть. Передаём его дальше заголовком: корневой layout
    рисует <html lang>, а прочитать сегмент пути оттуда нельзя.
  */
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, current);

  let response = NextResponse.next({ request: { headers } });
  response.cookies.set(COOKIE, current, COOKIE_OPTIONS);

  if (!isSupabaseConfigured()) return response;

  /*
    Токен доступа живёт около часа. Без обновления сессия слетала бы,
    и пользователь «разлогинивался» сам собой.
  */
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request: { headers } });
        response.cookies.set(COOKIE, current, COOKIE_OPTIONS);
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
    /*
      Пропускаем статику и картинки. api и auth — тоже: их зовут машины
      и внешние сервисы, языковой префикс им только помешал бы.

      robots.txt и sitemap.xml — по той же причине, но забыть их особенно
      обидно: поисковик просит их по единственному адресу в корне, а мы
      уводили его на /en/robots.txt, то есть на 404. Карта сайта была бы
      написана и никем не прочитана.
    */
    "/((?!api|auth|robots\\.txt|sitemap\\.xml|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
