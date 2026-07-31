import type { Locale } from "@/lib/i18n/config";
import { PERIODS } from "@/lib/billing";
import { SUPPORT_EMAIL } from "@/lib/contact";

/*
  Правовые документы. Не юридическое заключение: это честное описание
  того, как сервис устроен на самом деле, написанное человеческим языком.
  Перед серьёзным оборотом их стоит показать юристу — особенно про НДС и
  налоговый статус продавца, который зависит от страны и формы работы.

  Тексты на двух языках, как промты и FAQ. Даты и сроки берутся из
  billing.ts: документ, разошедшийся с реальными тарифами, хуже, чем
  отсутствующий.
*/

export const LEGAL_DOCS = ["privacy", "terms", "agreement"] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];

export function isLegalDoc(value: string): value is LegalDoc {
  return (LEGAL_DOCS as readonly string[]).includes(value);
}

export interface Section {
  title: string;
  body: string[];
}

export interface Document {
  title: string;
  intro: string;
  sections: Section[];
}

const RU: Record<LegalDoc, Document> = {
  privacy: {
    title: "Политика конфиденциальности",
    intro:
      "Коротко: мы собираем минимум — почту для входа и то, что вы сами отметили в избранном. Ничего не продаём и не передаём рекламодателям.",
    sections: [
      {
        title: "Какие данные мы храним",
        body: [
          "Адрес электронной почты — он нужен, чтобы вы могли войти и чтобы мы знали, кому открыт доступ.",
          "Имя и ссылку на аватар, если вы вошли через Google. Их передаёт сам Google, мы их только показываем в кабинете.",
          "Список промтов, которые вы добавили в избранное.",
          "Срок оплаченного доступа и код платежа — восемь символов, по которым платёж находит ваш аккаунт.",
        ],
      },
      {
        title: "Чего мы не храним",
        body: [
          "Паролей. Вход работает по ссылке на почту или через Google — пароля у нас нет вовсе, и утечь ему неоткуда.",
          "Данных банковских карт. Оплата проходит на стороне платёжной системы, к нам реквизиты не попадают.",
          "Переписки, содержимого ваших запросов к нейросетям и результатов, которые вы получили.",
        ],
      },
      {
        title: "Кому передаются данные",
        body: [
          "Supabase — хранение базы и вход в аккаунт.",
          "Vercel — размещение сайта.",
          "NOWPayments — приём оплаты. Туда уходит только сумма и код платежа, почта не передаётся.",
          "Vercel Analytics — счётчик посещений. Считает просмотры страниц без cookie и без профилей: кто именно зашёл, он не знает и знать не может.",
          "Больше никому. Рекламных сетей на сайте нет.",
        ],
      },
      {
        title: "Сколько данные хранятся",
        body: [
          "Пока существует ваш аккаунт. Напишете на " +
            SUPPORT_EMAIL +
            " — удалим профиль и избранное.",
        ],
      },
      {
        title: "Ваши права",
        body: [
          "Запросить, что о вас хранится, исправить ошибку или потребовать удаления. Пишите на " +
            SUPPORT_EMAIL +
            " с того адреса, на который зарегистрированы, — так мы поймём, что это действительно вы.",
        ],
      },
    ],
  },

  terms: {
    title: "Условия использования",
    intro:
      "Что вы получаете за оплату, на какой срок, и что с этим можно делать.",
    sections: [
      {
        title: "Что за сервис",
        body: [
          "PrompTom — каталог готовых текстовых запросов (промтов) к нейросетям. Мы даём формулировки; сами нейросети — чужие сервисы, мы к ним отношения не имеем и за их ответы не отвечаем.",
        ],
      },
      {
        title: "Оплата и срок",
        body: [
          `Доступ покупается на срок: ${PERIODS.monthly.days} дней за ${PERIODS.monthly.price} $ или ${PERIODS.yearly.days} дней за ${PERIODS.yearly.price} $.`,
          "Автопродления нет. Деньги сами не списываются никогда — по окончании срока PRO-промты просто закрываются.",
          "Оплата принимается криптовалютой через NOWPayments. Сумма в долларах, списывается эквивалент в выбранной монете по курсу на момент оплаты.",
          "Доступ открывается автоматически после подтверждения платежа — обычно в течение нескольких минут.",
        ],
      },
      {
        title: "Возврат",
        body: [
          "Криптовалютный перевод технически необратим, поэтому вернуть его мы не можем.",
          "Если доступ не открылся из-за сбоя на нашей стороне — мы открываем его вручную. Это наша обязанность, а не жест доброй воли.",
          "Если списание кажется вам ошибочным, напишите на " +
            SUPPORT_EMAIL +
            ". Разберём каждый случай.",
        ],
      },
      {
        title: "Что можно делать с промтами",
        body: [
          "Использовать в своей работе, включая коммерческую, для себя и для клиентов. Менять под свои задачи. Результаты, полученные с их помощью, — ваши.",
          "Нельзя: перепродавать сам каталог, публиковать его копию, раздавать доступ к своему аккаунту другим людям.",
        ],
      },
      {
        title: "Чего мы не обещаем",
        body: [
          "Конкретного результата от нейросети. Один и тот же промт у разных моделей и в разных руках даёт разное — это свойство самой технологии.",
          "Бесперебойной работы. Сайт может быть недоступен на время обновлений или из-за сбоя у поставщиков. Если простой съел заметную часть оплаченного срока — напишите, продлим.",
        ],
      },
      {
        title: "Изменение условий",
        body: [
          "Цены и состав тарифов могут меняться. На уже оплаченный доступ это не влияет: срок и условия остаются те, что были на момент оплаты.",
        ],
      },
    ],
  },

  agreement: {
    title: "Пользовательское соглашение",
    intro:
      "Правила пользования аккаунтом и то, за что доступ может быть закрыт.",
    sections: [
      {
        title: "Аккаунт",
        body: [
          "Аккаунт личный. Доступ к почте, на которую он зарегистрирован, — это и есть доступ к аккаунту, поэтому берегите её.",
          "Один оплаченный доступ — один человек. Передавать вход другим нельзя.",
        ],
      },
      {
        title: "Допустимое использование",
        body: [
          "Не пытайтесь обойти ограничения тарифа техническими средствами.",
          "Не выгружайте каталог автоматически и не создавайте нагрузку, мешающую другим.",
          "Не используйте промты для того, что запрещено законом или правилами самих нейросетей.",
        ],
      },
      {
        title: "Приостановка доступа",
        body: [
          "Мы можем закрыть доступ при нарушении этих правил. Если нарушения не было, а доступ закрыт — напишите на " +
            SUPPORT_EMAIL +
            ", вернём.",
          "При закрытии за нарушение оплаченный остаток не возвращается.",
        ],
      },
      {
        title: "Связь",
        body: [
          "Все вопросы — на " +
            SUPPORT_EMAIL +
            ". Отвечаем на письма с того адреса, на который зарегистрирован аккаунт.",
        ],
      },
    ],
  },
};

