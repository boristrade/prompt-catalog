import { ArrowUpRight } from "lucide-react";
import { toolsByCategory, TOOLS } from "@/lib/tools";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Полезные инструменты" };

const PRICING_LABEL: Record<string, string> = {
  free: "бесплатно",
  freemium: "есть free-план",
  paid: "платно",
};

export default function ToolsPage() {
  const grouped = toolsByCategory();

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">Подборка</p>
      <h1 className="font-display rise rise-1 mt-4 text-[30px] text-ink md:text-[44px]">
        Полезные инструменты
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {TOOLS.length} сервисов и нейросетей, которые мы используем сами — по
        задачам: тексты, изображения, дизайн, видео и маркетплейсы.
      </p>

      <div className="mt-12 space-y-10">
        {Object.entries(grouped).map(([cat, tools]) => (
          <div key={cat}>
            <Reveal>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.13em] text-faint">
                {cat}
              </h2>
            </Reveal>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, i) => (
                <Reveal key={tool.name} delay={(i % 3) * 60}>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-card border border-line bg-surface p-4 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[14.5px] font-semibold tracking-[-0.015em] text-ink">
                        {tool.name}
                      </h3>
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-faint transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </div>
                    <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted">
                      {tool.description}
                    </p>
                    <span className="mt-3 w-fit rounded-chip bg-sunken px-2 py-1 font-mono text-[10.5px] text-faint">
                      {PRICING_LABEL[tool.pricing]}
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
