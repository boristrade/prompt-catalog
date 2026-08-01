import type { Dictionary } from "@/lib/i18n/dictionaries";
import { templateImage, type Template } from "@/lib/templates";
import TemplateCard from "@/components/TemplateCard";

/*
  Бегущая лента шаблонов.

  Список отрисован дважды: дорожка уезжает ровно на половину своей ширины,
  и в этот момент вторая копия стоит там же, где начиналась первая —
  склейки не видно. Сама анимация в globals.css, здесь только разметка.

  Копия помечена aria-hidden: для читалки экрана это те же самые карточки,
  и озвучивать их дважды незачем.
*/
export default function TemplateMarquee({
  templates,
  t,
}: {
  templates: Template[];
  t: Dictionary;
}) {
  function row(copy: boolean) {
    return templates.map((item) => (
      <div key={`${copy ? "copy" : "main"}-${item.id}`} className="pr-3">
        <TemplateCard
          title={item.title}
          summary={item.summary}
          bestFor={item.bestFor}
          prompt={item.prompt}
          image={templateImage(item.id)}
          t={t}
        />
      </div>
    ));
  }

  return (
    /*
      Края растворяются в фоне, иначе карточки обрубались бы ровной
      вертикальной линией и лента читалась бы как ошибка вёрстки.
      Маска только на широких экранах: на телефоне лента листается
      пальцем, и подтаявший край мешал бы понять, что справа ещё есть.
    */
    <div className="marquee -mx-5 md:-mx-8 md:[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div className="marquee-track px-5 md:px-8">
        {row(false)}
        <div className="flex" aria-hidden="true">
          {row(true)}
        </div>
      </div>
    </div>
  );
}
