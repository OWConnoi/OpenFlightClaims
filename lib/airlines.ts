import airlineData from "@/data/airlines.json";
import { getLinkStatus } from "@/lib/status";
import type { AirlineRecord } from "@/types/airline";

export function getAirlines() {
  return sortAirlines(airlineData as AirlineRecord[]);
}

export function getAirlineBySlug(slug: string) {
  return getAirlines().find((airline) => airline.slug === slug) ?? null;
}

export function sortAirlines(records: AirlineRecord[]) {
  return [...records].sort((first, second) => first.name.localeCompare(second.name) || first.slug.localeCompare(second.slug));
}

export function getVerifiedAirlines(records = getAirlines()) {
  return records.filter((airline) => airline.status === "verified");
}

export function getPopularVerifiedAirlines(records = getAirlines()) {
  const preferredSlugs = [
    "british-airways",
    "ryanair",
    "easyjet",
    "aer-lingus",
    "air-france",
    "klm-royal-dutch-airlines",
    "lufthansa",
    "american-airlines",
  ];

  const bySlug = new Map(records.map((airline) => [airline.slug, airline]));
  return preferredSlugs.flatMap((slug) => {
    const airline = bySlug.get(slug);
    return airline?.status === "verified" ? [airline] : [];
  });
}

export function getDatasetStats(records: AirlineRecord[]) {
  return {
    total: records.length,
    active: records.filter((airline) => getLinkStatus(airline.status) === "active").length,
  };
}
