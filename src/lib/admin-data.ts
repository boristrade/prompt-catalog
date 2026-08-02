import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  /** До какого момента открыт PRO. null — не покупался. */
  proUntil: Date | null;
  endless: boolean;
  paymentCode: string;
  favorites: number;
}

/*
  Почты лежат в auth.users, а срок доступа — в public.profiles. Читаем
  обе и сшиваем по id: одним запросом их не взять, служебная схема
  Supabase из обычного select недоступна.

  Постранично: за один вызов listUsers отдаёт ограниченное число, и на
  сотне пользователей молча показывать первую страницу как «всех» —
  худший вид ошибки, потому что выглядит как правда.
*/
export async function listUsers(page = 1, perPage = 100): Promise<{
  users: AdminUser[];
  hasMore: boolean;
}> {
  const supabase = createAdminClient();

  const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
    page,
    perPage,
  });
  if (authError) throw new Error(authError.message);

  const ids = authData.users.map((u) => u.id);

  /*
    Страница за пределами реального списка (например, ?page=99 у
    четырёх пользователей) — не ошибка, а пустой результат: authData.users
    тогда пуст, и .in("id", []) отправлять незачем. Полагаться на то, как
    PostgREST разберёт пустой список, не стоит — это деталь конкретной
    версии клиента, а не документированное поведение, на которое стоит
    рассчитывать.
  */
  const [{ data: profiles }, { data: favorites }] =
    ids.length === 0
      ? [{ data: [] }, { data: [] }]
      : await Promise.all([
          supabase
            .from("profiles")
            .select("id, pro_until, payment_code")
            .in("id", ids),
          supabase.from("favorites").select("user_id").in("user_id", ids),
        ]);

  const byId = new Map(
    (profiles ?? []).map((p) => [p.id as string, p]),
  );

  const favCount = new Map<string, number>();
  for (const row of favorites ?? []) {
    const id = row.user_id as string;
    favCount.set(id, (favCount.get(id) ?? 0) + 1);
  }

  const users = authData.users.map((u): AdminUser => {
    const profile = byId.get(u.id);
    const raw = profile?.pro_until as string | null | undefined;

    // 'infinity' из Postgres в Date не превращается — помечаем отдельно,
    // иначе дата уехала бы в Invalid Date и таблица показала бы мусор.
    const endless = raw === "infinity";
    const proUntil = raw && !endless ? new Date(raw) : null;

    return {
      id: u.id,
      email: u.email ?? "",
      name:
        (u.user_metadata?.full_name as string | undefined) ??
        (u.user_metadata?.name as string | undefined) ??
        "",
      createdAt: u.created_at,
      proUntil,
      endless,
      paymentCode: (profile?.payment_code as string | undefined) ?? "",
      favorites: favCount.get(u.id) ?? 0,
    };
  });

  // Новые сверху: смотреть админку приходят из-за свежей оплаты.
  users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { users, hasMore: authData.users.length === perPage };
}

export function hasPro(user: AdminUser): boolean {
  if (user.endless) return true;
  return user.proUntil !== null && user.proUntil.getTime() > Date.now();
}

/*
  Поиск идёт по уже загруженной странице: listUsers в Supabase искать не
  умеет, а тянуть всю базу ради подстроки — плохой размен. Пока людей
  меньше сотни, разницы нет; когда станет больше, страница честно скажет,
  что ищет в пределах текущей выборки.
*/
export function filterUsers(users: AdminUser[], query: string): AdminUser[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return users;

  return users.filter((u) =>
    [u.email, u.name, u.paymentCode].some((field) =>
      field.toLowerCase().includes(needle),
    ),
  );
}

export interface AdminStats {
  total: number;
  pro: number;
  endless: number;
  favorites: number;
}

