-- Счётчик копирований промтов.
-- Выполнить в Supabase: SQL Editor → вставить целиком → Run.

/*
  Сколько раз промт скопировали.

  Зачем это нужно, кроме цифры на странице: каталог из двух сотен промтов
  растёт вслепую. Без счётчика неизвестно, какие из них действительно
  забирают, а какие пролистывают, — и следующая пачка пишется по
  ощущениям. Со счётчиком видно, в какую сторону расширять.

  Строка на промт, а не строка на каждое копирование: показываем мы
  только итог, а таблица «кто и когда скопировал» через месяц стала бы
  сотнями тысяч строк, которые никто не читает.

  Идентификатор — текстовый id промта из кода, а не внешний ключ:
  каталог живёт в репозитории, а не в базе. Промт, переименованный в
  коде, просто начинает счёт заново — это честнее, чем показывать чужие
  цифры под новым именем.
*/
create table if not exists public.prompt_copies (
  prompt_id text primary key,
  count bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.prompt_copies enable row level security;

/*
  Читать может кто угодно, включая незалогиненного: цифра стоит на
  открытой странице промта и должна доезжать до всех.
*/
drop policy if exists "prompt_copies are readable by everyone" on public.prompt_copies;
create policy "prompt_copies are readable by everyone"
  on public.prompt_copies for select
  using (true);

/*
  Писать напрямую нельзя никому — ни анониму, ни вошедшему. Прибавляет
  только функция ниже: она выполняется с правами владельца и умеет ровно
  одно — увеличить счётчик на единицу. Разреши мы insert/update, любой
  желающий выставил бы своему промту миллион, а чужому ноль.
*/

create or replace function public.bump_prompt_copy(p_prompt_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  /*
    Пустое и слишком длинное отбрасываем молча: id промтов короткие, а в
    аргумент прилетает то, что прислал браузер. Без проверки таблица за
    ночь набьётся мусором с чужой страницы.
  */
  if p_prompt_id is null or length(p_prompt_id) = 0 or length(p_prompt_id) > 80 then
    return;
  end if;

  insert into public.prompt_copies as c (prompt_id, count)
  values (p_prompt_id, 1)
  on conflict (prompt_id) do update
    set count = c.count + 1,
        updated_at = now();
end;
$$;

revoke all on function public.bump_prompt_copy(text) from public;
grant execute on function public.bump_prompt_copy(text) to anon, authenticated;
