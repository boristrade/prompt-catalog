import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/*
  Клиент Cryptomus. Подпись у них такая: md5(base64(тело) + api_key).

  Тонкость, на которой ломается большинство интеграций: подпись считается
  от JSON-строки, а PHP на их стороне экранирует слэши (\/), тогда как
  JSON.stringify — нет. Любой url в теле — и подписи расходятся.
  Поэтому сериализуем сами и экранируем слэши руками, а подписываем ровно
  ту строку, которую отправляем: иначе подпись описывала бы не то тело.
*/

const API = "https://api.cryptomus.com/v1";

function escapeSlashes(json: string): string {
  return json.replace(/\//g, "\\/");
}

function sign(payload: string, apiKey: string): string {
  return createHash("md5")
    .update(Buffer.from(payload).toString("base64") + apiKey)
    .digest("hex");
}

function equal(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export interface Invoice {
  uuid: string;
  orderId: string;
  url: string;
}

export async function createInvoice(params: {
  amount: string;
  orderId: string;
  callbackUrl: string;
  returnUrl: string;
}): Promise<Invoice> {
  const merchant = process.env.CRYPTOMUS_MERCHANT_ID;
  const apiKey = process.env.CRYPTOMUS_API_KEY;
  if (!merchant || !apiKey) {
    throw new Error("CRYPTOMUS_MERCHANT_ID и CRYPTOMUS_API_KEY не заданы");
  }

  const body = escapeSlashes(
    JSON.stringify({
      amount: params.amount,
      currency: "USD",
      order_id: params.orderId,
      url_callback: params.callbackUrl,
      url_return: params.returnUrl,
      url_success: params.returnUrl,
    }),
  );

  const response = await fetch(`${API}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      merchant,
      sign: sign(body, apiKey),
    },
    body,
  });

  const json = (await response.json()) as {
    state?: number;
    message?: string;
    result?: { uuid?: string; order_id?: string; url?: string };
  };

  // У Cryptomus state 0 — успех, всё остальное ошибка, причём HTTP при
  // этом может быть 200. Проверять только response.ok недостаточно.
  if (!response.ok || json.state !== 0 || !json.result?.url) {
    throw new Error(json.message ?? `Cryptomus ответил ${response.status}`);
  }

  return {
    uuid: json.result.uuid ?? "",
    orderId: json.result.order_id ?? params.orderId,
    url: json.result.url,
  };
}

/**
 * Проверяет подпись уведомления. Возвращает разобранное тело или null.
 * На вход только сырая строка: разбирать до проверки подписи нельзя.
 */
export function verifyWebhook(raw: string): Record<string, unknown> | null {
  const apiKey = process.env.CRYPTOMUS_API_KEY;
  if (!apiKey) return null;

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }

  const received = data.sign;
  if (typeof received !== "string" || !received) return null;

  const { sign: _omit, ...rest } = data;
  void _omit;
  const json = JSON.stringify(rest);

  /*
    Сверяем с двумя вариантами сериализации — со экранированными слэшами
    и без. Это не ослабляет проверку: обе подписи считаются от одних и тех
    же данных с тем же ключом, и без ключа подделать нельзя ни одну.
    Зато уведомление не отвергается из-за разницы в экранировании.
  */
  const candidates = [sign(escapeSlashes(json), apiKey), sign(json, apiKey)];
  if (!candidates.some((c) => equal(c, received))) return null;

  return data;
}

/*
  Оплаченным считаем только эти два статуса. paid_over — заплатили больше
  нужного, доступ всё равно открываем. Недоплата приходит как
  wrong_amount и доступа не даёт.
*/
const PAID = new Set(["paid", "paid_over"]);

export function isPaid(status: unknown): boolean {
  return typeof status === "string" && PAID.has(status);
}
