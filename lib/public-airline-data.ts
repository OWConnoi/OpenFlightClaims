import type { AirlineRecord, PublicAirline } from "@/types/airline";
import { toPublicAirline } from "@/types/airline";

export interface PublicAirlineDataset {
  generatedAt: string;
  count: number;
  airlines: PublicAirline[];
}

export interface FullAirlineDataset {
  generatedAt: string;
  count: number;
  airlines: AirlineRecord[];
}

export function buildPublicAirlineDataset(
  airlines: AirlineRecord[],
  generatedAt = new Date().toISOString(),
): PublicAirlineDataset {
  return {
    generatedAt,
    count: airlines.length,
    airlines: airlines.map(toPublicAirline),
  };
}

export function buildFullAirlineDataset(
  airlines: AirlineRecord[],
  generatedAt = new Date().toISOString(),
): FullAirlineDataset {
  return {
    generatedAt,
    count: airlines.length,
    airlines,
  };
}
