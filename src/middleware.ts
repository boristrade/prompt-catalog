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

/** Код партнёра из реферальной ссылки. */
export const REF_COOKIE = "ref";
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

  /*
    Код партнёра из ссылки вида /ru?ref=ABC12345 кладём в cookie и
    забываем про адрес: человек почти никогда не покупает на первом же
    экране — уйдёт читать каталог, вернётся завтра. Держим 30 дней, как
    принято в партнёрских программах.

    Перезаписываем на каждой новой ссылке, но привязка к аккаунту всё
    равно случится один раз и навсегда — за это отвечает attach_referrer
    в базе, а не cookie, которую человек волен менять как угодно.
  */
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref && /^[A-Za-z0-9]{4,16}$/.test(ref)) {
    response.cookies.set(REF_COOKIE, ref.toUpperCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

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

      /r/ — реферальные ссылки: маршрут сам ставит cookie и уводит на
      нужный язык. Языковой префикс превратил бы /r/КОД в /ru/r/КОД, то
      есть в несуществующую страницу, и партнёрские ссылки перестали бы
      работать.

      .html в том же списке — из-за файлов подтверждения прав в поисковых
      панелях. Google просит положить googleXXXX.html в корень и забирает
      его строго по этому адресу: увели бы на /en/googleXXXX.html — и
      подтверждение не прошло бы, причём без внятной причины. Своих
      страниц с расширением .html у нас нет, так что список ничего не
      перехватывает.
    */
    "/((?!api|auth|r/|robots\\.txt|sitemap\\.xml|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)",
  ],
};
