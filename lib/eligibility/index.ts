import { evaluateEu261 } from "./eu261";
import { evaluateUk261 } from "./uk261";
import { evaluateUs } from "./us";
import { evaluateCountryBased } from "./advanced";
import type { AdvancedEligibilityResult, EligibilityInput, EligibilityResult } from "./types";

export function evaluateEligibility(input: EligibilityInput): EligibilityResult | AdvancedEligibilityResult {
  // Advanced / Country-based mode
  if (input.countryBased) {
    return evaluateCountryBased(input.countryBased);
  }

  // Legacy Simple mode
  const region = input.regulationRegion;

  switch (region) {
    case "eu":
      return evaluateEu261(input);
    case "uk":
      return evaluateUk261(input);
    case "us":
      return evaluateUs(input);
    case "other":
      return {
        outcome: "unknown",
        title: "Check the airline and local regulator",
        explanation:
          "OpenFlightClaims does not have enough route information to assess this jurisdiction. Airline and regulator rules vary.",
        nextSteps: [
          "Use the airline's official claim or complaint page.",
          "Check the government or aviation regulator for the departure and arrival countries.",
          "Avoid claims-management sites unless you deliberately choose one after checking fees.",
        ],
        sourceUrls: ["https://www.transportation.gov/airconsumer/file-consumer-complaint"],
      };
    default:
      return {
        outcome: "unknown",
        title: "More information needed",
        explanation: "Please select a regulation region (Simple mode) or switch to Advanced mode.",
        nextSteps: ["Select a region above or try Advanced mode for country-specific guidance."],
        sourceUrls: [],
      };
  }
}

export type { EligibilityInput, EligibilityResult, AdvancedEligibilityResult } from "./types";
