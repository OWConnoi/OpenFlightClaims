import type { AirlineStatus, LinkStatus } from "@/types/airline";
import { getLinkStatus as deriveLinkStatus } from "@/types/airline";

export const statusLabels: Record<AirlineStatus, string> = {
  listed: "Listed",
  verified: "Verified",
  broken: "Broken",
  unknown: "Unknown",
};

export const statusDescriptions: Record<AirlineStatus, string> = {
  listed: "Included in the open directory.",
  verified: "Checked against an official airline source.",
  broken: "Reported as broken or outdated.",
  unknown: "Needs more information.",
};

export const linkStatusLabels: Record<LinkStatus, string> = {
  active: "Active",
  reported_broken: "Reported broken",
  unknown: "Unknown",
};

export const linkStatusDescriptions: Record<LinkStatus, string> = {
  active: "Available in the directory.",
  reported_broken: "Community or checker flagged it as broken or outdated.",
  unknown: "Unclear status or needs maintainer review.",
};

export function getLinkStatus(status: AirlineStatus): LinkStatus {
  return deriveLinkStatus(status);
}

export function isListedStatus(status: AirlineStatus) {
  return status === "listed";
}
