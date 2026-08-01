import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { siteUrl } from "@/lib/site";

/*
  Партнёрский кабинет: ссылка и заработок.

  Читаем от имени самого партнёра, а не сервисным ключом: политика на
  referrals пускает к своим строкам и только к ним. Так даже ошибка в
  этом файле не покажет чужие продажи — за это отвечает база, а не
  аккуратность кода здесь.
*/

export interface PartnerStats {
  code: string;
  link: string;
  /** Оплат, приведённых партнёром. */
  sales: number;
  /** Заработано всего. */
  earned: number;
  /** Уже выплачено. */
  paidOut: number;
  /** К выплате: заработано минус выплаченное. */
  pending: number;
}

export async function getPartnerStats(
  locale: string,
): Promise<PartnerStats | null> {
  if (!isSupabaseConfigured()) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const supabase = await createClient();

    const [profile, referrals] = await Promise.all([
      supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("referrals").select("commission, paid_out"),
    ]);

    const code = (profile.data?.referral_code as string | undefined) ?? "";
    if (!code) return null;

    const rows = (referrals.data ?? []) as {
      commission: number;
      paid_out: boolean;
    }[];

    /*
      Суммируем в центах и делим один раз в конце. Складывать дробные
      доллары по одному — верный способ получить 23.999999999999996 в
      отчёте о деньгах.
    */
    const cents = (value: number) => Math.round(value * 100);
    const earned = rows.reduce((sum, r) => sum + cents(r.commission), 0);
    const paidOut = rows
      .filter((r) => r.paid_out)
      .reduce((sum, r) => sum + cents(r.commission), 0);

    return {
      code,
      /*
        Ссылка ведёт на язык, с которого партнёр её скопировал: он и
        приводит людей из своей аудитории. Параметр ловит middleware.
      */
      link: `${siteUrl()}/${locale}?ref=${code}`,
      sales: rows.length,
      earned: earned / 100,
      paidOut: paidOut / 100,
      pending: (earned - paidOut) / 100,
    };
  } catch {
    // База недоступна — страница покажет описание программы без
    // статистики, а не упадёт целиком.
    return null;
  }
}
