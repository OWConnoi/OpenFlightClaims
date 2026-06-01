import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocaleCode, locales } from "@/i18n/locales";
import { getAddAirlineIssueUrl, getGenericBrokenLinkIssueUrl } from "@/lib/github-issue-links";
import { getGuide, guides } from "@/lib/guides";
import { getDictionary } from "@/lib/i18n";
import { getGuidePath, getGuideUrl, getLanguageAlternatesForPath, getLocalePath, siteName, siteUrl } from "@/lib/site";

interface GuidePageProps {
  params: Promise<{
    locale: string;
    guide: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => guides.map((guide) => ({ locale: locale.code, guide: guide.slug })));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { locale: code, guide: slug } = await params;

  if (!isLocaleCode(code)) {
    notFound();
  }

  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const title = `${guide.title} | ${siteName}`;
  const canonical = getGuideUrl(code, guide.slug);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description: guide.description,
    alternates: {
      canonical,
      languages: getLanguageAlternatesForPath((locale) => getGuidePath(locale, guide.slug)),
    },
    openGraph: {
      title,
      description: guide.description,
      url: canonical,
      siteName,
      type: "article",
      locale: code,
    },
    twitter: {
      card: "summary",
      title,
      description: guide.description,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale: code, guide: slug } = await params;

  if (!isLocaleCode(code)) {
    notFound();
  }

  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const dictionary = getDictionary(code);
  const addAirlineUrl = getAddAirlineIssueUrl();
  const reportBrokenUrl = getGenericBrokenLinkIssueUrl();

  return (
    <main className="page-shell" id="main-content">
      <SiteHeader dictionary={dictionary} localeCode={code} />
      <article className="content-page">
        <a className="breadcrumb" href={getLocalePath(code)}>
          {dictionary.guides.backToDirectory}
        </a>
        <header className="content-hero">
          <p className="eyebrow">{dictionary.guides.eyebrow}</p>
          <h1>{guide.title}</h1>
          <p className="lede">{guide.summary}</p>
        </header>

        <section className="notice" aria-label="Legal disclaimer">
          <p>{dictionary.guides.disclaimer}</p>
        </section>

        <div className="content-stack">
          {guide.sections.map((section) => (
            <section className="detail-card" key={section.title}>
              <h2>{section.title}</h2>
              <ul className="clean-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <section className="detail-card">
            <h2>{dictionary.guides.officialSources}</h2>
            <ul className="source-list">
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} rel="noopener noreferrer" target="_blank">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: guide.sections.map((section) => ({
                "@type": "Question",
                name: section.title,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: section.items.join(" "),
                },
              })),
            }),
          }}
          type="application/ld+json"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: guide.title,
              description: guide.description,
              url: getGuideUrl(code, guide.slug),
              publisher: {
                "@type": "Organization",
                name: siteName,
              },
              citation: guide.sources.map((source) => source.url),
            }),
          }}
          type="application/ld+json"
        />
      </article>
      <SiteFooter addAirlineUrl={addAirlineUrl} dictionary={dictionary} localeCode={code} reportBrokenUrl={reportBrokenUrl} />
    </main>
  );
}
