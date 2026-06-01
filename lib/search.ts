import { fuzzySearchAirlines } from "@/lib/fuzzy-search";
import type { AirlineRecord } from "@/types/airline";

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

/**
 * @deprecated Use fuzzySearchAirlines directly for new code.
 * Kept for backwards compatibility.
 */
export function matchesAirlineSearch(airline: AirlineRecord, query: string) {
  const searchableText = [
    airline.name,
    airline.iata,
    airline.icao,
    airline.country,
    airline.region,
    airline.status,
    ...airline.aliases,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}

export function searchAirlines(airlines: AirlineRecord[], query: string) {
  return fuzzySearchAirlines(airlines, query);
}
