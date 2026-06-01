import type { MetadataRoute } from "next";
import { getAirlines } from "@/lib/airlines";
import { guides } from "@/lib/guides";
import {
  defaultLocale,
  getAirlinePath,
  getAirlineUrl,
  getGuidePath,
  getGuideUrl,
  getLanguageAlternates,
  getLanguageAlternatesForPath,
  getLocaleUrl,
  getSiteUrl,
  getToolPath,
  getToolUrl,
  siteLocales,
} from "@/lib/site";

const languageAlternates = getLanguageAlternates();
const toolSlugs = ["eligibility-helper", "claim-template"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const airlines = getAirlines();

  return [
    {
      url: getSiteUrl("/"),
      alternates: { languages: languageAlternates },
      priority: 0.4,
    },
    ...siteLocales.map((locale) => ({
      url: getLocaleUrl(locale.code),
      alternates: { languages: languageAlternates },
      priority: locale.code === defaultLocale ? 1 : 0.8,
    })),
    ...siteLocales.flatMap((locale) =>
      airlines.map((airline) => ({
        url: getAirlineUrl(locale.code, airline.slug),
        alternates: {
          languages: getLanguageAlternatesForPath((localeCode) => getAirlinePath(localeCode, airline.slug)),
        },
        priority: airline.status === "verified" ? 0.7 : 0.5,
      })),
    ),
    ...siteLocales.flatMap((locale) =>
      guides.map((guide) => ({
        url: getGuideUrl(locale.code, guide.slug),
        alternates: {
          languages: getLanguageAlternatesForPath((localeCode) => getGuidePath(localeCode, guide.slug)),
        },
        priority: 0.7,
      })),
    ),
    ...siteLocales.flatMap((locale) =>
      toolSlugs.map((tool) => ({
        url: getToolUrl(locale.code, tool),
        alternates: {
          languages: getLanguageAlternatesForPath((localeCode) => getToolPath(localeCode, tool)),
        },
        priority: 0.6,
      })),
    ),
    { url: getSiteUrl("/api"), priority: 0.6 },
    { url: getSiteUrl("/api/meta"), priority: 0.5 },
    { url: getSiteUrl("/api/airlines"), priority: 0.5 },
    { url: getSiteUrl("/airlines.json"), priority: 0.4 },
    { url: getSiteUrl("/openapi.json"), priority: 0.5 },
    { url: getSiteUrl("/llms.txt"), priority: 0.4 },
    { url: getSiteUrl("/llms-full.txt"), priority: 0.3 },
    { url: getSiteUrl("/airlines.md"), priority: 0.4 },
    { url: getSiteUrl("/guides/index.md"), priority: 0.3 },
    { url: getSiteUrl("/contributing.md"), priority: 0.3 },
    { url: getSiteUrl("/mcp.json"), priority: 0.3 },
  ];
}
