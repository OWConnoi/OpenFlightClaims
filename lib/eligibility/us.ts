import type { EligibilityInput, EligibilityResult } from "./types";

const sourceUrls = [
  "https://www.transportation.gov/airconsumer/airline-cancellation-delay-dashboard",
  "https://www.transportation.gov/individuals/aviation-consumer-protection/refunds",
  "https://www.transportation.gov/individuals/aviation-consumer-protection/bumping-oversales",
  "https://www.transportation.gov/airconsumer/file-consumer-complaint",
];

export function evaluateUs(input: EligibilityInput): EligibilityResult {
  if (input.disruptionType === "denied-boarding") {
    return {
      outcome: "possibly",
      title: "US denied-boarding compensation may apply",
      explanation: "DOT rules may require compensation for involuntary bumping due to oversales when specific conditions are met.",
      nextSteps: ["Keep your boarding pass and written airline notice.", "Ask whether the airline treated the event as oversales bumping."],
      sourceUrls,
    };
  }

  if (input.disruptionType === "cancellation" || input.disruptionType === "delay") {
    if (input.reason === "airline-control") {
      return {
        outcome: "possibly",
        title: "Refunds or airline commitments may apply",
        explanation: "US DOT guidance focuses on refunds for significant changes/cancellations and on airline commitments for controllable disruptions.",
        nextSteps: ["Check whether you accepted travel or are seeking a refund.", "Review the DOT dashboard and the airline customer service plan."],
        sourceUrls,
      };
    }

    return {
      outcome: "unknown",
      title: "US rights depend on refund choice and airline commitments",
      explanation: "US passengers usually need to check refund eligibility, DOT dashboards, and the airline's own commitments rather than a fixed compensation table.",
      nextSteps: ["Check the airline's policy for your disruption.", "Use the airline claim link, then file a DOT complaint if needed."],
      sourceUrls,
    };
  }

  return {
    outcome: "unknown",
    title: "Use the airline complaint or refund process",
    explanation: "For this issue type, the most practical first step is the airline's official complaint, refund, or customer service channel.",
    nextSteps: ["Open the airline claim link.", "Keep written records and receipts.", "Use DOT complaint routes if the airline does not resolve the issue."],
    sourceUrls,
  };
}
