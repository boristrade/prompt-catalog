import { Copy, Sailboat, Sparkles, User } from "lucide-react";

/*
  Визуал первого экрана: карточка примера промта и «плавающие» плитки
  AI-сервисов вокруг неё. Всё собрано на CSS — ни одной картинки,
  поэтому блок ничего не весит и корректно живёт в обеих темах.
*/
export default function HeroVisual() {
  return (
    /* Внутренние отступы дают плиткам место: они «вылетают» за карточку,
       но остаются внутри блока и не создают горизонтальную прокрутку. */
    <div
      aria-hidden
      className="relative mx-auto hidden w-full max-w-[520px] select-none px-9 py-10 lg:block"
    >
      {/* Свечение под композицией */}
      <div className="pointer-events-none absolute inset-x-4 top-8 bottom-0 rounded-[80px] bg-[radial-gradient(closest-side,var(--glow),transparent_75%)] blur-xl" />

      {/* Карточка примера промта */}
      <div className="relative z-10 rounded-[18px] border border-line-strong bg-surface p-4 shadow-[0_30px_80px_-40px_var(--glow)]">
        <div className="flex items-center gap-2 text-[12.5px] text-muted">
          <User size={13} className="text-accent" />
          Пример промта
        </div>

        <div className="mt-3 rounded-[12px] border border-line bg-sunken p-3.5 font-mono text-[12px] leading-[1.7] text-muted">
          Создай реалистичное изображение будущего города на закате,{" "}
          <span className="text-accent">киберпанк стиль</span>, неоновые огни,
          летящие машины, высокая детализация,{" "}
          <span className="text-accent">8k, cinematic…</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {["Midjourney", "8K", "Cinematic"].map((t) => (
            <span
              key={t}
              className="rounded-chip border border-line bg-sunken px-2.5 py-1 text-[11px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-chip border border-line-strong bg-sunken px-4 py-2 text-[12.5px] font-medium text-ink">
            Копировать
            <Copy size={13} className="text-accent" />
          </span>
        </div>
      </div>

      {/* Плитка сверху справа */}
      <div className="grad-fill absolute right-0 top-0 z-20 flex h-[74px] w-[74px] rotate-[8deg] items-center justify-center rounded-[20px] shadow-[0_20px_40px_-16px_var(--glow)]">
        <Sparkles size={30} />
      </div>

      {/* Плитка слева — стоит перед карточкой, поэтому z-30 */}
      <div className="absolute left-0 top-[46%] z-30 flex h-[68px] w-[68px] -rotate-[10deg] items-center justify-center rounded-[18px] border border-line-strong bg-surface text-accent shadow-[0_18px_40px_-18px_var(--glow)]">
        <Sailboat size={26} />
      </div>

      {/* Плитка справа снизу */}
      <div className="absolute bottom-2 right-0 z-30 flex h-[70px] w-[70px] rotate-[6deg] items-center justify-center rounded-[18px] border border-line-strong bg-surface font-display text-[20px] tracking-tight text-ink shadow-[0_18px_40px_-18px_var(--glow)]">
        AI
      </div>
    </div>
  );
}
