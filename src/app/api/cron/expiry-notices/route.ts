import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { sendExpiryNotice } from "@/lib/email";

export const dynamic = "force-dynamic";

/*
  Напоминание за три дня до конца доступа. Vercel вызывает этот адрес по
  расписанию (vercel.json) и подписывает вызов заголовком Authorization,
  собранным из CRON_SECRET, — так же, как NOWPayments подписывает вебхук
  своим ключом. Без проверки кто угодно, узнав адрес, мог бы гонять
  задачу вручную хоть каждую секунду: claim_expiry_notices один запуск
  переживёт спокойно, но смысла в этом нет, а рассылка чужому по чужому
  расписанию — это уже не мелочь.

  Нет ключа — не работаем вовсе. Раньше здесь было наоборот: при пустом
  CRON_SECRET проверка пропускалась, и адрес оставался открытым. Так и
  вышло на боевом сайте — переменную забыли задать, и рассылку мог
  запустить кто угодно, а снаружи это выглядело как исправно работающая
  задача. Молчаливо открытая дверь хуже явно закрытой: 503 видно в логах
  и в ответе, а открытый адрес не виден никак. То же правило, что у
  isAdminEmail: пустой список — значит никого, а не всех.
*/
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    console.error("expiry-notices: CRON_SECRET не задан — рассылка выключена");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, sent: 0, note: "not configured" });
  }

  const supabase = createAdminClient();

  /*
    claim_expiry_notices сама и выбирает получателей, и отмечает их
    отправленными — одним запросом. Раздельно выбор и пометка не
    атомарны: два запуска подряд (например, ручной перезапуск после
    сбоя) выбрали бы одних и тех же людей и написали бы им дважды.
  */
  const { data, error } = await supabase.rpc("claim_expiry_notices", {
    p_within_days: 3,
  });

  if (error) {
    console.error("expiry-notices: claim_expiry_notices", error.message);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  const due = (data ?? []) as {
    user_id: string;
    email: string;
    pro_until: string;
  }[];

  /*
    Письма шлём последовательно, а не Promise.all: это до сотни адресов
    раз в сутки, не тысячи, — и последовательная отправка не бьёт по
    лимиту запросов Resend в секунду, который параллельная бы задела на
    первом же десятке.
  */
  for (const person of due) {
    await sendExpiryNotice({
      to: person.email,
      locale: DEFAULT_LOCALE,
      proUntil: person.pro_until,
    });
  }

  return NextResponse.json({ ok: true, sent: due.length });
}
