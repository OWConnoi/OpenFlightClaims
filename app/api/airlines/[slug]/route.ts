import { getAirlineBySlug, getAirlines } from "@/lib/airlines";
import { prettyJson } from "@/lib/pretty-json";
import { toPublicAirline } from "@/types/airline";

interface AirlineApiRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAirlines().map((airline) => ({ slug: airline.slug }));
}

export async function GET(request: Request, { params }: AirlineApiRouteProps) {
  const { slug } = await params;
  const airline = getAirlineBySlug(slug);

  if (!airline) {
    return new Response(JSON.stringify({ error: "Airline not found." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const isFull = url.searchParams.get("full") === "1" || url.searchParams.get("full") === "true";
  const payloadAirline = isFull ? airline : toPublicAirline(airline);

  return prettyJson(
    {
      generatedAt: new Date().toISOString(),
      airline: payloadAirline,
    },
    request,
  );
}
