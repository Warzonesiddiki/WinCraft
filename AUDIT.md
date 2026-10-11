# PC Tweaker — Comprehensive Audit & Improvement Report

## Executive Summary

PC Tweaker is a well-engineered ~44,000-line Tauri application (Rust + React/TypeScript) with strong architectural decisions. The codebase has excellent documentation, careful error handling, and a well-designed rollback system. This audit identified **7 bugs**, **5 security concerns**, **4 performance issues**, and **8 architectural improvements** — categorized by severity.

---

## 🔴 Bugs Found (7)

### BUG-1: `PRO_REQUIRED` toast still fires on stale cache (FIXED)
**Location:** `src/App.tsx` toggle() error handler  
**Issue:** The error path checking `message.startsWith("PRO_REQUIRED: ")` would show a misleading "license needs refresh" toast. With `require_pro()` always succeeding, this path is unreachable, but the dead code was confusing.  
**Status:** Cleaned up in dead-code removal commit.

### BUG-2: `refreshAccount()` triggers `startCheckout()` for pending plans (FIXED)  
**Location:** `src/App.tsx` lines 201-213  
**Issue:** On every window focus, `refreshAccount()` would check for a `pendingPlan` and auto-trigger Stripe checkout. This was dead code after making the app free, but if a user had a stale `pendingPlan` ref, it would attempt to open a checkout URL.  
**Status:** Removed in dead-code cleanup commit.

### BUG-3: `paywallFeature` state set by unreachable callbacks (FIXED)
**Location:** `src/App.tsx` — 16 call sites  
**Issue:** `setPaywallFeature()` was called from `onRequirePro` callbacks throughout the JSX. While unreachable (since `isPro` is always `true`), the state variable and `PaywallModal` render were dead weight that increased bundle size.  
**Status:** Removed all dead paywall state and modal in cleanup commit.

### BUG-4: `recommendedTweaks()` still filters by `isPro` (FIXED)
**Location:** `src/scan-runner.ts` line 245  
**Issue:** The scan "Fix All" feature still filtered tweaks by `(isPro || !t.requires_pro)`. While functionally correct (both conditions are now always `true`), the logic was misleading and would confuse anyone reading the code.  
**Status:** Simplified to remove the Pro filter.

### BUG-5: `freeTweakCount` calculation is redundant
**Location:** `src/App.tsx` line 709  
**Issue:** `freeTweakCount` counts tweaks where `!t.requires_pro`, which now equals the total catalog count. The variable is still passed to `PricingPanel` (which ignores it). Harmless but misleading.  
**Severity:** Low — no user impact.

### BUG-6: `lifetimeOwned` evaluation still checks `auth.plan === "lifetime"`
**Location:** `src/App.tsx` line 993  
**Issue:** The `ProfilesPanel` receives `lifetimeOwned={isProUnlocked && auth.status === "authenticated" && auth.plan === "lifetime"}`. For users who never purchased a lifetime plan, this is `false`, gating profile export/report features behind a concept that no longer exists.  
**Severity:** Medium — lifetime-only profile features are effectively hidden from most users.  
**Fix:** Should always be `true` or the lifetime distinction should be removed.

### BUG-7: `refreshLicense()` makes unnecessary network requests
**Location:** `src/App.tsx` lines 232-246  
**Issue:** On every `refreshAccount()` call (mount + every window focus), `refreshLicense()` fetches a signed license from the backend. Since `require_pro()` always succeeds, the license store is never read for access control. This wastes bandwidth and adds latency.  
**Severity:** Low — no user impact, just unnecessary network traffic.

---

## 🟡 Security Concerns (5)

### SEC-1: `dangerouslySetInnerHTML` for Halloween decorations
**Location:** `src/components/halloween-offer.tsx` (4 instances)  
**Risk:** Low — the HTML strings are hardcoded SVG constants from `src/halloween-decor.ts`, not user input. No XSS vector.  
**Recommendation:** Add a comment noting these are safe hardcoded SVGs, or use a build-time SVG import.

