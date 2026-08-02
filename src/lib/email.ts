import "server-only";
import { Resend } from "resend";

/*
  Письма через Resend.

  Ключа может не быть — так же, как Supabase бывает не настроен: сайт не
  должен падать оттого, что почта не подключена. Функции здесь тихо
  ничего не делают, если RESEND_API_KEY не задан, а не бросают исключение:
  вызывающий код (вебхук оплаты, задача по расписанию) не обязан знать,
  включена почта или нет.

  Отправитель обязан быть на подтверждённом в Resend домене — иначе
  письма или не уходят вовсе, или падают в спам. Пока свой домен не
  подтверждён, RESEND_FROM можно не задавать: тогда используется
  sandbox-адрес Resend, письма с которого доходят только на почту
  владельца аккаунта Resend. Это ожидаемое ограничение на время
  настройки, не баг.
*/

let client: Resend | null = null;

function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

function from(): string {
  return process.env.RESEND_FROM?.trim() || "PrompTom <onboarding@resend.dev>";
}

/*
  Каждая отправка обёрнута так, чтобы ошибка почтового сервиса не мешала
  тому, что вызвало письмо: доступ уже открыт до этого вызова, платёж уже
  засчитан, и если Resend сейчас недоступен, это не повод откатывать
  оплату или повторять вебхук. В лог попадает только факт сбоя, без тела
  письма и без адреса — тот же принцип, что у логов подписи NOWPayments:
  минимум подробностей, которые могут утечь.
*/
async function send(to: string, subject: string, html: string): Promise<void> {
  const client = resend();
  if (!client) return;

  try {
    await client.emails.send({ from: from(), to, subject, html });
  } catch (e) {
    console.error("email: отправка не удалась", e instanceof Error ? e.message : e);
  }
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === "ru" ? "ru" : "en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/*
  Общая обёртка письма. Простой HTML без внешних стилей и картинок:
  почтовые клиенты режут и то и другое непредсказуемо, а тут читать
  нечего, кроме текста и одной ссылки.
*/
function layout(body: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:32px 20px;background:#09090f;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#f5f5fa;">
<div style="max-width:480px;margin:0 auto;">
<div style="font-weight:700;letter-spacing:-0.02em;font-size:18px;margin-bottom:24px;">
Promp<span style="color:#a78bfa;">Tom</span>
</div>
${body}
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #1c1c2b;font-size:12px;color:#7c7c95;">
promptom.app
</div>
</div>
</body></html>`;
}

/** Подтверждение оплаты — уходит сразу после того, как вебхук открыл доступ. */
export async function sendPaymentReceipt(params: {
  to: string;
  locale: string;
  amount: number;
  periodLabel: string;
  proUntil: string;
}): Promise<void> {
  const ru = params.locale === "ru";
  const until = formatDate(params.proUntil, params.locale);
  const amount = params.amount.toFixed(2);

  const subject = ru ? "Оплата получена" : "Payment received";
  const body = ru
    ? `<p style="font-size:15px;line-height:1.6;">Оплата на сумму <b>$${amount}</b> получена, доступ PRO открыт.</p>
<p style="font-size:15px;line-height:1.6;">Тариф: ${params.periodLabel}<br>Доступ открыт до: <b>${until}</b></p>
<p style="font-size:13px;line-height:1.6;color:#9d9db4;">Это письмо — единственное подтверждение оплаты в криптовалюте: банковской выписки для неё не бывает. Сохраните его.</p>`
    : `<p style="font-size:15px;line-height:1.6;">Payment of <b>$${amount}</b> received, PRO access is open.</p>
<p style="font-size:15px;line-height:1.6;">Plan: ${params.periodLabel}<br>Access valid until: <b>${until}</b></p>
<p style="font-size:13px;line-height:1.6;color:#9d9db4;">This email is your only proof of a crypto payment — there is no bank statement for it. Keep it.</p>`;

  await send(params.to, subject, layout(body));
}

/** Напоминание за несколько дней до конца доступа. */
export async function sendExpiryNotice(params: {
  to: string;
  locale: string;
  proUntil: string;
}): Promise<void> {
  const ru = params.locale === "ru";
  const until = formatDate(params.proUntil, params.locale);
  const url = "https://promptom.app";
  const link = `${url}/${params.locale}/pricing`;

  const subject = ru ? "Доступ PRO скоро закончится" : "Your PRO access is ending soon";
  const body = ru
    ? `<p style="font-size:15px;line-height:1.6;">Доступ PRO открыт до <b>${until}</b>. После этого закрытые промты снова спрячутся за замком.</p>
<p style="font-size:15px;line-height:1.6;"><a href="${link}" style="color:#a78bfa;">Продлить доступ</a></p>
<p style="font-size:13px;line-height:1.6;color:#9d9db4;">Оплата разовая, автосписаний нет — если продлевать не нужно, ничего делать не надо.</p>`
    : `<p style="font-size:15px;line-height:1.6;">PRO access is open until <b>${until}</b>. After that, locked prompts go back behind the paywall.</p>
<p style="font-size:15px;line-height:1.6;"><a href="${link}" style="color:#a78bfa;">Renew access</a></p>
<p style="font-size:13px;line-height:1.6;color:#9d9db4;">Payment is one-time, nothing renews on its own — if you don't want to renew, there's nothing to do.</p>`;

  await send(params.to, subject, layout(body));
}

/** Уведомление партнёру о новом начислении. */
export async function sendCommissionNotice(params: {
  to: string;
  locale: string;
  commission: number;
}): Promise<void> {
  const ru = params.locale === "ru";
  const amount = params.commission.toFixed(2);
  const url = "https://promptom.app";
  const link = `${url}/${params.locale}/partner`;

  const subject = ru ? "Новое начисление по вашей ссылке" : "New commission on your link";
  const body = ru
    ? `<p style="font-size:15px;line-height:1.6;">По вашей партнёрской ссылке прошла оплата — начислено <b>$${amount}</b>.</p>
<p style="font-size:15px;line-height:1.6;"><a href="${link}" style="color:#a78bfa;">Открыть кабинет партнёра</a></p>`
    : `<p style="font-size:15px;line-height:1.6;">Someone paid through your referral link — you earned <b>$${amount}</b>.</p>
<p style="font-size:15px;line-height:1.6;"><a href="${link}" style="color:#a78bfa;">Open partner dashboard</a></p>`;

  await send(params.to, subject, layout(body));
}
