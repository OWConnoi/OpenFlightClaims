import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { StructuredData } from "@/components/structured-data";
import { fontClassNames } from "@/lib/fonts";
import { getDictionary } from "@/lib/i18n";
import { defaultLocale, getLanguageAlternates, getLocaleUrl, siteName, siteUrl } from "@/lib/site";
import { getThemeScript } from "@/lib/theme";
import "../globals.css";

const dictionary = getDictionary("en");
const canonicalUrl = getLocaleUrl(defaultLocale);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: dictionary.meta.title,
  description: dictionary.meta.description,
  applicationName: siteName,
  alternates: {
    canonical: canonicalUrl,
    languages: getLanguageAlternates(),
  },
  openGraph: {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    url: canonicalUrl,
    siteName,
    type: "website",
    locale: defaultLocale,
  },
  twitter: {
    card: "summary",
    title: dictionary.meta.title,
    description: dictionary.meta.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function DefaultRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={fontClassNames} dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
        <StructuredData
          description={dictionary.meta.description}
          localeCode={defaultLocale}
          title={dictionary.meta.title}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
