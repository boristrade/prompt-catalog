import { headers } from "next/headers";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/supabase/server";
import type { SessionUser } from "@/components/layout/UserMenu";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LOCALE_HEADER } from "@/middleware";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PrompTom — AI prompt catalogue",
    template: "%s — PrompTom",
  },
  description:
    "Curated AI prompts for designers, marketers, UGC creators and marketplace sellers.",
};

/*
  Выставляем тему до первой отрисовки, иначе при сохранённом «светло»
  страница успевает мигнуть тёмным. Скрипт крошечный и синхронный.
*/
const themeInit = `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){d.setAttribute("data-theme",t)}}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /*
    Язык кладёт в заголовок middleware. Прочитать сегмент пути из
    корневого layout нельзя, а <html lang> нужен именно здесь: он
    подсказывает переносы, озвучку и предложение перевести страницу.
  */
  const raw = (await headers()).get(LOCALE_HEADER) ?? "";
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDictionary(locale);

  // Данные Google приходят в user_metadata: имя и ссылка на аватар.
  const account = await getCurrentUser();
  const user: SessionUser | null = account
    ? {
        email: account.email ?? "",
        name:
          (account.user_metadata?.full_name as string | undefined) ??
          (account.user_metadata?.name as string | undefined) ??
          "",
        avatarUrl:
          (account.user_metadata?.avatar_url as string | undefined) ?? null,
      }
    : null;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {/* Inter — единственная гарнитура. Подключаем через <link>,
            а не next/font, чтобы сборка не требовала сети. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header user={user} locale={locale} t={t} />
        <main className="flex-1 w-full max-w-[1120px] mx-auto px-5 md:px-8">
          {children}
        </main>
        <Footer locale={locale} t={t} />
      </body>
    </html>
  );
}
