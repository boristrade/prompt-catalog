import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { allGuides } from "@/lib/guides";
import { allPdfGuides } from "@/lib/pdf-guides";
import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import Reveal from "@/components/Reveal";

/*
  Список гайдов. Статика: тексты лежат в коде, файлы — на диске, от
  вошедшего не зависят ни те ни другие — собирать страницу на каждый
  запрос незачем.

  Два вида в одном списке. Текстовый гайд открывается страницей на сайте,
  гайд-файл — самим PDF во весь экран, в родной читалке телефона.
  Разделять их на две вкладки было бы честно по устройству и неудобно по
  делу: человек ищет ответ на вопрос, а не формат файла.
*/
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  return pageMeta({
    locale,
    path: "/guides",
    title: t.guides.title,
    description: t.guides.subtitle,
  });
}

const CARD =
  "group flex h-full flex-col rounded-card border border-line bg-surface p-6 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong";

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const guides = allGuides(locale);
  const files = allPdfGuides(locale);

  /*
    Файлы идут первыми: свёрстанный гайд — то, ради чего сюда заходят.
    Карточки в ряду появляются со сдвигом, поэтому задержку считаем по
    месту в общем списке, а не по месту внутри своей половины.
  */
  const delay = (i: number) => (i % 2) * 70;

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{t.guides.eyebrow}</p>
      <h1 className="font-display rise rise-1 mt-4 max-w-2xl text-balance text-[30px] leading-tight text-ink md:text-[44px]">
        {t.guides.title}
      </h1>
      <p className="rise rise-2 mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        {t.guides.subtitle}
      </p>

      <div className="mt-10 grid items-start gap-3 lg:grid-cols-2">
        {files.map((file, i) => (
          <Reveal key={file.slug} delay={delay(i)}>
            {/*
              Обычная ссылка, а не <Link>: PDF отдаёт не роутер, а сервер
              файлом. target="_blank" — чтобы сайт остался открытым за
              спиной у читалки и «назад» вернуло на список, а не на
              главную.
            */}
            <a href={file.file} target="_blank" rel="noopener" className={CARD}>
              {file.cover && (
                /*
                  Первая страница вместо картинки-заставки: сразу видно,
                  что это свёрстанный документ, а не ссылка в никуда.
                  object-top — показываем верх страницы с заголовком,
                  а не её середину.
                */
                <span className="mb-5 block overflow-hidden rounded-[10px] border border-line bg-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.cover}
                    alt=""
                    loading="lazy"
                    className="h-40 w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.02] sm:h-48"
                  />
                </span>
              )}

              <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
                <FileText size={11} />
                PDF
                {file.pages ? ` · ${file.pages} ${t.guides.pages}` : ""}
              </span>
              <h2 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink transition-colors duration-200 group-hover:text-accent">
                {file.title}
              </h2>
              {file.summary && (
                <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-muted">
                  {file.summary}
                </p>
              )}
              <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent">
                {t.guides.openPdf}
                <ArrowRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </a>
          </Reveal>
        ))}

        {guides.map(({ slug, guide }, i) => (
          <Reveal key={slug} delay={delay(files.length + i)}>
            <Link href={`/${locale}/guides/${slug}`} className={CARD}>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
                <Clock size={11} />
                {guide.minutes} {t.guides.minutes}
              </span>
              <h2 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink transition-colors duration-200 group-hover:text-accent">
                {guide.title}
              </h2>
              <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-muted">
                {guide.summary}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent">
                {t.guides.readMore}
                <ArrowRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
