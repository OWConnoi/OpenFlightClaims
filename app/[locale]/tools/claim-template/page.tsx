import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClaimTemplateGenerator } from "@/components/claim-template-generator";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocaleCode, locales } from "@/i18n/locales";
import { getAirlines } from "@/lib/airlines";
import { getAddAirlineIssueUrl, getGenericBrokenLinkIssueUrl } from "@/lib/github-issue-links";
import { getDictionary } from "@/lib/i18n";
import { getLanguageAlternatesForPath, getLocalePath, getToolPath, getToolUrl, siteName, siteUrl } from "@/lib/site";

interface ToolPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocaleCode(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const title = `${dictionary.tools.claimTemplateTitle} | ${siteName}`;
  const description = dictionary.tools.claimTemplateDescription;
  const canonical = getToolUrl(locale, "claim-template");

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternatesForPath((localeCode) => getToolPath(localeCode, "claim-template")),
    },
    openGraph: { title, description, url: canonical, siteName, type: "website", locale },
    twitter: { card: "summary", title, description },
  };
}

export default async function ClaimTemplatePage({ params }: ToolPageProps) {
  const { locale } = await params;

  if (!isLocaleCode(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const addAirlineUrl = getAddAirlineIssueUrl();
  const reportBrokenUrl = getGenericBrokenLinkIssueUrl();

  return (
    <main className="page-shell" id="main-content">
      <SiteHeader dictionary={dictionary} localeCode={locale} />
      <section className="content-page">
        <a className="breadcrumb" href={getLocalePath(locale)}>
          {dictionary.guides.backToDirectory}
        </a>
        <header className="content-hero">
          <p className="eyebrow">{dictionary.tools.eyebrow}</p>
          <h1>{dictionary.tools.claimTemplateTitle}</h1>
          <p className="lede">{dictionary.tools.claimTemplateDescription}</p>
        </header>
        <section className="notice">
          <p>{dictionary.tools.templateDisclaimer}</p>
        </section>
        <ClaimTemplateGenerator airlines={getAirlines()} dictionary={dictionary} />
      </section>
      <SiteFooter addAirlineUrl={addAirlineUrl} dictionary={dictionary} localeCode={locale} reportBrokenUrl={reportBrokenUrl} />
    </main>
  );
}
