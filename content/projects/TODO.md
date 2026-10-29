# Project content migration TODOs

JSON does not support comments, so temporary migration notes live here instead of inside the
project files. Remove entries as the content is rewritten.

## Store (`store`)

- [x] `tagline` — rewritten and shortened for all three locales.
- [x] `seo.description` — rewritten and checked against the 160-character limit.
- [x] `stack.primary` / `stack.groups` — regrouped into core, data, forms and tooling.
- [x] `deepDive[].summary` — rewritten from the legacy `benefits[].description`.
- [x] `features` — six key features added.
- [x] `tryIt` / `limitations` — filled.

## Palma (`palma`)

- [x] Replaced legacy `weather` project with `palma` (Palma UC).
- [x] Metadata filled (`personal`, `live`, 2026, `solo`).
- [x] `tagline` and `seo.description` written and checked within 160 chars for all 3 locales.
- [x] `stack.primary` / `stack.groups` grouped into core, data, forms, and tooling.
- [x] `features` (6 items) with valid icons added.
- [x] `deepDive` (5 technical topics) with titles, summaries, and details added.
- [x] `tryIt` (3 steps) and `limitations` (4 items) filled.
- [x] Single theme-aware images (`palmaDark`, `palmaMobileDark`) generated and wired.

## Images

- `store`: `desktop` and `mobile` are single strings (`storeDark`, `storeMobileDark`).
- `palma`: `desktop` and `mobile` are single strings (`palmaDark`, `palmaMobileDark`).

## Uzbek review

Uzbek copy written for store and palma content; needs a native-speaker review.
