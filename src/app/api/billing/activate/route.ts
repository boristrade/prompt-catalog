import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PERIODS, type PeriodId } from "@/lib/billing";

export const dynamic = "force-dynamic";

/*
  Открывает оплаченный доступ по коду из комментария к платежу.

  Точка входа одна и не зависит от платёжной системы: сюда одинаково
  постучится и обработчик Donatello, и запрос руками, когда деньги
  пришли мимо автоматики. Менять сайт при смене платёжки не придётся.
*/

function authorized(request: NextRequest): boolean {
  const secret = process.env.BILLING_WEBHOOK_SECRET;
  // Без секрета маршрут закрыт полностью: пустая строка не должна
  // случайно совпасть с пустым заголовком и открыть доступ всем.
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  // Разная длина сама по себе утечка, но сравнивать всё равно посимвольно
  // нельзя: по времени ответа подбирают значение символ за символом.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  let body: { code?: unknown; period?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  const period = String(body.period ?? "") as PeriodId;

  if (!code || !(period in PERIODS)) {
    return NextResponse.json(
      { error: "code и period обязательны", periods: Object.keys(PERIODS) },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("extend_access", {
      code,
      days: PERIODS[period].days,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Функция возвращает null, когда строки с таким кодом нет.
    if (!data) {
      return NextResponse.json({ error: "код не найден" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, proUntil: data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    );
  }
}
