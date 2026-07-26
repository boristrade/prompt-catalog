import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="mt-40 border-t border-graphite">
      <div className="mx-auto max-w-[1216px] px-5 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-[22px] text-white">
              Promp<span className="text-copper">Tom</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-fog">
              Каталог отобранных AI-промтов для работы и творчества.
            </p>
          </div>

          <div>
            <div className="text-[13px] font-semibold tracking-tight text-fog">
              Каталог
            </div>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/prompts/${c.slug}`}
                    className="text-sm text-mist transition-colors hover:text-white"
                  >
                    {c.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[13px] font-semibold tracking-tight text-fog">
              Разделы
            </div>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/tools" className="text-sm text-mist transition-colors hover:text-white">
                  Полезные инструменты
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-mist transition-colors hover:text-white">
                  Вход и регистрация
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[13px] font-semibold tracking-tight text-fog">
              Поддержка
            </div>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="mailto:support@example.com"
                  className="text-sm text-copper transition-opacity hover:opacity-80"
                >
                  Написать нам
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-graphite pt-6 text-[13px] text-ash">
          © {new Date().getFullYear()} PrompTom. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
