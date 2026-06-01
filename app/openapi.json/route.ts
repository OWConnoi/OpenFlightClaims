import { getAirlines } from "@/lib/airlines";
import { getSiteUrl } from "@/lib/site";
import { prettyJson } from "@/lib/pretty-json";

export const dynamic = "force-static";

export function GET(request: Request) {
  const airlines = getAirlines();
  const slugs = airlines.map((airline) => airline.slug);

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "OpenFlightClaims API",
      description: "Open community directory of official airline claim, refund, complaint, and passenger-rights links. No auth required. All endpoints are read-only and publicly accessible.",
      version: "2.0.0",
      contact: {
        name: "OpenFlightClaims",
        url: getSiteUrl("/"),
      },
      license: {
        name: "AGPL-3.0-or-later",
        url: "https://github.com/OWConnoi/OpenFlightClaims/blob/main/LICENSE-CODE.md",
      },
    },
    servers: [
      {
        url: getSiteUrl("/"),
        description: "Production",
      },
    ],
    paths: {
      "/api/airlines": {
        get: {
          summary: "List all airlines",
          description: "Returns all airline records (public projection by default). Use ?pretty=1 for formatted JSON, ?full=1 for the complete internal records including verification metadata.",
          operationId: "listAirlines",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AirlinesResponse" },
                },
              },
            },
          },
        },
      },
      "/api/airlines/{slug}": {
        get: {
          summary: "Get airline by slug",
          description: "Returns a single airline record (public projection by default). Use ?pretty=1 for formatted JSON, ?full=1 for the complete internal record.",
          operationId: "getAirlineBySlug",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
              examples: slugs.slice(0, 3),
            },
          ],
          responses: {
            "200": {
              description: "Airline record found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AirlineResponse" },
                },
              },
            },
            "404": {
              description: "Airline not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/meta": {
        get: {
          summary: "Project metadata",
          description: "Returns project info, dataset stats, and available endpoints.",
          operationId: "getMeta",
          responses: {
            "200": {
              description: "Project metadata",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MetaResponse" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Airline: {
          type: "object",
          required: ["name", "slug", "aliases", "claimUrl", "linkStatus"],
          description: "Public projection returned by default from the JSON API. Use ?full=1 on list or detail endpoints to receive the complete internal AirlineRecord (includes verification provenance fields).",
          properties: {
            name: { type: "string", description: "Airline name" },
            slug: { type: "string", description: "URL-safe identifier" },
            aliases: { type: "array", items: { type: "string" }, description: "Alternative names and codes" },
            iata: { type: "string", nullable: true, description: "2-char IATA code" },
            icao: { type: "string", nullable: true, description: "3-char ICAO code" },
            country: { type: "string", nullable: true, description: "Primary country" },
            region: { type: "string", nullable: true, description: "Broad region" },
            claimUrl: { type: "string", format: "uri", description: "Official airline claim link" },
            officialWebsiteUrl: { type: "string", format: "uri", nullable: true },
            logoUrl: { type: "string", format: "uri", nullable: true },
            linkStatus: { type: "string", enum: ["active", "reported_broken", "unknown"], description: "Public link status derived from internal verification state" },
            notes: { type: "string", nullable: true },
          },
        },
        AirlinesResponse: {
          type: "object",
          properties: {
            generatedAt: { type: "string", format: "date-time" },
            count: { type: "integer" },
            airlines: { type: "array", items: { $ref: "#/components/schemas/Airline" } },
          },
        },
        AirlineResponse: {
          type: "object",
          properties: {
            generatedAt: { type: "string", format: "date-time" },
            airline: { $ref: "#/components/schemas/Airline" },
          },
        },
        MetaResponse: {
          type: "object",
          properties: {
            project: { type: "string" },
            description: { type: "string" },
            repoUrl: { type: "string", format: "uri" },
            siteUrl: { type: "string", format: "uri" },
            supportedLocales: { type: "array", items: { type: "string" } },
            dataset: {
              type: "object",
              properties: {
                count: { type: "integer" },
                active: { type: "integer" },
              },
            },
            generatedAt: { type: "string", format: "date-time" },
            endpoints: { type: "object" },
            disclaimer: { type: "string" },
            contribution: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  };

  return prettyJson(spec, request);
}
