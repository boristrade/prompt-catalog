import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PrompTom — каталог AI-промтов",
    template: "%s — PrompTom",
  },
  description:
    "Отобранные AI-промты для дизайнеров, маркетологов, UGC-креаторов и продавцов маркетплейсов.",
};

/*
  Выставляем тему до первой отрисовки, иначе при сохранённом «светло»
  страница успевает мигнуть тёмным. Скрипт крошечный и синхронный.
*/
const themeInit = `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){d.setAttribute("data-theme",t)}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
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
        <Header />
        <main className="flex-1 w-full max-w-[1120px] mx-auto px-5 md:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
