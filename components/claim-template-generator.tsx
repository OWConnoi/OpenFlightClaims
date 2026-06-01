"use client";

import { useMemo, useState } from "react";
import { getPassengerRightsKnowledgeUpdateUrl } from "@/lib/github-issue-links";
import type { Dictionary } from "@/lib/i18n";
import type { AirlineRecord } from "@/types/airline";

interface ClaimTemplateGeneratorProps {
  airlines: AirlineRecord[];
  dictionary: Dictionary;
}

export function ClaimTemplateGenerator({ airlines, dictionary }: ClaimTemplateGeneratorProps) {
  const [passengerName, setPassengerName] = useState("");
  const [airlineSlug, setAirlineSlug] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [route, setRoute] = useState("");
  const [scheduledArrival, setScheduledArrival] = useState("");
  const [actualArrival, setActualArrival] = useState("");
  const [disruptionType, setDisruptionType] = useState("delay");
  const [delayLength, setDelayLength] = useState("");
  const [description, setDescription] = useState("");
  const [requestedOutcome, setRequestedOutcome] = useState("");
  const [attachments, setAttachments] = useState("Booking confirmation, boarding pass, disruption messages, receipts");
  const [copyStatus, setCopyStatus] = useState("");

  const airline = airlines.find((item) => item.slug === airlineSlug);
  const claimText = useMemo(
    () =>
      [
        `Subject: Claim request for ${airline?.name ?? "[airline]"} flight ${flightNumber || "[flight number]"}`,
        "",
        `Dear ${airline?.name ?? "Airline"} customer care team,`,
        "",
        `I am writing about ${disruptionType.replace("-", " ")} affecting flight ${flightNumber || "[flight number]"} on ${travelDate || "[date of travel]"} for route ${route || "[route]"}.`,
        passengerName ? `Passenger name: ${passengerName}.` : "Passenger name: [optional passenger name].",
        bookingReference ? `Booking reference: ${bookingReference}.` : "Booking reference: [optional booking reference].",
        `Scheduled arrival: ${scheduledArrival || "[scheduled arrival]"}.`,
        `Actual arrival: ${actualArrival || "[actual arrival]"}.`,
        `Delay length / disruption length: ${delayLength || "[delay length]"}.`,
        "",
        `Short description: ${description || "[briefly describe what happened and any reason given by the airline]"}.`,
        "",
        `Requested outcome: ${requestedOutcome || "[state whether you are requesting compensation, reimbursement, refund, rerouting costs, or a written explanation]"}.`,
        "",
        `Attachments available: ${attachments || "[list evidence and receipts]"}.`,
        "",
        "Please assess this request under the passenger-rights rules and airline policies that apply to this journey. This message is not legal advice and does not assume eligibility; it asks for your official assessment.",
        "",
        "Kind regards,",
        passengerName || "[your name]",
      ].join("\n"),
    [
      actualArrival,
      airline,
      attachments,
      bookingReference,
      delayLength,
      description,
      disruptionType,
      flightNumber,
      passengerName,
      requestedOutcome,
      route,
      scheduledArrival,
      travelDate,
    ],
  );

  async function copyClaimText() {
    await navigator.clipboard.writeText(claimText);
    setCopyStatus(dictionary.tools.copied);
  }

  function clearForm() {
    setPassengerName("");
    setAirlineSlug("");
    setFlightNumber("");
    setBookingReference("");
    setTravelDate("");
    setRoute("");
    setScheduledArrival("");
    setActualArrival("");
    setDisruptionType("delay");
    setDelayLength("");
    setDescription("");
    setRequestedOutcome("");
    setAttachments("Booking confirmation, boarding pass, disruption messages, receipts");
    setCopyStatus("");
  }

  return (
    <div className="tool-layout">
      <form className="tool-form">
        <TextField label={dictionary.tools.passengerName} onChange={setPassengerName} value={passengerName} />
        <label className="field-label">
          <span>{dictionary.tools.airline}</span>
          <select className="footer-select" onChange={(event) => setAirlineSlug(event.currentTarget.value)} value={airlineSlug}>
            <option value="">{dictionary.tools.selectAirline}</option>
            {airlines.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <TextField label={dictionary.tools.flightNumber} onChange={setFlightNumber} value={flightNumber} />
        <TextField label={dictionary.tools.bookingReference} onChange={setBookingReference} value={bookingReference} />
        <TextField label={dictionary.tools.travelDate} onChange={setTravelDate} type="date" value={travelDate} />
        <TextField label={dictionary.tools.route} onChange={setRoute} value={route} />
        <TextField label={dictionary.tools.scheduledArrival} onChange={setScheduledArrival} value={scheduledArrival} />
        <TextField label={dictionary.tools.actualArrival} onChange={setActualArrival} value={actualArrival} />
        <label className="field-label">
          <span>{dictionary.tools.disruptionType}</span>
          <select className="footer-select" onChange={(event) => setDisruptionType(event.currentTarget.value)} value={disruptionType}>
            <option value="delay">{dictionary.tools.delay}</option>
            <option value="cancellation">{dictionary.tools.cancellation}</option>
            <option value="denied-boarding">{dictionary.tools.deniedBoarding}</option>
            <option value="downgrade">{dictionary.tools.downgrade}</option>
            <option value="baggage-other">{dictionary.tools.baggageOther}</option>
          </select>
        </label>
        <TextField label={dictionary.tools.delayLength} onChange={setDelayLength} value={delayLength} />
        <TextField label={dictionary.tools.requestedOutcome} onChange={setRequestedOutcome} value={requestedOutcome} />
        <label className="field-label field-label--wide">
          <span>{dictionary.tools.shortDescription}</span>
          <textarea className="text-area" onChange={(event) => setDescription(event.currentTarget.value)} value={description} />
        </label>
        <label className="field-label field-label--wide">
          <span>{dictionary.tools.attachments}</span>
          <textarea className="text-area" onChange={(event) => setAttachments(event.currentTarget.value)} value={attachments} />
        </label>
      </form>

      <section className="tool-result">
        <h2>{dictionary.tools.generatedMessage}</h2>
        <pre className="claim-output">{claimText}</pre>
        <div className="card-actions">
          <button className="claim-button button-reset" onClick={copyClaimText} type="button">
            {dictionary.tools.copy}
          </button>
          <button className="secondary-button" onClick={clearForm} type="button">
            {dictionary.tools.clear}
          </button>
          {airline ? (
            <a className="secondary-link" href={airline.claimUrl} rel="noopener noreferrer" target="_blank">
              {dictionary.actions.openClaim}
            </a>
          ) : null}
        </div>
        {copyStatus ? <p className="result-meta">{copyStatus}</p> : null}

        <div style={{ marginTop: '16px', fontSize: '0.85em', opacity: 0.8 }}>
          For eligibility assessment and the latest rules, use the <a href="/en/tools/eligibility-helper" className="secondary-link">Eligibility Helper</a>.
          <br />
          Rules change — <a
            href={getPassengerRightsKnowledgeUpdateUrl("Claim Template / General")}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-link"
          >
            Request knowledge update
          </a>.
        </div>
      </section>
    </div>
  );
}

function TextField({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <input className="search-input field-input" onChange={(event) => onChange(event.currentTarget.value)} type={type} value={value} />
    </label>
  );
}
