import { getAirlines } from "@/lib/airlines";
import { guides } from "@/lib/guides";
import { getLinkStatus } from "@/lib/status";
import { getSiteUrl, repoUrl, siteName } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const airlines = getAirlines();
  const active = airlines.filter((airline) => getLinkStatus(airline.status) === "active").length;
  const lines = [
    `# ${siteName}`,
    "",
    "OpenFlightClaims is a static-first open-source directory of official airline-owned claim, refund, complaint, passenger-rights, and disruption-support links.",
    "",
    "Purpose:",
    "- Help passengers find official airline links without claims-management companies, affiliate flows, accounts, or middlemen.",
    "- Provide concise official-source passenger-rights guides.",
    "- Provide browser-only helper tools that do not store or submit passenger data.",
    "",
    "Key routes:",
    "- /en",
    "- /en/airlines/[slug]",
    "- /en/guides/eu261",
    "- /en/guides/uk261",
    "- /en/guides/us-passenger-rights",
    "- /en/tools/eligibility-helper",
    "- /en/tools/claim-template",
    "",
    "Public data:",
    `- ${getSiteUrl("/api/airlines")} (JSON API)`,
    `- ${getSiteUrl("/api/airlines/[slug]")} (single airline JSON)`,
    `- ${getSiteUrl("/airlines.json")} (direct JSON file)`,
    `- ${getSiteUrl("/airlines.md")} (Markdown directory)`,
    `- ${getSiteUrl("/airlines/[slug].md")} (single airline Markdown)`,
    `- ${getSiteUrl("/api/meta")} (project metadata)`,
    `- ${getSiteUrl("/openapi.json")} (OpenAPI spec)`,
    `- ${getSiteUrl("/llms-full.txt")} (full dataset summary)`,
    "",
    `Dataset: ${airlines.length} airlines, ${active} active.`,
    "",
    "Guides:",
    ...guides.map((guide) => `- ${guide.title}: ${getSiteUrl(`/en/guides/${guide.slug}`)}`),
    "",
    "Licensing:",
    "- Code: AGPL-3.0-or-later (see LICENSE-CODE.md)",
    "- Data: ODbL-1.0 (see LICENSE-DATA.md)",
    "- Brand: reserved (see TRADEMARKS.md)",
    "- Airline names/logos/trademarks belong to their respective owners.",
    "",
    "Disclaimers:",
    "- OpenFlightClaims is not legal advice.",
    "- External airline and regulator rules can change.",
    "- Users should verify links and guidance against official airline, government, or regulator sources.",
    "- The project does not process claims and does not collect passenger personal data server-side.",
    "",
    `Contribute: ${repoUrl}`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
