export type JurisdictionId =
  | "eu261"
  | "uk261"
  | "us-dot"
  | "oman"
  | "canada"
  | "australia"
  | "uae"
  | "singapore"
  | "japan"
  | "india"
  | "brazil"
  | "turkey"
  | "south-korea"
  | "china"
  | "qatar"
  | "other";

export interface Jurisdiction {
  id: JurisdictionId;
  name: string;
  lastReviewed: string; // YYYY-MM-DD
  description: string;
  countries: string[]; // ISO or common names this jurisdiction primarily covers
  sources: Array<{
    label: string;
    url: string;
  }>;
}

export interface ApplicableRegime {
  jurisdiction: Jurisdiction;
  outcome: "likely" | "possibly" | "unlikely" | "unknown";
  summary: string;
  nextSteps: string[];
}
