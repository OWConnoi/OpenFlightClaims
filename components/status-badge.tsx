import type { Dictionary } from "@/lib/i18n";
import { getLinkStatus } from "@/lib/status";
import type { AirlineStatus, LinkStatus } from "@/types/airline";

interface StatusBadgeProps {
  status: AirlineStatus;
  dictionary: Dictionary["status"];
}

const linkStatusDictKey: Record<LinkStatus, keyof Pick<Dictionary["status"], "active" | "reportedBroken" | "unknownStatus">> = {
  active: "active",
  reported_broken: "reportedBroken",
  unknown: "unknownStatus",
};

const linkStatusDescKey: Record<LinkStatus, keyof Pick<Dictionary["status"], "activeDescription" | "reportedBrokenDescription" | "unknownDescription">> = {
  active: "activeDescription",
  reported_broken: "reportedBrokenDescription",
  unknown: "unknownDescription",
};

export function StatusBadge({ status, dictionary }: StatusBadgeProps) {
  const linkStatus = getLinkStatus(status);

  return (
    <span
      className={`status-badge link-status-${linkStatus}`}
      title={dictionary[linkStatusDescKey[linkStatus]]}
    >
      {dictionary[linkStatusDictKey[linkStatus]]}
    </span>
  );
}
