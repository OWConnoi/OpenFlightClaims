export const guideSlugs = [
  "eu261",
  "uk261",
  "us-passenger-rights",
  "how-to-claim",
  "delayed-flight",
  "cancelled-flight",
  "denied-boarding",
  "baggage-problems",
  "seat-downgrade",
  "tarmac-delays",
  "missed-connections",
  "refund-rights",
] as const;

export type GuideSlug = (typeof guideSlugs)[number];

export interface GuideSource {
  label: string;
  url: string;
}

export interface GuideSection {
  title: string;
  items: string[];
}

export interface Guide {
  slug: GuideSlug;
  title: string;
  description: string;
  summary: string;
  sections: GuideSection[];
  sources: GuideSource[];
}

const euSources: GuideSource[] = [
  {
    label: "Your Europe: Air passenger rights",
    url: "https://europa.eu/youreurope/citizens/travel/passenger-rights/air/index_en.htm",
  },
  {
    label: "European Commission: Air passenger rights",
    url: "https://transport.ec.europa.eu/transport-themes/passenger-rights/air_en",
  },
  {
    label: "EUR-Lex summary of Regulation (EC) No 261/2004",
    url: "https://eur-lex.europa.eu/legal-content/en/LSU/?uri=celex%3A32004R0261",
  },
];

const ukSources: GuideSource[] = [
  {
    label: "UK CAA: Flight delays and cancellations",
    url: "https://www.caa.co.uk/passengers-and-public/resolving-travel-problems/delays-and-cancellations/",
  },
  {
    label: "UK CAA: Delays",
    url: "https://www.caa.co.uk/passengers-and-public/resolving-travel-problems/delays-and-cancellations/delays/",
  },
  {
    label: "UK CAA: Cancellations",
    url: "https://www.caa.co.uk/passengers/resolving-travel-problems/delays-and-cancellations/cancellations/",
  },
];

const usSources: GuideSource[] = [
  {
    label: "US DOT: Airline Cancellation and Delay Dashboard",
    url: "https://www.transportation.gov/airconsumer/airline-cancellation-delay-dashboard",
  },
  {
    label: "US DOT: Refunds",
    url: "https://www.transportation.gov/individuals/aviation-consumer-protection/refunds",
  },
  {
    label: "US DOT: File a consumer complaint",
    url: "https://www.transportation.gov/airconsumer/file-consumer-complaint",
  },
  {
    label: "US DOT: Bumping and oversales",
    url: "https://www.transportation.gov/individuals/aviation-consumer-protection/bumping-oversales",
  },
];

