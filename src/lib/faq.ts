import type { Locale } from "@/lib/i18n/config";
import { PERIODS, YEARLY_PER_MONTH } from "@/lib/billing";
import { PROMPTS } from "@/lib/prompts";
import { SUPPORT_EMAIL } from "@/lib/contact";

export interface QA {
  q: string;
  a: string;
}

/*
  Вопросы, которые задают до оплаты и после неё. Тексты на двух языках —
  как и промты: на ru отдаётся русский, на остальных английский. Держать
  живой FAQ на шести языках дороже, чем он того стоит, а устаревший ответ
  про деньги хуже, чем ответ на чужом языке.

  Цены и сроки подставляются из billing.ts, а не вписаны руками:
  разъехавшийся с тарифами FAQ — это спор с клиентом, который вы
  проиграете.
*/

const proCount = PROMPTS.filter((p) => p.tier === "pro").length;
const freeCount = PROMPTS.length - proCount;

const ru: QA[] = [
  {
    q: "Что входит в бесплатный доступ?",
    a: `${freeCount} промтов из ${PROMPTS.length} открыты полностью и навсегда: текст, пример результата, копирование в один клик. Регистрация для этого не нужна. Остальные ${proCount} — в тарифе PRO.`,
  },
  {
    q: "Подписка списывается сама каждый месяц?",
    a: "Нет. Оплата разовая: вы платите за 30 или за 365 дней, доступ живёт до этой даты и сам не продлевается. Когда срок кончится, ничего не спишется — просто закроются PRO-промты. Захотите продлить — оплатите ещё раз.",
  },
  {
    q: "Почему оплата в криптовалюте?",
    a: "Сервис работает из Украины без ФОП, и обычные платёжные системы такому продавцу карты не подключают. Крипта — то, что доступно без юрлица. Платёж проходит через NOWPayments: вы отправляете сумму на указанный адрес, доступ открывается автоматически.",
  },
  {
    q: "Сколько стоит?",
    a: `${PERIODS.monthly.price} $ за месяц или ${PERIODS.yearly.price} $ за год — это ${YEARLY_PER_MONTH} $ в месяц. Годовой выгоднее, если планируете пользоваться дольше двух месяцев.`,
  },
  {
    q: "Я оплатил, а PRO не появился. Что делать?",
    a: `Обновите страницу кабинета: доступ открывается по уведомлению от платёжной системы, и между оплатой и уведомлением проходит несколько минут. Если через полчаса ничего не изменилось — напишите на ${SUPPORT_EMAIL} и укажите код платежа из кабинета. Откроем вручную.`,
  },
  {
    q: "Можно вернуть деньги?",
    a: "Криптовалютный перевод отменить нельзя — он необратим по своей природе. Поэтому если доступ не открылся из-за сбоя на нашей стороне, мы открываем его вручную, а не возвращаем платёж. Если считаете, что списание ошибочное, напишите — разберёмся.",
  },
  {
    q: "Промты работают в ChatGPT? А в Claude, Midjourney?",
    a: "Да. У каждого промта подписано, под какую нейросеть он заточен, но большинство текстовых работают в любой из них. Промты для картинок написаны под Midjourney и Flux и в текстовых моделях бесполезны.",
  },
  {
    q: "Что означают {фигурные скобки} в промте?",
    a: "Это места, куда подставить своё: продукт, аудиторию, тон. Они подсвечены цветом. Скопируйте промт, замените подсвеченное на своё — и отправляйте.",
  },
  {
    q: "Можно использовать промты в работе с клиентами?",
    a: "Да, в том числе в коммерческой. Нельзя одно: перепродавать сам каталог или выкладывать его копию как свой продукт.",
  },
  {
    q: "На каком языке промты?",
    a: "На русской версии сайта — по-русски, на остальных пяти языках — по-английски. Интерфейс переведён на шесть языков, промты на двух: машинный перевод специализированных формулировок портит ровно то, ради чего их берут.",
  },
  {
    q: "Каталог пополняется?",
    a: "Да, новые подборки добавляются. Оплаченный доступ открывает и то, что появится за его срок, — доплачивать за новые промты не нужно.",
  },
  {
    q: "Как удалить аккаунт?",
    a: `Напишите на ${SUPPORT_EMAIL} с адреса, на который зарегистрированы. Удалим профиль и избранное.`,
  },
];

const en: QA[] = [
  {
    q: "What do I get for free?",
    a: `${freeCount} of ${PROMPTS.length} prompts are fully open, forever: the text, the sample result, one-click copying. No sign-up needed. The other ${proCount} come with PRO.`,
  },
  {
    q: "Does the subscription renew automatically?",
    a: "No. Payment is one-off: you pay for 30 or 365 days, access runs until that date and does not renew itself. When it expires nothing is charged — the PRO prompts simply close again. Want to continue? Pay once more.",
  },
  {
    q: "Why is payment in cryptocurrency?",
    a: "The service is run from Ukraine without a registered sole proprietorship, and ordinary card processors do not onboard a seller like that. Crypto is what works without a legal entity. Payments go through NOWPayments: you send the amount to the address shown, and access opens automatically.",
  },
  {
    q: "What does it cost?",
    a: `$${PERIODS.monthly.price} a month or $${PERIODS.yearly.price} a year — that is $${YEARLY_PER_MONTH} a month. The yearly plan pays off if you expect to use it for more than two months.`,
  },
  {
    q: "I paid but PRO did not appear. What now?",
    a: `Refresh your account page: access opens on a notification from the payment system, and a few minutes pass between payment and notification. If nothing changes within half an hour, write to ${SUPPORT_EMAIL} with the payment code from your account page. We will open it by hand.`,
  },
  {
    q: "Can I get a refund?",
    a: "A crypto transfer cannot be reversed — that is how it works. So if access failed to open because of a fault on our side, we open it manually rather than refunding. If you believe a charge was wrong, write to us and we will sort it out.",
  },
  {
    q: "Do the prompts work in ChatGPT? In Claude, Midjourney?",
    a: "Yes. Each prompt says which model it is tuned for, but most text prompts work in any of them. Image prompts are written for Midjourney and Flux and are useless in text models.",
  },
  {
    q: "What do the {curly braces} in a prompt mean?",
    a: "They mark what to replace with your own: product, audience, tone. They are highlighted in colour. Copy the prompt, swap the highlighted parts for yours, and send it.",
  },
  {
    q: "Can I use the prompts in client work?",
    a: "Yes, commercial work included. One thing is not allowed: reselling the catalogue itself or publishing a copy of it as your own product.",
  },
  {
    q: "What language are the prompts in?",
    a: "Russian on the Russian version of the site, English on the other five languages. The interface is translated into six languages, the prompts into two: machine-translating specialised wording ruins exactly what people come for.",
  },
  {
    q: "Is the catalogue growing?",
    a: "Yes, new sets are added. Paid access covers whatever appears during its term — no extra charge for new prompts.",
  },
  {
    q: "How do I delete my account?",
    a: `Write to ${SUPPORT_EMAIL} from the address you signed up with. We will delete the profile and your favourites.`,
  },
];

export function faqFor(locale: Locale): QA[] {
  return locale === "ru" ? ru : en;
}
