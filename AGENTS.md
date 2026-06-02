# Wave Agent Guide

This repository is for **Wave**, an AI-powered scam and risk detection assistant. Follow these rules when exploring, editing, or extending the project.

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

## Agent Behavior

- Make changes that fit the current architecture unless the user asks for a redesign.
- Prefer explicit, easy-to-audit code over clever abstractions.
- Keep prompts, UI copy, and analysis outputs aligned with Wave's scam-detection purpose.
- When in doubt about a styling value, check `src/app/globals.css` first.
