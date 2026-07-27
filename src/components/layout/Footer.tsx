import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-[1120px] px-5 py-12 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="text-[17px] font-semibold tracking-[-0.025em] text-ink">
              Promp<span className="text-accent">Tom</span>
            </div>
            <p className="mt-2.5 max-w-[30ch] text-[13.5px] leading-relaxed text-muted">
              Каталог отобранных AI-промтов для работы и творчества.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.13em] text-faint">
              Каталог
            </div>
            <ul className="mt-3.5 space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/prompts/${c.slug}`}
                    className="text-[13.5px] text-muted transition-colors hover:text-ink"
                  >
                    {c.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.13em] text-faint">
              Разделы
            </div>
            <ul className="mt-3.5 space-y-2">
              <li>
                <Link
                  href="/tools"
                  className="text-[13.5px] text-muted transition-colors hover:text-ink"
                >
                  Инструменты
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-[13.5px] text-muted transition-colors hover:text-ink"
                >
                  Вход и регистрация
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.13em] text-faint">
              Поддержка
            </div>
            <ul className="mt-3.5 space-y-2">
              <li>
                <a
                  href="mailto:support@example.com"
                  className="text-[13.5px] text-accent transition-opacity hover:opacity-80"
                >
                  Написать нам
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-5 font-mono text-[11px] text-faint">
          © {new Date().getFullYear()} PrompTom
        </div>
      </div>
    </footer>
  );
}
