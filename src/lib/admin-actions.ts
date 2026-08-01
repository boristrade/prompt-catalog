"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { currentAdmin } from "@/lib/admin";
import { PERIODS, type PeriodId } from "@/lib/billing";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

/*
  Действия админки. Каждое открывает или закрывает платный доступ, то
  есть по последствиям равно обработчику оплаты — и требования к нему
  такие же.

  Главное: currentAdmin() вызывается заново в каждом действии. Проверка
  при отрисовке страницы не значит ничего — действие приходит отдельным
  запросом, и его можно отправить, не открывая страницу вовсе.
*/

interface Target {
  id: string;
  paymentCode: string;
  /** Куда вернуться после действия: язык и текущий фильтр. */
  back: string;
}

function readTarget(form: FormData): Target {
  // DEFAULT_LOCALE, а не случайный язык: страница всегда шлёт своё
  // значение, запасной вариант нужен только если поле вдруг потерялось.
  const locale = String(form.get("locale") ?? DEFAULT_LOCALE);
  const query = String(form.get("query") ?? "");

  return {
    id: String(form.get("id") ?? ""),
    paymentCode: String(form.get("code") ?? ""),
    back: `/${locale}/admin${query ? `?${query}` : ""}`,
  };
}

function finish(back: string, message: string): never {
  revalidatePath(back.split("?")[0]);
  const separator = back.includes("?") ? "&" : "?";
  redirect(`${back}${separator}msg=${encodeURIComponent(message)}`);
}

/** Продлить доступ на срок тарифа. */
export async function extendAccess(form: FormData) {
  const admin = await currentAdmin();
  if (!admin) redirect("/");

  const target = readTarget(form);
  const period = String(form.get("period") ?? "") as PeriodId;
  if (!target.paymentCode || !(period in PERIODS)) {
    finish(target.back, "Не хватает данных для продления");
  }

  let message: string;
  try {
    const supabase = createAdminClient();
    /*
      Через ту же функцию, что и оплата: она считает срок от максимума
      между «сейчас» и текущей датой окончания. Своя арифметика здесь
      однажды разошлась бы с боевой и обнулила бы кому-то остаток.
    */
    const { data, error } = await supabase.rpc("extend_access", {
      code: target.paymentCode,
      days: PERIODS[period].days,
    });

    if (error) message = `Ошибка: ${error.message}`;
    else if (!data) message = "Пользователь не найден";
    else {
      message = `Доступ продлён до ${new Date(data as string).toLocaleDateString("ru")}`;
      console.info("admin: продлил доступ", {
        by: admin.email,
        code: target.paymentCode,
        days: PERIODS[period].days,
      });
    }
  } catch (e) {
    message = `Ошибка: ${e instanceof Error ? e.message : "неизвестно"}`;
  }

  finish(target.back, message);
}

/** Выдать бессрочный доступ. */
export async function grantEndless(form: FormData) {
  const admin = await currentAdmin();
  if (!admin) redirect("/");

  const target = readTarget(form);
  if (!target.id) finish(target.back, "Не указан пользователь");

  let message: string;
  try {
    const supabase = createAdminClient();
    /*
      .select() после update — не украшение: без него Supabase не
      сообщает об ошибке и на несуществующий id, обновляя ноль строк.
      Без проверки длины результата кнопка отчиталась бы «Выдан
      бессрочный доступ», даже если в базе ничего не изменилось —
      например, если пользователя тем временем удалили или id в форме
      был подделан.

      'infinity' — то же значение, что ставит миграция вручную выданным
      доступам. Заводить второй способ «навсегда» незачем.
    */
    const { data, error } = await supabase
      .from("profiles")
      .update({ pro_until: "infinity" })
      .eq("id", target.id)
      .select("id");

    if (error) message = `Ошибка: ${error.message}`;
    else if (!data || data.length === 0) message = "Пользователь не найден";
    else {
      message = "Выдан бессрочный доступ";
      console.info("admin: выдал бессрочный доступ", {
        by: admin.email,
        user: target.id,
      });
    }
  } catch (e) {
    message = `Ошибка: ${e instanceof Error ? e.message : "неизвестно"}`;
  }

  finish(target.back, message);
}

/** Закрыть доступ. */
export async function revokeAccess(form: FormData) {
  const admin = await currentAdmin();
  if (!admin) redirect("/");

  const target = readTarget(form);
  if (!target.id) finish(target.back, "Не указан пользователь");

  let message: string;
  try {
    const supabase = createAdminClient();
    // .select() — по той же причине, что и в grantEndless: без него
    // обновление нуля строк выглядело бы как успех.
    const { data, error } = await supabase
      .from("profiles")
      .update({ pro_until: null })
      .eq("id", target.id)
      .select("id");

    if (error) message = `Ошибка: ${error.message}`;
    else if (!data || data.length === 0) message = "Пользователь не найден";
    else {
      message = "Доступ закрыт";
      console.info("admin: закрыл доступ", {
        by: admin.email,
        user: target.id,
      });
    }
  } catch (e) {
    message = `Ошибка: ${e instanceof Error ? e.message : "неизвестно"}`;
  }

  finish(target.back, message);
}
