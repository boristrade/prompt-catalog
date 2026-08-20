import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/*
  Сколько раз промт скопировали.

  Читаем на сервере и печатаем в разметке, а не догружаем из браузера:
  цифра стоит на открытой странице промта, её должен видеть и поисковик,
  и человек с выключенным JS.

  Считает база (см. миграцию 0007): прибавляет отдельная функция, которой
  разрешено ровно одно действие. Писать в таблицу напрямую не может
  никто, иначе любой желающий выставил бы своему промту миллион.

  Отсутствие базы — не ошибка. Сайт собирается и работает без Supabase,
  и страница промта в этом случае просто не показывает цифру.
*/

/** Ниже этого числа цифру не показываем: «скопировали 2 раза» — не довод. */
export const MIN_SHOWN = 25;

/**
 * Сколько раз скопировали каждый из этих промтов.
 * Промты, которых ещё не копировали, в ответе не появляются.
 */
export async function copyCounts(
  ids: string[],
): Promise<Record<string, number>> {
  if (!isSupabaseConfigured() || ids.length === 0) return {};

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("prompt_copies")
      .select("prompt_id, count")
      .in("prompt_id", ids);

    if (error || !data) return {};

    const counts: Record<string, number> = {};
    for (const row of data) {
      const value = Number(row.count);
      if (Number.isFinite(value) && value > 0) counts[row.prompt_id] = value;
    }
    return counts;
  } catch {
    // База недоступна — страница обязана открыться без цифры, а не упасть.
    return {};
  }
}

/** Сколько раз скопировали один промт. */
export async function copyCount(id: string): Promise<number> {
  return (await copyCounts([id]))[id] ?? 0;
}
