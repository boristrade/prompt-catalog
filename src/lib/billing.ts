/*
  Цены и сроки в одном месте: их читают и страница тарифов, и страница
  оплаты, и обработчик активации. Разъехавшийся ценник — это спор с
  клиентом, который вы проиграете.
*/

export type PeriodId = "monthly" | "yearly";

export interface Period {
  id: PeriodId;
  name: string;
  /** Цена в долларах — так, как показываем. */
  price: number;
  /** На сколько дней открывается доступ после оплаты. */
  days: number;
  period: string;
}

export const PERIODS: Record<PeriodId, Period> = {
  monthly: {
    id: "monthly",
    name: "PRO на месяц",
    price: 7.99,
    // 30, а не «календарный месяц»: срок считается в базе через
    // make_interval, и одинаковый шаг проще объяснить и проверить.
    days: 30,
    period: "в месяц",
  },
  yearly: {
    id: "yearly",
    name: "PRO на год",
    price: 59,
    days: 365,
    period: "в год",
  },
};

/** Экономия годового тарифа против двенадцати месячных, в процентах. */
export const YEARLY_SAVING = Math.round(
  ((PERIODS.monthly.price * 12 - PERIODS.yearly.price) /
    (PERIODS.monthly.price * 12)) *
    100,
);

export const YEARLY_PER_MONTH = (PERIODS.yearly.price / 12).toFixed(2);

export function isPeriodId(value: string): value is PeriodId {
  return value in PERIODS;
}

/** Ссылка на страницу автора в Donatello — оттуда человек и платит. */
export const DONATELLO_URL =
  process.env.NEXT_PUBLIC_DONATELLO_URL ?? "https://donatello.to/";
