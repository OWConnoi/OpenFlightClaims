import { guides } from "@/lib/guides";
import { getSiteUrl, repoUrl, siteName } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${siteName} Guides`,
    "",
    "Official-source passenger-rights guides. Concise summaries backed by regulator links.",
    "",
    "> **Disclaimer:** These guides are not legal advice. Rules can change. Verify against the linked official sources.",
    "",
    "## Guides",
    "",
    ...guides.map((guide) => `- **${guide.title}** — ${guide.description} ([Read](${getSiteUrl(`/en/guides/${guide.slug}`)}))`),
    "",
    "## Official Sources",
    "",
    ...guides.flatMap((guide) =>
      guide.sources.map((source) => `- [${source.label}](${source.url})`),
    ),
    "",
    "## More Information",
    "",
    `- [Airline directory](${getSiteUrl("/airlines.md")})`,
    `- [GitHub repo](${repoUrl})`,
    `- [llms.txt](${getSiteUrl("/llms.txt")})`,
  ];

  return new Response([...new Set(lines)].join("\n") + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
