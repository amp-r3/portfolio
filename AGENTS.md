# AGENTS.md

Rules and architectural boundaries for AI agents in this repo. `CLAUDE.md` symlinks `AGENTS.md`.
Known gaps and backlog live in `ROADMAP.md`;
architecture decisions in `docs/migration/decisions.md`.

## Editing this file

- **Hard cap: 150 lines, 100 columns** — `scripts/check-agents-md.mjs` (`pnpm check:agents`) fails
  the pre-commit hook if exceeded. Keep this file dense and concise.
- Rules and pointers, not rationale. A rule is 1–2 lines: what to do, the trap it avoids, where to
  look. Background and architecture decisions go to `docs/migration/decisions.md`.

## Stack & Commands

Next.js 16 (App Router, Turbopack), React 19, TypeScript 5.9, next-intl 4 (`[locale]` routing:
`en`, `ru`, `uz`), SCSS Modules + CSS custom properties (light/dark themes), Motion,
Locomotive Scroll, Zod. Node 24.x, pnpm 10.33.3.

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint` / `pnpm typecheck`
- `pnpm check:agents` (validates line/column limits in this file)
- `pnpm test:architecture` (FSD boundary checks via eslint-plugin-boundaries)
- `pnpm test:messages` (ICU syntax & 3-locale key parity)
- `pnpm test:projects` (server-only data isolation and types)
- `pnpm test:smoke` (Playwright across Chromium, Firefox, WebKit)
- `pnpm test:visual` (Playwright visual regression vs baseline)

## Architecture — Feature-Sliced Design (FSD)

Strict hierarchy under `src/` (highest → lowest):
`_app` (providers, theme, metadata) → `_pages` (page composition) → `widgets` → `features` →
`entities` → `shared`. Next.js `app/` directory acts strictly as route adapters.

1. **Unidirectional flow**: import only from layers strictly below.
2. **No same-layer cross-imports**: widgets do not import widgets; features do not import features.
3. **Public API (`index.ts`) — never bypass**: always import through slice root; no deep imports.
4. **Server Data Isolation**:
   - `entities/project/index.server.ts` is protected with `import 'server-only'`.
   - Client components and client barrels (`index.ts`) must NEVER import `index.server.ts` or
     server functions (`getProjects`, `getProject`).
   - Server Components (`app/**/page.tsx`) fetch data and pass plain serializable props down.

## Forbidden → Use Instead

- `next/link` and `next/navigation` (`useRouter`, `usePathname`, `redirect`) → `@/shared/i18n`
  (preserves `[locale]` prefix).
- Hardcoded UI text in components → message keys in `messages/{en,ru,uz}.json` via
  `useTranslations` / `getTranslations`.
- Hardcoded colors/spacings → CSS theme variables (`--text-primary`, `--card-bg`) and SCSS tokens
  (`$spacing-*`, `$border-radius-*`).
- Direct `localStorage` reads in render → `ThemeScript` (runs in `<head>` before paint) +
  `useTheme()`.
- `any` → specific TypeScript types or Zod schemas.
- `console.log` → delete before commit; only `console.error` in exceptional catch blocks.

## i18n & Message Catalogs

- Locales are prefixed in URL (`/en`, `/ru`, `/uz`); `proxy.ts` is the middleware entry point.
- **Strict parity**: adding a key to `messages/en.json` requires immediate addition to `ru.json`
  and `uz.json` (`pnpm test:messages` will fail otherwise).
- ICU formatting: escape literal `{` and `}` in project content; use rich-text tags
  (e.g. `<code>` instead of `<0>`).

## Styling & Theme

- Strict BEM, one colocated SCSS module per component (`ui/Name/Name.module.scss`).
- Two themes (`light` / `dark`) driven by `data-theme` attribute on `<html>`. Zero FOUC.
- Theme switch duration is 1.5s (`$transition-duration-theme`, `$timing-function-theme`); all
  elements across the site synchronize color, background, and border transitions with it.
- Components with theme color transitions must use non-color hover effects (`transform`,
  `box-shadow`, `opacity`) to prevent 1.5s hover lag and theme transition color collisions.
- Animations and scroll handlers must respect `prefers-reduced-motion` and avoid breaking hydration.

## Verification Checklist Before Completion

1. `pnpm check:agents` (if AGENTS.md was edited)
2. `pnpm lint && pnpm typecheck`
3. `pnpm test:architecture`
4. `pnpm test:messages`
5. `pnpm test:projects`
6. `pnpm test:smoke` (if routes/navigation changed)
