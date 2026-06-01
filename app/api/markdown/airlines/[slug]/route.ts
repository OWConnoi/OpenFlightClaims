import { notFound } from "next/navigation";
import { getAirlines, getAirlineBySlug } from "@/lib/airlines";
import { getSiteUrl, repoUrl } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAirlines().map((airline) => ({ slug: airline.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const airline = getAirlineBySlug(slug);

  if (!airline) {
    notFound();
  }

  const codes = [airline.iata, airline.icao].filter(Boolean).join(" / ");
  const locationInfo = [airline.country, airline.region].filter(Boolean).join(", ");

  const lines = [
    `# ${airline.name} official claim link`,
    "",
    `- **Claim URL:** ${airline.claimUrl}`,
  ];

  if (codes) {
    lines.push(`- **Codes:** ${codes}`);
  }
  if (locationInfo) {
    lines.push(`- **Location:** ${locationInfo}`);
  }
  if (airline.aliases.length > 0) {
    lines.push(`- **Also known as:** ${airline.aliases.join(", ")}`);
  }

  lines.push(
    "",
    "## Status",
    "",
    `- **Listed at:** ${airline.listedAt}`,
  );

  if (airline.verifiedAt) {
    lines.push(`- **Verified at:** ${airline.verifiedAt}`);
  }

  if (airline.verifiedBy) {
    lines.push(`- **Verified by:** ${airline.verifiedBy}`);
  }

  if (airline.lastCheckedAt) {
    lines.push(`- **Last checked:** ${airline.lastCheckedAt}`);
  }

  if (airline.officialSourceUrl) {
    lines.push(
      "",
      "## Official Source",
      "",
      `- ${airline.officialSourceUrl}`,
    );
  }

  if (airline.officialWebsiteUrl) {
    lines.push(`- [Official website](${airline.officialWebsiteUrl})`);
  }

  lines.push(
    "",
    "## Links",
    "",
    `- [JSON API](${getSiteUrl(`/api/airlines/${airline.slug}`)})`,
    `- [Detail page](${getSiteUrl(`/en/airlines/${airline.slug}`)})`,
  );

  lines.push(
    "",
    "## Contribute",
    "",
    `- [Report broken link](${repoUrl}/issues/new?template=report-broken-link.yml&title=${encodeURIComponent(`Report broken airline link: ${airline.name}`)})`,
    `- [Suggest update](${repoUrl}/issues/new?template=update-airline-link.yml&title=${encodeURIComponent(`Update airline link: ${airline.name}`)})`,
    "",
    "> **Disclaimer:** OpenFlightClaims is not legal advice. External airline links can change. Verify links against official airline websites.",
  );

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
