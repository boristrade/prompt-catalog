import { Search } from "lucide-react";

/*
  Поиск по каталогу — обычная GET-форма, а не клиентский компонент со
  своим состоянием. Так же, как фильтры в CatalogFilters: результат
  живёт в адресе, работает без JavaScript и до того, как скрипты
  загрузились, и переслать подборку «промт про упаковку» можно ссылкой.

  Остальные фильтры (доступ, нейросеть, раздел) едут вместе со строкой
  поиска скрытыми полями: без них отправка формы обнулила бы их —
  обычное поведение <form>, а не то, что здесь нужно.
*/
export default function SearchBox({
  action,
  query,
  placeholder,
  button,
  hidden = {},
}: {
  action: string;
  query: string;
  placeholder: string;
  button: string;
  hidden?: Record<string, string>;
}) {
  return (
    <form action={action} method="get" className="flex gap-2">
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div className="relative flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          className="w-full rounded-chip border border-line bg-surface py-2.5 pl-10 pr-4 text-[13.5px] text-ink outline-none transition-[border-color] duration-200 placeholder:text-faint focus:border-line-strong"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-chip border border-line-strong px-5 py-2.5 text-[13.5px] font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-sunken active:scale-[0.97]"
      >
        {button}
      </button>
    </form>
  );
}
