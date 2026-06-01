import { getAirlines } from "@/lib/airlines";
import { getSiteUrl, repoUrl, siteName } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const airlines = getAirlines();
  const lines = [
    `# ${siteName} Airline Directory`,
    "",
    `**${airlines.length} airlines** in the open community directory of official airline claim, refund, complaint, and passenger-rights links.`,
    "",
    "> **Disclaimer:** OpenFlightClaims is not legal advice. External airline links can change. Verify links against official airline websites.",
    "",
    "## Airlines",
    "",
    ...airlines.map((airline) => {
      const detailMd = getSiteUrl(`/airlines/${airline.slug}.md`);
      const apiJson = getSiteUrl(`/api/airlines/${airline.slug}`);
      const codes = [airline.iata, airline.icao].filter(Boolean).join(" / ");
      const meta = codes ? ` (${codes})` : "";
      const country = airline.country ?? "";
      return `- **${airline.name}**${meta}${country ? ` — ${country}` : ""} &middot; [Claim link](${airline.claimUrl}) &middot; [Details](${detailMd}) &middot; [JSON](${apiJson})`;
    }),
    "",
    "## Contributing",
    "",
    `- [Add a missing airline](${repoUrl}/issues/new?template=add-airline-link.yml)`,
    `- [Report a broken link](${repoUrl}/issues/new?template=report-broken-link.yml)`,
    `- [Suggest an update](${repoUrl}/issues/new?template=update-airline-link.yml)`,
    `- [Contribution guide](${repoUrl}/blob/main/CONTRIBUTING.md)`,
    "",
    "## API & Data",
    "",
    `- [JSON API](${getSiteUrl("/api/airlines")})`,
    `- [OpenAPI spec](${getSiteUrl("/openapi.json")})`,
    `- [llms.txt](${getSiteUrl("/llms.txt")})`,
    `- [GitHub repo](${repoUrl})`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
