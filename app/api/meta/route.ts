import { getAirlines, getDatasetStats } from "@/lib/airlines";
import { getSiteUrl, repoUrl, siteName, siteLocales, fallbackSiteUrl } from "@/lib/site";
import { prettyJson } from "@/lib/pretty-json";

export const dynamic = "force-static";

export function GET(request: Request) {
  const airlines = getAirlines();
  const stats = getDatasetStats(airlines);
  const siteUrlResolved = process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl;

  const payload = {
    project: siteName,
    description: "Open community directory of official airline claim, refund, complaint, and passenger-rights links.",
    repoUrl,
    siteUrl: siteUrlResolved,
    supportedLocales: siteLocales.map((locale) => locale.code),
    dataset: {
      count: stats.total,
      active: stats.active,
    },
    generatedAt: new Date().toISOString(),
    endpoints: {
      apiDocs: getSiteUrl("/api"),
      airlines: getSiteUrl("/api/airlines"),
      airlineBySlug: getSiteUrl("/api/airlines/{slug}"),
      airlinesJson: getSiteUrl("/airlines.json"),
      airlinesMarkdown: getSiteUrl("/airlines.md"),
      meta: getSiteUrl("/api/meta"),
      openapi: getSiteUrl("/openapi.json"),
      llmsTxt: getSiteUrl("/llms.txt"),
      llmsFullTxt: getSiteUrl("/llms-full.txt"),
    },
    marksdownEndpoints: {
      airlines: getSiteUrl("/airlines.md"),
      airlineBySlug: getSiteUrl("/airlines/{slug}.md"),
      guides: getSiteUrl("/guides/index.md"),
      contributing: getSiteUrl("/contributing.md"),
    },
    disclaimer: "OpenFlightClaims is not legal advice. External airline links can change. Verify links against official airline websites.",
    licenses: {
      code: "AGPL-3.0-or-later",
      codeUrl: getSiteUrl("/LICENSE-CODE.md"),
      data: "ODbL-1.0",
      dataUrl: getSiteUrl("/LICENSE-DATA.md"),
      trademarkPolicyUrl: getSiteUrl("/TRADEMARKS.md"),
      noticeUrl: getSiteUrl("/NOTICE"),
    },
    contribution: {
      addAirline: `${repoUrl}/issues/new?template=add-airline-link.yml`,
      reportBroken: `${repoUrl}/issues/new?template=report-broken-link.yml`,
      suggestUpdate: `${repoUrl}/issues/new?template=update-airline-link.yml`,
      contributingGuide: `${repoUrl}/blob/main/CONTRIBUTING.md`,
    },
  };

  return prettyJson(payload, request);
}
