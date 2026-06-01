import type { AirlineRecord } from "@/types/airline";

/**
 * Lightweight dependency-free fuzzy string matcher.
 * Scores based on character sequence proximity. Higher = better match.
 * Returns 0 if no match.
 */
export function fuzzyScore(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (t === q) return 10000; // exact match

  let score = 0;
  let tIdx = 0;
  let qIdx = 0;
  let consecutive = 0;
  let firstMatchIndex = -1;

  while (tIdx < t.length && qIdx < q.length) {
    if (t[tIdx] === q[qIdx]) {
      if (firstMatchIndex === -1) firstMatchIndex = tIdx;
      score += 1 + consecutive * 2; // reward consecutive matches heavily
      consecutive++;
      qIdx++;
    } else {
      consecutive = 0;
    }
    tIdx++;
  }

  if (qIdx !== q.length) return 0; // not all query chars matched

  // Penalize late first match
  if (firstMatchIndex > 0) {
    score -= firstMatchIndex * 0.5;
  }

  // Penalize long text relative to query (precision boost)
  score -= (t.length - q.length) * 0.3;

  return Math.max(1, score);
}

/**
 * Score an airline record against a query.
 * Checks name, aliases, iata, icao, country, region.
 * Exact IATA/ICAO matches get massive bonuses.
 */
export function scoreAirlineMatch(airline: AirlineRecord, query: string): number {
  const q = query.trim();
  if (!q) return 0;
  const qLower = q.toLowerCase();

  let best = 0;

  // Exact IATA/ICAO matches rank highest
  if (airline.iata && airline.iata.toLowerCase() === qLower) {
    return 50000;
  }
  if (airline.icao && airline.icao.toLowerCase() === qLower) {
    return 40000;
  }

  // Prefix matches on name/aliases are strong
  const fields = [
    airline.name,
    ...airline.aliases,
    airline.country,
    airline.region,
    airline.iata,
    airline.icao,
  ].filter(Boolean) as string[];

  for (const field of fields) {
    const score = fuzzyScore(field, q);
    if (score > best) best = score;
  }

  return best;
}

/**
 * Search airlines with fuzzy matching, sorted by relevance.
 */
export function fuzzySearchAirlines(airlines: AirlineRecord[], query: string): AirlineRecord[] {
  const q = query.trim();
  if (!q) return [];

  const scored = airlines
    .map((airline) => ({ airline, score: scoreAirlineMatch(airline, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map(({ airline }) => airline);
}