const EN: Record<LegalDoc, Document> = {
  privacy: {
    title: "Privacy policy",
    intro:
      "In short: we collect the minimum — an email address to sign you in, and whatever you added to favourites. We sell nothing and pass nothing to advertisers.",
    sections: [
      {
        title: "What we store",
        body: [
          "Your email address — needed so you can sign in and so we know whose access is open.",
          "Your name and avatar link if you signed in with Google. Google supplies those; we only display them in your account.",
          "The list of prompts you marked as favourites.",
          "The end date of paid access and a payment code — eight characters that let a payment find your account.",
        ],
      },
      {
        title: "What we do not store",
        body: [
          "Passwords. Sign-in works by an email link or through Google — we have no password at all, so none can leak.",
          "Card details. Payment happens on the payment provider's side; the details never reach us.",
          "Your conversations, the queries you send to AI models, or the results you get back.",
        ],
      },
      {
        title: "Who receives the data",
        body: [
          "Supabase — database hosting and sign-in.",
          "Vercel — website hosting.",
          "NOWPayments — payment processing. Only the amount and the payment code go there; your email does not.",
          "Vercel Analytics — visit counting. It counts page views without cookies and without profiles: it cannot know who visited.",
          "Nobody else. There are no ad networks on this site.",
        ],
      },
      {
        title: "How long we keep it",
        body: [
          "As long as your account exists. Write to " +
            SUPPORT_EMAIL +
            " and we will delete the profile and favourites.",
        ],
      },
      {
        title: "Your rights",
        body: [
          "Ask what we hold about you, correct a mistake, or demand deletion. Write to " +
            SUPPORT_EMAIL +
            " from the address you signed up with, so we can tell it is really you.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms of use",
    intro: "What you get for your money, for how long, and what you may do with it.",
    sections: [
      {
        title: "What this service is",
        body: [
          "PrompTom is a catalogue of ready-made text prompts for AI models. We provide the wording; the AI models themselves belong to other companies, and we are not responsible for their answers.",
        ],
      },
      {
        title: "Payment and term",
        body: [
          `Access is bought for a period: ${PERIODS.monthly.days} days for $${PERIODS.monthly.price}, or ${PERIODS.yearly.days} days for $${PERIODS.yearly.price}.`,
          "There is no auto-renewal. Money is never taken automatically — when the term ends, the PRO prompts simply close again.",
          "Payment is accepted in cryptocurrency through NOWPayments. Prices are in US dollars; the equivalent in your chosen coin is charged at the rate at the moment of payment.",
          "Access opens automatically once the payment is confirmed — usually within a few minutes.",
        ],
      },
      {
        title: "Refunds",
        body: [
          "A crypto transfer is technically irreversible, so we cannot send it back.",
          "If access failed to open because of a fault on our side, we open it manually. That is an obligation, not a favour.",
          "If a charge looks wrong to you, write to " +
            SUPPORT_EMAIL +
            ". We look at every case.",
        ],
      },
      {
        title: "What you may do with the prompts",
        body: [
          "Use them in your work, commercial work included, for yourself and for clients. Adapt them to your needs. Whatever you produce with them is yours.",
          "You may not: resell the catalogue itself, publish a copy of it, or share your account access with other people.",
        ],
      },
      {
        title: "What we do not promise",
        body: [
          "A specific result from an AI model. The same prompt gives different output across models and in different hands — that is how the technology works.",
          "Uninterrupted service. The site may be unavailable during updates or because of a provider outage. If downtime eats a noticeable part of your paid term, write to us and we will extend it.",
        ],
      },
      {
        title: "Changes to these terms",
        body: [
          "Prices and plan contents may change. This does not affect access already paid for: the term and conditions stay as they were at the moment of payment.",
        ],
      },
    ],
  },

  agreement: {
    title: "User agreement",
    intro: "Rules for using your account, and what can get access closed.",
    sections: [
      {
        title: "Your account",
        body: [
          "The account is personal. Access to the email it is registered to is access to the account, so look after it.",
          "One paid access, one person. Passing your sign-in to others is not allowed.",
        ],
      },
      {
        title: "Acceptable use",
        body: [
          "Do not try to bypass plan limits by technical means.",
          "Do not scrape the catalogue automatically or create load that disrupts others.",
          "Do not use the prompts for anything forbidden by law or by the AI providers' own rules.",
        ],
      },
      {
        title: "Suspension",
        body: [
          "We may close access if these rules are broken. If there was no breach and access is closed, write to " +
            SUPPORT_EMAIL +
            " and we will restore it.",
          "When access is closed for a breach, the remaining paid time is not refunded.",
        ],
      },
      {
        title: "Contact",
        body: [
          "Any questions to " +
            SUPPORT_EMAIL +
            ". We reply to messages sent from the address the account is registered to.",
        ],
      },
    ],
  },
};

export function legalDoc(locale: Locale, doc: LegalDoc): Document {
  return locale === "ru" ? RU[doc] : EN[doc];
}
