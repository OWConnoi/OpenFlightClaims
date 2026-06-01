import type { AirlineRecord } from "@/types/airline";
import { repoUrl } from "@/lib/site";

const GITHUB_NEW_ISSUE_URL = `${repoUrl}/issues/new`;

interface GitHubIssueUrlOptions {
  template: string;
  title: string;
  body: string;
  fields?: Record<string, string>;
}

export function buildGitHubIssueUrl(options: GitHubIssueUrlOptions) {
  // GitHub issue forms do not reliably hydrate arbitrary YAML field ids from query params.
  // Keep the individual fields for clients that support them, and always include a readable markdown body fallback.
  const params = new URLSearchParams({
    template: options.template,
    title: options.title,
    body: options.body,
    ...options.fields,
  });

  return `${GITHUB_NEW_ISSUE_URL}?${params.toString()}`;
}

export function getUpdateIssueUrl(airline: AirlineRecord) {
  return buildGitHubIssueUrl({
    template: "update-airline-link.yml",
    title: `Update airline link: ${airline.name}`,
    body: buildUpdateIssueBody(airline),
    fields: {
      airline_name: airline.name,
      current_url: airline.claimUrl,
      proposed_official_url: "Paste the airline-owned replacement URL here",
      proof_source_url: "Paste an official airline source URL here",
      notes: buildMetadataNotes(airline),
    },
  });
}

export function getBrokenLinkIssueUrl(airline: AirlineRecord) {
  return buildGitHubIssueUrl({
    template: "report-broken-link.yml",
    title: `Report broken airline link: ${airline.name}`,
    body: buildBrokenIssueBody(airline),
    fields: {
      airline_name: airline.name,
      current_url: airline.claimUrl,
      proposed_official_url: "Paste the airline-owned replacement URL here, or write N/A",
      proof_source_url: "Paste an official airline source URL here",
      notes: buildMetadataNotes(airline),
    },
  });
}

export function getAddAirlineIssueUrl() {
  return buildGitHubIssueUrl({
    template: "add-airline-link.yml",
    title: "Add airline link: ",
    body: [
      "## Add missing airline",
      "",
      "### Airline",
      "Paste the airline name here.",
      "",
      "### Proposed official URL",
      "Paste the airline-owned claim, refund, complaint, passenger rights, or disruption support URL here.",
      "",
      "### Proof/source URL from airline website",
      "Paste an official airline page proving the proposed URL belongs to the airline.",
      "",
      "### Notes",
      "Add country, aliases, route/region limitations, or other maintainer context here.",
    ].join("\n"),
    fields: {
      airline_name: "",
      current_url: "N/A",
      proposed_official_url: "",
      proof_source_url: "",
      notes: "Please include country, aliases, caveats, or maintainer context. No affiliate or claims-management links.",
    },
  });
}

export function getGenericBrokenLinkIssueUrl() {
  return buildGitHubIssueUrl({
    template: "report-broken-link.yml",
    title: "Report broken airline link: ",
    body: [
      "## Broken airline link report",
      "",
      "### Airline",
      "Paste the airline name here.",
      "",
      "### Current OpenFlightClaims data",
      "- Current claim URL: Paste the current URL here.",
      "- Current status: Unknown",
      "- Official source URL: Not provided",
      "- Listed at: Unknown",
      "- Verified at: Not verified",
      "- Verified by: Not verified",
      "",
      "### What is wrong?",
      "Replace this line with what happened, for example: 404, redirects to homepage, wrong airline, not a claim page, blocked region, or outdated page.",
      "",
      "### Proposed official replacement URL",
      "Paste the airline-owned replacement URL here, or write N/A.",
      "",
      "### Proof/source URL from airline website",
      "Paste an official airline page proving the replacement URL belongs to the airline.",
      "",
      "### Notes",
      "Add region, browser, route, or other context here.",
    ].join("\n"),
    fields: {
      airline_name: "",
      current_url: "",
      proposed_official_url: "",
      proof_source_url: "",
      notes: "Please include what broke and any official replacement source.",
    },
  });
}

function buildUpdateIssueBody(airline: AirlineRecord) {
  return [
    "## Airline link update",
    "",
    "### Airline",
    airline.name,
    "",
    "### Current OpenFlightClaims data",
    ...buildMetadataLines(airline),
    "",
    "### Proposed official replacement URL",
    "Paste the airline-owned replacement URL here.",
    "",
    "### Proof/source URL from airline website",
    "Paste an official airline page proving the replacement URL belongs to the airline.",
    "",
    "### Notes",
    "Add what changed, region details, browser behavior, or other context here.",
  ].join("\n");
}