export function statsOf(users: AdminUser[]): AdminStats {
  return {
    total: users.length,
    pro: users.filter(hasPro).length,
    endless: users.filter((u) => u.endless).length,
    favorites: users.reduce((sum, u) => sum + u.favorites, 0),
  };
}

/*
  Партнёры и их вознаграждение.

  Сервисным ключом, в обход RLS: владельцу нужно видеть всех, а политика
  на referrals показывает только свои строки. Здесь это оправдано — файл
  и так серверный, и попасть в него из браузера нельзя.
*/
export interface Partner {
  id: string;
  email: string;
  code: string;
  /** Переходов по ссылке. */
  clicks: number;
  /** Зарегистрировались по ссылке. */
  signups: number;
  /** Из них оплатили хотя бы раз. */
  buyers: number;
  sales: number;
  earned: number;
  pending: number;
}

export async function listPartners(): Promise<Partner[]> {
  const supabase = createAdminClient();

  /*
    Воронка и начисления читаются отдельно и по разным причинам: воронка
    есть даже у того, кто пока никого не привёл к оплате, а начисления —
    только у того, кто привёл. Партнёр без продаж, но с переходами, тоже
    должен быть виден: по нему и понятно, что ссылка работает, а
    конверсии нет.
  */
  const [{ data: rows, error }, { data: overview }] = await Promise.all([
    supabase.from("referrals").select("partner_id, commission, paid_out"),
    supabase.rpc("partners_overview"),
  ]);
  if (error) throw new Error(error.message);

  const funnel = new Map(
    ((overview ?? []) as {
      partner_id: string;
      clicks: number;
      signups: number;
      paid: number;
    }[]).map((f) => [f.partner_id, f]),
  );

  if ((!rows || rows.length === 0) && funnel.size === 0) return [];

  /*
    Суммируем в центах и делим один раз в конце: складывать дробные
    доллары по одному — верный способ получить 23.999999999999996 в
    отчёте о деньгах.
  */
  const cents = (value: number) => Math.round(Number(value) * 100);
  const totals = new Map<string, { sales: number; earned: number; pending: number }>();

  for (const row of rows ?? []) {
    const id = row.partner_id as string;
    const value = cents(row.commission as number);
    const current = totals.get(id) ?? { sales: 0, earned: 0, pending: 0 };

    current.sales += 1;
    current.earned += value;
    if (!row.paid_out) current.pending += value;
    totals.set(id, current);
  }

  // Объединяем: кто-то есть только в воронке, кто-то только в начислениях.
  const ids = [...new Set([...totals.keys(), ...funnel.keys()])];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, referral_code")
    .in("id", ids);
  const codeById = new Map(
    (profiles ?? []).map((p) => [p.id as string, p.referral_code as string]),
  );

  /*
    Почты лежат в auth.users и одним запросом по списку id не берутся:
    служебная схема Supabase из обычного select недоступна. Читаем
    страницу пользователей и сопоставляем — партнёров в разы меньше, чем
    пользователей, так что одной страницы хватает надолго.
  */
  const { data: authData } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  const emailById = new Map(
    (authData?.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  const partners = ids.map((id): Partner => {
    const total = totals.get(id) ?? { sales: 0, earned: 0, pending: 0 };
    const f = funnel.get(id);
    return {
      id,
      email: emailById.get(id) ?? "",
      code: codeById.get(id) ?? "",
      clicks: f?.clicks ?? 0,
      signups: Number(f?.signups ?? 0),
      buyers: Number(f?.paid ?? 0),
      sales: total.sales,
      earned: total.earned / 100,
      pending: total.pending / 100,
    };
  });

  /*
    Сверху те, кому больше должны, — с них начинается разбор выплат.
    Дальше по заработку, потом по переходам: партнёр без продаж, но с
    трафиком, тоже интересен — с ним есть о чём поговорить.
  */
  partners.sort(
    (a, b) =>
      b.pending - a.pending || b.earned - a.earned || b.clicks - a.clicks,
  );
  return partners;
}
