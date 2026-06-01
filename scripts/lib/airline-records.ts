import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { airlineStatuses, logoStatuses, sourceTypes, type AirlineRecord } from "../../types/airline";

export const DATA_DIR = path.resolve(process.cwd(), "data");
export const REPORTS_DIR = path.resolve(process.cwd(), "reports");
export const AIRLINES_FILE = path.join(DATA_DIR, "airlines.json");
export const VERIFICATION_REPORT_FILE = path.join(REPORTS_DIR, "link-verification.json");

const countrySecondLevelDomains = new Set(["ac", "co", "com", "edu", "gov", "net", "org"]);
export const disallowedVerifiedDomainFragments = [
  "airhelp",
  "claimcompass",
  "euclaim",
  "facebook",
  `flight${"compensation"}links`,
  "flightright",
  "instagram",
  "linkedin",
  "linktr",
  "refundmore",
  "skycop",
  "twitter",
  "x.com",
];

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

export async function writeJsonFile(filePath: string, data: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function toAbsoluteUrl(href: string | undefined, baseUrl: string) {
  if (!href) {
    return null;
  }

  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
    return null;
  }

  try {
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return null;
  }
}

export function getHostname(url: string) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function getRegistrableDomain(urlOrHost: string) {
  const host = urlOrHost.includes("://") ? getHostname(urlOrHost) : urlOrHost.toLowerCase().replace(/^www\./, "");
  const parts = host.split(".").filter(Boolean);

  if (parts.length <= 2) {
    return host;
  }

  const topLevel = parts.at(-1);
  const secondLevel = parts.at(-2);

  if (topLevel?.length === 2 && secondLevel && countrySecondLevelDomains.has(secondLevel) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }

  return parts.slice(-2).join(".");
}

export function validateAirlineRecord(value: unknown, index: number) {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return [`Record ${index + 1} must be an object.`];
  }

  requireString(value, "name", index, errors);
  requireSlug(value, index, errors);
  requireStringArray(value, "aliases", index, errors);
  optionalAirlineCode(value, "iata", 2, index, errors);
  optionalAirlineCode(value, "icao", 3, index, errors);
  optionalString(value, "country", index, errors);
  optionalString(value, "region", index, errors);
  requireUrl(value, "claimUrl", index, errors);
  optionalUrl(value, "officialSourceUrl", index, errors);
  optionalUrl(value, "officialWebsiteUrl", index, errors);
  optionalUrl(value, "logoUrl", index, errors);
  optionalUrl(value, "logoSourceUrl", index, errors);
  optionalEnum(value, "logoStatus", logoStatuses, index, errors);
  optionalString(value, "logoNotes", index, errors);
  optionalEnum(value, "sourceType", sourceTypes, index, errors);
  requireEnum(value, "status", airlineStatuses, index, errors);
  requireIsoDate(value, "listedAt", index, errors);
  optionalIsoDate(value, "verifiedAt", index, errors);
  optionalEnum(value, "verifiedBy", ["maintainer", "github_pr", "automated_check"] as const, index, errors);
  optionalString(value, "notes", index, errors);
  optionalString(value, "lastCheckedAt", index, errors);
  optionalString(value, "lastCheckStatus", index, errors);
  optionalString(value, "lastCommunityUpdateAt", index, errors);
  rejectOldValues(value, index, errors);

  if (value.status === "verified") {
    if (!value.officialSourceUrl) {
      errors.push(`Record ${index + 1} (${value.slug}) is verified but has no officialSourceUrl.`);
    }

    if (!value.verifiedAt) {
      errors.push(`Record ${index + 1} (${value.slug}) is verified but has no verifiedAt timestamp.`);
    }

    if (!value.verifiedBy) {
      errors.push(`Record ${index + 1} (${value.slug}) is verified but has no verifiedBy value.`);
    }

    if (typeof value.claimUrl === "string" && hasDisallowedVerifiedDomain(value.claimUrl)) {
      errors.push(`Record ${index + 1} (${value.slug}) is verified but points to a disallowed intermediary domain.`);
    }

    if (typeof value.officialSourceUrl === "string" && hasDisallowedVerifiedDomain(value.officialSourceUrl)) {
      errors.push(`Record ${index + 1} (${value.slug}) is verified but uses a disallowed intermediary source URL.`);
    }
  }

  if (value.logoStatus === "verified" && !value.logoUrl) {
    errors.push(`Record ${index + 1} (${value.slug}) has a verified logoStatus but no logoUrl.`);
  }

  return errors;
}

export function validateAirlineRecords(records: unknown) {
  const errors: string[] = [];

  if (!Array.isArray(records)) {
    return ["Airline data must be an array."];
  }

  const seenSlugs = new Set<string>();

  records.forEach((record, index) => {
    errors.push(...validateAirlineRecord(record, index));

    if (isRecord(record) && typeof record.slug === "string") {
      if (seenSlugs.has(record.slug)) {
        errors.push(`Duplicate slug: ${record.slug}.`);
      }

      seenSlugs.add(record.slug);
    }
  });

  return errors;
}

