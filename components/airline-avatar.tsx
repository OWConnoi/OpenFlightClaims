import type { AirlineRecord } from "@/types/airline";

interface AirlineAvatarProps {
  airline: AirlineRecord;
}

export function AirlineAvatar({ airline }: AirlineAvatarProps) {
  if (airline.logoStatus === "verified" && airline.logoUrl) {
    return (
      <img
        alt={`${airline.name} logo`}
        className="airline-avatar airline-avatar--image"
        height="56"
        src={airline.logoUrl}
        width="56"
      />
    );
  }

  return (
    <span aria-hidden="true" className="airline-avatar">
      {getInitials(airline.name)}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.at(0)?.toUpperCase())
    .join("");
}
