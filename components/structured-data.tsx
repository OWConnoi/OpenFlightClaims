import { siteName, siteUrl } from "@/lib/site";

interface StructuredDataProps {
  description: string;
  localeCode: string;
  title: string;
}

export function StructuredData({ description, localeCode, title }: StructuredDataProps) {
  const pageUrl = `${siteUrl}/${localeCode}`;

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description,
    inLanguage: localeCode,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${pageUrl}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description,
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: pageUrl,
    isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    inLanguage: localeCode,
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
        type="application/ld+json"
      />
    </>
  );
}
