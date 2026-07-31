import { notFound } from "next/navigation";
import { LEGAL_DOCS, isLegalDoc, legalDoc } from "@/lib/legal";
import { LOCALES } from "@/lib/i18n/config";
import { pageLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import Reveal from "@/components/Reveal";

/*
  Три документа одной страницей: у них одинаковая структура, и три
  почти одинаковых файла разошлись бы при первой же правке вёрстки.
*/
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    LEGAL_DOCS.map((doc) => ({ locale, doc })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { doc } = await params;
  const { locale } = await pageLocale(params);
  if (!isLegalDoc(doc)) return {};

  const document = legalDoc(locale, doc);
  return pageMeta({
    locale,
    path: `/legal/${doc}`,
    title: document.title,
    description: document.intro,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { doc } = await params;
  const { locale, t } = await pageLocale(params);
  if (!isLegalDoc(doc)) notFound();

  const document = legalDoc(locale, doc);

  return (
    <section className="pt-16 pb-20 md:pt-20">
      <p className="eyebrow rise">{t.footer.legal}</p>
      <h1 className="font-display rise rise-1 mt-4 max-w-3xl text-[30px] text-ink md:text-[40px]">
        {document.title}
      </h1>
      <p className="rise rise-2 mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
        {document.intro}
      </p>

      <div className="mt-12 max-w-3xl space-y-9">
        {document.sections.map((section, i) => (
          <Reveal key={section.title} delay={Math.min(i, 6) * 50}>
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
                {section.title}
              </h2>
              <ul className="mt-3.5 space-y-2.5">
                {section.body.map((line) => (
                  <li
                    key={line}
                    className="relative pl-5 text-[14px] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-violet"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
