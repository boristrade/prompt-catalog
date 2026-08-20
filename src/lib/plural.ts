import type { Locale } from "@/lib/i18n/config";

/*
  Число и слово рядом с ним.

  На сайте до сих пор стояла одна форма на все числа: «208 промтов». Для
  двухсот восьми это верно, а для девяноста одного — уже нет: по-русски
  «91 промт», «92 промта», «95 промтов». Пока числа были только большие и
  постоянные, ошибка не всплывала; на странице пополнений числа разные и
  меняются с каждой пачкой.

  Формы выбирает Intl.PluralRules — тот же справочник, которым
  пользуется браузер. Свои правила писать нельзя: в русском и польском их
  три, во французском два, но не те же, что в английском, и «если 1, то
  так, иначе эдак» ломается на 21 и 111.

  other — обязательная запасная форма: у языка может не оказаться
  категории, которую вернул справочник, и молча выдать пустую строку
  хуже, чем показать одну лишнюю букву.
*/

export interface Forms {
  one: string;
  few?: string;
  many?: string;
  other: string;
}

export function plural(locale: Locale, count: number, forms: Forms): string {
  const category = new Intl.PluralRules(locale).select(count);
  return forms[category as keyof Forms] ?? forms.other;
}

/** «91 промт», «92 промта», «208 промтов». */
export function counted(locale: Locale, count: number, forms: Forms): string {
  return `${count.toLocaleString(locale)} ${plural(locale, count, forms)}`;
}
