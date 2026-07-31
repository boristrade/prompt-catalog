import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/*
  Клиент NOWPayments.

  Запросы авторизуются заголовком x-api-key. Уведомления об оплате
  подписываются иначе — HMAC-SHA512 по IPN-ключу, и это разные ключи:
  API-ключ из раздела API keys, секрет из Instant payment notifications.
*/

const API = "https://api.nowpayments.io/v1";

/*
  Подпись считается от JSON с ключами, отсортированными по алфавиту, —
  и на вложенных объектах тоже. Порядок ключей в присланном теле
  произвольный, поэтому подписать его как есть нельзя: подпись не сойдётся.
*/
function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortDeep((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

export interface Invoice {
  id: string;
  url: string;
}

export async function createInvoice(params: {
  amount: number;
  orderId: string;
  description: string;
  callbackUrl: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<Invoice> {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) throw new Error("NOWPAYMENTS_API_KEY не задан");

  const response = await fetch(`${API}/invoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({
      price_amount: params.amount,
      price_currency: "usd",
      order_id: params.orderId,
      order_description: params.description,
      ipn_callback_url: params.callbackUrl,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    }),
  });

  const json = (await response.json()) as {
    id?: string | number;
    invoice_url?: string;
    message?: string;
  };

  if (!response.ok || !json.invoice_url) {
    throw new Error(json.message ?? `NOWPayments ответил ${response.status}`);
  }

  return { id: String(json.id ?? ""), url: json.invoice_url };
}

/**
 * Проверяет подпись уведомления. Возвращает разобранное тело или null.
 * На вход сырая строка: разбирать до проверки подписи нельзя.
 */
/*
  PHP и Python по умолчанию экранируют не-ASCII в \uXXXX (json_encode без
  JSON_UNESCAPED_UNICODE, json.dumps с ensure_ascii=True), а JSON.stringify
  оставляет символы как есть. Байты разные — HMAC разный.

  Пока в описании заказа была одна латиница, разницы не было. С русским
  названием тарифа подпись перестала сходиться: у нас «PRO на месяц», у
  них «PRO на месяц».

  Суррогатные пары экранируются по одной кодовой единице UTF-16 — ровно
  так же делают PHP и Python, поэтому посимвольный обход подходит.
*/
function escapeNonAscii(json: string): string {
  return json.replace(/[-￿]/g, (char) =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}

function matches(expected: string, signature: string): boolean {
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  // Разная длина — сразу мимо, иначе timingSafeEqual бросит исключение.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Проверяет подпись уведомления. Возвращает разобранное тело или null.
 * На вход сырая строка: разбирать до проверки подписи нельзя.
 */
export function verifyIpn(
  raw: string,
  signature: string | null,
): Record<string, unknown> | null {
  // trim: их же пример подписи делает trim($notification_key). Лишний
  // перевод строки, прилипший при вставке ключа в форму, ломал бы всё
  // молча.
  const secret = process.env.NOWPAYMENTS_IPN_SECRET?.trim();
  if (!secret || !signature) return null;

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }

  /*
    Подписываем пересобранный объект, а не присланную строку, — так
    описано у NOWPayments и так делают их примеры.

    Форм две, потому что на той стороне не JavaScript: сверяем и с
    экранированием не-ASCII, и без него. Обе считаются от одних данных
    одним ключом, поэтому проверка от этого не слабеет — вопрос
    по-прежнему один: знает ли отправитель секрет.

    Одно место остаётся хрупким: после JSON.parse число 59.0 неотличимо
    от 59. Если настоящий платёж однажды не пройдёт проверку, причину
    покажет лог ниже, а не молчание.
  */
  const canonical = JSON.stringify(sortDeep(data));

  const ok = [canonical, escapeNonAscii(canonical)].some((variant) =>
    matches(createHmac("sha512", secret).update(variant).digest("hex"), signature),
  );

  if (!ok) {
    // Ни секрета, ни ожидаемой подписи в лог не пишем: по ним подбирают
    // ключ. Идентификатора заказа достаточно, чтобы найти платёж.
    console.error("nowpayments: подпись не сошлась", {
      orderId: typeof data.order_id === "string" ? data.order_id : "?",
      status: data.payment_status,
    });
    return null;
  }

  return data;
}

/*
  Оплаченным считаем только эти статусы. finished — деньги дошли и
  конвертированы. confirmed — подтверждено сетью, до зачисления остаются
  минуты; ждать их незачем, доступ открывается сразу.

  partially_paid сюда не входит намеренно: человек заплатил меньше
  нужного, и открывать полный доступ не за что.
*/
const PAID = new Set(["finished", "confirmed"]);

export function isPaid(status: unknown): boolean {
  return typeof status === "string" && PAID.has(status);
}