export const guides: Guide[] = [
  {
    slug: "eu261",
    title: "EU261 air passenger rights",
    description: "A concise, official-source summary of EU passenger rights for disruption claims.",
    summary:
      "EU rules may apply to flights departing the EU and to some flights arriving in the EU on EU carriers. They cover care, rerouting or reimbursement, and possible fixed compensation for qualifying delays, cancellations, and denied boarding.",
    sections: [
      {
        title: "When it generally applies",
        items: [
          "Flights within the EU, flights departing the EU, and flights arriving in the EU from outside the EU when operated by an EU airline.",
          "Similar rules may also apply in Iceland, Norway, Switzerland, and some outermost regions identified by official EU guidance.",
          "Passengers should check the official EU source because coverage depends on itinerary, operating carrier, and whether benefits were already received under another regime.",
        ],
      },
      {
        title: "Common disruption types",
        items: [
          "Long delay at final destination.",
          "Cancellation with short notice.",
          "Involuntary denied boarding.",
          "Right to care during qualifying disruption, including meals, communication, and accommodation where required.",
        ],
      },
      {
        title: "Before claiming",
        items: [
          "Keep boarding passes, booking references, receipts, disruption messages, and arrival-time evidence.",
          "Claim directly with the operating airline first.",
          "Escalate through the relevant national enforcement body or approved dispute-resolution process when the airline does not resolve the issue.",
        ],
      },
    ],
    sources: euSources,
  },
  {
    slug: "uk261",
    title: "UK261 passenger rights",
    description: "A concise, official-source summary of UK flight delay, cancellation, and denied boarding rights.",
    summary:
      "UK passenger-rights rules broadly cover flights departing the UK and some UK/EU airline flights arriving in the UK. They can include care, rerouting or reimbursement, and fixed compensation for qualifying disruption.",
    sections: [
      {
        title: "When it generally applies",
        items: [
          "Flights departing a UK airport.",
          "Flights arriving in the UK on a UK or EU airline in circumstances described by UK CAA guidance.",
          "Self-transfer itineraries and separate bookings may have different protection; check official CAA guidance.",
        ],
      },
      {
        title: "Common disruption types",
        items: [
          "Delays reaching final destination.",
          "Cancelled flights, including short-notice cancellations.",
          "Denied boarding when there are too few seats for checked-in passengers.",
        ],
      },
      {
        title: "Before claiming",
        items: [
          "Claim directly with the airline using the airline-owned claim or complaint channel.",
          "Keep receipts for reasonable care expenses if the airline did not provide care directly.",
          "Use CAA guidance to understand escalation routes if the airline rejects or ignores a claim.",
        ],
      },
    ],
    sources: ukSources,
  },
  {
    slug: "us-passenger-rights",
    title: "US passenger rights",
    description: "A concise, official-source summary of US DOT rules and airline commitments.",
    summary:
      "The US does not use an EU-style fixed compensation system for ordinary delays. DOT rules and airline commitments focus on refunds, controllable cancellation/delay services, tarmac-delay protections, complaint handling, and denied-boarding compensation.",
    sections: [
      {
        title: "What to check first",
        items: [
          "For a significant delay, cancellation, or schedule change, check whether you are entitled to a refund if you do not travel.",
          "For controllable delays or cancellations, check the DOT dashboard and the airline customer service plan.",
          "For involuntary denied boarding due to oversales, DOT rules may require compensation based on fare and arrival delay.",
        ],
      },
      {
        title: "Where to claim or complain",
        items: [
          "Start with the airline’s own complaint, refund, or customer-service channel.",
          "If the airline does not resolve the issue, DOT accepts consumer complaints for air travel problems.",
          "Keep written evidence of what the airline offered and whether the disruption was described as controllable.",
        ],
      },
    ],
    sources: usSources,
  },
  {
    slug: "how-to-claim",
    title: "How to claim from an airline",
    description: "A practical, official-link-first checklist for filing an airline claim directly.",
    summary:
      "Claim directly with the operating airline. Use official airline-owned forms or passenger-rights pages, keep evidence, avoid middlemen, and escalate only after the airline has had a fair chance to respond.",
    sections: [
      {
        title: "Prepare evidence",
        items: [
          "Booking reference, ticket number, flight number, travel date, route, and passenger names.",
          "Scheduled and actual arrival times, disruption messages, photos of airport screens, and receipts.",
          "The reason given by the airline, if one was provided.",
        ],
      },
      {
        title: "Submit directly",
        items: [
          "Use the airline detail page in OpenFlightClaims to open the official airline claim or support link.",
          "Write a concise claim explaining the disruption, what happened, and the outcome requested.",
          "Do not pay a claims-management company unless you deliberately choose to use one after understanding its fees.",
        ],
      },
      {
        title: "Escalate carefully",
        items: [
          "If the airline does not respond or rejects the claim, check the official regulator route for your jurisdiction.",
          "Rules and deadlines vary, so verify current official guidance before escalating.",
        ],
      },
    ],
    sources: [...euSources, ...ukSources, usSources[2]],
  },
  {
    slug: "delayed-flight",
    title: "Delayed flight claims",
    description: "What to check before claiming for a delayed flight.",
    summary:
      "Delay rights depend on the route, airline, reason for delay, and final arrival delay. EU/UK rules may provide fixed compensation in qualifying cases; US passengers should check refund rules and airline commitments.",
    sections: [
      {
        title: "Key checks",
        items: [
          "Measure delay at final arrival, not only departure.",
          "Record the airline’s stated reason and whether it was within the airline’s control.",
          "For EU/UK claims, the three-hour final-arrival threshold is often important, but exceptions apply.",
        ],
      },
      {
        title: "Evidence to keep",
        items: [
          "Arrival time evidence, disruption messages, boarding passes, receipts, and airline correspondence.",
          "If care was not provided, keep reasonable meal, communication, hotel, and transport receipts.",
        ],
      },
    ],
    sources: [...euSources, ukSources[1], usSources[0], usSources[1]],
  },
  {
    slug: "cancelled-flight",
    title: "Cancelled flight claims",
    description: "What to check before claiming for a cancelled flight.",
    summary:
      "Cancellation rights can include reimbursement, rerouting, care, and in some jurisdictions compensation. The notice period, reason, route, and replacement-flight timing matter.",
    sections: [
      {
        title: "Key checks",
        items: [
          "Confirm when the airline notified you of the cancellation.",
          "Record replacement-flight departure and arrival times.",
          "Check whether the airline offered reimbursement, rerouting, or care.",
        ],
      },
      {
        title: "Evidence to keep",
        items: [
          "Cancellation notice, rebooking offer, refund offer, receipts, and any written reason from the airline.",
          "Proof that you accepted, rejected, or did not receive an alternative flight.",
        ],
      },
    ],
    sources: [...euSources, ukSources[2], usSources[0], usSources[1]],
  },
  {
    slug: "denied-boarding",
    title: "Denied boarding claims",
    description: "What to check when an airline denies boarding.",
    summary:
      "Denied boarding rules differ by region. EU/UK rules may cover involuntary denied boarding where passengers checked in on time; US DOT rules cover bumping due to oversales in specific circumstances.",
    sections: [
      {
        title: "Key checks",
        items: [
          "Record whether you volunteered or were involuntarily denied boarding.",
          "Keep proof that you had a confirmed reservation and met check-in and gate deadlines.",
          "Ask the airline for written information about your rights and any compensation offered.",
        ],
      },
      {
        title: "Evidence to keep",
        items: [
          "Boarding pass, booking confirmation, gate arrival evidence, written airline notice, and substitute-flight details.",
          "Receipts for reasonable care expenses if you had to pay because the airline did not provide care.",
        ],
      },
    ],
    sources: [...euSources, ...ukSources, usSources[3]],
  },
  {
    slug: "baggage-problems",
    title: "Baggage problems",
    description: "What to check for delayed, lost, or damaged baggage.",
    summary:
      "Baggage rules vary by route and carrier. Most airlines follow Montreal Convention limits for international flights, and some jurisdictions add local protections. Document everything before leaving the airport.",
    sections: [
      {
        title: "At the airport",
        items: [
          "Report the problem to the airline or handling agent before leaving the baggage hall.",
          " Obtain a Property Irregularity Report (PIR) or written reference number.",
          " Photograph the damaged bag and its contents before leaving the airport.",
        ],
      },
      {
        title: "Key checks",
        items: [
          "Check whether your route is covered by the Montreal Convention or a local passenger-rights regime.",
          " Keep receipts for essential purchases while waiting for delayed baggage.",
          " Do not throw away damaged items until the airline has had a chance to inspect them.",
        ],
      },
    ],
    sources: [...euSources, ukSources[0], usSources[1]],
  },
  {
    slug: "seat-downgrade",
    title: "Seat downgrade claims",
    description: "What to check if you are moved to a lower cabin class.",
    summary:
      "A downgrade can entitle you to a partial refund of the fare difference under some passenger-rights regimes. The rules depend on the route, the reason, and how the airline handles it.",
    sections: [
      {
        title: "Key checks",
        items: [
          "Confirm the reason for the downgrade in writing.",
          "Keep your original booking confirmation showing the cabin class paid for.",
          "Check whether the airline's conditions of carriage or local rules specify downgrade remedies.",
        ],
      },
      {
        title: "Evidence to keep",
        items: [
          "Original booking, boarding pass, and any written downgrade notice.",
          "Receipts if you paid for seat selection or extra-legroom seats that were not honored.",
        ],
      },
    ],
    sources: [...euSources, ukSources[0]],
  },
  {
    slug: "tarmac-delays",
    title: "Tarmac delay rights",
    description: "What to check during a long tarmac delay.",
    summary:
      "Tarmac-delay rules differ sharply by country. US DOT rules set maximum times before passengers must be allowed to deplane. EU/UK rules may treat long tarmac delays as qualifying delays for care and compensation purposes.",
    sections: [
      {
        title: "Key checks",
        items: [
          "Record the time the aircraft door was closed and when it reopened or the aircraft returned to the gate.",
          " Note what care was offered (water, food, ventilation, lavatory access).",
          " Check the local regulator's tarmac-delay or long-delay rules for your departure country.",
        ],
      },
      {
        title: "Evidence to keep",
        items: [
          "Flight tracking screenshots, airline app notifications, and crew announcements.",
          "Receipts if you had to buy food or water because the airline did not provide care.",
        ],
      },
    ],
    sources: [...euSources, ukSources[0], usSources[0]],
  },
  {
    slug: "missed-connections",
    title: "Missed connection rights",
    description: "What to check when a delay causes you to miss a connecting flight.",
    summary:
      "Protection depends on whether the flights were booked together, the airline's responsibility for the delay, and the jurisdiction. Self-transfer itineraries often have different or no protection.",
    sections: [
      {
        title: "Key checks",
        items: [
          "Confirm whether the flights were booked on a single ticket or separate bookings.",
          " Record the reason for the initial delay and how long it lasted.",
          " Ask the airline for rerouting options and whether they will cover reasonable care costs.",
        ],
      },
      {
        title: "Evidence to keep",
        items: [
          "Both boarding passes, booking references, and disruption messages for all affected flights.",
          "Receipts for hotel, meals, and transport if the airline did not provide rerouting or care.",
        ],
      },
    ],
    sources: [...euSources, ukSources[0]],
  },
  {
    slug: "refund-rights",
    title: "Refund rights",
    description: "When you may be entitled to a ticket refund.",
    summary:
      "Refund rights vary by reason. Cancellations by the airline, significant schedule changes, and some controllable delays may entitle you to a refund. Voluntary changes usually follow the fare rules you agreed to.",
    sections: [
      {
        title: "Key checks",
        items: [
          "Confirm who cancelled or changed the booking and when you were notified.",
          "Check whether the airline offered a voucher instead of a refund and whether you are required to accept it.",
          "Verify the refund deadline and method in the airline's conditions of carriage.",
        ],
      },
      {
        title: "Evidence to keep",
        items: [
          "Original booking confirmation, cancellation notice, and any refund offer or voucher terms.",
          "Screenshots of the airline's refund policy at the time of booking if it has since changed.",
        ],
      },
    ],
    sources: [...euSources, ukSources[0], usSources[1]],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}
