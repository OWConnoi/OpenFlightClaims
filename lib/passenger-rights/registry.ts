import type { Jurisdiction } from "./types";

export const jurisdictions: Jurisdiction[] = [
  {
    id: "eu261",
    name: "EU261 / EC 261",
    lastReviewed: "2025-05-20",
    description: "European Union air passenger rights for delays, cancellations, and denied boarding.",
    countries: ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "Iceland", "Norway", "Switzerland"],
    sources: [
      { label: "European Commission – Air passenger rights", url: "https://transport.ec.europa.eu/transport-themes/passenger-rights/air_en" },
      { label: "Your Europe – Air passenger rights", url: "https://europa.eu/youreurope/citizens/travel/passenger-rights/air/index_en.htm" },
    ],
  },
  {
    id: "uk261",
    name: "UK261",
    lastReviewed: "2025-04-15",
    description: "United Kingdom air passenger rights (post-Brexit version of EU261 rules).",
    countries: ["United Kingdom"],
    sources: [
      { label: "UK Civil Aviation Authority", url: "https://www.caa.co.uk/passengers-and-public/resolving-travel-problems/delays-and-cancellations/" },
    ],
  },
  {
    id: "us-dot",
    name: "US DOT / Airline Commitments",
    lastReviewed: "2025-03-10",
    description: "United States Department of Transportation rules on refunds, tarmac delays, denied boarding compensation, and airline customer service plans.",
    countries: ["United States"],
    sources: [
      { label: "DOT Airline Cancellation & Delay Dashboard", url: "https://www.transportation.gov/airconsumer/airline-cancellation-delay-dashboard" },
      { label: "DOT Consumer Protection", url: "https://www.transportation.gov/individuals/aviation-consumer-protection" },
    ],
  },
  {
    id: "oman",
    name: "Oman Civil Aviation Authority",
    lastReviewed: "2025-06-01",
    description: "Oman passenger rights and airline obligations under Omani civil aviation regulations.",
    countries: ["Oman"],
    sources: [
      { label: "Oman Civil Aviation Authority", url: "https://caa.gov.om/" },
    ],
  },
  {
    id: "canada",
    name: "Canada APPR",
    lastReviewed: "2025-02-28",
    description: "Canada Air Passenger Protection Regulations (APPR) administered by the Canadian Transportation Agency.",
    countries: ["Canada"],
    sources: [
      { label: "Canadian Transportation Agency – Air passenger rights", url: "https://www.otc-cta.gc.ca/eng/air-passenger-rights" },
    ],
  },
  {
    id: "australia",
    name: "Australia Consumer Rights",
    lastReviewed: "2025-01-15",
    description: "Australian Consumer Law protections for flight delays, cancellations, and consumer guarantees.",
    countries: ["Australia"],
    sources: [
      { label: "Australian Competition & Consumer Commission", url: "https://www.accc.gov.au/consumers/travel-flight-and-holiday-rights" },
    ],
  },
  {
    id: "uae",
    name: "UAE GCAA Passenger Rights",
    lastReviewed: "2024-11-20",
    description: "United Arab Emirates General Civil Aviation Authority passenger rights regulations.",
    countries: ["United Arab Emirates"],
    sources: [
      { label: "UAE GCAA", url: "https://www.gcaa.gov.ae/" },
    ],
  },
  {
    id: "qatar",
    name: "Qatar Civil Aviation Authority",
    lastReviewed: "2025-05-01",
    description: "Qatar passenger rights and airline obligations.",
    countries: ["Qatar"],
    sources: [
      { label: "Qatar Civil Aviation Authority", url: "https://www.caa.gov.qa/" },
    ],
  },
  {
    id: "singapore",
    name: "Singapore CAAS",
    lastReviewed: "2025-04-05",
    description: "Singapore Civil Aviation Authority consumer protection for air travel.",
    countries: ["Singapore"],
    sources: [
      { label: "CAAS Consumer Protection", url: "https://www.caas.gov.sg/" },
    ],
  },
  {
    id: "japan",
    name: "Japan MLIT / Consumer Affairs",
    lastReviewed: "2024-12-10",
    description: "Japanese rules on flight delays, cancellations, and consumer rights.",
    countries: ["Japan"],
    sources: [
      { label: "Ministry of Land, Infrastructure, Transport and Tourism", url: "https://www.mlit.go.jp/" },
    ],
  },
  {
    id: "india",
    name: "India DGCA / Consumer Protection",
    lastReviewed: "2025-03-25",
    description: "India Directorate General of Civil Aviation and consumer protection rules for air travel.",
    countries: ["India"],
    sources: [
      { label: "DGCA India", url: "https://www.dgca.gov.in/" },
    ],
  },
  {
    id: "brazil",
    name: "Brazil ANAC",
    lastReviewed: "2025-02-12",
    description: "Brazil National Civil Aviation Agency passenger rights regulations.",
    countries: ["Brazil"],
    sources: [
      { label: "ANAC Brazil", url: "https://www.anac.gov.br/" },
    ],
  },
  {
    id: "south-korea",
    name: "South Korea MOLIT / KCA",
    lastReviewed: "2025-01-30",
    description: "South Korea air passenger rights under the Ministry of Land, Infrastructure and Transport.",
    countries: ["South Korea"],
    sources: [
      { label: "Korea Consumer Agency", url: "https://www.kca.go.kr/" },
    ],
  },
  {
    id: "turkey",
    name: "Turkey SHGM / Consumer Rights",
    lastReviewed: "2024-10-18",
    description: "Turkey Directorate General of Civil Aviation passenger protection rules.",
    countries: ["Turkey"],
    sources: [
      { label: "SHGM Turkey", url: "https://www.shgm.gov.tr/" },
    ],
  },
];

export function getJurisdiction(id: string): Jurisdiction | undefined {
  return jurisdictions.find((j) => j.id === id);
}

export function getAllJurisdictions(): Jurisdiction[] {
  return [...jurisdictions];
}
