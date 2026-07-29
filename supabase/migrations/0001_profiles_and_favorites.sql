-- Личный кабинет: тариф пользователя и его избранные промты.
-- Выполнить в Supabase: SQL Editor → вставить целиком → Run.

-- ── Профили ───────────────────────────────────────────────────────────
-- Тариф хранится отдельно от auth.users: в служебную таблицу Supabase
-- писать нельзя, а user_metadata правится самим пользователем из браузера
-- и на неё нельзя опираться в вопросах доступа.

create table if not exists public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  plan       text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Свой профиль виден владельцу" on public.profiles;
create policy "Свой профиль виден владельцу"
  on public.profiles for select
  using (auth.uid() = id);

-- Менять тариф пользователь не может: политики на update нет вовсе.
-- Апгрейд будет ставить обработчик оплаты сервисным ключом, в обход RLS.

-- Профиль заводится сам при регистрации, иначе первый вход оставлял бы
-- пользователя без строки и весь кабинет пришлось бы обвешивать проверками.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Тем, кто зарегистрировался до этой миграции, профиль создаём вручную.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- ── Избранное ─────────────────────────────────────────────────────────
-- prompt_id — текстовый идентификатор из каталога в коде, а не внешний
-- ключ: сами промты лежат в репозитории, а не в базе.

create table if not exists public.favorites (
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  prompt_id  text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

alter table public.favorites enable row level security;

-- Три отдельные политики вместо одной «for all»: читать, добавлять и
-- удалять можно только свои строки, и каждое право видно по отдельности.
drop policy if exists "Избранное видно владельцу" on public.favorites;
create policy "Избранное видно владельцу"
  on public.favorites for select
  using (auth.uid() = user_id);

drop policy if exists "Добавлять можно только себе" on public.favorites;
create policy "Добавлять можно только себе"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "Удалять можно только своё" on public.favorites;
create policy "Удалять можно только своё"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Кабинет запрашивает избранное одного пользователя, отсортированное по дате.
create index if not exists favorites_user_created_idx
  on public.favorites (user_id, created_at desc);
