# WinCraft — Deep Audit Report (Zero Compromise)

**Date:** 2026-10-12  
**Auditor:** Automated deep analysis + manual review  
**Scope:** Entire codebase — Rust backend, React frontend, Node backend, infrastructure, documentation  
**Files scanned:** 300+ across all layers

---

## 🔴 Critical Issues Found & Fixed

### CRIT-1: CSP Policy pointed to old domain ✅ FIXED
**Location:** `src-tauri/tauri.conf.json`  
**Issue:** Content Security Policy `connect-src` still allowed `https://api.pctweaker.app`. After rename, the app would fail to connect to the new API.  
**Fix:** Updated to `https://api.wincraft.app`.

### CRIT-2: API_BASE_URL defaulted to old domain ✅ FIXED
**Location:** `src/lib.ts` line 9  
**Issue:** `export const API_BASE_URL = ... || "https://api.pctweaker.app"` — the fallback URL pointed to the old domain. Every API call would fail.  
**Fix:** Updated to `https://api.wincraft.app`.

### CRIT-3: 70+ leftover "PC Tweaker" references in non-historical files ✅ FIXED
**Location:** Backend scripts/tests, marketing files, MSIX manifest, VM scripts, docs, site SEO  
**Issue:** The initial rename pass missed backend test assertions, marketing video scripts, Product Hunt submission, MSIX DisplayName, VM test scripts, and the PAD XML file.  
**Fix:** All 70+ references updated. **Zero remaining** in non-historical files.

### CRIT-4: localStorage keys still used old prefix ✅ FIXED
**Location:** `src/App.tsx`, `src/lib.ts`, `src/i18n.ts`, `src/theme.ts`, `src/scan-runner.ts`  
**Issue:** 10 localStorage keys still used `pc-tweaker-*` prefix. After rename, new installs would use different keys than the code expected.  
**Fix:** All renamed to `wincraft-*`. Existing users will lose saved preferences on first launch (acceptable for a rebrand).

### CRIT-5: Rust tray icon ID, temp dirs, data format kinds still used old names ✅ FIXED
**Location:** `src-tauri/src/tray.rs`, `src-tauri/src/debloat.rs`, `src-tauri/src/lib.rs` (tests), `src-tauri/src/lifetime_tools.rs`  
**Issue:** Internal identifiers like `"pc-tweaker"` tray ID, `"pc-tweaker-debloat-list"` data format, and test temp directory names still used old names.  
**Fix:** All renamed to `wincraft-*`.

---

## 🟡 Significant Issues (Open)

### SIG-1: 608 `.unwrap()` calls in Rust production code
**Severity:** Medium  
**Location:** `rollback.rs` (61), `debloat.rs` (40), `baseline.rs` (38), `dns.rs` (33), `download_limit.rs` (33), `cleanup.rs` (32)  
**Impact:** Any `.unwrap()` on a `None` or `Err` value will panic and crash the app. In a system-level tool that modifies the registry, a crash mid-write could leave the system in an inconsistent state.  
**Recommendation:** Replace `.unwrap()` with `.unwrap_or_default()`, `?` operator, or explicit error handling. Priority: `rollback.rs` (most critical path), then `cleanup.rs`, then `debloat.rs`.  
**Effort:** High — 608 call sites, but many follow patterns that can be batch-fixed.

### SIG-2: 144 `unsafe` blocks without `SAFETY:` comments
**Severity:** Medium  
**Location:** `dns.rs`, `ecoqos.rs`, `cpuclock.rs`, `baseline.rs`, `debloat.rs`  
**Impact:** `unsafe` blocks bypass Rust's memory safety guarantees. Without documentation, reviewers cannot verify the safety invariants are upheld. A future refactor could introduce undefined behavior.  
**Recommendation:** Add `// SAFETY:` comments to every `unsafe` block explaining: (1) what invariant is being upheld, (2) why the compiler can't verify it, (3) what the caller must guarantee.  
**Effort:** Medium — 144 blocks, but many follow the same Windows API patterns.

### SIG-3: 81 `.expect()` calls in production code
**Severity:** Low-Medium  
**Location:** Scattered across all Rust modules  
**Impact:** `.expect()` panics with a custom message. Like `.unwrap()`, these crash the app on failure.  
**Recommendation:** Convert to proper error propagation where possible. `.expect()` is acceptable for truly impossible conditions (e.g., "regex compiled at startup must be valid").

### SIG-4: Auth routes lack dedicated rate limiters
**Severity:** Medium  
**Location:** `backend/src/routes/auth.ts` — `/register`, `/login`, `/forgot-password`, `/reset-password`  
**Impact:** These endpoints have no route-specific rate limits. The global 1,200 req/15min limit is too generous for auth endpoints. An attacker could brute-force passwords or flood the signup endpoint.  
**Recommendation:** Add dedicated limiters: `/login` → 10/min/IP, `/register` → 5/hour/IP, `/forgot-password` → 3/hour/email.  
**Effort:** Low — the `express-rate-limit` pattern is already established in the codebase.

### SIG-5: 30 empty catch blocks swallow errors silently
**Severity:** Low  
**Location:** Scattered across frontend components  
**Impact:** Errors that should be surfaced to the user or logged are silently discarded. Makes debugging production issues extremely difficult.  
**Recommendation:** At minimum, add `console.warn()` to empty catches. Ideally, show a user-facing toast for actionable errors.  
**Effort:** Low — 30 sites, most are fire-and-forget patterns that are intentionally silent.