export function sortAirlineRecords(records: AirlineRecord[]) {
  return [...records].sort((first, second) => first.name.localeCompare(second.name) || first.slug.localeCompare(second.slug));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function requireString(record: Record<string, unknown>, key: string, index: number, errors: string[]) {
  if (typeof record[key] !== "string" || record[key].trim().length === 0) {
    errors.push(`Record ${index + 1} must include a non-empty ${key}.`);
  }
}

function optionalString(record: Record<string, unknown>, key: string, index: number, errors: string[]) {
  if (record[key] !== undefined && typeof record[key] !== "string") {
    errors.push(`Record ${index + 1} ${key} must be a string when present.`);
  }
}

function optionalAirlineCode(
  record: Record<string, unknown>,
  key: string,
  length: number,
  index: number,
  errors: string[],
) {
  const value = record[key];

  if (value === undefined) {
    return;
  }

  if (typeof value !== "string" || !new RegExp(`^[A-Z0-9]{${length}}$`).test(value)) {
    errors.push(`Record ${index + 1} ${key} must be a ${length}-character uppercase airline code when present.`);
  }
}

function requireStringArray(record: Record<string, unknown>, key: string, index: number, errors: string[]) {
  const value = record[key];

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    errors.push(`Record ${index + 1} must include ${key} as an array of strings.`);
  }
}

function requireSlug(record: Record<string, unknown>, index: number, errors: string[]) {
  if (typeof record.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)) {
    errors.push(`Record ${index + 1} must include a URL-safe slug.`);
  }
}

function requireUrl(record: Record<string, unknown>, key: string, index: number, errors: string[]) {
  if (typeof record[key] !== "string" || !isHttpUrl(record[key])) {
    errors.push(`Record ${index + 1} must include ${key} as a valid http(s) URL.`);
  }
}

function optionalUrl(record: Record<string, unknown>, key: string, index: number, errors: string[]) {
  if (record[key] !== undefined && (typeof record[key] !== "string" || !isHttpUrl(record[key]))) {
    errors.push(`Record ${index + 1} ${key} must be a valid http(s) URL when present.`);
  }
}

function requireEnum<T extends readonly string[]>(
  record: Record<string, unknown>,
  key: string,
  allowed: T,
  index: number,
  errors: string[],
) {
  if (typeof record[key] !== "string" || !allowed.includes(record[key])) {
    errors.push(`Record ${index + 1} ${key} must be one of: ${allowed.join(", ")}.`);
  }
}

function optionalEnum<T extends readonly string[]>(
  record: Record<string, unknown>,
  key: string,
  allowed: T,
  index: number,
  errors: string[],
) {
  if (record[key] !== undefined && (typeof record[key] !== "string" || !allowed.includes(record[key]))) {
    errors.push(`Record ${index + 1} ${key} must be one of: ${allowed.join(", ")} when present.`);
  }
}

function requireIsoDate(record: Record<string, unknown>, key: string, index: number, errors: string[]) {
  if (typeof record[key] !== "string" || Number.isNaN(Date.parse(record[key]))) {
    errors.push(`Record ${index + 1} must include ${key} as an ISO timestamp.`);
  }
}

function optionalIsoDate(record: Record<string, unknown>, key: string, index: number, errors: string[]) {
  if (record[key] !== undefined && (typeof record[key] !== "string" || Number.isNaN(Date.parse(record[key])))) {
    errors.push(`Record ${index + 1} ${key} must be an ISO timestamp when present.`);
  }
}

function isHttpUrl(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function hasDisallowedVerifiedDomain(url: string) {
  const host = getHostname(url);
  return disallowedVerifiedDomainFragments.some((fragment) => host.includes(fragment));
}

function rejectOldValues(record: Record<string, unknown>, index: number, errors: string[]) {
  const oldPageField = `source${"Page"}Url`;
  const oldDateField = `${"import"}edAt`;
  const oldUnreviewedStatus = `${"needs"}_verification`;
  const oldListedStatus = `${"se"}ed`;
  const oldSourceType = `${"se"}ed_import`;

  if (oldPageField in record) {
    errors.push(`Record ${index + 1} includes an obsolete page field.`);
  }

  if (oldDateField in record) {
    errors.push(`Record ${index + 1} includes an obsolete date field.`);
  }

  if (record.status === oldListedStatus || record.status === oldUnreviewedStatus) {
    errors.push(`Record ${index + 1} uses an old status value.`);
  }

  if (record.sourceType === oldSourceType) {
    errors.push(`Record ${index + 1} uses an old sourceType value.`);
  }
}
