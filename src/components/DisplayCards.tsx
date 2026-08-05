import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

/*
  Стопка карточек: три раздела сайта, лежащие внахлёст, как колода.

  Исходник этого приёма написан под shadcn/ui: bg-muted, text-muted-
  foreground, outline-border, animate-in fade-in-0 и утилита cn. Ничего
  этого в проекте нет — и переписано не из упрямства. Классы вроде
  bg-background в Tailwind без соответствующих переменных не ошибка: они
  просто ничего не делают, и карточка вышла бы прозрачной без объяснения
  причин. Хуже того, bg-muted здесь существует, но означает цвет
  приглушённого текста, а не фона: получилась бы серая плашка, и было бы
  непонятно, так задумано или нет.

  Колода собрана по-разному на широком и узком экране, и это не
  «мобильная заглушка». Исходный приём — три карточки по 352 пикселя,
  разъезжающиеся вправо, — на 360px даёт горизонтальную прокрутку, то
  есть не работает вовсе. Поэтому там, где не помещается сдвиг вбок,
  колода собирается по вертикали: карточки заходят друг на друга низом и
  чуть повёрнуты, каждая следующая поверх предыдущей. Читается тем же —
  стопка, — но ничего не уезжает за край.

  Появляются по очереди. На широком экране колоду видно целиком и сразу,
  а на телефоне карточки идут одна под другой, и заметна именно очередь:
  их как будто сдают. Задержка небольшая — иначе похоже не на раздачу, а
  на медленную загрузку.
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
  Раскладка карточки.

  На широком экране — колода: три карточки в одной ячейке сетки,
  разъехавшиеся в стороны и наклонённые. На телефоне тот же разъезд, но
  листается пальцем: три карточки по 352 пикселя в 360 не помещаются, а
  собирать их в столбик уже пробовали — получался обычный список, от
  которого весь смысл приёма пропадал.

  Ширина карточки 78% экрана выбрана не на глаз: при ней край следующей
  всегда виден, и человеку понятно, что ряд листается. Во всю ширину
  карточка выглядела бы единственной.

  Сдвиг по вертикали у второй и третьей — чтобы ряд читался как колода,
  а не как ряд одинаковых плиток.

  Трансформации живут на этом же элементе, а не на обёртке Reveal: у
  правила html[data-js] .reveal в globals.css свой transform, и по
  специфичности оно перебивает утилиту Tailwind на том же элементе.

  min-w-0 обязателен: описание не переносится (truncate), и без него
  карточка распирала бы колонку шире экрана.
*/ const LAYERS = [
  "w-[78%] shrink-0 snap-center lg:w-auto lg:shrink lg:[grid-area:stack] lg:-translate-x-36 lg:-translate-y-3 lg:opacity-70 lg:hover:z-10 lg:hover:-translate-y-9 lg:hover:opacity-100",
  "w-[78%] shrink-0 snap-center translate-y-3 lg:w-auto lg:shrink lg:[grid-area:stack] lg:translate-y-7 lg:opacity-85 lg:hover:z-10 lg:hover:translate-y-1 lg:hover:opacity-100",
  "w-[78%] shrink-0 snap-center translate-y-6 lg:w-auto lg:shrink lg:[grid-area:stack] lg:translate-x-36 lg:translate-y-[4.25rem] lg:hover:z-10 lg:hover:translate-y-10",
];

export default function DisplayCards({ cards }: { cards: DisplayCard[] }) {
  return (
    /*
      На телефоне — лента с прокруткой пальцем, на широком экране —
      стопка. Прокрутка живёт внутри блока: страница вбок не едет, за
      это отвечает overflow-x-auto на самом ряду.

      Отрицательные поля с обратными отступами — чтобы карточки доходили
      до края экрана: край следующей виден, и сразу понятно, что их
      можно листать. Без этого лента упиралась бы в поля страницы и
      выглядела как обрезанный ряд.

      overscroll-x-contain обязателен: без него смахивание влево на
      краю ленты уводит браузер на предыдущую страницу — человек
      листает карточки и вылетает с сайта.

      snap-center — карточка сама доводится до места, а не замирает
      посередине движения.
    */
    <div
      className="
        -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto
        overscroll-x-contain px-5 pb-10 pt-2
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        lg:mx-0 lg:mb-24 lg:grid lg:snap-none lg:gap-0 lg:overflow-visible
        lg:px-0 lg:pb-0 lg:pt-0 lg:place-items-center
        lg:[grid-template-areas:'stack']
      "
    >
      {cards.map((card, i) => (
        <div
          key={card.href}
          className={`transition-[transform,opacity] duration-500 ease-out ${LAYERS[i % LAYERS.length]}`}
        >
          <Reveal delay={i * 90}>
            <Link
              href={card.href}
              className="
                group flex h-full flex-col justify-between gap-3 overflow-hidden
                rounded-card border border-line bg-surface px-5 py-4
                shadow-[0_14px_34px_-16px_rgba(0,0,0,0.65)]
                transition-[border-color,transform] duration-200
                hover:border-line-strong active:scale-[0.985]
                h-36 -skew-y-[6deg] lg:w-[22rem] lg:-skew-y-[8deg] lg:shadow-none
              "
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
          </Reveal>
        </div>
      ))}
    </div>
  );
}
