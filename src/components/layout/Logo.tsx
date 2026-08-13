import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

/*
  Знак нарисован вектором, а не картинкой: он нужен в двух местах, в двух
  темах и на разных размерах, а PNG в шапке пришлось бы отдавать в двойном
  разрешении и он всё равно мылился бы на ретине.

  Пузырь речи внутри «P» — вырез, а не белая заливка: на светлой теме
  сквозь него видно белый фон, на тёмной — тёмный. Белая заливка была бы
  пятном на тёмной теме.
*/

/** Четырёхлучевая искра. Управляем радиусом и «талией» — тем, насколько узки лучи. */
function sparkle(cx: number, cy: number, r: number, waist: number): string {
  return [
    `M${cx} ${cy - r}`,
    `C${cx} ${cy - waist} ${cx - waist} ${cy} ${cx - r} ${cy}`,
    `C${cx - waist} ${cy} ${cx} ${cy + waist} ${cx} ${cy + r}`,
    `C${cx} ${cy + waist} ${cx + waist} ${cy} ${cx + r} ${cy}`,
    `C${cx + waist} ${cy} ${cx} ${cy - waist} ${cx} ${cy - r}`,
    "Z",
  ].join(" ");
}

/*
  Штрихи движения слева от знака. Все заканчиваются на x=16, у самой
  ножки «P», а начинаются в разных местах — отсюда ощущение скорости.
*/
const STREAK_END = 18;
const STREAKS = [
  { y: 8, x: 11, opacity: 0.5 },
  { y: 15, x: 0, opacity: 0.85 },
  { y: 22, x: 6, opacity: 0.32 },
  { y: 29, x: 9, opacity: 0.7 },
];

export function LogoMark({
  id,
  className = "",
}: {
  /*
    Различающая часть id — своя у каждого знака на странице.

    Градиент и маска объявляются внутри самого svg, а ссылка url(#id)
    ищется по всему документу. Знак стоит и в шапке, и в подвале: с
    одинаковыми id вторая ссылка в Safari не разрешается вовсе, маска не
    применяется — и в подвале вместо «P» был сплошной фиолетовый
    квадрат. В Chrome при этом всё выглядело правильно, поэтому ошибку
    видно только с телефона.

    Параметр обязательный: с необязательным про него забыли бы у
    третьего знака, и квадрат вернулся бы. Уникальность стережёт
    logo-id.test.ts.
  */
  id: string;
  className?: string;
}) {
  const gradientId = `promptom-grad-${id}`;
  const maskId = `promptom-mask-${id}`;

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="48"
          x2="48"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#6d28d9" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>

        <mask id={maskId}>
          {/* Силуэт «P» без внутреннего просвета — просвет вырежет пузырь */}
          <path d="M20 5 H30 A11 11 0 0 1 30 27 V43 H20 Z" fill="#fff" />
          {/* Пузырь речи: круг с хвостом вниз-влево */}
          <circle cx="31.5" cy="16" r="7" fill="#000" />
          <path d="M28 21 L23.5 30 L33 22.5 Z" fill="#000" />
          {/* Искры внутри пузыря возвращают заливку */}
          <path d={sparkle(30, 16.5, 4.6, 1.3)} fill="#fff" />
          <path d={sparkle(34.5, 13, 2.3, 0.65)} fill="#fff" />
        </mask>
      </defs>

      {/* Один прямоугольник с градиентом, форму задаёт маска */}
      <rect
        width="48"
        height="48"
        fill={`url(#${gradientId})`}
        mask={`url(#${maskId})`}
      />

      {STREAKS.map(({ y, x, opacity }) => (
        <rect
          key={y}
          x={x}
          y={y}
          width={STREAK_END - x}
          height="4"
          rx="2"
          fill={`url(#${gradientId})`}
          opacity={opacity}
        />
      ))}

      {/* Две точки — самые дальние брызги, без них штрихи выглядят строем */}
      <circle
        cx="5"
        cy="10"
        r="1.8"
        fill={`url(#${gradientId})`}
        opacity="0.45"
      />
      <circle
        cx="12"
        cy="37"
        r="1.8"
        fill={`url(#${gradientId})`}
        opacity="0.55"
      />
    </svg>
  );
}

/** Название: до заглавной T — цветом текста, дальше — градиентом, как в знаке. */
export function LogoWord({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-bold tracking-[-0.02em] text-ink ${className}`}
      translate="no"
    >
      Promp<span className="grad-text">Tom</span>
    </span>
  );
}

export default function Logo({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <Link
      href={`/${locale}`}
      className={`flex items-center gap-2 ${className}`}
      aria-label="PrompTom"
    >
      <LogoMark id="header" className="h-8 w-8 shrink-0" />
      <LogoWord className="text-[17px]" />
    </Link>
  );
}
