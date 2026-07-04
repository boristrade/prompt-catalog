export const metadata = { title: "Полезные инструменты" };

export default function ToolsPage() {
  return (
    <section className="pt-20 pb-24 md:pt-28">
      <p className="text-[13px] font-semibold tracking-tight text-copper">
        Подборка
      </p>
      <h1 className="font-display mt-4 text-[36px] text-white md:text-[52px]">
        Полезные инструменты
      </h1>
      <p className="mt-4 max-w-xl text-lg font-light text-fog">
        Сервисы и нейросети, которые мы используем сами.
      </p>

      {/* Список инструментов из таблицы tools появится в Фазе 7 */}
      <div className="mt-14 rounded-[10px] border border-graphite bg-onyx p-10 text-center text-sm text-fog">
        Раздел подключается к базе данных в Фазе 7.
      </div>
    </section>
  );
}
