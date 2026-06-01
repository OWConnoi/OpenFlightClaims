import { locales, type LocaleCode } from "@/i18n/locales";

export const siteName = "OpenFlightClaims";
export const repoUrl = "https://github.com/OWConnoi/OpenFlightClaims";
export const defaultLocale = "en" satisfies LocaleCode;
export const fallbackSiteUrl = "https://openflightclaims.com";
export const siteLocales = locales;
export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl);

export function getSiteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${siteUrl}/`).toString();
}

export function getLocalePath(locale: LocaleCode) {
  return `/${locale}`;
}

export function getLocaleUrl(locale: LocaleCode) {
  return getSiteUrl(getLocalePath(locale));
}

export function getAirlinePath(locale: LocaleCode, slug: string) {
  return `/${locale}/airlines/${slug}`;
}

export function getAirlineUrl(locale: LocaleCode, slug: string) {
  return getSiteUrl(getAirlinePath(locale, slug));
}

export function getGuidePath(locale: LocaleCode, slug: string) {
  return `/${locale}/guides/${slug}`;
}

export function getGuideUrl(locale: LocaleCode, slug: string) {
  return getSiteUrl(getGuidePath(locale, slug));
}

export function getToolPath(locale: LocaleCode, slug: string) {
  return `/${locale}/tools/${slug}`;
}

export function getToolUrl(locale: LocaleCode, slug: string) {
  return getSiteUrl(getToolPath(locale, slug));
}

export function getLanguageAlternates() {
  const languageUrls = Object.fromEntries(siteLocales.map((locale) => [locale.code, getLocaleUrl(locale.code)]));

  return {
    ...languageUrls,
    "x-default": getLocaleUrl(defaultLocale),
  };
}

export function getLanguageAlternatesForPath(pathForLocale: (locale: LocaleCode) => string) {
  const languageUrls = Object.fromEntries(
    siteLocales.map((locale) => [locale.code, getSiteUrl(pathForLocale(locale.code))]),
  );

  return {
    ...languageUrls,
    "x-default": getSiteUrl(pathForLocale(defaultLocale)),
  };
}

export function getRepoFileUrl(path: string) {
  return `${repoUrl}/blob/main/${path.replace(/^\/+/, "")}`;
}

function normalizeSiteUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");

  if (!trimmed) {
    return fallbackSiteUrl;
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    return fallbackSiteUrl;
  }
}