function buildBrokenIssueBody(airline: AirlineRecord) {
  return [
    "## Broken airline link report",
    "",
    "### Airline",
    airline.name,
    "",
    "### Current OpenFlightClaims data",
    ...buildMetadataLines(airline),
    "",
    "### What is wrong?",
    "Replace this line with what happened, for example: 404, redirects to homepage, wrong airline, not a claim page, blocked region, or outdated page.",
    "",
    "### Proposed official replacement URL",
    "Paste the airline-owned replacement URL here, or write N/A.",
    "",
    "### Proof/source URL from airline website",
    "Paste an official airline page proving the replacement URL belongs to the airline.",
    "",
    "### Notes",
    "Add region, browser, route, or other context here.",
  ].join("\n");
}

function buildMetadataNotes(airline: AirlineRecord) {
  return [
    `Airline: ${airline.name}`,
    `Slug: ${airline.slug}`,
    `IATA: ${airline.iata || "Not provided"}`,
    `ICAO: ${airline.icao || "Not provided"}`,
    `Country: ${airline.country || "Not provided"}`,
    `Region: ${airline.region || "Not provided"}`,
    `Current claim URL: ${airline.claimUrl}`,
    `Current status: ${airline.status}`,
    `Official website URL: ${airline.officialWebsiteUrl || "Not provided"}`,
    `Official source URL: ${airline.officialSourceUrl || "Not provided"}`,
    `Logo status: ${airline.logoStatus || "missing"}`,
    `Listed at: ${airline.listedAt}`,
    `Verified at: ${airline.verifiedAt || "Not verified"}`,
    `Verified by: ${airline.verifiedBy || "Not verified"}`,
    "What happened: replace this with 404, redirect, wrong page, non-airline page, region issue, or other details.",
    "Suggested replacement: paste the airline-owned replacement URL if known.",
  ].join("\n");
}

function buildMetadataLines(airline: AirlineRecord) {
  return [
    `- Slug: ${airline.slug}`,
    `- IATA: ${airline.iata || "Not provided"}`,
    `- ICAO: ${airline.icao || "Not provided"}`,
    `- Country: ${airline.country || "Not provided"}`,
    `- Region: ${airline.region || "Not provided"}`,
    `- Current claim URL: ${airline.claimUrl}`,
    `- Current status: ${airline.status}`,
    `- Official website URL: ${airline.officialWebsiteUrl || "Not provided"}`,
    `- Official source URL: ${airline.officialSourceUrl || "Not provided"}`,
    `- Logo status: ${airline.logoStatus || "missing"}`,
    `- Listed at: ${airline.listedAt}`,
    `- Verified at: ${airline.verifiedAt || "Not verified"}`,
    `- Verified by: ${airline.verifiedBy || "Not verified"}`,
  ];
}

export function getPassengerRightsKnowledgeUpdateUrl(jurisdiction: string, currentLastReviewed?: string) {
  const title = `Update passenger rights knowledge: ${jurisdiction}`;

  const body = [
    "## Passenger Rights Knowledge Update",
    "",
    `**Jurisdiction / Section:** ${jurisdiction}`,
    currentLastReviewed ? `**Current "Last Knowledge Update" shown in tool:** ${currentLastReviewed}` : "",
    "",
    "### What needs to be updated or added?",
    "Replace this line with a clear description of what is outdated, missing, or incorrect.",
    "",
    "### Proposed new information + official sources",
    "Paste the updated rules, amounts, time limits, or new jurisdiction details here. Include direct links to official government or regulator websites (not airline pages or claims management companies).",
    "",
    "### Notes",
    "Any additional context (routes affected, why this matters, exact part of the tool that should change).",
  ].join("\n");

  return buildGitHubIssueUrl({
    template: "update-passenger-rights-knowledge.yml",
    title,
    body,
    fields: {
      jurisdiction,
      current_last_reviewed: currentLastReviewed || "Not shown",
      what_needs_updating: "Describe what is outdated or missing...",
      proposed_changes: "Paste updated rules + official sources here...",
      notes: `Generated from Eligibility Helper / Claim Template for: ${jurisdiction}`,
    },
  });
}
