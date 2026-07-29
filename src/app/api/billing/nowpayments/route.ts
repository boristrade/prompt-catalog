import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PERIODS, parseOrderId } from "@/lib/billing";
import { isPaid, verifyIpn } from "@/lib/nowpayments";

export const dynamic = "force-dynamic";

/*
  Уведомление об оплате от NOWPayments.

  Тело читаем строкой и проверяем подпись до разбора: подписан присланный
  текст, а повторная сериализация разобранного объекта дала бы другую
  строку и другую подпись.

  Кто заплатил и за какой срок, берём из order_id — его мы сами составили
  при создании счёта. Подпись гарантирует, что его не подменили: IPN-ключ
  знаем только мы и NOWPayments.
*/
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const raw = await request.text();
  const data = verifyIpn(raw, request.headers.get("x-nowpayments-sig"));
  if (!data) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  // Не оплачено — отвечаем 200, иначе NOWPayments будет слать повторы.
  // waiting и confirming — нормальная часть жизни платежа, не ошибка.
  if (!isPaid(data.payment_status)) {
    return NextResponse.json({ ok: true, ignored: data.payment_status });
  }

  const orderId = typeof data.order_id === "string" ? data.order_id : "";
  const parsed = parseOrderId(orderId);
  if (!parsed) {
    console.error("nowpayments: не разобрал order_id", orderId);
    return NextResponse.json({ error: "bad order_id" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data: until, error } = await supabase.rpc("extend_access", {
      code: parsed.paymentCode,
      days: PERIODS[parsed.period].days,
    });

    if (error) {
      // 500 — чтобы NOWPayments повторил попытку: деньги уже получены,
      // и терять оплату из-за минутной недоступности базы нельзя.
      console.error("nowpayments: extend_access", error.message);
      return NextResponse.json({ error: "db" }, { status: 500 });
    }
    if (!until) {
      console.error("nowpayments: код не найден", parsed.paymentCode);
      return NextResponse.json({ error: "код не найден" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, proUntil: until });
  } catch (e) {
    console.error("nowpayments: сбой", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
