# Wave Agent Guide

This repository is for **Wave**, an AI-powered scam and risk detection assistant. Follow these rules when exploring, editing, or extending the project.

## File Map

Use this map first to avoid rediscovering the app structure.

- App entry: `src/app/page.tsx` renders `ScannerPage`.
- Root layout, metadata, and fonts: `src/app/layout.tsx`.
- Global design tokens and theme values: `src/app/globals.css`.
- Scan API route: `src/app/api/scan/route.ts`.
- Core scam analysis prompt and Gemini call: `src/lib/wave-scan.ts`.
- Scan response parsing, view types, risk tone helpers: `src/lib/wave-scan-view.ts`.
- Shared class-name helper: `src/lib/utils.ts`.
- Main screen state and scan flow orchestration: `src/components/wave-scanner/scanner-page.tsx`.
- Top navigation: `src/components/wave-scanner/scanner-nav.tsx`.
- Landing page layout and feature breakdown: `src/components/wave-scanner/landing-screen.tsx`.
- Landing animated demo loop: `src/components/wave-scanner/landing-demo.tsx`.
- Message scan form and image attachment UI: `src/components/wave-scanner/message-scan-form.tsx`.
- URL scan form and image attachment UI: `src/components/wave-scanner/link-scan-form.tsx`.
- Message/URL tab selector: `src/components/wave-scanner/scan-tabs.tsx`.
- Loading terminal animation: `src/components/wave-scanner/scan-loading-terminal.tsx`.
- Scan result report UI: `src/components/wave-scanner/scan-result-panel.tsx`.
- shadcn primitives: `src/components/ui/*`.

## Project Rules

- Keep Wave scoped to scam and risk detection only.
- Preserve the app's multilingual and tone-aware behavior.
- Prefer small, localized changes over broad refactors.
- Use the existing code patterns in the repo before introducing new abstractions.
- Avoid destructive filesystem or git actions unless the user explicitly asks for them.

## Repo Workflow

- Inspect the relevant files before editing.
- Trace how a feature flows through the app before changing it.
- Reuse the existing structure when adding new UI, logic, or prompts.
- Keep changes minimal, readable, and easy to review.
- Do not overwrite unrelated user work.

## Styling and Design System Rules

- `src/app/globals.css` is the single source of truth for all visual tokens.
- All colors, spacing tokens, radii, shadows, and theme values must be defined in `src/app/globals.css`.
- Component files must never hardcode hex values or duplicate design tokens.
- Do not repeat color values in feature files, components, or utility layers.
- If a visual value is needed, reference the existing global CSS variable or approved utility only.
- Component-level styling may compose the global design system, but must not redefine it.
- Add new design tokens only in `src/app/globals.css`, not inside individual components.

## Next.js and Framework Guidance

- This project may differ from standard Next.js expectations.
- Before changing framework-sensitive code, read the relevant guide in `node_modules/next/dist/docs/`.
- Heed any deprecation notices or repo-specific conventions over general Next.js assumptions.

## Deploying to Vercel

Rate limiting uses Upstash Redis (serverless, HTTP-based). To enable it on Vercel:

1. **Upstash Redis via Marketplace (recommended):** Go to your Vercel project dashboard → Storage → Browse Marketplace → find **Upstash Redis** (a key-value / KV store) → install and connect it to your project. Vercel auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` — no code changes needed.
2. **Standalone Upstash:** Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in your Vercel environment variables.
3. **Done** — the limiter auto-detects either set of env vars and uses Redis. If neither is present, it falls back to in-memory (useful for local dev).

Default limits: **10 requests per minute**, **50 per day**. Override with `RATE_LIMIT_PER_MIN` / `RATE_LIMIT_PER_DAY` env vars.

## Agent Behavior

- Make changes that fit the current architecture unless the user asks for a redesign.
- Prefer explicit, easy-to-audit code over clever abstractions.
- Keep prompts, UI copy, and analysis outputs aligned with Wave's scam-detection purpose.
- When in doubt about a styling value, check `src/app/globals.css` first.
