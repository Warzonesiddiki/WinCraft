# WinCraft: Vibe Coding Developer Guide & Engineering Runbook

**Document Version:** 2.0.0  
**Target Audience:** AI Coding Agents & Human Systems Engineers  
**Scope:** Strict engineering contracts, step-by-step feature addition runbooks, i18n invariants, quality gates, and architectural boundaries for WinCraft development.

---

## 1. Core Engineering Principles

When developing or vibe coding in WinCraft, you must strictly adhere to the following **Five Non-Negotiable Invariants**:

1. **The "Zero-Brick" Invariant:** Never delete files from `WinSxS`, never corrupt `DISM` or `sfc`, and never break Windows Update servicing.
2. **The Reversibility Invariant:** Every state transition (registry write, service status change, scheduled task toggle, debloat removal) must record an exact snapshot in `%APPDATA%\WinCraft\history.json` before execution.
3. **The Least-Privilege Invariant:** The UI and starter workflow profiles run unprivileged (`HKCU`, `requires_admin: false`). Elevated operations (`HKLM`, services, tasks) must route exclusively through the isolated elevated IPC helper.
4. **The 6-Locale Invariant:** No hardcoded English strings in components. Every user-visible string must exist across all 6 locales (`en`, `it`, `fr`, `es`, `de`, `pt-PT`) with identical placeholders.
5. **The Public Claim Parity Invariant:** Tweak counts mentioned in documentation, marketing, and the UI must match `scripts/check-public-counts.mjs` exactly.

---

## 2. Repository Layout & Architecture Map

```
WinCraft/
├── src/                          # React 19 + TypeScript Frontend
│   ├── components/               # Domain-specific UI panels & copy tables
│   │   ├── starter-profiles.tsx  # 9 Workflow Presets UI
│   │   ├── starter-presets.mjs   # Workflow Preset definitions & rules
│   │   ├── starter-copy.ts       # 6-locale copy for starter presets
│   │   ├── debloat.tsx           # Debloat UI panel
│   │   └── debloat-copy.ts       # 6-locale copy for debloat catalog
│   ├── locales/                  # Global locale dictionaries (en, it, fr, es, de, pt)
│   ├── catalog.ts                # Frontend registry tweak catalog
│   ├── debloat-model.ts          # Debloat tiers and sizing logic
│   └── i18n.ts                   # Internationalization engine
├── src-tauri/                    # Rust 2021 Core Engine
│   └── src/
│       ├── lib.rs                # Tauri command registrations & app entry
│       ├── tweaks.rs             # Registry adapters and data types
│       ├── debloat.rs            # AppX / MSIX package catalog & removal journal
│       ├── rollback.rs           # Transactional snapshot store
│       └── scheduledtasks.rs     # Scheduled task manipulation
├── scripts/                      # CI Quality Gate Verification Scripts
│   ├── check-i18n.mjs            # Placeholder & key parity check
│   ├── audit-i18n.mjs            # Quality & untranslated string auditor
│   ├── check-public-counts.mjs   # Tweak count claim validator
│   └── test-starter-presets.mjs  # Preset safety & scope verification
└── docs/                         # Canonical specifications & architectural guides
```

---

## 3. Step-by-Step Runbook: Adding a New Tweak

To add a new optimization control without breaking any CI quality gates or type contracts, follow this exact 5-step runbook:

### Step 1: Define Backend Registry Adapter (`src-tauri/src/tweaks.rs`)

1. Add the tweak definition to the `TWEAKS` catalog in `src-tauri/src/tweaks.rs`.
2. Specify the exact `Hive`, registry `path`, `name`, `target_value`, `default_value`, and `requires_admin` flag.
3. Ensure the pre-write snapshot handler captures original values.

### Step 2: Register Frontend Catalog Metadata (`src/catalog.ts`)

1. Add the control to `CATALOG_ITEMS` in `src/catalog.ts`.
2. Assign the appropriate category (`privacy`, `ui`, `services`, `gaming`, `network`, `storage`, `power`).
3. Set the `evidence` tier (`Measured`, `Modest`, `Neutral`).

### Step 3: Add Multi-Language Copy (`src/locales/` or component copy table)

1. Add the translation keys across all 6 locale files:
   - `src/locales/en.ts` (English)
   - `src/locales/it.ts` (Italian)
   - `src/locales/fr.ts` (French)
   - `src/locales/es.ts` (Spanish)
   - `src/locales/de.ts` (German)
   - `src/locales/pt.ts` (European Portuguese - pt-PT)
2. Ensure interpolation variables (e.g. `{count}`, `{percent}`) match identically across all files.

### Step 4: Handle Loanwords & Quality Audit (`scripts/audit-i18n.mjs`)

1. If the term is identical to English (e.g. "Office", "Browser", "DPC"), add the translation key to `REVIEWED_AS_CORRECT` in `scripts/audit-i18n.mjs`.

### Step 5: Run Verification Pipeline

Execute the full local quality gate suite:

```bash
./node_modules/.bin/tsc --noEmit
npm run check:i18n
npm run check:i18n-quality
npm run check:public-counts
npm test
```

---

## 4. UI Design Token System Rules

When styling components in `src/components/`:

- **Do not hardcode raw Tailwind hex colors** (e.g. `bg-zinc-900`, `text-slate-400`).
- **Use WinCraft semantic design tokens** defined in `src/components/ui.tsx` and `src/App.css`:
  - Surfaces: `bg-surface-base`, `bg-surface-elevated`, `bg-surface-card`
  - Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`
  - Accents: `text-accent-primary`, `bg-accent-primary`, `border-accent-primary`
  - Status: `text-status-success`, `text-status-warning`, `text-status-danger`

---

## 5. Summary of CI Quality Gate Commands

| Command                        | Purpose                                                                               |
| :----------------------------- | :------------------------------------------------------------------------------------ |
| `npm run check:i18n`           | Verifies that all 1,598+ keys exist across all 6 locales with identical placeholders. |
| `npm run check:i18n-quality`   | Ensures no untranslated, unaccented, or mispunctuated strings exist.                  |
| `npm run check:public-counts`  | Validates that public documentation tweak claims match the active catalog.            |
| `npm run test:starter-presets` | Verifies that starter profiles only use non-elevated HKCU keys.                       |
| `npm run test:debloat`         | Validates that all 25 debloat packages have valid publisher IDs and Store links.      |
| `npm test`                     | Runs the full Vitest suite (326+ unit and integration tests).                         |
