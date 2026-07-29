import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, Heart, LogOut, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { getAccount } from "@/lib/account";
import { getPromptById, isLocked, veil } from "@/lib/prompts";
import { getCategory } from "@/lib/categories";
import PromptCard from "@/components/PromptCard";
import Reveal from "@/components/Reveal";

/*
  Страница зависит от вошедшего пользователя: избранное, тариф и замки на
  PRO-промтах у каждого свои. Без этой строки Next пытается отдать её из
  предсборки, и один посетитель увидел бы состояние другого.
*/
export const dynamic = "force-dynamic";

export const metadata = { title: "Кабинет" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=%2Faccount");

  const account = await getAccount();
  const plan = account?.plan ?? "free";

  // Бессрочный доступ, выданный руками, показывать датой незачем.
  const until = account?.proUntil ?? null;
  const endless = until !== null && until.getFullYear() > 9000;
  const daysLeft =
    until && !endless
      ? Math.max(0, Math.ceil((until.getTime() - Date.now()) / 86400000))
      : null;

  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    "";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  /*
    Избранное могло быть добавлено, а промт потом убран из каталога —
    тогда getPromptById вернёт undefined. Просто пропускаем такие записи,
    иначе кабинет падал бы из-за старой строки в базе.
  */
  const favorites = [...(account?.favorites ?? [])]
    .map(getPromptById)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">Кабинет</p>

      <div className="rise rise-1 mt-6 flex flex-col gap-5 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {avatar ? (
            // Аватар с домена Google — обычный img, чтобы не заводить
            // remotePatterns под каждый возможный CDN.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              width={52}
              height={52}
              className="h-[52px] w-[52px] rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="grad-fill flex h-[52px] w-[52px] items-center justify-center rounded-full text-[20px] font-semibold">
              {(name || user.email || "?").charAt(0).toUpperCase()}
            </span>
          )}

          <div className="min-w-0">
            <div className="truncate text-[17px] font-semibold text-ink">
              {name || "Аккаунт"}
            </div>
            <div className="mt-0.5 truncate text-[13px] text-muted">
              {user.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={`rounded-chip px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] ${
              plan === "pro"
                ? "border border-accent/40 text-accent"
                : "border border-line-strong text-muted"
            }`}
          >
            {plan === "pro" ? "PRO" : "FREE"}
          </span>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-chip border border-line-strong px-3.5 py-2 text-[13px] font-medium text-muted transition-[color,background-color,transform] duration-200 hover:bg-sunken hover:text-ink active:scale-[0.97]"
            >
              <LogOut size={14} />
              Выйти
            </button>
          </form>
        </div>
      </div>

      {plan === "pro" && !endless && until && (
        <Reveal delay={60}>
          <div className="mt-4 flex flex-col gap-4 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 shrink-0 text-accent">
                <CalendarClock size={16} />
              </span>
              <div>
                <div className="text-[14.5px] font-semibold text-ink">
                  Доступ до{" "}
                  {until.toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {/* Про отсутствие автосписания говорим прямо: человек
                      вправе знать, что деньги сами не спишутся. */}
                  Осталось {daysLeft} дн. Подписка не продлевается сама —
                  продлите вручную, когда срок подойдёт к концу.
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 rounded-chip border border-line-strong px-5 py-2.5 text-center text-[13.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.97]"
            >
              Продлить
            </Link>
          </div>
        </Reveal>
      )}

      {plan === "free" && (
        <Reveal delay={60}>
          <div className="mt-4 flex flex-col gap-4 rounded-card border border-violet/40 bg-surface p-6 shadow-[0_20px_60px_-40px_var(--glow)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 shrink-0 text-accent">
                <Sparkles size={16} />
              </span>
              <div>
                <div className="text-[14.5px] font-semibold text-ink">
                  Откройте весь каталог
                </div>
                <p className="mt-1 max-w-md text-[13px] leading-relaxed text-muted">
                  PRO-промты сейчас под замком. С подпиской открываются все, и
                  новые подборки приходят каждый месяц.
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="grad-fill shrink-0 rounded-chip px-5 py-2.5 text-center text-[13.5px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              Смотреть тарифы
            </Link>
          </div>
        </Reveal>
      )}

      <div className="mt-14 flex items-center gap-2.5">
        <Heart size={15} className="text-accent" />
        <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">
          Избранное
        </h2>
        <span className="font-mono text-[11.5px] text-faint">
          {favorites.length}
        </span>
      </div>

      {favorites.length > 0 ? (
        <div className="mt-6 grid items-start gap-3 lg:grid-cols-2">
          {favorites.map((p, i) => {
            const locked = isLocked(p, plan);
            return (
              <Reveal key={p.id} delay={(i % 2) * 70}>
                <PromptCard
                  prompt={locked ? veil(p) : p}
                  locked={locked}
                  favorited
                  signedIn
                />
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-card border border-dashed border-line-strong bg-surface p-10 text-center">
          <p className="text-[13.5px] leading-relaxed text-muted">
            Пока пусто. Нажмите на сердечко у любого промта в каталоге — он
            появится здесь.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["designers", "marketers", "ugc", "marketplaces"].map((slug) => {
              const cat = getCategory(slug);
              if (!cat) return null;
              return (
                <Link
                  key={slug}
                  href={`/prompts/${slug}`}
                  className="rounded-chip border border-line px-3.5 py-2 text-[12.5px] text-muted transition-[color,border-color] duration-200 hover:border-line-strong hover:text-ink"
                >
                  {cat.nav}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
