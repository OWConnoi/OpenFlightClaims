import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocaleCode, locales } from "@/i18n/locales";
import { getAddAirlineIssueUrl, getGenericBrokenLinkIssueUrl } from "@/lib/github-issue-links";
import { getDictionary } from "@/lib/i18n";
import { guides } from "@/lib/guides";
import { getGuidePath, getLanguageAlternatesForPath, getLocalePath, siteName, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: code } = await params;
  if (!isLocaleCode(code)) notFound();
  const title = `Guides | ${siteName}`;
  const description = "Official-source passenger-rights guides for flight disruptions, baggage, downgrades, and refunds.";
  const canonical = `${siteUrl}/${code}/guides`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternatesForPath((locale) => `${getLocalePath(locale)}/guides`),
    },
    openGraph: { title, description, url: canonical, siteName, type: "website", locale: code },
    twitter: { card: "summary", title, description },
  };
}

export default async function GuidesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: code } = await params;
  if (!isLocaleCode(code)) notFound();

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
          <h1>Passenger rights guides</h1>
          <p className="lede">
            Concise, official-source summaries. Not legal advice — always verify against the linked regulator guidance.
          </p>
        </header>

        <section className="notice" aria-label="Legal disclaimer">
          <p>{dictionary.guides.disclaimer}</p>
        </section>

        <div className="content-stack">
          {guides.map((guide) => (
            <details className="detail-card guide-accordion" key={guide.slug}>
              <summary className="guide-accordion__summary">
                <span className="guide-accordion__title">{guide.title}</span>
                <span className="guide-accordion__meta">{guide.description}</span>
              </summary>
              <div className="guide-accordion__content">
                <p className="muted">{guide.summary}</p>
                <div className="card-actions">
                  <a className="claim-button" href={getGuidePath(code, guide.slug)}>
                    Read guide
                  </a>
                </div>
              </div>
            </details>
          ))}
        </div>
      </article>

      <SiteFooter addAirlineUrl={addAirlineUrl} dictionary={dictionary} localeCode={code} reportBrokenUrl={reportBrokenUrl} />
    </main>
  );
}
