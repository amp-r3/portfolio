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

## Weather (`weather`)

- `tagline` — TODO shorten: currently the full legacy `description` (all three locales).
- `seo.description` — TODO rewrite: mechanically derived from the first sentence of the legacy
  `description`; not editorially reviewed yet.
- `stack.primary` / `stack.groups` — TODO regroup: `primary` is the first five legacy
  `technologies`, and `core` contains the complete legacy list.
- `deepDive[].summary` — TODO rewrite: mechanically derived from the first sentence of the legacy
  `benefits[].description`, which is also copied unchanged into `deepDive[].details`.
- `features` — empty for now; content will be added in the next pass.
- `tryIt` / `limitations` — not filled yet.

## Missing required metadata (fields are optional until data is available)

- `weather`: `type`, `status`, `period`, `role` are not filled in. TODO: add once known.
- `store`: filled (`personal`, `live`, 2025–2026, `solo`).

## Images

- `store`: `desktop` and `mobile` are single strings (`storeDark`, `storeMobileDark`), so the same
  dark screenshot is shown in both themes, as requested in the migration brief.
- `weather`: both desktop and mobile keep `{ light, dark }` pairs.

## Uzbek review

Uzbek copy written for the store content pass; needs a native-speaker review.

- `content/projects/store.json`:
  - `tagline.uz`
  - `seo.description.uz`
  - `features[0].text.uz` … `features[5].text.uz`
  - `deepDive[0].title.uz`, `deepDive[0].summary.uz`, `deepDive[0].details.uz`
  - `deepDive[1].title.uz`, `deepDive[1].summary.uz`, `deepDive[1].details.uz` (legacy text plus
    one appended sentence)
  - `deepDive[2].title.uz`, `deepDive[2].summary.uz`, `deepDive[2].details.uz`
  - `deepDive[3].title.uz`, `deepDive[3].summary.uz`, `deepDive[3].details.uz`
  - `deepDive[4].title.uz`, `deepDive[4].summary.uz`, `deepDive[4].details.uz`
  - `tryIt[0].text.uz` … `tryIt[2].text.uz`
  - `limitations[0].text.uz` … `limitations[3].text.uz`
- `messages/uz.json` → `projects.labels.*` — pre-existing UI labels; JSON cannot carry inline
  comments, so this note is the review marker.