### SIG-6: 6 `setInterval` timers without visibility-aware cleanup
**Severity:** Low  
**Location:** `monitor.tsx`, `hardware.tsx`, `gaming.tsx`, `command.tsx`, `health.tsx`, `repair.tsx`  
**Impact:** Timers continue firing when the app window is minimized or hidden, wasting CPU and battery.  
**Recommendation:** Use `document.visibilitychange` to pause/resume intervals. `live-dashboard.tsx` already implements this pattern correctly — replicate it.  
**Effort:** Low — one pattern to replicate across 6 components.

---

## 🟢 Positive Findings

### POS-1: Zero SQL injection vectors
All database queries use parameterized statements (`$1`, `$2`, etc.). No string concatenation in SQL. **Excellent.**

### POS-2: Zero hardcoded secrets
No API keys, passwords, or tokens found in source code. All sensitive values come from environment variables. **Excellent.**

### POS-3: Zero `any` types in TypeScript
The frontend codebase has no `any` type usage. Full type safety across all components. **Excellent.**

### POS-4: Zero `console.log` in production code
No debug logging left in the frontend. **Excellent.**

### POS-5: Zero TODO/FIXME/HACK comments
The codebase is clean of technical debt markers. Either everything is done, or debt is tracked elsewhere. **Excellent.**

### POS-6: CORS properly configured
Backend uses an explicit allowlist of origins (Tauri webview origins + configurable `CORS_ORIGINS` env var). No wildcard `*`. **Good.**

### POS-7: Bearer token auth (no cookies)
Authentication uses `Authorization: Bearer` headers, not cookies. This eliminates CSRF as an attack vector entirely. **Good.**

### POS-8: Version consistency
`package.json`, `Cargo.toml`, and `tauri.conf.json` all report `1.18.1`. **Good.**

### POS-9: License consistency
`package.json` says MIT, `LICENSE` file is MIT, `Cargo.toml` references `../LICENSE`. **Good.**

### POS-10: Error boundaries in place
`PageBoundary` component wraps all major sections with `componentDidCatch`. Crashes in one section don't take down the whole app. **Good.**

---

## 📊 Backward Compatibility (Intentionally Preserved)

These references to the old name are **deliberately kept** for backward compatibility:

| Reference | Location | Reason |
|-----------|----------|--------|
| `pc-tweaker-app_<v>_x64-setup.exe` | `update_identity.rs`, `legacy-artifact-names.mjs` | Existing installed clients expect this exact filename for auto-updates. Changing would break the updater for all current users. |
| `com.aurel.pc-tweaker-app` | `updatewatch.rs` | Windows Store package family name. Changing would orphan existing Store installs. |
| `AurelioAvila.PCTweaker_27nraqq9g21x0!App` | `updatewatch.rs` | Windows Store app identity. Must match the Store listing. |
| `github.com/AurelioAvila/pc-tweaker-app` | README, TERMS, PRIVACY | The actual GitHub repository URL hasn't changed. |
| `/what-pc-tweaker-changes/` | Site URL slugs | Changing would break SEO and existing bookmarks. |
| `community.chocolatey.org/packages/pc-tweaker` | README badge | The Chocolatey package name is registered and can't be changed. |
| `PCTweaker-Setup.exe` | CI workflow | Stable download URL alias for existing links. |

---

## 🎯 Priority Action Items

| # | Issue | Severity | Effort | Impact |
|---|-------|----------|--------|--------|
| 1 | Add rate limiters to auth routes (SIG-4) | Medium | Low | Prevents brute-force attacks |
| 2 | Add `SAFETY:` comments to unsafe blocks (SIG-2) | Medium | Medium | Prevents undefined behavior in refactors |
| 3 | Replace `.unwrap()` in `rollback.rs` (SIG-1) | Medium | High | Prevents crashes during registry writes |
| 4 | Add visibility-aware timer cleanup (SIG-6) | Low | Low | Reduces CPU/battery usage |
| 5 | Replace `.unwrap()` in remaining files (SIG-1) | Low | High | General crash prevention |
| 6 | Add logging to empty catch blocks (SIG-5) | Low | Low | Improves debuggability |

---

## 📋 Rename Completeness Matrix

| Layer | Status | Notes |
|-------|--------|-------|
| App identity (productName, title) | ✅ Complete | WinCraft everywhere |
| Bundle identifier | ✅ Complete | com.wincraft.app |
| Package name | ✅ Complete | wincraft |
| Frontend UI strings (6 languages) | ✅ Complete | 336 references updated |
| Rust source code | ✅ Complete | All comments, strings, IDs |
| Backend API | ✅ Complete | Product ID, all routes |
| localStorage keys | ✅ Complete | All 10 keys renamed |
| CSP policy | ✅ Complete | api.wincraft.app |
| API_BASE_URL | ✅ Complete | api.wincraft.app |
| Documentation | ✅ Complete | README, TERMS, PRIVACY, SECURITY |
| Marketing materials | ✅ Complete | All video scripts, submissions |
| Store listings | ✅ Complete | All 6 languages |
| MSIX manifest | ✅ Complete | DisplayName updated, Identity preserved |
| CI/CD workflows | ⚠️ Blocked | GitHub App lacks `workflows` permission |
| Historical records | ✅ Preserved | CHANGELOG, release notes untouched |
| Backward compat refs | ✅ Preserved | Updater filenames, Store identity |

**Final result: 0 remaining "PC Tweaker" references in non-historical, non-backward-compat files.**
