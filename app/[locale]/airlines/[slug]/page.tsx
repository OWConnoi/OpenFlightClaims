import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocaleCode, locales } from "@/i18n/locales";
import { getAirlines, getAirlineBySlug } from "@/lib/airlines";
import { getAddAirlineIssueUrl, getBrokenLinkIssueUrl, getGenericBrokenLinkIssueUrl, getUpdateIssueUrl } from "@/lib/github-issue-links";
import { getDictionary } from "@/lib/i18n";
import { getAirlinePath, getAirlineUrl, getLanguageAlternatesForPath, getLocalePath, siteName, siteUrl } from "@/lib/site";
import type { AirlineRecord } from "@/types/airline";

interface AirlinePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const airlines = getAirlines();
  return locales.flatMap((locale) => airlines.map((airline) => ({ locale: locale.code, slug: airline.slug })));
}

export async function generateMetadata({ params }: AirlinePageProps): Promise<Metadata> {
  const { locale: code, slug } = await params;

  if (!isLocaleCode(code)) {
    notFound();
  }

  const airline = getAirlineBySlug(slug);

  if (!airline) {
    notFound();
  }

  const title = `${airline.name} | ${siteName}`;
  const description = `Open the official ${airline.name} claim, refund, or complaint link. No middlemen. Open source.`;
  const canonical = getAirlineUrl(code, airline.slug);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternatesForPath((locale) => getAirlinePath(locale, airline.slug)),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: "website",
      locale: code,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function AirlinePage({ params }: AirlinePageProps) {
  const { locale: code, slug } = await params;

  if (!isLocaleCode(code)) {
    notFound();
  }

  const airline = getAirlineBySlug(slug);

  if (!airline) {
    notFound();
  }

  const dictionary = getDictionary(code);
  const addAirlineUrl = getAddAirlineIssueUrl();
  const reportBrokenUrl = getGenericBrokenLinkIssueUrl();

  return (
    <main className="page-shell" id="main-content">
      <SiteHeader dictionary={dictionary} localeCode={code} />

      <nav aria-label="Breadcrumb">
        <a className="breadcrumb" href={getLocalePath(code)}>
          {dictionary.airlineDetail.backToDirectory}
        </a>
      </nav>

      <article className="detail-page">
        <header className="detail-hero">
          <div>
            <h1>{airline.name}</h1>
            <p className="detail-meta">
              {formatCodes(airline)}
              {airline.country ? <span>{airline.country}</span> : null}
              {airline.region ? <span>{airline.region}</span> : null}
            </p>
          </div>
        </header>

        <div className="detail-layout">
          <section className="detail-card">
            <p className="detail-lede">{dictionary.airlineDetail.claimDescription}</p>
            <div className="card-actions">
              <a className="claim-button" href={airline.claimUrl} rel="noopener noreferrer" target="_blank">
                {dictionary.actions.openClaim}
              </a>
              {airline.officialWebsiteUrl ? (
                <a className="secondary-link" href={airline.officialWebsiteUrl} rel="noopener noreferrer" target="_blank">
                  {dictionary.airlineDetail.officialWebsite}
                </a>
              ) : null}
            </div>
          </section>

          <section className="detail-card">
            <h2 className="detail-card__title">{dictionary.airlineDetail.contribute}</h2>
            <div className="card-actions card-actions--stack">
              <a className="secondary-link" href={getBrokenLinkIssueUrl(airline)} rel="noopener noreferrer" target="_blank">
                {dictionary.actions.reportBroken}
              </a>
              <a className="secondary-link" href={getUpdateIssueUrl(airline)} rel="noopener noreferrer" target="_blank">
                {dictionary.actions.suggestUpdate}
              </a>
              <a className="secondary-link" href={addAirlineUrl} rel="noopener noreferrer" target="_blank">
                {dictionary.actions.addAirline}
              </a>
            </div>
          </section>

          {airline.notes ? (
            <section className="detail-card detail-card--wide">
              <p className="muted">{airline.notes}</p>
            </section>
          ) : null}

          <section className="notice detail-card--wide" aria-label="Accuracy note">
            <p>{dictionary.airlineDetail.accuracyNote}</p>
          </section>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: `${airline.name} official claim link`,
              url: getAirlineUrl(code, airline.slug),
              isPartOf: {
                "@type": "WebSite",
                name: siteName,
                url: siteUrl,
              },
              about: {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": getAirlineUrl(code, airline.slug),
                name: airline.name,
                url: airline.claimUrl,
                sameAs: airline.officialWebsiteUrl ? [airline.officialWebsiteUrl] : undefined,
                address: airline.country
                  ? {
                      "@type": "PostalAddress",
                      addressCountry: airline.country,
                    }
                  : undefined,
                identifier: [
                  airline.iata ? { "@type": "PropertyValue", propertyID: "IATA", value: airline.iata } : undefined,
                  airline.icao ? { "@type": "PropertyValue", propertyID: "ICAO", value: airline.icao } : undefined,
                ].filter(Boolean),
              },
            }),
          }}
          type="application/ld+json"
        />
      </article>

      <SiteFooter addAirlineUrl={addAirlineUrl} dictionary={dictionary} localeCode={code} reportBrokenUrl={reportBrokenUrl} />
    </main>
  );
}

function formatCodes(airline: AirlineRecord) {
  const codes = [airline.iata, airline.icao].filter(Boolean);
  if (codes.length === 0) return null;
  return <span>{codes.join(" / ")}</span>;
}
