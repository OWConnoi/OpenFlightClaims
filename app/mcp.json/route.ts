import { getSiteUrl } from "@/lib/site";
import { prettyJson } from "@/lib/pretty-json";

export const dynamic = "force-static";

export function GET(request: Request) {
  return prettyJson({
    name: "openflightclaims",
    description: "OpenFlightClaims MCP support — use through the JSON API or MCP endpoint.",
    version: "0.1.0",
    transport: "http",
    endpoint: `${getSiteUrl("/mcp")}`,
    method: "POST",
    contentType: "application/json",
    tools: [
      "search_airlines",
      "get_airline_claim_link",
      "get_airline",
      "list_airlines_by_country",
      "list_airlines_by_region",
      "get_report_broken_link_url",
      "get_update_link_url",
      "get_dataset_meta",
    ],
    note: "This is a stateless, read-only MCP-compatible endpoint. For full documentation, see llms.txt or the OpenAPI spec.",
    alternatives: {
      openapi: getSiteUrl("/openapi.json"),
      llmsTxt: getSiteUrl("/llms.txt"),
      apiMeta: getSiteUrl("/api/meta"),
    },
    futurePlan: "A full MCP server with SSE support may be added in the future. For now, use the JSON-RPC endpoint at /mcp or the JSON/OpenAPI/Markdown endpoints.",
  }, request);
}
