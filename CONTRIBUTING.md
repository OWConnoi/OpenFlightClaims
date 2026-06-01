# Contributing to OpenFlightClaims

Thanks for helping. This project stays minimal: no database, no auth, no admin panel, no CMS.

## What you can help with

- **Report a broken airline link**
- **Suggest a better official link**
- **Add a missing airline**
- **Improve translations**
- **Improve UI or content**

## Link rules

We only accept **official airline-owned links**:

- Claim, refund, complaint, or passenger-rights pages
- Directly from the airline or linked from its official website

We do **not** accept:

- Claims-management companies
- Affiliate links
- Middlemen or lead-generation pages
- Link shorteners (unless clearly airline-owned)

## Quick links

- [Report broken link](https://github.com/OWConnoi/OpenFlightClaims/issues/new?template=report-broken-link.yml)
- [Add missing airline](https://github.com/OWConnoi/OpenFlightClaims/issues/new?template=add-airline-link.yml)
- [Suggest update](https://github.com/OWConnoi/OpenFlightClaims/issues/new?template=update-airline-link.yml)
- [Translation guide](docs/translations.md)

## Translations

Translation files live in `messages/`. English is the source language.

- Keep airline names as official brand names
- Add your locale in `i18n/locales.ts` if adding a new language
- Run `npm run validate:translations` before submitting

See [docs/translations.md](docs/translations.md) for more.

## Local development

```bash
npm install
npm run dev
```

Useful checks before submitting:

```bash
npm run typecheck
npm run lint
npm run validate:data
npm run validate:translations
npm run build
```

Or run everything:

```bash
npm run ci
```

Keep changes minimal. No database, auth, admin, CMS, or heavy dependencies.

## License note

By contributing code, data, or translations you agree they are contributed under the project's licensing structure: AGPL-3.0-or-later for code, ODbL-1.0 for data. See [LICENSE](LICENSE) for details.

This is not legal advice.
