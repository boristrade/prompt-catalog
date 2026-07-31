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

  const [{ data: profiles }, { data: favorites }] = await Promise.all([
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
