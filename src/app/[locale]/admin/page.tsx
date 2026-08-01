import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarClock,
  Heart,
  Infinity as InfinityIcon,
  Search,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { currentAdmin } from "@/lib/admin";
import { filterUsers, hasPro, listUsers, statsOf, type AdminUser } from "@/lib/admin-data";
import { extendAccess, grantEndless, revokeAccess } from "@/lib/admin-actions";
import { PERIODS } from "@/lib/billing";
import { pageLocale } from "@/lib/i18n";

/*
  Админка. Одна страница на одного человека, поэтому без перевода на шесть
  языков: тексты интерфейса здесь читает только владелец сайта.

  Список пользователей и сроки доступа меняются постоянно — отдавать
  страницу из предсборки нельзя.
*/
export const dynamic = "force-dynamic";

/*
  Заголовок ставим только своему. Next вычисляет метаданные и тогда, когда
  страница отвечает notFound() — без этой проверки посторонний получал бы
  «страница не найдена» с заголовком «Админка» и по нему узнавал, что
  адрес рабочий. Из поиска страницу убираем в любом случае.
*/
export async function generateMetadata() {
  const admin = await currentAdmin();
  return {
    title: admin ? "Админка" : undefined,
    robots: { index: false, follow: false },
  };
}

const PER_PAGE = 100;

