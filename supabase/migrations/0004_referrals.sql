-- Партнёрская программа: реферальные ссылки и учёт вознаграждения.
-- Выполнить в Supabase: SQL Editor → вставить целиком → Run.

/*
  Код партнёра — публичный: его вставляют в описание канала, в сторис, в
  видео. Поэтому он отдельный от payment_code, который наоборот полу-
  секретный: по нему платёж находит аккаунт, и раздавать его нельзя.
  Один код на две роли однажды закончился бы тем, что чужая оплата
  открыла бы доступ не тому человеку.
*/
alter table public.profiles
  add column if not exists referral_code text;

update public.profiles
set referral_code = upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
where referral_code is null;

alter table public.profiles
  alter column referral_code set default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

alter table public.profiles
  alter column referral_code set not null;

create unique index if not exists profiles_referral_code_idx
  on public.profiles (referral_code);

/*
  Кто привёл этого человека. Ставится один раз при входе и больше не
  меняется: иначе последний, чью ссылку открыл покупатель, забирал бы
  чужую продажу — и партнёр, реально приведший клиента, остался бы ни с
  чем через месяц после своей работы.
*/
alter table public.profiles
  add column if not exists referred_by uuid references auth.users on delete set null;

-- ── Начисления ───────────────────────────────────────────────────────

/*
  Строка на каждую оплату, приведённую партнёром.

  order_id уникален: тот же ключ, что и у processed_payments. Повторное
  уведомление от NOWPayments не должно начислять вознаграждение дважды —
  ровно та же авария, что была с продлением доступа, только дороже:
  здесь это живые деньги наружу.
*/
create table if not exists public.referrals (
  order_id    text primary key,
  partner_id  uuid not null references auth.users on delete cascade,
  buyer_id    uuid references auth.users on delete set null,
  amount      numeric(10, 2) not null,
  commission  numeric(10, 2) not null,
  paid_out    boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists referrals_partner_idx
  on public.referrals (partner_id, created_at desc);

alter table public.referrals enable row level security;

/*
  Партнёр видит только свои начисления. Почты покупателей здесь нет
  намеренно: партнёру довольно знать, что продажа была и сколько он
  заработал, а кто именно купил — не его дело.
*/
drop policy if exists "Свои начисления видны партнёру" on public.referrals;
create policy "Свои начисления видны партнёру"
  on public.referrals for select
  using (auth.uid() = partner_id);

-- Писать может только сервер: политик на insert и update нет вовсе.

-- ── Привязка партнёра ────────────────────────────────────────────────

/*
  Вызывается при входе, если в браузере лежит код из реферальной ссылки.

  Три защиты, каждая закрывает свой способ обмануть счётчик:
  — привязка только если её ещё нет (первый партнёр не перебивается);
  — нельзя привязать себя к себе;
  — неизвестный код просто игнорируется.
*/
create or replace function public.attach_referrer(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner uuid;
begin
  select id into v_partner
  from public.profiles
  where referral_code = upper(trim(p_code));

  if v_partner is null or v_partner = auth.uid() then
    return false;
  end if;

  update public.profiles
  set referred_by = v_partner
  where id = auth.uid() and referred_by is null;

  return found;
end;
$$;

revoke all on function public.attach_referrer(text) from public, anon;
grant execute on function public.attach_referrer(text) to authenticated;

-- ── Оплата: продление + начисление одной транзакцией ─────────────────

/*
  Старая версия принимала три аргумента. Удаляем её и создаём одну
  функцию с необязательными суммами: вызов из трёх аргументов по-прежнему
  находит эту же функцию, поэтому выкатывать код и миграцию можно в любом
  порядке — оплата не сломается в промежутке.

  Начисление здесь же, а не отдельным запросом: если бы оно шло вторым
  вызовом и упало, доступ был бы открыт, платёж помечен обработанным, а
  партнёр не получил бы ничего — и починить это повторным уведомлением
  уже нельзя, оно вернулось бы как дубль.
*/
drop function if exists public.record_payment_and_extend(text, text, int);

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
  v_until   timestamptz;
  v_buyer   uuid;
  v_partner uuid;
begin
  insert into public.processed_payments (order_id) values (p_order_id);

  v_until := public.extend_access(p_code, p_days);

  -- Партнёра ищем у того же профиля, которому только что открыли доступ.
  select id, referred_by into v_buyer, v_partner
  from public.profiles
  where payment_code = p_code;

  if v_partner is not null and p_commission > 0 then
    insert into public.referrals (order_id, partner_id, buyer_id, amount, commission)
    values (p_order_id, v_partner, v_buyer, p_amount, p_commission);
  end if;

  return jsonb_build_object('duplicate', false, 'pro_until', v_until);
exception
  when unique_violation then
    return jsonb_build_object('duplicate', true, 'pro_until', null);
end;
$$;

revoke all on function public.record_payment_and_extend(text, text, int, numeric, numeric)
  from public, anon, authenticated;
