"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { evaluateEligibility } from "@/lib/eligibility";
import { getPassengerRightsKnowledgeUpdateUrl } from "@/lib/github-issue-links";
import type { Dictionary } from "@/lib/i18n";
import type { AirlineRecord } from "@/types/airline";
import type { AdvancedEligibilityResult, AirlineReason, DelayBand, DisruptionType, DistanceBand, EligibilityResult, RegulationRegion, TravelRegion } from "@/lib/eligibility/types";

function isAdvancedResult(r: EligibilityResult | AdvancedEligibilityResult): r is AdvancedEligibilityResult {
  return 'applicableRegimes' in r;
}

interface EligibilityHelperProps {
  airlines: AirlineRecord[];
  dictionary: Dictionary;
}

export function EligibilityHelper({ airlines, dictionary }: EligibilityHelperProps) {
  const [mode, setMode] = useState<"simple" | "advanced">("simple");

  // Simple mode state
  const [regulationRegion, setRegulationRegion] = useState<RegulationRegion>("eu");
  const [disruptionType, setDisruptionType] = useState<DisruptionType>("delay");
  const [airlineSlug, setAirlineSlug] = useState("");
  const [departureRegion, setDepartureRegion] = useState<TravelRegion>("eu");
  const [arrivalRegion, setArrivalRegion] = useState<TravelRegion>("eu");
  const [delayBand, setDelayBand] = useState<DelayBand>("3-4");
  const [reason, setReason] = useState<AirlineReason>("unknown");
  const [distanceBand, setDistanceBand] = useState<DistanceBand>("unknown");

  // Advanced mode state (country-based)
  const [departureCountry, setDepartureCountry] = useState("Germany");
  const [arrivalCountry, setArrivalCountry] = useState("Oman");

  const airline = airlines.find((item) => item.slug === airlineSlug);

  const result = useMemo(() => {
    if (mode === "advanced") {
      return evaluateEligibility({
        disruptionType,
        delayBand,
        reason,
        airlineName: airline?.name,
        airlineClaimUrl: airline?.claimUrl,
        countryBased: {
          departureCountry,
          arrivalCountry,
          disruptionType,
          delayBand,
          reason,
          airlineName: airline?.name,
          airlineClaimUrl: airline?.claimUrl,
        },
      });
    }

    // Simple mode
    return evaluateEligibility({
      regulationRegion,
      disruptionType,
      departureRegion,
      arrivalRegion,
      delayBand,
      distanceBand,
      reason,
      airlineName: airline?.name,
      airlineClaimUrl: airline?.claimUrl,
    });
  }, [
    mode, disruptionType, delayBand, reason, airline,
    departureCountry, arrivalCountry,
    regulationRegion, departureRegion, arrivalRegion, distanceBand
  ]);

  return (
    <div className="tool-layout">
      <form className="tool-form">
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9em' }}>Mode</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setMode('simple')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: mode === 'simple' ? '2px solid var(--accent)' : '1px solid var(--line)',
                background: mode === 'simple' ? 'var(--panel-soft)' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.85em'
              }}
            >
              Simple (Regions)
            </button>
            <button
              type="button"
              onClick={() => setMode('advanced')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: mode === 'advanced' ? '2px solid var(--accent)' : '1px solid var(--line)',
                background: mode === 'advanced' ? 'var(--panel-soft)' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.85em',
                fontWeight: mode === 'advanced' ? 600 : 400
              }}
            >
              Advanced (Countries)
            </button>
          </div>
        </div>

        {mode === "simple" ? (
          <>
            <SelectField label={dictionary.tools.region} onChange={setRegulationRegion} value={regulationRegion}>
              <option value="eu">EU</option>
              <option value="uk">UK</option>
              <option value="us">US / DOT</option>
              <option value="other">{dictionary.tools.other}</option>
            </SelectField>

            <SelectField label={dictionary.tools.disruptionType} onChange={setDisruptionType} value={disruptionType}>
              <option value="delay">{dictionary.tools.delay}</option>
              <option value="cancellation">{dictionary.tools.cancellation}</option>
              <option value="denied-boarding">{dictionary.tools.deniedBoarding}</option>
              <option value="downgrade">{dictionary.tools.downgrade}</option>
              <option value="baggage-other">{dictionary.tools.baggageOther}</option>
            </SelectField>

            <SelectField label={dictionary.tools.airline} onChange={setAirlineSlug} value={airlineSlug}>
              <option value="">{dictionary.tools.selectAirline}</option>
              {airlines.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </SelectField>

            <SelectField label={dictionary.tools.departureRegion} onChange={setDepartureRegion} value={departureRegion}>
              <option value="eu">EU / EEA / Switzerland</option>
              <option value="uk">UK</option>
              <option value="us">US</option>
              <option value="other">{dictionary.tools.other}</option>
            </SelectField>

            <SelectField label={dictionary.tools.arrivalRegion} onChange={setArrivalRegion} value={arrivalRegion}>
              <option value="eu">EU / EEA / Switzerland</option>
              <option value="uk">UK</option>
              <option value="us">US</option>
              <option value="other">{dictionary.tools.other}</option>
            </SelectField>

            <SelectField label={dictionary.tools.delayLength} onChange={setDelayBand} value={delayBand}>
              <option value="under-2">{dictionary.tools.underTwoHours}</option>
              <option value="2-3">{dictionary.tools.twoToThreeHours}</option>
              <option value="3-4">{dictionary.tools.threeToFourHours}</option>
              <option value="4-plus">{dictionary.tools.fourPlusHours}</option>
              <option value="unknown">{dictionary.tools.unknown}</option>
            </SelectField>

            <SelectField label={dictionary.tools.distanceBand} onChange={setDistanceBand} value={distanceBand}>
              <option value="under-1500">{dictionary.tools.under1500}</option>
              <option value="1500-3500">{dictionary.tools.between1500And3500}</option>
              <option value="over-3500">{dictionary.tools.over3500}</option>
              <option value="unknown">{dictionary.tools.unknown}</option>
            </SelectField>

            <SelectField label={dictionary.tools.reason} onChange={setReason} value={reason}>
              <option value="airline-control">{dictionary.tools.airlineControl}</option>
              <option value="extraordinary">{dictionary.tools.extraordinary}</option>
              <option value="safety">{dictionary.tools.safety}</option>
              <option value="unknown">{dictionary.tools.unknown}</option>
            </SelectField>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Departure Country</label>
              <input
                className="search-input field-input"
                value={departureCountry}
                onChange={(e) => setDepartureCountry(e.target.value)}
                placeholder="e.g. Germany, Oman, United Kingdom"
              />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Arrival Country</label>
              <input
                className="search-input field-input"
                value={arrivalCountry}
                onChange={(e) => setArrivalCountry(e.target.value)}
                placeholder="e.g. Oman, United States, Canada"
              />
            </div>
            <div style={{ fontSize: '0.8em', opacity: 0.7, marginBottom: '8px' }}>
              Tip: Try “Germany → Oman” or “United Kingdom → United States” to see multiple regimes.
            </div>
          </>
        )}
      </form>

      {isAdvancedResult(result) ? (
        <section className="tool-result tool-result--possibly" aria-live="polite">
          <p className="eyebrow">Advanced — Multi-Jurisdiction</p>
          <h2>{result.summaryTitle}</h2>
          <p>{result.summaryExplanation}</p>
          <p style={{ fontSize: '0.85em', opacity: 0.75, marginBottom: '12px' }}>
            Oldest knowledge in this result: <strong>{result.oldestKnowledgeUpdate}</strong>
          </p>

           {result.applicableRegimes.map((regime) => (
            <div key={regime.jurisdictionId} className="detail-card" style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>{regime.jurisdictionName}</div>
              <p style={{ margin: '4px 0 var(--space-sm)' }}>{regime.explanation}</p>
              <ul className="clean-list" style={{ fontSize: '0.9em' }}>
                {regime.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
              <div className="card-actions" style={{ marginTop: 'var(--space-sm)' }}>
                {regime.sourceUrls.slice(0, 2).map((url, i) => (
                  <a key={i} className="secondary-link" href={url} target="_blank" rel="noopener noreferrer">
                    Official source
                  </a>
                ))}
                <a
                  className="secondary-link"
                  href={getPassengerRightsKnowledgeUpdateUrl(regime.jurisdictionName, regime.lastReviewed)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Request update for this section
                </a>
              </div>
            </div>
          ))}

          <div className="card-actions">
            {airline && (
              <a className="claim-button" href={airline.claimUrl} target="_blank" rel="noopener noreferrer">
                {dictionary.actions.openClaim}
              </a>
            )}
            <a
              className="secondary-link"
              href={getPassengerRightsKnowledgeUpdateUrl("General / Multiple jurisdictions")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request general knowledge update
            </a>
          </div>
        </section>
      ) : (
        <section className={`tool-result tool-result--${result.outcome}`} aria-live="polite">
          <p className="eyebrow">{dictionary.tools[result.outcome]}</p>
          <h2>{result.title}</h2>
          <p>{result.explanation}</p>
          <ul className="clean-list">
            {result.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
          </ul>
          <div className="card-actions">
            {airline && (
              <a className="claim-button" href={airline.claimUrl} target="_blank" rel="noopener noreferrer">
                {dictionary.actions.openClaim}
              </a>
            )}
            {result.sourceUrls.map((url, i) => (
              <a key={i} className="secondary-link" href={url} target="_blank" rel="noopener noreferrer">
                {dictionary.guides.officialSources}
              </a>
            ))}
            <a
              className="secondary-link"
              href={getPassengerRightsKnowledgeUpdateUrl(result.title)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request update for this guidance
            </a>
          </div>
        </section>
      )}
     </div>
   );
 }

function SelectField<T extends string>({
  children,
  label,
  onChange,
  value,
}: {
  children: ReactNode;
  label: string;
  onChange: (value: T) => void;
  value: T;
}) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <select className="footer-select" onChange={(event) => onChange(event.currentTarget.value as T)} value={value}>
        {children}
      </select>
    </label>
  );
}
