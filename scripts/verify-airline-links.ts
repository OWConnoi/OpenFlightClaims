import type { AirlineRecord, AirlineStatus } from "../types/airline";
import {
  AIRLINES_FILE,
  VERIFICATION_REPORT_FILE,
  getHostname,
  getRegistrableDomain,
  hasDisallowedVerifiedDomain,
  readJsonFile,
  sortAirlineRecords,
  writeJsonFile,
} from "./lib/airline-records";

const MAX_REDIRECTS = 6;
const REQUEST_TIMEOUT_MS = 10_000;
const CONCURRENCY = 8;
const WRITE_STATUSES = process.argv.includes("--write");

interface LinkCheckResult {
  finalUrl: string;
  httpStatus: number | null;
  reachable: boolean;
  broken: boolean;
  blocked: boolean;
  redirectChain: string[];
  error?: string;
}

interface ReportEntry extends LinkCheckResult {
  slug: string;
  name: string;
  claimUrl: string;
  statusBefore: AirlineStatus;
  suspicious: boolean;
  suspiciousReasons: string[];
  canConfirmOfficial: boolean;
  recommendedStatus: AirlineStatus;
}

async function main() {
  const checkedAt = new Date().toISOString();
  const records = await readJsonFile<AirlineRecord[]>(AIRLINES_FILE, []);
  const results = await mapWithConcurrency(records, CONCURRENCY, async (record) => {
    const check = await checkLink(record.claimUrl);
    const suspiciousReasons = getSuspiciousReasons(record, check.finalUrl);
    const suspicious = suspiciousReasons.length > 0;
    const canConfirmOfficial =
      check.reachable && !check.broken && !suspicious && Boolean(record.officialSourceUrl) && domainsLookRelated(record, check.finalUrl);
    const recommendedStatus = getRecommendedStatus(check, canConfirmOfficial);
    const entry: ReportEntry = {
      slug: record.slug,
      name: record.name,
      claimUrl: record.claimUrl,
      statusBefore: record.status,
      suspicious,
      suspiciousReasons,
      canConfirmOfficial,
      recommendedStatus,
      ...check,
    };

    return {
      updatedRecord: applyStatusRecommendation(record, recommendedStatus, canConfirmOfficial, checkedAt),
      entry,
    };
  });

  const entries = results.map((result) => result.entry);
  const updatedRecords = results.map((result) => result.updatedRecord);
  const summary = {
    checkedAt,
    total: entries.length,
    reachable: entries.filter((entry) => entry.reachable).length,
    broken: entries.filter((entry) => entry.broken).length,
    blocked: entries.filter((entry) => entry.blocked).length,
    suspicious: entries.filter((entry) => entry.suspicious).length,
    canConfirmOfficial: entries.filter((entry) => entry.canConfirmOfficial).length,
  };

  await writeJsonFile(VERIFICATION_REPORT_FILE, {
    summary,
    entries,
  });

  if (WRITE_STATUSES) {
    await writeJsonFile(AIRLINES_FILE, sortAirlineRecords(updatedRecords));
  }

  console.log(`Wrote link verification report to ${VERIFICATION_REPORT_FILE}.`);
  console.log(
    `Checked ${summary.total} links: ${summary.reachable} reachable, ${summary.broken} broken, ${summary.blocked} blocked, ${summary.suspicious} suspicious.`,
  );
}

