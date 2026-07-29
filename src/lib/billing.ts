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

/*
  Идентификатор заказа для платёжной системы. Внутрь кладём код платежа и срок —
  по ним уведомление об оплате находит, кому и на сколько открывать
  доступ. Метка времени делает его уникальным: повторная оплата тем же
  человеком не должна натыкаться на «такой заказ уже есть».

  Внутренний uuid пользователя сюда не попадает: order_id виден в чужой
  системе, и светить им идентификаторы своей базы незачем.
*/
export function buildOrderId(paymentCode: string, period: PeriodId): string {
  return `${paymentCode}-${period}-${Date.now().toString(36)}`;
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
