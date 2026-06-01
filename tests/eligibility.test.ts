/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { evaluateEligibility } from "../lib/eligibility";
import type { EligibilityInput } from "../lib/eligibility/types";

const baseInput: EligibilityInput = {
  regulationRegion: "eu",
  disruptionType: "delay",
  departureRegion: "eu",
  arrivalRegion: "eu",
  delayBand: "3-4",
  distanceBand: "1500-3500",
  reason: "airline-control",
};

describe("evaluateEligibility", () => {
  it("returns a likely EU261 outcome for covered airline-controlled long delays", () => {
    const result = evaluateEligibility(baseInput) as any;

    expect(result.outcome).toBe("likely");
    expect(result.sourceUrls.some((url: string) => url.includes("europa.eu"))).toBe(true);
  });

  it("treats uncovered EU routes as unlikely", () => {
    const result = evaluateEligibility({
      ...baseInput,
      departureRegion: "us",
      arrivalRegion: "other",
    }) as any;

    expect(result.outcome).toBe("unlikely");
  });

  it("returns a likely UK denied-boarding outcome for covered UK routes", () => {
    const result = evaluateEligibility({
      ...baseInput,
      regulationRegion: "uk",
      disruptionType: "denied-boarding",
      departureRegion: "uk",
      arrivalRegion: "eu",
    }) as any;

    expect(result.outcome).toBe("likely");
    expect(result.sourceUrls.some((url: string) => url.includes("caa.co.uk"))).toBe(true);
  });

  it("keeps US delay guidance conservative", () => {
    const result = evaluateEligibility({
      ...baseInput,
      regulationRegion: "us",
      departureRegion: "us",
      arrivalRegion: "us",
      reason: "unknown",
    }) as any;

    expect(result.outcome).toBe("unknown");
    expect(result.sourceUrls.some((url: string) => url.includes("transportation.gov"))).toBe(true);
  });
});
