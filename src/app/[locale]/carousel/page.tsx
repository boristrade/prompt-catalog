import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import CarouselBuilder from "@/components/carousel/CarouselBuilder";
import { niches } from "@/lib/carousel/niches";

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
    path: "/carousel",
    title: t.carousel.title,
    description: t.carousel.subtitle,
  });
}

export default async function CarouselPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await pageLocale(params);

  return (
    <section className="py-14 md:py-16">
      <Reveal>
        <p className="eyebrow">{t.carousel.nav}</p>
        <h1 className="font-display mt-3 text-balance text-[32px] leading-[1.1] text-ink md:text-[42px]">
          {t.carousel.title}
        </h1>
        <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted">
          {t.carousel.subtitle}
        </p>
      </Reveal>

      {/*
        Конструктор — клиентский: он рисует канвасом и читает файл с
        телефона. На сервере рисовать нечем, да и незачем: фотография
        туда не попадает вовсе.
      */}
      <CarouselBuilder t={t} niches={niches(locale)} />
    </section>
  );
}
