import type { AirlineRecord } from "../types/airline";
import {
  AIRLINES_FILE,
  getRegistrableDomain,
  hasDisallowedVerifiedDomain,
  readJsonFile,
  sortAirlineRecords,
  writeJsonFile,
} from "./lib/airline-records";

const dryRun = process.argv.includes("--dry-run");
const verifiedBy: NonNullable<AirlineRecord["verifiedBy"]> = process.argv.includes("--by=maintainer") ? "maintainer" : "github_pr";

async function main() {
  const records = await readJsonFile<AirlineRecord[]>(AIRLINES_FILE, []);
  const verifiedAt = new Date().toISOString();
  let stamped = 0;
  let skipped = 0;

  const updated: AirlineRecord[] = records.map((record) => {
    if (!isEligible(record)) {
      skipped += 1;
      return record;
    }

    stamped += 1;
    return {
      ...record,
      status: "verified" as const,
      verifiedAt,
      verifiedBy,
    };
  });

  if (!dryRun) {
    await writeJsonFile(AIRLINES_FILE, sortAirlineRecords(updated));
  }

  console.log(`${dryRun ? "Would stamp" : "Stamped"} ${stamped} eligible records as verified.`);
  console.log(`Skipped ${skipped} records.`);
}

function isEligible(record: AirlineRecord) {
  if (!record.officialSourceUrl) {
    return false;
  }

  if (record.status === "broken" || record.status === "unknown") {
    return false;
  }

  if (hasDisallowedVerifiedDomain(record.claimUrl) || hasDisallowedVerifiedDomain(record.officialSourceUrl)) {
    return false;
  }

  return getRegistrableDomain(record.claimUrl) === getRegistrableDomain(record.officialSourceUrl);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
