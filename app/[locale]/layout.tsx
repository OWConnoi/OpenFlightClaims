import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { StructuredData } from "@/components/structured-data";
import { getLocale, isLocaleCode, locales } from "@/i18n/locales";
import { fontClassNames } from "@/lib/fonts";
import { getDictionary } from "@/lib/i18n";
import { defaultLocale, getLanguageAlternates, getLocaleUrl, siteName, siteUrl } from "@/lib/site";
import { getThemeScript } from "@/lib/theme";
import "../globals.css";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale: code } = await params;
  const localeCode = isLocaleCode(code) ? code : defaultLocale;
  const dictionary = getDictionary(localeCode);
  const canonicalUrl = getLocaleUrl(localeCode);

  return {
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
      locale: localeCode,
      alternateLocale: locales.filter((locale) => locale.code !== localeCode).map((locale) => locale.code),
    },
    twitter: {
      card: "summary",
      title: dictionary.meta.title,
      description: dictionary.meta.description,
    },
    robots: isLocaleCode(code) ? undefined : { index: false, follow: false },
  };
}

export default async function LocaleRootLayout({ children, params }: Readonly<LocaleLayoutProps>) {
  const { locale: code } = await params;
  const locale = getLocale(isLocaleCode(code) ? code : defaultLocale);

  const dictionary = getDictionary(locale.code);

  return (
    <html className={fontClassNames} dir={locale.dir} lang={locale.code} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
        <StructuredData
          description={dictionary.meta.description}
          localeCode={locale.code}
          title={dictionary.meta.title}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
