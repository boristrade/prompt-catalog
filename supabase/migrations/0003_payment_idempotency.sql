-- Идемпотентность вебхука оплаты: одно уведомление — одно продление.
-- Выполнить в Supabase: SQL Editor → вставить целиком → Run.

/*
  NOWPayments шлёт IPN на каждую смену статуса платежа, а не один раз.
  У одной оплаты это обычно waiting → confirming → confirmed → finished,
  и confirmed, и finished сервер уже засчитывает как «оплачено» — так
  задумано, чтобы не ждать зачисления лишних минут. Но это же значит, что
  на один платёж уведомление «оплачено» приходит дважды, и без защиты
  extend_access выполнялся бы дважды: человек, оплативший 30 дней,
  получал бы 60.

  order_id — надёжный ключ дедупликации: он собирается один раз при
  создании счёта (buildOrderId кладёт в него метку времени), и одинаковый
  order_id может прийти только у повторного уведомления по тому же
  платежу, а не у новой оплаты.
*/
create table if not exists public.processed_payments (
  order_id     text primary key,
  processed_at timestamptz not null default now()
);

revoke all on table public.processed_payments from public, anon, authenticated;

/*
  Отметка «обработан» и продление доступа — одной функцией, а не двумя
  отдельными запросами из обработчика. Раздельно они не атомарны: если
  extend_access упадёт уже после того, как строка в processed_payments
  создана, платёж навсегда останется помеченным как обработанный, а
  доступ так и не откроется — и повторное уведомление от NOWPayments,
  которое как раз и должно было его починить, будет молча проигнорировано.

  Здесь обе операции — часть одного вызова функции: если extend_access
  бросит исключение, отменится и вставка в processed_payments, и
  вызывающий получит обычную ошибку вместо тихого «уже обработано».

  unique_violation по order_id ловим отдельно и явно: это не ошибка, а
  штатный повтор уведомления о том же платеже.
*/
create or replace function public.record_payment_and_extend(
  p_order_id text,
  p_code text,
  p_days int
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_until timestamptz;
begin
  insert into public.processed_payments (order_id) values (p_order_id);

  v_until := public.extend_access(p_code, p_days);

  return jsonb_build_object('duplicate', false, 'pro_until', v_until);
exception
  when unique_violation then
    return jsonb_build_object('duplicate', true, 'pro_until', null);
end;
$$;

revoke all on function public.record_payment_and_extend(text, text, int)
  from public, anon, authenticated;
