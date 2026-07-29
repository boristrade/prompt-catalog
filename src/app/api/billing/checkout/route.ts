import { NextResponse, type NextRequest } from "next/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured, siteUrl } from "@/lib/supabase/config";
import { PERIODS, buildOrderId, isPeriodId } from "@/lib/billing";
import { createInvoice } from "@/lib/cryptomus";

export const dynamic = "force-dynamic";

/*
  Создаёт счёт в Cryptomus и отдаёт ссылку на оплату.

  Сумма берётся с сервера из PERIODS, а не из тела запроса: иначе любой
  желающий выставил бы себе счёт на один цент и получил год доступа.
*/
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { period?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const periodId = String(body.period ?? "");
  if (!isPeriodId(periodId)) {
    return NextResponse.json({ error: "unknown period" }, { status: 400 });
  }
  const period = PERIODS[periodId];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("payment_code")
      .eq("id", user.id)
      .maybeSingle();

    const code = data?.payment_code as string | undefined;
    if (!code) {
      return NextResponse.json({ error: "нет профиля" }, { status: 500 });
    }

    const base = siteUrl();
    const invoice = await createInvoice({
      amount: period.price.toFixed(2),
      orderId: buildOrderId(code, period.id),
      callbackUrl: `${base}/api/billing/cryptomus`,
      returnUrl: `${base}/account`,
    });

    return NextResponse.json({ url: invoice.url });
  } catch (e) {
    // Наружу отдаём общее сообщение: текст ошибки платёжной системы
    // может содержать детали настройки мерчанта.
    console.error("checkout failed", e);
    return NextResponse.json(
      { error: "не удалось создать счёт" },
      { status: 502 },
    );
  }
}
