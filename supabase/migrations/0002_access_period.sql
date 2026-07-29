-- Доступ на срок вместо вечного тарифа.
-- Выполнить в Supabase: SQL Editor → вставить целиком → Run.

/*
  Автосписание требует ФОП или юрлица, поэтому оплата разовая: человек
  платит за месяц или за год, и доступ живёт до даты. Колонка plan этого
  выразить не могла — она знала только «pro», но не «до какого числа».

  pro_until становится единственным источником правды: доступ есть, пока
  дата в будущем. Держать рядом ещё и plan значило бы завести два ответа
  на один вопрос и однажды получить разные.
*/

alter table public.profiles
  add column if not exists pro_until timestamptz;

/*
  Код платежа. Человек вставляет его в комментарий к оплате, обработчик
  по нему находит, кому открывать доступ. Восемь символов в верхнем
  регистре: достаточно коротко, чтобы переписать вручную с телефона, и
  достаточно случайно, чтобы не подобрать чужой.
*/
alter table public.profiles
  add column if not exists payment_code text;

update public.profiles
set payment_code = upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
where payment_code is null;

alter table public.profiles
  alter column payment_code set default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

alter table public.profiles
  alter column payment_code set not null;

create unique index if not exists profiles_payment_code_idx
  on public.profiles (payment_code);

-- Переносим тех, кому PRO выдали вручную: считаем доступ бессрочным.
update public.profiles
set pro_until = 'infinity'::timestamptz
where plan = 'pro' and pro_until is null;

alter table public.profiles drop column if exists plan;

/*
  Продление доступа. Вызывается только сервисным ключом с сервера, из
  браузера сюда не попасть: политики на update у profiles по-прежнему нет.

  Считаем от максимума между «сейчас» и текущей датой окончания — иначе
  оплата за месяц, сделанная заранее, обнуляла бы остаток уже купленного.
*/
create or replace function public.extend_access(code text, days int)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  result timestamptz;
begin
  update public.profiles
  set pro_until = greatest(coalesce(pro_until, now()), now()) + make_interval(days => days)
  where payment_code = code
  returning pro_until into result;

  return result;
end;
$$;

-- Функция меняет оплаченный доступ, поэтому вызывать её может только сервер.
revoke all on function public.extend_access(text, int) from public, anon, authenticated;