function formatDate(date: Date): string {
  return date.toLocaleDateString("ru", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function accessLabel(user: AdminUser): { text: string; tone: "pro" | "free" } {
  if (user.endless) return { text: "Бессрочно", tone: "pro" };
  if (!user.proUntil) return { text: "Не покупал", tone: "free" };

  const days = Math.ceil((user.proUntil.getTime() - Date.now()) / 86400000);
  if (days <= 0) {
    return { text: `Истёк ${formatDate(user.proUntil)}`, tone: "free" };
  }
  return { text: `До ${formatDate(user.proUntil)} · ${days} дн.`, tone: "pro" };
}

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string; msg?: string }>;
}) {
  const { locale } = await pageLocale(params);

  /*
    notFound, а не редирект на вход: посторонний должен увидеть обычную
    «страница не найдена» и не узнать, что по этому адресу что-то есть.
  */
  const admin = await currentAdmin();
  if (!admin) notFound();

  const sp = await searchParams;
  const query = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);

  const { users: all, hasMore } = await listUsers(page, PER_PAGE);
  const users = filterUsers(all, query);
  const stats = statsOf(all);

  // Строку запроса возвращаем в действия, чтобы после нажатия кнопки
  // человек остался на том же фильтре и той же странице.
  const back = new URLSearchParams();
  if (query) back.set("q", query);
  if (page > 1) back.set("page", String(page));
  const backQuery = back.toString();

  const cards = [
    { icon: Users, label: "Пользователей", value: stats.total },
    { icon: ShieldCheck, label: "С доступом", value: stats.pro },
    { icon: InfinityIcon, label: "Бессрочных", value: stats.endless },
    { icon: Heart, label: "В избранном", value: stats.favorites },
  ];

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">Служебное</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[40px]">
        Админка
      </h1>
      <p className="rise rise-2 mt-3 text-[13.5px] text-muted">
        Вход: {admin.email}
      </p>

      <Link
        href={`/${locale}/admin/partners`}
        className="rise rise-3 mt-4 inline-flex items-center gap-2 rounded-chip border border-line-strong px-4 py-2 text-[13px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.97]"
      >
        <Wallet size={14} className="text-accent" />
        Партнёры и выплаты
      </Link>

      {sp.msg && (
        <div className="mt-6 rounded-card border border-violet/40 bg-surface px-5 py-3.5 text-[13.5px] text-ink">
          {sp.msg}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-card border border-line bg-surface p-4"
          >
            <span className="flex items-center gap-2 text-[12px] text-muted">
              <card.icon size={13} className="text-accent" />
              {card.label}
            </span>
            <div className="mt-2 font-mono text-[22px] text-ink">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <form method="get" className="mt-8 flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Почта, имя или код платежа"
            className="w-full rounded-chip border border-line bg-surface py-2.5 pl-10 pr-4 text-[13.5px] text-ink outline-none transition-[border-color] duration-200 placeholder:text-faint focus:border-line-strong"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-chip border border-line-strong px-5 py-2.5 text-[13.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.97]"
        >
          Найти
        </button>
      </form>

      {query && (
        <p className="mt-3 text-[12.5px] text-faint">
          Найдено {users.length} из {all.length} на этой странице.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {users.map((user) => {
          const access = accessLabel(user);
          const pro = hasPro(user);

          return (
            <div
              key={user.id}
              className={`rounded-card border bg-surface p-5 ${
                pro ? "border-violet/35" : "border-line"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-ink">
                    {user.email || "— без почты —"}
                  </div>
                  <div className="mt-1 text-[12.5px] text-muted">
                    {user.name && `${user.name} · `}
                    Регистрация {formatDate(new Date(user.createdAt))}
                    {user.favorites > 0 && ` · ${user.favorites} в избранном`}
                  </div>
                  <div className="mt-2 font-mono text-[11.5px] tracking-[0.08em] text-faint">
                    {user.paymentCode || "код не выдан"}
                  </div>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-chip border px-3 py-1.5 text-[11.5px] ${
                    access.tone === "pro"
                      ? "border-accent/40 text-accent"
                      : "border-line-strong text-muted"
                  }`}
                >
                  {user.endless ? (
                    <InfinityIcon size={12} />
                  ) : (
                    <CalendarClock size={12} />
                  )}
                  {access.text}
                </span>
              </div>

              {/*
                Каждая кнопка — отдельная форма: у server action нет
                способа отличить, какую из них нажали, кроме как по тому,
                какая форма отправилась.
              */}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                {(["monthly", "yearly"] as const).map((period) => (
                  <form key={period} action={extendAccess}>
                    <input type="hidden" name="id" value={user.id} />
                    <input type="hidden" name="code" value={user.paymentCode} />
                    <input type="hidden" name="period" value={period} />
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="query" value={backQuery} />
                    <button
                      type="submit"
                      disabled={!user.paymentCode}
                      className="rounded-chip border border-line-strong px-3.5 py-2 text-[12.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.97] disabled:opacity-40"
                    >
                      +{PERIODS[period].days} дней
                    </button>
                  </form>
                ))}

                <form action={grantEndless}>
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="query" value={backQuery} />
                  <button
                    type="submit"
                    className="rounded-chip border border-line-strong px-3.5 py-2 text-[12.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.97]"
                  >
                    Навсегда
                  </button>
                </form>

                {(pro || user.proUntil) && (
                  <form action={revokeAccess}>
                    <input type="hidden" name="id" value={user.id} />
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="query" value={backQuery} />
                    <button
                      type="submit"
                      className="rounded-chip border border-line px-3.5 py-2 text-[12.5px] font-medium text-muted transition-[color,border-color] duration-200 hover:border-line-strong hover:text-ink"
                    >
                      Закрыть
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="rounded-card border border-dashed border-line-strong bg-surface p-10 text-center text-[13.5px] text-muted">
            {query ? "Никого не нашлось" : "Пользователей пока нет"}
          </div>
        )}
      </div>

      {(page > 1 || hasMore) && (
        <div className="mt-8 flex items-center justify-between">
          {page > 1 ? (
            <a
              href={`/${locale}/admin?page=${page - 1}`}
              className="rounded-chip border border-line-strong px-4 py-2.5 text-[13px] text-ink transition-[background-color] duration-200 hover:bg-sunken"
            >
              Назад
            </a>
          ) : (
            <span />
          )}
          <span className="font-mono text-[12px] text-faint">
            Страница {page}
          </span>
          {hasMore ? (
            <a
              href={`/${locale}/admin?page=${page + 1}`}
              className="rounded-chip border border-line-strong px-4 py-2.5 text-[13px] text-ink transition-[background-color] duration-200 hover:bg-sunken"
            >
              Вперёд
            </a>
          ) : (
            <span />
          )}
        </div>
      )}
    </section>
  );
}
