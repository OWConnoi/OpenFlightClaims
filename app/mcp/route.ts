import { getAirlines } from "@/lib/airlines";
import { getLinkStatus } from "@/lib/status";
import { getBrokenLinkIssueUrl, getUpdateIssueUrl } from "@/lib/github-issue-links";
import { getSiteUrl, repoUrl } from "@/lib/site";

export const dynamic = "force-static";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error");
  }

  if (!isJsonRpcRequest(body)) {
    return jsonRpcError(null, -32600, "Invalid Request");
  }

  const { method, params, id } = body;

  switch (method) {
    case "tools/list":
      return jsonRpcResult(id, { tools: getTools() });
    case "tools/call": {
      if (!params || typeof params !== "object" || !("name" in params)) {
        return jsonRpcError(id, -32602, "Invalid params");
      }
      const toolName = (params as { name: string }).name;
      const toolArgs = (params as { arguments?: Record<string, unknown> }).arguments ?? {};
      const content = await callTool(toolName, toolArgs);
      return jsonRpcResult(id, { content });
    }
    default:
      return jsonRpcError(id, -32601, `Method not found: ${method}`);
  }
}

function getTools() {
  return [
    {
      name: "search_airlines",
      description: "Search airlines by name, IATA code, ICAO code, country, or region.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
        },
        required: ["query"],
      },
    },
    {
      name: "get_airline_claim_link",
      description: "Get the official claim link and metadata for an airline by slug or name.",
      inputSchema: {
        type: "object",
        properties: {
          slug_or_name: { type: "string", description: "Airline slug or name" },
        },
        required: ["slug_or_name"],
      },
    },
    {
      name: "get_airline",
      description: "Get full airline record by slug or name.",
      inputSchema: {
        type: "object",
        properties: {
          slug_or_name: { type: "string", description: "Airline slug or name" },
        },
        required: ["slug_or_name"],
      },
    },
    {
      name: "list_airlines_by_country",
      description: "List airlines filtered by country.",
      inputSchema: {
        type: "object",
        properties: {
          country: { type: "string", description: "Country name" },
        },
        required: ["country"],
      },
    },
    {
      name: "list_airlines_by_region",
      description: "List airlines filtered by region.",
      inputSchema: {
        type: "object",
        properties: {
          region: { type: "string", description: "Region name" },
        },
        required: ["region"],
      },
    },
    {
      name: "get_report_broken_link_url",
      description: "Get the GitHub issue URL for reporting a broken link for an airline.",
      inputSchema: {
        type: "object",
        properties: {
          slug_or_name: { type: "string", description: "Airline slug or name" },
        },
        required: ["slug_or_name"],
      },
    },
    {
      name: "get_update_link_url",
      description: "Get the GitHub issue URL for suggesting an update to an airline record.",
      inputSchema: {
        type: "object",
        properties: {
          slug_or_name: { type: "string", description: "Airline slug or name" },
        },
        required: ["slug_or_name"],
      },
    },
    {
      name: "get_dataset_meta",
      description: "Get dataset metadata including count, status distribution, and available endpoints.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ];
}

