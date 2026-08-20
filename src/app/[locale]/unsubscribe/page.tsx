import Link from "next/link";
import { Check, X } from "lucide-react";
import { unsubscribeByToken } from "@/lib/subscribe";
import { pageLocale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/seo";

/*
  Отписка по ссылке из письма.

  Отписка происходит от одного открытия страницы, без кнопки
  «подтвердите». Обычно так не делают — почтовые клиенты подгружают
  ссылки заранее и могут отписать человека без его ведома. Здесь это
  меньшее из двух зол: письмо, от которого нельзя отписаться в один клик,
  помечают спамом, а следом за рассылкой в спам уходят чеки об оплате с
  того же домена. Случайно отписавшийся вернётся формой на сайте, а
  испорченную репутацию домена возвращают месяцами.

  Страницу не индексируем: в поиске ей делать нечего, а токен из адреса
  попал бы в чужие руки через ссылающиеся страницы.
*/
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  return {
    ...pageMeta({
      locale,
      path: "/unsubscribe",
      title: t.subscribe.leaveTitle,
      description: t.subscribe.leaveDone,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function UnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const { token } = await searchParams;

  const done = await unsubscribeByToken(token ?? "");

  return (
    <section className="flex min-h-[52vh] flex-col items-center justify-center py-16 text-center">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full border ${
          done
            ? "border-line-strong bg-accent-soft text-accent"
            : "border-line-strong text-muted"
        }`}
      >
        {done ? <Check size={20} /> : <X size={20} />}
      </span>

      <h1 className="font-display mt-6 text-[24px] leading-tight text-ink md:text-[30px]">
        {t.subscribe.leaveTitle}
      </h1>
      <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-muted">
        {done ? t.subscribe.leaveDone : t.subscribe.leaveFailed}
      </p>

      <Link
        href={`/${locale}`}
        className="mt-7 rounded-chip border border-line-strong px-5 py-2.5 text-[13.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.97]"
      >
        {t.subscribe.leaveBack}
      </Link>
    </section>
  );
}
