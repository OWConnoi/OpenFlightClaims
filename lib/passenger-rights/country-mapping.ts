import type { Jurisdiction } from "./types";
import { jurisdictions } from "./registry";

export interface CountryBasedInput {
  departureCountry: string;
  arrivalCountry: string;
  airlineCountry?: string;
}

export function getApplicableJurisdictions(input: CountryBasedInput): Jurisdiction[] {
  const normalizedDeparture = input.departureCountry.toLowerCase().trim();
  const normalizedArrival = input.arrivalCountry.toLowerCase().trim();

  const matches: Jurisdiction[] = [];

  for (const j of jurisdictions) {
    const coversDeparture = j.countries.some((c) => c.toLowerCase() === normalizedDeparture);
    const coversArrival = j.countries.some((c) => c.toLowerCase() === normalizedArrival);

    // A jurisdiction applies if it covers the departure country (primary trigger per many rules)
    // or in some cases the arrival country.
    if (coversDeparture || coversArrival) {
      matches.push(j);
    }
  }

  // Always include "other" as a fallback if nothing matched
  if (matches.length === 0) {
    // We can later add a generic "other" jurisdiction
  }

  return matches;
}

export function getOldestLastReviewed(jurisdictions: Jurisdiction[]): string {
  if (jurisdictions.length === 0) return "Unknown";

  return jurisdictions
    .map((j) => j.lastReviewed)
    .sort()
    .at(0)!;
}