async function mapWithConcurrency<T, U>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<U>,
): Promise<U[]> {
  const results = new Array<U>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      const item = items[currentIndex];

      if (item === undefined) {
        continue;
      }

      results[currentIndex] = await mapper(item, currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function checkLink(url: string): Promise<LinkCheckResult> {
  const redirectChain: string[] = [url];
  let currentUrl = url;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await requestUrl(currentUrl, "HEAD");
    const usableResponse = response.httpStatus === 405 || response.httpStatus === 403 ? await requestUrl(currentUrl, "GET") : response;

    if (usableResponse.error) {
      return {
        finalUrl: currentUrl,
        httpStatus: usableResponse.httpStatus,
        reachable: false,
        broken: false,
        blocked: false,
        redirectChain,
        error: usableResponse.error,
      };
    }

    const status = usableResponse.httpStatus;

    if (status && status >= 300 && status < 400 && usableResponse.location) {
      const nextUrl = new URL(usableResponse.location, currentUrl).toString();

      if (redirectChain.includes(nextUrl)) {
        return {
          finalUrl: nextUrl,
          httpStatus: status,
          reachable: false,
          broken: true,
          blocked: false,
          redirectChain: [...redirectChain, nextUrl],
          error: "Redirect loop detected.",
        };
      }

      currentUrl = nextUrl;
      redirectChain.push(nextUrl);
      continue;
    }

    const blocked = status === 401 || status === 403 || status === 429;
    const broken = status === 404 || (status !== null && status >= 500);

    return {
      finalUrl: currentUrl,
      httpStatus: status,
      reachable: Boolean(status && status >= 200 && status < 400),
      broken,
      blocked,
      redirectChain,
    };
  }

  return {
    finalUrl: currentUrl,
    httpStatus: null,
    reachable: false,
    broken: true,
    blocked: false,
    redirectChain,
    error: "Too many redirects.",
  };
}

async function requestUrl(url: string, method: "HEAD" | "GET") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method,
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "user-agent": "OpenFlightClaims link verifier (+https://github.com/OWConnoi/OpenFlightClaims)",
        accept: "text/html,application/xhtml+xml,application/json",
      },
    });

    return {
      httpStatus: response.status,
      location: response.headers.get("location"),
    };
  } catch (error) {
    return {
      httpStatus: null,
      location: null,
      error: error instanceof Error ? error.message : "Unknown request error.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function getSuspiciousReasons(record: AirlineRecord, finalUrl: string) {
  const reasons: string[] = [];
  const claimHost = getHostname(finalUrl);

  if (hasDisallowedVerifiedDomain(finalUrl)) {
    reasons.push(`Claim URL host (${claimHost}) looks like a third-party or intermediary domain.`);
  }

  if (!record.officialSourceUrl) {
    reasons.push("No officialSourceUrl is present for domain comparison.");
    return reasons;
  }

  if (!domainsLookRelated(record, finalUrl)) {
    const claimDomain = getRegistrableDomain(finalUrl);
    const officialDomain = getRegistrableDomain(record.officialSourceUrl);
    reasons.push(`Claim URL domain (${claimDomain}) does not match official source domain (${officialDomain}).`);
  }

  return reasons;
}

function domainsLookRelated(record: AirlineRecord, finalUrl: string) {
  if (!record.officialSourceUrl) {
    return false;
  }

  return getRegistrableDomain(finalUrl) === getRegistrableDomain(record.officialSourceUrl);
}

function getRecommendedStatus(check: LinkCheckResult, canConfirmOfficial: boolean): AirlineStatus {
  if (check.broken) {
    return "broken";
  }

  if (canConfirmOfficial) {
    return "verified";
  }

  return "listed";
}

function applyStatusRecommendation(
  record: AirlineRecord,
  recommendedStatus: AirlineStatus,
  canConfirmOfficial: boolean,
  checkedAt: string,
): AirlineRecord {
  if (!WRITE_STATUSES) {
    return record;
  }

  const base = {
    ...record,
    lastCheckedAt: checkedAt,
    lastCheckStatus: recommendedStatus,
  };

  if (recommendedStatus === "broken") {
    return {
      ...base,
      status: "broken",
    };
  }

  if (canConfirmOfficial) {
    return {
      ...base,
      status: "verified",
      verifiedAt: checkedAt,
      verifiedBy: "automated_check",
    };
  }

  if (record.status === "verified") {
    return {
      ...base,
      status: "listed",
    };
  }

  return base;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