### SEC-2: Session tokens in localStorage/sessionStorage
**Location:** `src/lib.ts` `storeSession()`  
**Risk:** Low for a desktop app — tokens are stored locally on the user's machine, not transmitted to third parties. The `sessionStorage` option for "don't remember me" is correct.  
**Recommendation:** Acceptable for a Tauri desktop app. If the WebView2 ever gets compromised, the token is exposed, but that's a platform-level risk.

### SEC-3: Backend CORS allows specific origins
**Location:** `backend/src/index.ts`  
**Risk:** Low — the backend uses an explicit allowlist rather than `*`. This is correct.  
**Recommendation:** No action needed.

### SEC-4: Error reports send messages to backend
**Location:** `src/lib.ts` `reportError()`  
**Risk:** Low — messages are truncated to 500 chars, opt-in via localStorage toggle, and contain no PII. The backend endpoint is rate-limited.  
**Recommendation:** Good implementation. Consider adding a hash-based dedup to reduce noise.

### SEC-5: `unsafe` blocks in Rust FFI code
**Location:** `src-tauri/src/dns.rs`, `ecoqos.rs`, `cpuclock.rs`, `debloat.rs`, `baseline.rs`  
**Risk:** Moderate — these are Windows API FFI calls that are inherently unsafe. The code handles handles correctly and checks return values.  
**Recommendation:** Add `// SAFETY:` comments to each `unsafe` block explaining the invariants being upheld. This is Rust best practice and helps reviewers.

---

## 🟢 Performance Issues (4)

### PERF-1: `refreshAccount()` on every window focus
**Location:** `src/App.tsx` useEffect line 280-290  
**Issue:** Every time the window gains focus, a network request hits `/api/account`. For users who alt-tab frequently, this creates unnecessary server load.  
**Impact:** Network latency on focus, server load.  
**Fix:** Debounce to at most once per 5 minutes, or only refresh on explicit user action.

### PERF-2: Driver audit cache is localStorage-only
**Location:** `src/lib.ts` `readCachedDriverAudit()` / `writeCachedDriverAudit()`  
**Issue:** The driver audit takes ~16 seconds (per code comments). The cache survives in localStorage but is lost on storage eviction. The Rust side could persist it to the app data directory for durability.  
**Impact:** Users may re-scan drivers unnecessarily after storage pressure.

### PERF-3: 13 `setInterval` timers across components
**Location:** Multiple components (monitor, hardware, health, gaming, command, repair, advanced-controls)  
**Issue:** Each component creates its own polling interval. Some run at 1-second intervals. When the app is idle on a background tab, these continue firing.  
**Impact:** CPU wake-ups, battery drain on laptops.  
**Fix:** Use `document.visibilitychange` to pause intervals when the app is hidden. Some components already do this (live-dashboard), but not consistently.

### PERF-4: `i18n.ts` is 11,182 lines
**Location:** `src/i18n.ts`  
**Issue:** A single file containing all translations for 6 languages. This increases initial parse time and makes the bundle larger than necessary.  
**Impact:** Slower initial load, larger bundle.  
**Fix:** Code-split by language using dynamic imports: `const strings = await import(`./i18n/${lang}.ts`)`. Only the active language needs to be loaded.

---

## 🔵 Architecture Improvements (8)

### ARCH-1: Remove the `requires_pro` field from `TweakInfo`
**Priority:** High  
**Impact:** The field still exists in the Rust struct and is serialized to the frontend, where it's always `false`. Removing it from the struct definition would prevent future confusion and reduce the serialized payload size.  
**Effort:** Medium — requires updating ~40 struct construction sites in `lib.rs`.

### ARCH-2: Extract `App.tsx` into smaller components
**Priority:** Medium  
**Impact:** `App.tsx` is 1,340 lines with 30+ state variables and 15+ event handlers. Extracting the sidebar, content area, and modal system into separate components would improve maintainability.  
**Effort:** Medium — the component already delegates rendering to child components; the state hoisting is the issue.

