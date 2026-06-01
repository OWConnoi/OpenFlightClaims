import type { EligibilityInput, EligibilityResult } from "./types";

const sourceUrls = [
  "https://www.caa.co.uk/passengers-and-public/resolving-travel-problems/delays-and-cancellations/",
  "https://www.caa.co.uk/passengers-and-public/resolving-travel-problems/delays-and-cancellations/delays/",
  "https://www.caa.co.uk/passengers/resolving-travel-problems/delays-and-cancellations/cancellations/",
];

export function evaluateUk261(input: EligibilityInput): EligibilityResult {
  if (!isUkRouteCovered(input)) {
    return {
      outcome: "unlikely",
      title: "UK261 looks unlikely from the route information",
      explanation: "UK flight disruption rights generally depend on whether the journey departs the UK or arrives in the UK on a covered airline.",
      nextSteps: ["Check official CAA guidance for route coverage.", "If EU or US rules are more relevant, use that region instead."],
      sourceUrls,
    };
  }

  if (input.disruptionType === "baggage-other") {
    return {
      outcome: "unknown",
      title: "This may not be a UK261 compensation claim",
      explanation: "Baggage and miscellaneous complaints may use airline complaint routes or other rules rather than UK delay/cancellation compensation.",
      nextSteps: ["Use the airline claim link for baggage or complaints.", "Check CAA guidance for the exact problem."],
      sourceUrls,
    };
  }

  if (input.reason === "extraordinary" || input.reason === "safety") {
    return {
      outcome: "unlikely",
      title: "Fixed compensation looks unlikely",
      explanation: "UK CAA guidance explains that extraordinary circumstances can remove the right to fixed compensation, although care and rerouting/refund rights may still apply.",
      nextSteps: ["Keep evidence of the airline's stated reason.", "Check whether care, rerouting, or reimbursement still applies."],
      sourceUrls,
    };
  }

  if (input.disruptionType === "denied-boarding") {
    return {
      outcome: "likely",
      title: "UK denied-boarding rights may apply",
      explanation: "If you were involuntarily denied boarding despite meeting booking, check-in, and gate requirements, UK rights may apply.",
      nextSteps: ["Ask the airline for written rights information.", "Use the airline claim link and include substitute-flight details."],
      sourceUrls,
    };
  }

  if (input.delayBand === "3-4" || input.delayBand === "4-plus") {
    return {
      outcome: input.reason === "airline-control" ? "likely" : "possibly",
      title: "UK261 compensation may be possible",
      explanation: "A final-arrival delay of three hours or more can support a claim when the disruption is within the airline's responsibility.",
      nextSteps: ["Confirm final arrival delay, route coverage, and reason.", "Use the airline claim link and include evidence."],
      sourceUrls,
    };
  }

  if (input.disruptionType === "cancellation") {
    return {
      outcome: "possibly",
      title: "UK cancellation rights may apply",
      explanation: "Cancellation outcomes depend on notice period, replacement-flight timing, route coverage, and cause.",
      nextSteps: ["Keep cancellation and rebooking records.", "Check CAA guidance before escalating beyond the airline."],
      sourceUrls,
    };
  }

  return {
    outcome: "unknown",
    title: "More detail is needed",
    explanation: "UK261 outcomes depend on route, timing, disruption type, and the airline's reason.",
    nextSteps: ["Check official CAA guidance.", "Use the airline claim link if you have evidence for an assessment."],
    sourceUrls,
  };
}

function isUkRouteCovered(input: EligibilityInput) {
  return input.departureRegion === "uk" || input.arrivalRegion === "uk";
}
