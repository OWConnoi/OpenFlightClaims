import { getSiteUrl, repoUrl, siteName } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# Contributing to ${siteName}`,
    "",
    "OpenFlightClaims is an open community directory of official airline claim, refund, complaint, and passenger-rights links. It is community-maintained through GitHub.",
    "",
    "## What We Accept",
    "",
    "We accept official airline-owned compensation, refund, complaint, passenger-rights, disruption-support, or claim links.",
    "",
    "We do **not** accept:",
    "",
    "- claims-management companies",
    "- affiliate links",
    "- middlemen",
    "- lead-generation pages",
    "- unrelated travel support pages",
    "- link shorteners unless clearly airline-owned",
    "",
    "## How to Contribute",
    "",
    `- **Add an airline:** [Open an issue](${repoUrl}/issues/new?template=add-airline-link.yml)`,
    `- **Report a broken link:** [Open an issue](${repoUrl}/issues/new?template=report-broken-link.yml)`,
    `- **Suggest an update:** [Open an issue](${repoUrl}/issues/new?template=update-airline-link.yml)`,
    `- **Full contributing guide:** [CONTRIBUTING.md](${repoUrl}/blob/main/CONTRIBUTING.md)`,
    "",
    "## Data Statuses",
    "",
    "- `active`: available in the directory",
    "- `reported_broken`: community or checker flagged it as broken or outdated",
    "- `unknown`: unclear status or needs maintainer review",
    "",
    "## Requirements for New Links",
    "",
    "1. The link must be airline-owned and official.",
    "2. Include the airline name, claim URL, and proof/source URL from the airline website.",
    "3. Include optional metadata: IATA, ICAO, country, region.",
    "",
    "## API & AI Access",
    "",
    `- [JSON API](${getSiteUrl("/api/airlines")})`,
    `- [OpenAPI spec](${getSiteUrl("/openapi.json")})`,
    `- [Markdown endpoints](${getSiteUrl("/airlines.md")})`,
    `- [llms.txt](${getSiteUrl("/llms.txt")})`,
    `- [API meta](${getSiteUrl("/api/meta")})`,
    "",
    "## Legal",
    "",
    "OpenFlightClaims is not legal advice. External airline links can change. Verify links against official airline websites.",
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
