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
  Раскладка каждой карточки: на телефоне — поворот и нахлёст низом, на
  широком экране — разъезд в стороны.

  Нахлёст в 12 пикселей выбран по содержимому, а не на глаз: у карточки
  16 пикселей нижнего поля, и заходить дальше — значит наползать на
  строку с количеством. Стопку видно, текст цел.

  Поля по бокам на телефоне — из-за поворота: повёрнутая карточка занимает
  чуть больше своей ширины, и на 360px это давало ровно один лишний
  пиксель прокрутки. Один, но горизонтальная прокрутка есть или её нет.

  Разведены на девять рем, а не на четыре, как в исходнике: при тесном
  нахлёсте у двух задних карточек виден один заголовок, а описание и
  количество закрыты следующей. Для украшения неважно, но карточки
  здесь — ссылки на разделы, и человек выбирает по описанию.
*/
/*
  На обёртке — только то, что не трансформация: место в сетке, слой и
  поля. Трансформации сюда ставить нельзя (см. комментарий ниже).

  min-w-0 обязателен. Обёртка — элемент сетки, а у него минимальная
  ширина по умолчанию равна ширине содержимого; описание в карточке не
  переносится (truncate), поэтому «содержимое» — это вся строка целиком,
  и карточка распирала колонку на два десятка пикселей. Видно это было
  только как горизонтальная прокрутка на телефоне.
*/
const SLOTS = [
  "z-[1] min-w-0 mx-1 lg:mx-0 lg:[grid-area:stack]",
  "z-[2] min-w-0 mx-1 -mt-3 lg:mx-0 lg:mt-0 lg:[grid-area:stack]",
  "z-[3] min-w-0 mx-1 -mt-3 lg:mx-0 lg:mt-0 lg:[grid-area:stack]",
];

/*
  Поворот и разъезд — на самой ссылке, а не на обёртке Reveal, и это не
  вкусовщина. У правила html[data-js] .reveal в globals.css свой
  transform для появления, и по специфичности оно перебивает утилиту
  Tailwind на том же элементе: поворот молча не применялся бы, а на
  широком экране разъехалась бы и вся колода. Ошибка из тех, что видно
  только глазами — в сборке всё «успешно».
*/
const LAYERS = [
  "-rotate-[1.6deg] lg:rotate-0 lg:-translate-x-36 lg:-translate-y-3 lg:opacity-70 lg:group-hover/card:-translate-y-9 lg:group-hover/card:opacity-100",
  "rotate-[1.1deg] lg:rotate-0 lg:translate-y-7 lg:opacity-85 lg:group-hover/card:translate-y-1 lg:group-hover/card:opacity-100",
  "-rotate-[0.8deg] lg:rotate-0 lg:translate-x-36 lg:translate-y-[4.25rem] lg:group-hover/card:translate-y-10",
];

export default function DisplayCards({ cards }: { cards: DisplayCard[] }) {
  return (
    <div className="grid lg:mb-24 lg:grid-cols-1 lg:place-items-center lg:[grid-template-areas:'stack']">
      {cards.map((card, i) => (
        /*
          Появление и раскладка — на обёртке, а не на самой ссылке: Reveal
          создаёт свой div, и без этого сеткой управлял бы он, а карточка
          внутри легла бы мимо стопки.
        */
        <Reveal
          key={card.href}
          delay={i * 90}
          className={`group/card ${SLOTS[i % SLOTS.length]} lg:hover:z-10`}
        >
          <Link
            href={card.href}
            className={`
              group flex h-full flex-col justify-between gap-3 overflow-hidden
              rounded-card border border-line bg-surface px-5 py-4
              shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)]
              transition-[border-color,transform,opacity] duration-500 ease-out
              hover:border-line-strong active:scale-[0.985]
              lg:h-36 lg:w-[22rem] lg:-skew-y-[8deg] lg:shadow-none
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
        </Reveal>
      ))}
    </div>
  );
}
