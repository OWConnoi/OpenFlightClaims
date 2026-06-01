export const regulationRegions = ["eu", "uk", "us", "other"] as const;
export const disruptionTypes = ["delay", "cancellation", "denied-boarding", "downgrade", "baggage-other"] as const;
export const travelRegions = ["eu", "uk", "us", "other"] as const;
export const delayBands = ["under-2", "2-3", "3-4", "4-plus", "unknown"] as const;
export const distanceBands = ["under-1500", "1500-3500", "over-3500", "unknown"] as const;
export const airlineReasons = ["airline-control", "extraordinary", "safety", "unknown"] as const;

export type RegulationRegion = (typeof regulationRegions)[number];
export type DisruptionType = (typeof disruptionTypes)[number];
export type TravelRegion = (typeof travelRegions)[number];
export type DelayBand = (typeof delayBands)[number];
export type DistanceBand = (typeof distanceBands)[number];
export type AirlineReason = (typeof airlineReasons)[number];
export type EligibilityOutcome = "likely" | "possibly" | "unlikely" | "unknown";

// New country-based input for Advanced mode
export interface CountryBasedEligibilityInput {
  departureCountry: string;
  arrivalCountry: string;
  airlineCountry?: string;
  disruptionType: DisruptionType;
  delayBand: DelayBand;
  reason: AirlineReason;
  airlineName?: string;
  airlineClaimUrl?: string;
}

export interface EligibilityInput {
  // Legacy Simple mode fields (still supported)
  regulationRegion?: RegulationRegion;
  departureRegion?: TravelRegion;
  arrivalRegion?: TravelRegion;

  // Common fields
  disruptionType: DisruptionType;
  delayBand: DelayBand;
  distanceBand?: DistanceBand;
  reason: AirlineReason;
  airlineName?: string;
  airlineClaimUrl?: string;

  // Advanced mode
  countryBased?: CountryBasedEligibilityInput;
}

export interface RegimeResult {
  jurisdictionId: string;
  jurisdictionName: string;
  lastReviewed: string;
  outcome: EligibilityOutcome;
  title: string;
  explanation: string;
  nextSteps: string[];
  sourceUrls: string[];
}

// Legacy result shape — used by Simple mode (required fields)
export interface EligibilityResult {
  outcome: EligibilityOutcome;
  title: string;
  explanation: string;
  nextSteps: string[];
  sourceUrls: string[];
}

// New advanced result shape for country-based / multi-regime output
export interface AdvancedEligibilityResult {
  applicableRegimes: RegimeResult[];
  oldestKnowledgeUpdate: string;
  primaryRecommendation?: RegimeResult;
  // Also includes a summary for the UI
  summaryTitle: string;
  summaryExplanation: string;
}
