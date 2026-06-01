# OpenFlightClaims CODEX Working Brief

OpenFlightClaims is a minimal, fast, open-source directory of official airline claim, compensation, refund, complaint, passenger-rights, and disruption-support links.

Core user flow:

```txt
Search airline -> open official airline link -> report/update via GitHub if needed
```

The project must stay:

- Static-first
- Next.js App Router
- Deployable on Vercel
- Open-source
- Community-maintained through GitHub
- Very fast on mobile and desktop
- Minimal and trustworthy
- Free of database, auth, admin-panel, and CMS complexity
- AI-crawler and agent friendly

## Current Scope

The current release is the V2.1 AI-native open data foundation.

Included:

- Searchable localized directory
- Airline detail pages
- Top-airline metadata cleanup
- IATA and ICAO fields
- Country and region fields
- Optional logo fields with trademark safeguards
- Official-source passenger-rights guides
- Browser-only eligibility helper
- Browser-only claim template generator
- Public JSON endpoints with enhanced metadata
- Markdown endpoints for AI citations
- OpenAPI 3.1 spec
- llms.txt and llms-full.txt AI discovery
- MCP-compatible read-only endpoint
- Sitemap, robots, and structured data
- Scheduled link-check workflow
- Candidate airline discovery scanner
- AI-crawler-friendly policies
- Tiny test coverage for pure eligibility logic

Still do not add:

- Database
- Auth
- Admin panel
- CMS
- AI chatbot
- Analytics SDKs
- Heavy UI libraries
- Framer Motion
- Old source/provenance/import/scrape terms

## Public Link Status Model

Public-facing statuses:

- `active`: available in the directory (internal `listed` or `verified`)
- `reported_broken`: flagged as broken or outdated
- `unknown`: unclear or needs review

Internal fields preserve `officialSourceUrl`, `verifiedAt`, `verifiedBy`, `lastCheckedAt`, and `lastCheckStatus` when available.

## Data Trust Model

Internal statuses:

- `listed`: included in the open directory.
- `verified`: checked against an official airline source.
- `broken`: reported as broken, wrong, or outdated.
- `unknown`: not enough context.

Source types:

- `official_site`
- `community_pr`
- `maintainer`
- `legacy`

## Verification Rules

Only official airline-owned links are accepted.

Do not accept:

- claims-management companies
- affiliate links
- middlemen
- lead-generation pages
- unrelated travel support pages
- link shorteners unless clearly airline-owned

Verified records require an official source URL, a verification timestamp, and a verifier value.

IATA codes are two uppercase alphanumeric characters. ICAO codes are three uppercase alphanumeric characters. Logos are optional and must remain identification-only.

## AI & Programmatic Access

The project exposes multiple endpoints for AI agents, scrapers, and developers:

- JSON API: `/api/airlines`, `/api/airlines/{slug}`, `/api/meta`
- Direct JSON: `/airlines.json`
- Markdown: `/airlines.md`, `/airlines/{slug}.md`, `/guides/index.md`, `/contributing.md`
- Discovery: `/llms.txt`, `/llms-full.txt`
- API spec: `/openapi.json`
- MCP: `/mcp` (JSON-RPC), `/mcp.json` (manifest)

See `docs/ai-access.md` for full documentation.

## UI Direction

The site should feel like a tiny utility from Vercel, Linear, Raycast, GitHub, or clean legal-tech/aviation tooling.

Design should be:

- Extremely minimal
- Sleek
- Mobile-first
- Fast
- Accessible
- Restrained
- High contrast
- Free of noisy travel imagery

Main message:

```txt
Find official airline claim links. No middlemen. Open source.
```

## Translation Foundation

English is the source language. Translation files live in `messages/`.

Initial locales:

- English
- Spanish
- French
- Arabic
- Urdu

Arabic and Urdu support right-to-left direction through locale routes and the language selector.

## Licensing Strategy

- **Code:** AGPL-3.0-or-later (see LICENSE-CODE.md)
- **Data:** ODbL-1.0 (see LICENSE-DATA.md)
- **Brand/trademark:** Reserved — forks must rebrand (see TRADEMARKS.md)

Forks must use a clearly different name, logo, and branding. No proprietary copied data. All data contributions must be original, community-maintained, and backed by official sources. No third-party directory scraping or unverified provenance claims.

The project stays minimal: no database, no auth, no admin panel, no CMS, no AI chatbot.

## Required Checks

Before a release, run:

```bash
npm run typecheck
npm run lint
npm run validate:data
npm run validate:translations
npm run test
npm run verify:links
npm run build
```
