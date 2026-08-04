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
  Раскладка карточки. Три слоя, и у каждого своя трансформация — иначе
  никак:

  1. внешний div — место в сетке, слой и сам сдвиг колоды;
  2. Reveal внутри — своё превращение для появления;
  3. ссылка — наклон.

  Сдвиг обязан жить на внешнем div, а не на ссылке внутри, и это не
  вкусовщина. Все три обёртки лежат в одной ячейке сетки. Сдвинь мы
  только ссылку — карточка рисуется слева, а её обёртка остаётся в
  середине, поверх соседей: верхняя карточка перехватывает нажатия по
  двум нижним. Человек жмёт «Гайды» и попадает в «Промты» — или никуда.
  Трансформация на самом элементе двигает и то, что нарисовано, и то,
  что нажимается.

  Ставить сдвиг на Reveal тоже нельзя: у правила html[data-js] .reveal в
  globals.css свой transform для появления, и по специфичности оно
  перебивает утилиту Tailwind на том же элементе — сдвиг молча не
  применился бы.

  Нахлёст на телефоне в 12 пикселей выбран по содержимому, а не на глаз:
  у карточки 16 пикселей нижнего поля, глубже — и наползаем на строку с
  количеством. Поля по бокам — из-за поворота: повёрнутая карточка
  занимает чуть больше своей ширины, и на 360px это давало ровно один
  лишний пиксель прокрутки.

  На широком экране разведены на девять рем, а не на четыре, как в
  исходнике: при тесном нахлёсте у двух задних видно один заголовок, а
  описание и количество закрыты следующей. Для украшения неважно, но
  карточки здесь — ссылки на разделы, и человек выбирает по описанию.

  min-w-0 обязателен: обёртка — элемент сетки, а у него минимальная
  ширина по умолчанию равна ширине содержимого. Описание не переносится
  (truncate), поэтому «содержимым» была вся строка целиком, и карточка
  распирала колонку на два десятка пикселей.
*/
const LAYERS = [
  "z-[1] min-w-0 mx-1 -rotate-[1.6deg] lg:mx-0 lg:rotate-0 lg:[grid-area:stack] lg:-translate-x-36 lg:-translate-y-3 lg:opacity-70 lg:hover:z-10 lg:hover:-translate-y-9 lg:hover:opacity-100",
  "z-[2] min-w-0 mx-1 -mt-3 rotate-[1.1deg] lg:mx-0 lg:mt-0 lg:rotate-0 lg:[grid-area:stack] lg:translate-y-7 lg:opacity-85 lg:hover:z-10 lg:hover:translate-y-1 lg:hover:opacity-100",
  "z-[3] min-w-0 mx-1 -mt-3 -rotate-[0.8deg] lg:mx-0 lg:mt-0 lg:rotate-0 lg:[grid-area:stack] lg:translate-x-36 lg:translate-y-[4.25rem] lg:hover:z-10 lg:hover:translate-y-10",
];

export default function DisplayCards({ cards }: { cards: DisplayCard[] }) {
  return (
    <div className="grid lg:mb-24 lg:grid-cols-1 lg:place-items-center lg:[grid-template-areas:'stack']">
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
                shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)]
                transition-[border-color,transform] duration-200
                hover:border-line-strong active:scale-[0.985]
                lg:h-36 lg:w-[22rem] lg:-skew-y-[8deg] lg:shadow-none
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