async function callTool(name: string, args: Record<string, unknown>): Promise<Array<{ type: "text"; text: string }>> {
  const airlines = getAirlines();

  switch (name) {
    case "search_airlines": {
      const query = (typeof args.query === "string" ? args.query : "").toLowerCase().trim();
      if (!query) return [{ type: "text", text: JSON.stringify({ results: [] }) }];
      const results = airlines.filter((airline) => {
        const haystack = [airline.name, airline.iata, airline.icao, airline.country, airline.region, ...airline.aliases]
          .filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(query);
      }).map(summarize);
      return [{ type: "text", text: JSON.stringify({ results, count: results.length }) }];
    }
    case "get_airline_claim_link":
    case "get_airline": {
      const input = typeof args.slug_or_name === "string" ? args.slug_or_name.toLowerCase().trim() : "";
      const airline = findAirline(airlines, input);
      if (!airline) return [{ type: "text", text: JSON.stringify({ error: "Airline not found." }) }];
      if (name === "get_airline_claim_link") {
        return [{ type: "text", text: JSON.stringify(summarize(airline)) }];
      }
      return [{ type: "text", text: JSON.stringify({ airline, linkStatus: getLinkStatus(airline.status) }) }];
    }
    case "list_airlines_by_country": {
      const country = typeof args.country === "string" ? args.country.toLowerCase().trim() : "";
      const results = airlines.filter((a) => a.country?.toLowerCase().includes(country)).map(summarize);
      return [{ type: "text", text: JSON.stringify({ results, count: results.length }) }];
    }
    case "list_airlines_by_region": {
      const region = typeof args.region === "string" ? args.region.toLowerCase().trim() : "";
      const results = airlines.filter((a) => a.region?.toLowerCase().includes(region)).map(summarize);
      return [{ type: "text", text: JSON.stringify({ results, count: results.length }) }];
    }
    case "get_report_broken_link_url":
    case "get_update_link_url": {
      const input = typeof args.slug_or_name === "string" ? args.slug_or_name.toLowerCase().trim() : "";
      const airline = findAirline(airlines, input);
      if (!airline) return [{ type: "text", text: JSON.stringify({ error: "Airline not found." }) }];
      const url = name === "get_report_broken_link_url" ? getBrokenLinkIssueUrl(airline) : getUpdateIssueUrl(airline);
      return [{ type: "text", text: JSON.stringify({ url }) }];
    }
    case "get_dataset_meta": {
      const active = airlines.filter((a) => getLinkStatus(a.status) === "active").length;
      return [{ type: "text", text: JSON.stringify({
        total: airlines.length,
        active,
        reportedBroken: airlines.filter((a) => getLinkStatus(a.status) === "reported_broken").length,
        unknown: airlines.filter((a) => getLinkStatus(a.status) === "unknown").length,
        endpoints: {
          api: getSiteUrl("/api/airlines"),
          meta: getSiteUrl("/api/meta"),
          openapi: getSiteUrl("/openapi.json"),
          markdown: getSiteUrl("/airlines.md"),
          llmsTxt: getSiteUrl("/llms.txt"),
        },
        contribution: {
          addAirline: `${repoUrl}/issues/new?template=add-airline-link.yml`,
          reportBroken: `${repoUrl}/issues/new?template=report-broken-link.yml`,
        },
      }) }];
    }
    default:
      return [{ type: "text", text: JSON.stringify({ error: `Unknown tool: ${name}` }) }];
  }
}

function findAirline(airlines: ReturnType<typeof getAirlines>, input: string) {
  return airlines.find((a) => a.slug === input) ??
    airlines.find((a) => a.name.toLowerCase() === input) ??
    airlines.find((a) => a.iata?.toLowerCase() === input || a.icao?.toLowerCase() === input) ??
    airlines.find((a) => a.name.toLowerCase().includes(input)) ??
    null;
}

function summarize(airline: ReturnType<typeof getAirlines>[number]) {
  return {
    name: airline.name,
    slug: airline.slug,
    claimUrl: airline.claimUrl,
    iata: airline.iata,
    icao: airline.icao,
    country: airline.country,
    region: airline.region,
    linkStatus: getLinkStatus(airline.status),
    officialSourceUrl: airline.officialSourceUrl,
    listedAt: airline.listedAt,
    detailPage: getSiteUrl(`/en/airlines/${airline.slug}`),
    jsonApi: getSiteUrl(`/api/airlines/${airline.slug}`),
    markdownApi: getSiteUrl(`/airlines/${airline.slug}.md`),
  };
}

function isJsonRpcRequest(value: unknown): value is {
  jsonrpc: string;
  method: string;
  params?: unknown;
  id?: string | number | null;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "method" in value &&
    typeof (value as Record<string, unknown>).method === "string" &&
    "jsonrpc" in value &&
    (value as Record<string, unknown>).jsonrpc === "2.0"
  );
}

function jsonRpcResult(id: string | number | null | undefined, result: unknown) {
  return Response.json({ jsonrpc: "2.0", id: id ?? null, result });
}

function jsonRpcError(id: string | number | null | undefined, code: number, message: string) {
  return Response.json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });
}
