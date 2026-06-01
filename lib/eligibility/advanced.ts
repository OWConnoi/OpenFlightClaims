import type { AdvancedEligibilityResult, CountryBasedEligibilityInput } from "./types";
import { getApplicableJurisdictions, getOldestLastReviewed } from "@/lib/passenger-rights";

export function evaluateCountryBased(input: CountryBasedEligibilityInput): AdvancedEligibilityResult {
  const applicable = getApplicableJurisdictions({
    departureCountry: input.departureCountry,
    arrivalCountry: input.arrivalCountry,
    airlineCountry: input.airlineCountry,
  });

  if (applicable.length === 0) {
    return {
      applicableRegimes: [],
      oldestKnowledgeUpdate: "N/A",
      summaryTitle: "No structured guidance available yet",
      summaryExplanation:
        "We don't have detailed rules for this combination of countries yet. Many destinations have their own passenger rights regulations.",
    };
  }

  const oldestDate = getOldestLastReviewed(applicable);

  // For now, provide a high-level multi-regime result.
  // In later steps we will map to specific rule evaluators.
  const regimes = applicable.map((j) => {
    // Basic outcome logic — can be expanded with real rules per jurisdiction
    let outcome: "likely" | "possibly" | "unlikely" | "unknown" = "possibly";
    let title = `${j.name} may apply`;
    let explanation = `${j.description}. In many jurisdictions, rules are primarily triggered by the country of departure.`;

    if (j.id === "eu261" || j.id === "uk261") {
      explanation = `${j.description}. Strong protections often apply for delays of 3+ hours, cancellations, and denied boarding when departing from covered countries.`;
    }
    if (j.id === "us-dot") {
      outcome = "unknown";
      title = "US DOT rules — refunds & commitments";
      explanation = "The US focuses more on refunds for significant disruptions and airline customer service plans rather than fixed compensation.";
    }
    if (j.id === "oman") {
      explanation = `${j.description}. Omani regulations provide passenger protections; check the latest CAA guidance for your specific situation.`;
    }

    return {
      jurisdictionId: j.id,
      jurisdictionName: j.name,
      lastReviewed: j.lastReviewed,
      outcome,
      title,
      explanation,
      nextSteps: [
        "Review the official sources linked below.",
        "Gather flight documents, boarding pass, and evidence of the disruption.",
      ],
      sourceUrls: j.sources.map((s) => s.url),
    };
  });

  return {
    applicableRegimes: regimes,
    oldestKnowledgeUpdate: oldestDate,
    primaryRecommendation: regimes[0],
    summaryTitle: `${applicable.length} jurisdiction(s) may apply`,
    summaryExplanation: `Based on your departure and arrival countries, the following passenger rights regimes could be relevant. The oldest knowledge in this result was last reviewed on ${oldestDate}.`,
  };
}

