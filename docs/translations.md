# Translation Guide

English is the source language for OpenFlightClaims. Translation files live in `messages/`.

Supported locales:

- `en` English
- `es` Spanish
- `fr` French
- `ar` Arabic
- `ur` Urdu

The root route `/` redirects to `/en`. Locale routes are available at `/en`, `/es`, `/fr`, `/ar`, and `/ur`. Arabic and Urdu are right-to-left languages, and their locale routes render `dir="rtl"` on the server. The language selector stores the selected locale in the browser and navigates to the matching route.

Localized routes also exist for:

- `/{locale}/airlines/{slug}`
- `/{locale}/guides/{guide}`
- `/{locale}/tools/eligibility-helper`
- `/{locale}/tools/claim-template`

Guide content currently uses concise English source material backed by official regulator links. UI chrome, labels, metadata, and shared warnings live in `messages/`.

## Editing Translations

1. Update `messages/en.json` first when adding UI copy.
2. Add the same key to every other locale file.
3. Keep airline names as official brand names.
4. Keep placeholders such as `{count}` unchanged.
5. Check right-to-left layout for Arabic and Urdu when adding longer labels.
6. Run `npm run validate:translations`.

The validator checks for missing keys, unknown keys, empty values, and unregistered locale files.
