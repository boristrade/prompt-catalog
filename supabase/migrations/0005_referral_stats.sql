-- Статистика партнёра: переходы, регистрации, оплаты.
-- Выполнить в Supabase: SQL Editor → вставить целиком → Run.

/*
  Счётчик переходов по ссылке. Простым числом, без таблицы событий: на
  этом этапе нужен ответ «сколько», а не «когда каждый». Таблица на
  каждый клик выросла бы быстрее всех остальных вместе взятых и ничего
  бы к решениям не добавила.
*/
alter table public.profiles
  add column if not exists referral_clicks integer not null default 0;

/*
  Почта приглашённого, скрытая до первой буквы: b***@gmail.com.

  Партнёру нужно видеть, что регистрации живые и разные, — для этого
  хватает маски. Полная почта здесь была бы передачей чужих контактов
  третьему лицу без согласия: человек регистрировался на сайте, а не
  соглашался, что его адрес увидит тот, кто привёл его по ссылке.
*/
create or replace function public.mask_email(p_email text)
returns text
language sql
immutable
as $$
  select case
    when p_email is null or position('@' in p_email) = 0 then '—'
    else left(split_part(p_email, '@', 1), 1) || '***@' || split_part(p_email, '@', 2)
  end;
$$;

/*
  Засчитать переход. Зовётся сервером из /r/КОД.

  Накрутить счётчик может кто угодно, открыв ссылку сто раз, — это
  свойство любого счётчика переходов, а не изъян этого. На деньги он не
  влияет: вознаграждение считается по таблице referrals, куда попадают
  только подтверждённые оплаты.
*/
create or replace function public.count_referral_click(p_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set referral_clicks = referral_clicks + 1
  where referral_code = upper(trim(p_code));
$$;

revoke all on function public.count_referral_click(text) from public, anon, authenticated;

/*
  Воронка партнёра одним запросом: переходы → регистрации → оплаты, и
  список приглашённых.

  security definer, потому что почты лежат в auth.users, куда обычному
  пользователю ходу нет. Но выборка жёстко ограничена своими: v_me
  берётся из auth.uid(), а не из аргумента, — подставить чужой id и
  посмотреть чужую воронку нельзя.
*/
create or replace function public.partner_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me     uuid := auth.uid();
  v_clicks integer;
  v_people jsonb;
begin
  if v_me is null then
    return null;
  end if;

  select referral_clicks into v_clicks
  from public.profiles
  where id = v_me;

  select coalesce(jsonb_agg(row order by row ->> 'joined' desc), '[]'::jsonb)
  into v_people
  from (
    select jsonb_build_object(
      'email', public.mask_email(u.email),
      'joined', p.created_at,
      'paid', exists (
        select 1 from public.referrals r
        where r.buyer_id = p.id and r.partner_id = v_me
      )
    ) as row
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.referred_by = v_me
  ) people;

  return jsonb_build_object(
    'clicks', coalesce(v_clicks, 0),
    'people', v_people
  );
end;
$$;

revoke all on function public.partner_stats() from public, anon;
grant execute on function public.partner_stats() to authenticated;

/*
  То же самое для владельца: воронка по каждому партнёру.
  Читается сервисным ключом из админки, обычным пользователям недоступна.
*/
create or replace function public.partners_overview()
returns table (
  partner_id  uuid,
  clicks      integer,
  signups     bigint,
  paid        bigint
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.referral_clicks,
    (select count(*) from public.profiles c where c.referred_by = p.id),
    (select count(distinct r.buyer_id) from public.referrals r where r.partner_id = p.id)
  from public.profiles p
  where p.referral_clicks > 0
     or exists (select 1 from public.profiles c where c.referred_by = p.id);
$$;

revoke all on function public.partners_overview() from public, anon, authenticated;
