import Link from "next/link";
import { ArrowRight } from "lucide-react";

/*
  Стопка карточек с наклоном: три раздела сайта, лежащие внахлёст, как
  колода. При наведении верхняя приподнимается, нижние выцветают меньше —
  видно, что их три и что каждая ведёт куда-то ещё.

  Исходник этого приёма написан под shadcn/ui: bg-muted, text-muted-
  foreground, outline-border, animate-in fade-in-0 и утилита cn. Ничего
  этого в проекте нет — и переписано не из упрямства. Классы вроде
  bg-background в Tailwind без соответствующих переменных не ошибка: они
  просто ничего не делают, и карточка вышла бы прозрачной без объяснения
  причин. Хуже того, bg-muted здесь существует, но означает цвет
  приглушённого текста, а не фона: получилась бы серая плашка, и было бы
  непонятно, так задумано или нет.

  Наклон и нахлёст живут только на широком экране. На 360px три карточки
  по 352 пикселя со сдвигом вправо на два десятка — это гарантированная
  горизонтальная прокрутка, а половина заходов с телефона. Поэтому там
  они просто ложатся в столбик: тот же смысл, без фокуса, который на
  таком экране всё равно не читается.
*/

export interface DisplayCard {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Строка под описанием: сколько всего в разделе. */
  meta: string;
}

/*
  Сдвиг каждой карточки. Порядок важен: последняя рисуется поверх и лежит
  ближе к читателю, поэтому она же самая яркая.

  Разведены на девять рем, а не на четыре, как в исходнике. При тесном
  нахлёсте у двух задних карточек видно один заголовок: описание и
  количество закрыты следующей. Для украшения это ничего не меняет, но
  карточки здесь — ссылки на разделы, и человек выбирает по описанию.
*/
const LAYERS = [
  "lg:-translate-x-36 lg:-translate-y-3 lg:opacity-70 lg:hover:-translate-y-9 lg:hover:opacity-100",
  "lg:translate-y-7 lg:opacity-85 lg:hover:translate-y-1 lg:hover:opacity-100",
  "lg:translate-x-36 lg:translate-y-[4.25rem] lg:hover:translate-y-10",
];

export default function DisplayCards({ cards }: { cards: DisplayCard[] }) {
  return (
    <div
      className="
        grid gap-3
        lg:mb-24 lg:grid-cols-1 lg:gap-0 lg:[grid-template-areas:'stack']
        lg:place-items-center
      "
    >
      {cards.map((card, i) => (
        <Link
          key={card.href}
          href={card.href}
          className={`
            group relative flex flex-col justify-between gap-3 overflow-hidden
            rounded-card border border-line bg-surface px-5 py-4
            transition-[transform,opacity,border-color] duration-500 ease-out
            hover:border-line-strong
            lg:h-36 lg:w-[22rem] lg:-skew-y-[8deg] lg:[grid-area:stack]
            lg:hover:z-10
            ${LAYERS[i % LAYERS.length]}
          `}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              {card.icon}
            </span>
            <span className="text-[16px] font-semibold tracking-[-0.015em] text-ink transition-colors duration-200 group-hover:text-accent">
              {card.title}
            </span>
          </div>

          {/* min-w-0 + truncate: длинный перевод не должен растягивать
              карточку и выталкивать её за край экрана. */}
          <p className="min-w-0 truncate text-[14px] text-muted">
            {card.description}
          </p>

          <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
            {card.meta}
            <ArrowRight
              size={11}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
