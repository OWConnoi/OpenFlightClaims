import type { EligibilityInput, EligibilityResult } from "./types";

const sourceUrls = [
  "https://europa.eu/youreurope/citizens/travel/passenger-rights/air/index_en.htm",
  "https://transport.ec.europa.eu/transport-themes/passenger-rights/air_en",
];

export function evaluateEu261(input: EligibilityInput): EligibilityResult {
  if (!isEuRouteCovered(input)) {
    return {
      outcome: "unlikely",
      title: "EU261 looks unlikely from the route information",
      explanation: "EU air passenger rules generally depend on the departure region, arrival region, and operating carrier.",
      nextSteps: ["Check the official EU passenger-rights page for route coverage.", "If another jurisdiction applies, check that region instead."],
      sourceUrls,
    };
  }

  if (input.disruptionType === "baggage-other") {
    return {
      outcome: "unknown",
      title: "This may not be an EU261 disruption claim",
      explanation: "Baggage and miscellaneous issues can have different rules from EU delay, cancellation, and denied-boarding rights.",
      nextSteps: ["Use the airline claim link for baggage or customer care.", "Check official EU and airline guidance for the specific issue."],
      sourceUrls,
    };
  }

  if (input.reason === "extraordinary" || input.reason === "safety") {
    return {
      outcome: "unlikely",
      title: "Compensation looks unlikely, but care rights may still matter",
      explanation: "Airlines may not owe fixed compensation for extraordinary circumstances or certain safety-related disruption.",
      nextSteps: ["Keep evidence of the reason the airline gave.", "Check whether reimbursement, rerouting, or care still applies."],
      sourceUrls,
    };
  }

  if (input.disruptionType === "denied-boarding") {
    return {
      outcome: "likely",
      title: "EU261 may apply to involuntary denied boarding",
      explanation: "If you had a confirmed booking, met check-in requirements, and did not volunteer, EU denied-boarding rights may apply.",
      nextSteps: ["Ask the airline for written rights information.", "Use the airline claim link and include replacement-flight details."],
      sourceUrls,
    };
  }

  if (input.disruptionType === "downgrade") {
    return {
      outcome: "possibly",
      title: "A downgrade refund may be possible",
      explanation: "EU guidance includes passenger rights for downgrade situations, but the amount depends on route and fare details.",
      nextSteps: ["Keep seat and fare evidence.", "Ask the airline for a downgrade refund assessment."],
      sourceUrls,
    };
  }

  if (input.delayBand === "3-4" || input.delayBand === "4-plus") {
    return {
      outcome: input.reason === "airline-control" ? "likely" : "possibly",
      title: "EU261 compensation may be possible",
      explanation: "A final-arrival delay of three hours or more can support a compensation claim when the reason is within the airline's responsibility.",
      nextSteps: ["Confirm final arrival delay and route coverage.", "Use the airline claim link and include disruption evidence."],
      sourceUrls,
    };
  }

  if (input.disruptionType === "cancellation") {
    return {
      outcome: "possibly",
      title: "EU261 cancellation rights may apply",
      explanation: "Cancellation rights depend on notice period, replacement-flight timing, route coverage, and the reason for disruption.",
      nextSteps: ["Keep cancellation notice and replacement-flight details.", "Use the airline claim link if the cancellation was short notice."],
      sourceUrls,
    };
  }

  return {
    outcome: "unknown",
    title: "More detail is needed",
    explanation: "EU261 outcomes depend on route, timing, disruption type, and the airline's reason.",
    nextSteps: ["Check official EU guidance.", "Use the airline claim link if you have enough evidence to ask for an assessment."],
    sourceUrls,
  };
}

function isEuRouteCovered(input: EligibilityInput) {
  return input.departureRegion === "eu" || input.arrivalRegion === "eu";
}
