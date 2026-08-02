import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { PERIODS, commissionOf, parseOrderId } from "@/lib/billing";
import { isPaid, verifyIpn } from "@/lib/nowpayments";
import { sendCommissionNotice, sendPaymentReceipt } from "@/lib/email";

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

    /*
      Один платёж проходит confirmed и finished отдельными уведомлениями,
      и оба уже попали сюда как «оплачено» — иначе доступ ждал бы лишних
      минут до полного зачисления. Без защиты от повтора extend_access
      выполнялся бы на каждое уведомление, и доступ продлевался бы дважды
      за одну оплату.

      Отметка «обработан» и продление — одним вызовом record_payment_and_extend,
      а не двумя отдельными запросами: порознь они не атомарны. Если бы
      extend_access упал уже после успешной вставки в processed_payments,
      платёж навсегда остался бы помеченным обработанным, а доступ так и
      не открылся бы — и повторное уведомление, которое должно было это
      починить, было бы молча проигнорировано как дубль.
    */
    const { data: result, error } = await supabase.rpc(
      "record_payment_and_extend",
      {
        p_order_id: orderId,
        p_code: parsed.paymentCode,
        p_days: PERIODS[parsed.period].days,
        /*
          Сумму берём из своего справочника тарифов, а не из тела
          уведомления: там она пришла бы снаружи, и завышенное число
          обернулось бы завышенной выплатой партнёру.
        */
        p_amount: PERIODS[parsed.period].price,
        p_commission: commissionOf(PERIODS[parsed.period].price),
      },
    );

    if (error) {
      // 500 — чтобы NOWPayments повторил попытку: деньги уже получены,
      // и терять оплату из-за минутной недоступности базы нельзя.
      console.error("nowpayments: record_payment_and_extend", error.message);
      return NextResponse.json({ error: "db" }, { status: 500 });
    }

    const payload = result as {
      duplicate: boolean;
      pro_until: string | null;
      buyer_email: string | null;
      partner_email: string | null;
      commission: number;
    };
    if (payload.duplicate) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    if (!payload.pro_until) {
      console.error("nowpayments: код не найден", parsed.paymentCode);
      return NextResponse.json({ error: "код не найден" }, { status: 404 });
    }

    /*
      Письма шлём после того, как доступ уже открыт, и ждём их здесь же:
      после ответа serverless-функция может быть заморожена в любой
      момент, и незавершённая отправка оборвалась бы вместе с ней.
      sendPaymentReceipt и sendCommissionNotice сами глотают свои ошибки
      (см. email.ts) — упавшее письмо не превратится в 500 и не заставит
      NOWPayments повторить уведомление о том, что доступ уже открыт.
      Локали покупателя мы не знаем — IPN её не несёт, — поэтому пишем на
      языке сайта по умолчанию.
    */
    await Promise.all([
      payload.buyer_email
        ? sendPaymentReceipt({
            to: payload.buyer_email,
            locale: DEFAULT_LOCALE,
            amount: PERIODS[parsed.period].price,
            periodLabel: PERIODS[parsed.period].name,
            proUntil: payload.pro_until,
          })
        : Promise.resolve(),
      payload.partner_email && payload.commission > 0
        ? sendCommissionNotice({
            to: payload.partner_email,
            locale: DEFAULT_LOCALE,
            commission: payload.commission,
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true, proUntil: payload.pro_until });
  } catch (e) {
    console.error("nowpayments: сбой", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
