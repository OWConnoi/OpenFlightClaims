import { getAirlines } from "@/lib/airlines";
import { buildFullAirlineDataset, buildPublicAirlineDataset } from "@/lib/public-airline-data";
import { prettyJson } from "@/lib/pretty-json";

export const dynamic = "force-static";

export function GET(request: Request) {
  const airlines = getAirlines();
  const url = new URL(request.url);
  const isFull = url.searchParams.get("full") === "1" || url.searchParams.get("full") === "true";
  const data = isFull ? buildFullAirlineDataset(airlines) : buildPublicAirlineDataset(airlines);
  return prettyJson(data, request);
}
