/*
  Адрес поддержки. Одна константа на весь сайт: он стоит и в шапке, и в
  подвале, а два одинаковых литерала однажды разъезжаются — правят один,
  забывают другой, и половина ссылок ведёт на старую почту.
*/
export const SUPPORT_EMAIL = "aixten092@gmail.com";

/** Ссылка «написать письмо». Тема заполняется сама. */
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "PrompTom — вопрос",
)}`;

/*
  Страница обратной связи, а не голая ссылка mailto в меню.

  mailto открывает почту, только если в системе назначен клиент по
  умолчанию. С телефона, где почтой пользуются через сайт Gmail, и внутри
  встроенных браузеров (Telegram, Instagram) нажатие не делает ничего —
  человек решает, что связаться не с кем, и уходит. Поэтому адрес сначала
  показываем текстом, который можно скопировать, а письмо предлагаем
  кнопкой рядом.
*/
export interface ContactCopy {
  eyebrow: string;
  emailLabel: string;
  title: string;
  intro: string;
  copy: string;
  copied: string;
  write: string;
  includeTitle: string;
  include: string[];
  reply: string;
  faqNote: string;
  faqLink: string;
}

const RU: ContactCopy = {
  eyebrow: "Поддержка",
  emailLabel: "Почта поддержки",
  title: "Обратная связь",
  intro:
    "Пишите на почту — это единственный канал связи, и отвечает на него человек, а не робот.",
  copy: "Скопировать адрес",
  copied: "Адрес скопирован",
  write: "Написать письмо",
  includeTitle: "Что приложить к письму",
  include: [
    "Адрес, на который зарегистрирован аккаунт, — по нему мы вас найдём.",
    "Код платежа из кабинета, если вопрос про оплату. Восемь символов вроде 18A588A6.",
    "Снимок экрана, если что-то выглядит не так, как должно.",
  ],
  reply: "Отвечаем в течение дня. По оплате — в первую очередь.",
  faqNote: "Возможно, ответ уже есть:",
  faqLink: "Частые вопросы",
};

const EN: ContactCopy = {
  eyebrow: "Support",
  emailLabel: "Support email",
  title: "Contact us",
  intro:
    "Write to us by email — it is the only channel, and a person answers it, not a bot.",
  copy: "Copy address",
  copied: "Address copied",
  write: "Write an email",
  includeTitle: "What to include",
  include: [
    "The address your account is registered to — that is how we find you.",
    "Your payment code from the account page if the question is about payment. Eight characters, like 18A588A6.",
    "A screenshot if something looks wrong.",
  ],
  reply: "We reply within a day. Payment questions come first.",
  faqNote: "The answer may already be here:",
  faqLink: "Frequently asked questions",
};

export function contactCopy(locale: string): ContactCopy {
  return locale === "ru" ? RU : EN;
}
