export function prettyJson(data: unknown, request: Request): Response {
  const url = new URL(request.url);
  const pretty = url.searchParams.get("pretty") === "1" || url.searchParams.get("pretty") === "true";

  const body = JSON.stringify(data, null, pretty ? 2 : 0);

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
