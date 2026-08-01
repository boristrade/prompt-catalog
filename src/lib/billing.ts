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

/*
  Доля партнёра с каждой приведённой оплаты.

  Здесь же, рядом с ценами: страница программы, начисление в базе и
  тексты обещают одно и то же число, и разъехаться им негде. Ставка,
  названная на сайте и посчитанная в базе по-разному, — это спор о
  деньгах, который вы проиграете.
*/
export const COMMISSION_RATE = 0.3;

export const COMMISSION_PERCENT = Math.round(COMMISSION_RATE * 100);

/** Вознаграждение партнёра с суммы, округлённое до цента. */
export function commissionOf(amount: number): number {
  return Math.round(amount * COMMISSION_RATE * 100) / 100;
}

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

/*
  Идентификатор заказа для платёжной системы. Внутрь кладём код платежа и срок —
  по ним уведомление об оплате находит, кому и на сколько открывать
  доступ. Метка времени и случайный хвост делают его уникальным: повторная
  оплата тем же человеком не должна натыкаться на «такой заказ уже есть».

  Одной метки времени недостаточно: order_id теперь ещё и ключ
  дедупликации вебхука (см. processed_payments) — два вызова в одну и ту
  же миллисекунду дали бы одинаковый order_id, и тогда второй, настоящий
  платёж молча зачёлся бы дублем первого и не продлил бы доступ. Случайный
  хвост закрывает это окно совпадения.

  Внутренний uuid пользователя сюда не попадает: order_id виден в чужой
  системе, и светить им идентификаторы своей базы незачем.
*/
export function buildOrderId(paymentCode: string, period: PeriodId): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${paymentCode}-${period}-${Date.now().toString(36)}${random}`;
}

export function parseOrderId(
  orderId: string,
): { paymentCode: string; period: PeriodId } | null {
  const parts = orderId.split("-");
  if (parts.length < 3) return null;
  const [paymentCode, period] = parts;
  if (!paymentCode || !isPeriodId(period)) return null;
  return { paymentCode, period };
}
