export const sourceTypes = ["official_site", "community_pr", "maintainer", "legacy"] as const;
export const airlineStatuses = ["listed", "verified", "broken", "unknown"] as const;
export const linkStatuses = ["active", "reported_broken", "unknown"] as const;
export const logoStatuses = ["missing", "candidate", "verified", "removed"] as const;

export type SourceType = (typeof sourceTypes)[number];
export type AirlineStatus = (typeof airlineStatuses)[number];
export type LinkStatus = (typeof linkStatuses)[number];
export type LogoStatus = (typeof logoStatuses)[number];

export function getLinkStatus(status: AirlineStatus): LinkStatus {
  if (status === "broken") return "reported_broken";
  if (status === "unknown") return "unknown";
  return "active";
}

export interface PublicAirline {
  name: string;
  slug: string;
  aliases: string[];
  iata?: string;
  icao?: string;
  country?: string;
  region?: string;
  claimUrl: string;
  officialWebsiteUrl?: string;
  logoUrl?: string;
  linkStatus: LinkStatus;
  notes?: string;
}

export function toPublicAirline(record: AirlineRecord): PublicAirline {
  return {
    name: record.name,
    slug: record.slug,
    aliases: record.aliases,
    iata: record.iata,
    icao: record.icao,
    country: record.country,
    region: record.region,
    claimUrl: record.claimUrl,
    officialWebsiteUrl: record.officialWebsiteUrl,
    logoUrl: record.logoUrl,
    linkStatus: getLinkStatus(record.status),
    notes: record.notes,
  };
}

export interface AirlineRecord {
  name: string;
  slug: string;
  aliases: string[];
  iata?: string;
  icao?: string;
  country?: string;
  region?: string;
  claimUrl: string;
  officialSourceUrl?: string;
  officialWebsiteUrl?: string;
  logoUrl?: string;
  logoSourceUrl?: string;
  logoStatus?: LogoStatus;
  logoNotes?: string;
  sourceType?: SourceType;
  status: AirlineStatus;
  listedAt: string;
  verifiedAt?: string;
  verifiedBy?: "maintainer" | "github_pr" | "automated_check";
  lastCheckedAt?: string;
  lastCheckStatus?: string;
  lastCommunityUpdateAt?: string;
  notes?: string;
}
