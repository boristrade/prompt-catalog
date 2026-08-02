-- История платежей в кабинете и письма о скором окончании доступа.
-- Выполнить в Supabase: SQL Editor → вставить целиком → Run.

/*
  До сих пор processed_payments хранил один только order_id: таблица
  заводилась как защита от повторного уведомления, и больше от неё
  ничего не требовалось. Но это единственное место, где вообще записан
  факт оплаты, — и человек в кабинете не может увидеть, когда платил и
  сколько. Добавляем недостающее сюда, а не заводим вторую таблицу:
  две записи об одном платеже однажды разошлись бы.

  Колонки необязательные: строки, записанные до этой миграции, останутся
  с пустыми суммами, и это честнее, чем проставить им выдуманные.
*/
alter table public.processed_payments
  add column if not exists user_id   uuid references auth.users on delete cascade,
  add column if not exists amount    numeric(10, 2),
  add column if not exists days      int,
  add column if not exists pro_until timestamptz;

create index if not exists processed_payments_user_idx
  on public.processed_payments (user_id, processed_at desc);

/*
  Свои платежи человек видит, чужие — нет. Право на select выдаём явно:
  в миграции 0003 таблица была закрыта целиком, и одной политики RLS без
  гранта не хватило бы — политика сужает доступ, а не открывает его.
*/
alter table public.processed_payments enable row level security;

drop policy if exists "Свои платежи видны владельцу" on public.processed_payments;
create policy "Свои платежи видны владельцу"
  on public.processed_payments for select
  using (auth.uid() = user_id);

grant select on table public.processed_payments to authenticated;

-- Писать по-прежнему может только сервер: политик на insert и update нет.

-- ── Отметка об отправленном письме ───────────────────────────────────

/*
  Когда человеку в последний раз написали, что доступ кончается. Без
  этой отметки задача по расписанию писала бы одно и то же каждый день,
  пока доступ не истечёт, — три письма подряд про одно и то же читаются
  как спам, и следующее письмо, уже важное, человек не откроет.
*/
alter table public.profiles
  add column if not exists expiry_notified_at timestamptz;

/*
  Кому пора написать — и сразу отметка, что написали.

  Выбор и пометка одним запросом намеренно: если бы отметка ставилась
  вторым вызовом и он не дошёл, следующий запуск отправил бы письмо
  повторно. Здесь худшее, что может случиться, — письмо не уйдёт вовсе
  из-за сбоя почтового сервиса уже после пометки. Из двух аварий эта
  тише: пропущенное напоминание человек не заметит, а три одинаковых
  письма подряд заметит обязательно и отпишется.

  update ... returning вместо select + update — та же причина: между
  двумя запросами два одновременных запуска задачи успели бы выбрать
  один и тот же список.
*/
create or replace function public.claim_expiry_notices(
  p_within_days int default 3
)
returns table (user_id uuid, email text, pro_until timestamptz)
language sql
security definer
set search_path = public
as $$
  with due as (
    update public.profiles p
    set expiry_notified_at = now()
    where p.pro_until is not null
      -- 'infinity' в интервалы не складывается и в сравнениях ведёт себя
      -- как «никогда не кончится» — таким писать не о чем.
      and p.pro_until <> 'infinity'
      and p.pro_until > now()
      and p.pro_until <= now() + make_interval(days => p_within_days)
      /*
        Не пишем повторно про тот же срок. Отметка старше текущего
        pro_until означает, что с прошлого письма человек уже продлил
        доступ, — про новый срок написать можно и нужно.
      */
      and (p.expiry_notified_at is null or p.expiry_notified_at < p.pro_until - make_interval(days => p_within_days))
    returning p.id, p.pro_until
  )
  select due.id, u.email::text, due.pro_until
  from due
  join auth.users u on u.id = due.id
  where u.email is not null;
$$;

revoke all on function public.claim_expiry_notices(int)
  from public, anon, authenticated;

-- ── Оплата: те же действия, плюс запись подробностей и почты ─────────

/*
  Функция делает ровно то же, что и раньше, и дополнительно:
  — записывает в processed_payments сумму, срок и владельца;
  — возвращает почты покупателя и партнёра.

  Почты возвращаются отсюда, а не запрашиваются обработчиком отдельно,
  по той же причине, по которой здесь же пишется начисление: лишний
  запрос из обработчика — это лишний способ не дойти до конца. Читать
  auth.users обычным select нельзя, а этой функции можно: она security
  definer.
*/
create or replace function public.record_payment_and_extend(
  p_order_id text,
  p_code text,
  p_days int,
  p_amount numeric default 0,
  p_commission numeric default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_until         timestamptz;
  v_buyer         uuid;
  v_partner       uuid;
  v_buyer_email   text;
  v_partner_email text;
begin
  insert into public.processed_payments (order_id) values (p_order_id);

  v_until := public.extend_access(p_code, p_days);

  select id, referred_by into v_buyer, v_partner
  from public.profiles
  where payment_code = p_code;

  update public.processed_payments
  set user_id = v_buyer, amount = p_amount, days = p_days, pro_until = v_until
  where order_id = p_order_id;

  if v_partner is not null and p_commission > 0 then
    insert into public.referrals (order_id, partner_id, buyer_id, amount, commission)
    values (p_order_id, v_partner, v_buyer, p_amount, p_commission);

    select email into v_partner_email from auth.users where id = v_partner;
  end if;

  select email into v_buyer_email from auth.users where id = v_buyer;

  return jsonb_build_object(
    'duplicate', false,
    'pro_until', v_until,
    'buyer_email', v_buyer_email,
    'partner_email', v_partner_email,
    'commission', p_commission
  );
exception
  when unique_violation then
    return jsonb_build_object('duplicate', true, 'pro_until', null);
end;
$$;

revoke all on function public.record_payment_and_extend(text, text, int, numeric, numeric)
  from public, anon, authenticated;