### ARCH-3: Replace `onRequirePro` prop pattern with a simpler API
**Priority:** Medium  
**Impact:** Every Pro-gated component accepts `isPro` and `onRequirePro` props. Since `isPro` is always `true`, these can be removed entirely, simplifying ~20 component interfaces.  
**Effort:** Low — straightforward prop removal.

### ARCH-4: Consolidate the pricing/checkout backend
**Priority:** Low  
**Impact:** The backend still has Stripe integration, entitlement tracking, checkout recovery, receipt outbox, promo system, and lifetime offer management. Since the app is free, this is ~2,000 lines of dead backend code.  
**Effort:** High — but a clean removal would simplify deployment and reduce infrastructure costs.

### ARCH-5: Add TypeScript strict mode
**Priority:** Medium  
**Impact:** The `tsconfig.json` doesn't enable `strict: true`. Several `as` type assertions and `any` types exist. Strict mode would catch more bugs at compile time.  
**Effort:** Medium — would require fixing existing type errors.

### ARCH-6: Add integration tests for the Rust IPC layer
**Priority:** High  
**Impact:** The Rust code has unit tests for license verification, tweak catalog, and rollback, but no integration tests that exercise the Tauri command handlers end-to-end. The `#[tauri::command]` functions are tested indirectly through the UI.  
**Effort:** Medium — Tauri provides test utilities for this.

### ARCH-7: Replace `eslint-disable` comments with proper fixes
**Priority:** Low  
**Impact:** `App.tsx` and several components have `eslint-disable` comments for React Compiler rules. These are documented as "legacy" but should be addressed.  
**Effort:** Low per instance, moderate in total.

### ARCH-8: Migrate from CSS modules to Tailwind-only styling
**Priority:** Low  
**Impact:** The app mixes Tailwind classes with imported CSS files (App.css, pricing.css, etc.). Consolidating to Tailwind-only would reduce CSS bundle size and improve developer experience.  
**Effort:** High — significant CSS refactoring needed.

---

## ✅ What's Done Well

1. **Excellent documentation** — Every function, module, and design decision has inline comments explaining *why*, not just *what*. This is rare and valuable.

2. **Defensive error handling** — The codebase handles edge cases thoroughly: corrupt cache files, missing directories, network failures, clock skew, and more.

3. **Rollback system** — The registry snapshot and rollback mechanism is well-designed with atomic writes and temp-file-then-rename patterns.

4. **Security-first CSP** — The Tauri config has a restrictive Content Security Policy that only allows connections to known endpoints.

5. **i18n completeness** — Six languages with a proper fallback chain and a lint script to catch missing translations.

6. **Test coverage** — Rust unit tests cover license verification, catalog integrity, tweak entitlements, and cleanup gating. Frontend has Node.js scripts for scan logic, debloat model, and promo calculations.

7. **Accessibility** — Toggles have proper ARIA labels, keyboard navigation is supported, and color is never the sole indicator of state.

---

## 📊 Summary Table

| Category | Count | Severity |
|----------|-------|----------|
| Bugs (Fixed) | 4 | 🔴 Resolved |
| Bugs (Open) | 3 | 🟡 Low-Medium |
| Security Concerns | 5 | 🟢 All Low-Moderate |
| Performance Issues | 4 | 🟡 Low-Medium |
| Architecture Improvements | 8 | 🔵 Various |
| **Total Issues** | **24** | |

---

## 🎯 Recommended Next Steps (Priority Order)

1. **Fix BUG-6** (`lifetimeOwned` gate) — Profile features are unnecessarily hidden
2. **Remove `requires_pro` field** (ARCH-1) — Clean up the data model
3. **Remove `onRequirePro` props** (ARCH-3) — Simplify component APIs
4. **Add `SAFETY:` comments** (SEC-5) — Rust best practice for unsafe blocks
5. **Debounce `refreshAccount()`** (PERF-1) — Reduce unnecessary network traffic
6. **Add Rust integration tests** (ARCH-6) — Improve test coverage
7. **Code-split i18n** (PERF-4) — Reduce initial bundle size
8. **Enable TypeScript strict mode** (ARCH-5) — Catch more bugs at compile time
