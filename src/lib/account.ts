import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type Plan = "free" | "pro";

export interface Account {
  userId: string;
  plan: Plan;
  /** До какого момента открыт PRO. null — не покупался. */
  proUntil: Date | null;
  /** Код для комментария к оплате. */
  paymentCode: string | null;
  favorites: Set<string>;
}

/*
  Оплата разовая, поэтому тариф это не флаг, а срок: PRO есть, пока дата
  окончания в будущем. Так истёкший доступ закрывается сам, без задачи
  по расписанию, которая однажды не запустится.
*/
function planFrom(proUntil: Date | null): Plan {
  return proUntil && proUntil.getTime() > Date.now() ? "pro" : "free";
}

/*
  Всё, что странице нужно знать о вошедшем: доступ и избранное.
  Одним вызовом, чтобы каталог не ходил в базу дважды за рендер.

  Гость — это null, а не «пустой аккаунт»: тогда вызывающий код обязан
  разобрать этот случай явно и не покажет чужому человеку PRO-промты.
*/
export async function getAccount(): Promise<Account | null> {
  if (!isSupabaseConfigured()) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const supabase = await createClient();

    const [profile, favorites] = await Promise.all([
      supabase
        .from("profiles")
        .select("pro_until, payment_code")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("favorites")
        .select("prompt_id")
        .order("created_at", { ascending: false }),
    ]);

    const raw = profile.data?.pro_until as string | null | undefined;
    // 'infinity' из Postgres в Date не превращается — считаем такой доступ
    // бессрочным и подставляем заведомо далёкую дату.
    const proUntil = raw
      ? raw === "infinity"
        ? new Date(8640000000000000)
        : new Date(raw)
      : null;

    return {
      userId: user.id,
      plan: planFrom(proUntil),
      proUntil,
      paymentCode: (profile.data?.payment_code as string | undefined) ?? null,
      favorites: new Set(
        (favorites.data ?? []).map((row) => row.prompt_id as string),
      ),
    };
  } catch {
    // База недоступна — сайт остаётся каталогом. Считаем гостем,
    // иначе упала бы вся страница вместо одной кнопки.
    return null;
  }
}

export interface PaymentRecord {
  orderId: string;
  amount: number | null;
  days: number | null;
  proUntil: Date | null;
  processedAt: Date;
}

/*
  История платежей для кабинета. Читаем от имени самого пользователя —
  политика на processed_payments (миграция 0006) пускает только к своим
  строкам, так же как referrals пускает партнёра только к своим.

  Платежи, записанные до миграции 0006, попадут сюда с пустыми amount и
  days: тогда user_id у них тоже не проставлен (это старые строки без
  привязки к покупателю), и такая строка просто не найдётся по
  auth.uid() — значит в списке её и не будет. Никаких «платёж без
  подробностей» показывать не придётся.
*/
export async function getPaymentHistory(): Promise<PaymentRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("processed_payments")
      .select("order_id, amount, days, pro_until, processed_at")
      .order("processed_at", { ascending: false });

    return (data ?? []).map((row) => ({
      orderId: row.order_id as string,
      amount: row.amount as number | null,
      days: row.days as number | null,
      proUntil: row.pro_until ? new Date(row.pro_until as string) : null,
      processedAt: new Date(row.processed_at as string),
    }));
  } catch {
    return [];
  }
}
