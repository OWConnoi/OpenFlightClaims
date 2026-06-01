import { readJsonFile, writeJsonFile, DATA_DIR, REPORTS_DIR, AIRLINES_FILE, hasDisallowedVerifiedDomain, slugify, getHostname } from "./lib/airline-records";
import type { AirlineRecord } from "../types/airline";
import path from "node:path";

const CANDIDATES_FILE = path.join(DATA_DIR, "airlines.candidates.json");
const DISCOVERY_REPORT_FILE = path.join(REPORTS_DIR, "airline-discovery-report.json");
const SEEDS_FILE = path.join(DATA_DIR, "airline-discovery-seeds.json");

interface SeedEntry {
  name: string;
  iata?: string;
  icao?: string;
  country?: string;
  website?: string;
}

interface CandidateEntry {
  name: string;
  slug: string;
  iata?: string;
  icao?: string;
  country?: string;
  region?: string;
  proposedClaimUrl: string;
  sourceUrl: string;
  confidence: "high" | "medium" | "low";
  signals: string[];
  warnings: string[];
  duplicate: boolean;
  duplicateSlug?: string;
}

interface DiscoveryReport {
  generatedAt: string;
  summary: {
    totalCandidates: number;
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
    duplicates: number;
    warnings: number;
  };
  candidates: CandidateEntry[];
}

async function main() {
  const existingRecords = await readJsonFile<AirlineRecord[]>(AIRLINES_FILE, []);
  const seeds = await readJsonFile<SeedEntry[]>(SEEDS_FILE, []);
  const existingSlugs = new Set(existingRecords.map((r) => r.slug));
  const existingIata = new Set(existingRecords.map((r) => r.iata?.toLowerCase()).filter(Boolean));
  const existingIcao = new Set(existingRecords.map((r) => r.icao?.toLowerCase()).filter(Boolean));
  const existingNames = new Set(
    existingRecords.map((r) => r.name.toLowerCase().trim()),
  );

  const candidates: CandidateEntry[] = [];

  for (const seed of seeds) {
    if (!seed.name || !seed.website) continue;

    const nameLower = seed.name.toLowerCase().trim();

    if (existingNames.has(nameLower) ||
        (seed.iata && existingIata.has(seed.iata.toLowerCase())) ||
        (seed.icao && existingIcao.has(seed.icao.toLowerCase()))) {
      const slug = slugify(seed.name);
      candidates.push({
        name: seed.name,
        slug,
        iata: seed.iata,
        icao: seed.icao,
        country: seed.country,
        proposedClaimUrl: `${seed.website.replace(/\/+$/, "")}/help/contact`,
        sourceUrl: seed.website,
        confidence: "low",
        signals: ["seed_match"],
        warnings: ["Already exists in dataset."],
        duplicate: true,
        duplicateSlug: existingSlugs.has(slug) ? slug : undefined,
      });
      continue;
    }

    const claimUrl = findClaimPage(seed);
    const warnings = getSeedWarnings(seed);
    const confidence = getConfidence(claimUrl, seed, warnings);

    const slug = slugify(seed.name);
    candidates.push({
      name: seed.name,
      slug,
      iata: seed.iata,
      icao: seed.icao,
      country: seed.country,
      proposedClaimUrl: claimUrl,
      sourceUrl: seed.website,
      confidence,
      signals: confidence === "high" ? ["seed_website", "pattern_match"] : ["seed_website"],
      warnings,
      duplicate: false,
    });
  }

  candidates.sort((a, b) => {
    const confOrder = { high: 0, medium: 1, low: 2 };
    return confOrder[a.confidence] - confOrder[b.confidence] || a.name.localeCompare(b.name);
  });

  const report: DiscoveryReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCandidates: candidates.length,
      highConfidence: candidates.filter((c) => c.confidence === "high").length,
      mediumConfidence: candidates.filter((c) => c.confidence === "medium").length,
      lowConfidence: candidates.filter((c) => c.confidence === "low").length,
      duplicates: candidates.filter((c) => c.duplicate).length,
      warnings: candidates.filter((c) => c.warnings.length > 0).length,
    },
    candidates,
  };

  await writeJsonFile(CANDIDATES_FILE, candidates.filter((c) => !c.duplicate || c.confidence !== "low"));
  await writeJsonFile(DISCOVERY_REPORT_FILE, report);

  console.log(`Discovery scan complete.`);
  console.log(`Found ${report.summary.totalCandidates} candidates:`);
  console.log(`  High confidence: ${report.summary.highConfidence}`);
  console.log(`  Medium confidence: ${report.summary.mediumConfidence}`);
  console.log(`  Low confidence: ${report.summary.lowConfidence}`);
  console.log(`  Duplicates: ${report.summary.duplicates}`);
  console.log(`Wrote candidates to ${CANDIDATES_FILE}`);
  console.log(`Wrote report to ${DISCOVERY_REPORT_FILE}`);
}

function findClaimPage(seed: SeedEntry): string {
  const base = (seed.website ?? "").replace(/\/+$/, "");

  const claimPaths = [
    "/help/contact",
    "/contact",
    "/customer-service",
    "/support",
    "/refund",
    "/claims",
    "/compensation",
    "/passenger-rights",
    "/complaint",
    "/feedback",
  ];

  return `${base}${claimPaths[0]}`;
}

function getConfidence(_claimUrl: string, _seed: SeedEntry, warnings: string[]): "high" | "medium" | "low" {
  if (warnings.length === 0) return "high";
  if (warnings.length <= 1) return "medium";
  return "low";
}

function getSeedWarnings(seed: SeedEntry): string[] {
  const warnings: string[] = [];

  try {
    const host = getHostname(seed.website ?? "");
    if (hasDisallowedVerifiedDomain(`https://${host}`)) {
      warnings.push(`Website domain ${host} matches a known intermediary/affiliate pattern.`);
    }
  } catch {
    warnings.push("Invalid website URL.");
  }

  if (!seed.iata && !seed.icao) {
    warnings.push("No IATA or ICAO code provided.");
  }

  return warnings;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
