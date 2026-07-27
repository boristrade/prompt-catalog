import Link from "next/link";
import { Instagram, Send, Youtube } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const SOCIALS = [
  { href: "https://t.me", label: "Telegram", Icon: Send },
  { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
];

const SUPPORT = [
  { label: "Частые вопросы", href: "/tools" },
  { label: "Помощь", href: "/tools" },
  { label: "Обратная связь", href: "mailto:support@example.com" },
];

const LEGAL = [
  { label: "Политика конфиденциальности", href: "/login" },
  { label: "Условия использования", href: "/login" },
  { label: "Пользовательское соглашение", href: "/login" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sunken">
      <div className="mx-auto max-w-[1120px] px-5 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
          {/* Бренд */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grad-fill flex h-7 w-7 items-center justify-center rounded-[7px] text-[14px] font-bold">
                P
              </span>
              <span className="text-[17px] font-bold tracking-[-0.02em] text-ink">
                PrompTom
              </span>
            </div>
            <p className="mt-3.5 max-w-[32ch] text-[13.5px] leading-relaxed text-muted">
              Каталог отобранных AI-промтов для работы и творчества. С примерами
              результата и копированием в один клик.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <div className="text-[13px] font-semibold text-ink">Каталог</div>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/prompts/${c.slug}`}
                    className="text-[13.5px] text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {c.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <div className="text-[13px] font-semibold text-ink">Поддержка</div>
            <ul className="mt-4 space-y-2.5">
              {SUPPORT.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="text-[13.5px] text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Правовая информация */}
          <div>
            <div className="text-[13px] font-semibold text-ink">
              Правовая информация
            </div>
            <ul className="mt-4 space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] leading-snug text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Соцсети */}
          <div>
            <div className="text-[13px] font-semibold text-ink">
              Следите за нами
            </div>
            <div className="mt-4 flex items-center gap-2.5">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-chip border border-line bg-surface text-muted transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-violet hover:text-accent"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-center text-[12.5px] text-faint">
          © {new Date().getFullYear()} PrompTom. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
