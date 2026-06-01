import { getBrokenLinkIssueUrl, getUpdateIssueUrl } from "@/lib/github-issue-links";
import type { Dictionary } from "@/lib/i18n";
import { getAirlinePath } from "@/lib/site";
import { getLinkStatus } from "@/lib/status";
import type { AirlineRecord } from "@/types/airline";
import type { LocaleCode } from "@/i18n/locales";
import { AirlineAvatar } from "./airline-avatar";
import { StatusBadge } from "./status-badge";

interface AirlineCardProps {
  airline: AirlineRecord;
  dictionary: Dictionary;
  exactCodeMatch?: boolean;
  localeCode: LocaleCode;
}

export function AirlineCard({ airline, dictionary, exactCodeMatch, localeCode }: AirlineCardProps) {
  return (
    <article className={`airline-card link-status-${getLinkStatus(airline.status)}`}>
      <div className="card-topline">
        <div className="card-title-group">
          <AirlineAvatar airline={airline} />
          <div>
            <h2>
              {airline.name}
                {exactCodeMatch ? (
                <span className="exact-match-badge">
                  Exact match
                </span>
              ) : null}
            </h2>
            <p className="muted code-line">{[airline.iata, airline.icao, airline.country].filter(Boolean).join(" · ")}</p>
          </div>
        </div>
        <StatusBadge dictionary={dictionary.status} status={airline.status} />
      </div>

      {airline.region ? <p className="muted">{airline.region}</p> : null}

      <div className="card-actions" aria-label={`Actions for ${airline.name}`}>
        <a className="claim-button" href={airline.claimUrl} rel="noopener noreferrer" target="_blank">
          {dictionary.actions.openClaim}
        </a>
        <a className="secondary-link" href={getAirlinePath(localeCode, airline.slug)}>
          {dictionary.actions.viewDetails}
        </a>
        <a className="secondary-link" href={getBrokenLinkIssueUrl(airline)} rel="noopener noreferrer" target="_blank">
          {dictionary.actions.reportBroken}
        </a>
        <a className="secondary-link" href={getUpdateIssueUrl(airline)} rel="noopener noreferrer" target="_blank">
          {dictionary.actions.suggestUpdate}
        </a>
      </div>
    </article>
  );
}
