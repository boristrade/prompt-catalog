import { ArrowUpRight } from "lucide-react";
import { toolsByCategory, TOOLS } from "@/lib/tools";

export const metadata = { title: "Полезные инструменты" };

const PRICING_LABEL: Record<string, string> = {
  free: "Бесплатно",
  freemium: "Есть free-план",
  paid: "Платно",
};

export default function ToolsPage() {
  const grouped = toolsByCategory();

  return (
    <section className="pt-20 pb-24 md:pt-28">
      <p className="text-[13px] font-semibold tracking-tight text-copper">
        Подборка
      </p>
      <h1 className="font-display mt-4 text-[36px] text-white md:text-[52px]">
        Полезные инструменты
      </h1>
      <p className="mt-4 max-w-xl text-lg font-light text-fog">
        {TOOLS.length} сервисов и нейросетей, которые мы используем сами — по
        задачам: тексты, изображения, дизайн, видео и маркетплейсы.
      </p>

      <div className="mt-14 space-y-14">
        {Object.entries(grouped).map(([cat, tools]) => (
          <div key={cat}>
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-fog">
              {cat}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-[10px] border border-graphite bg-onyx p-5 transition-colors hover:border-slate"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-medium text-white">
                      {tool.name}
                    </h3>
                    <ArrowUpRight
                      size={16}
                      className="text-steel transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-copper"
                    />
                  </div>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-fog">
                    {tool.description}
                  </p>
                  <span className="mt-4 w-fit rounded-[2px] bg-carbon px-2 py-1 text-[11px] text-mist">
                    {PRICING_LABEL[tool.pricing]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
