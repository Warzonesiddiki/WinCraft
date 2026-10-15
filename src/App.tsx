import { createAccountRefresh } from "./account-refresh";
import { tweaksForSection } from "./tweak-list-model";
import { TweakyDriverPromoCard } from "./components/tweaky-driver-promo";
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";
import { Lang, detectInitialLang, format, loadStrings, localeOf, stringsFor } from "./i18n";
import { ThemeName, detectInitialTheme } from "./theme";
import {
  API_BASE_URL,
  FEATURE_INTELLIGENCE,
  RAM_AUTO_STORAGE_KEY,
  adoptLegacyAvatar,
  clearSession,
  discardLegacyAvatar,
  formatBytes,
  friendlyError,
  readStoredEmail,
  readToken,
  reportError,
  storeSession,
  storedRamAutoMinutes,
  textFor,
} from "./lib";
import { requestAccountDeletion } from "./account-deletion";
import { AuthState, CleanupInfo, CleanupResult, Section, Toast, TweakInfo } from "./types";
import {
  GemIcon,
  HistoryIcon,
  LayersIcon,
  MagnifierIcon,
  RadarIcon,
  RocketIcon,
  UndoIcon,
  HeartPulseIcon,
  ThermometerIcon,
} from "./components/icons";
import { UpdateBanner } from "./components/ui";
import { AccountMenu } from "./components/account";
import { TweakRow } from "./components/tweak-row";
import { CATEGORY_STYLE } from "./categories";
import { ScanPanel } from "./components/scan";
import { PageBoundary } from "./components/page-boundary";
import { RamCleaner, SystemMonitor, useScheduledRamClean } from "./components/monitor";
import { usePulseSamples } from "./components/command";
import { TitleBar } from "./components/titlebar";
import { CommandPalette, useCommandPaletteShortcut } from "./components/command-palette";
import { OnboardingFlow, shouldShowOnboarding } from "./components/onboarding";
import { WorkspaceSidebar } from "./components/workspace-sidebar";
import { CONFIGURABLE_TWEAK_IDS, isCurrentCatalogTweak } from "./catalog";
// Every panel except the scan view is loaded when its section is opened, so the
// window paints from an entry chunk that carries the shell and Scan instead of
// all of them. Tauri serves the extra chunks from the app's own bundle, which
// makes this a local file read; a chunk that ever fails to load is caught by
// the PageBoundary the panel sits in, which offers a retry.
const Dashboard = lazy(() =>
  import("./components/dashboard").then((m) => ({ default: m.Dashboard })),
);
const BrowserCleanupCard = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.BrowserCleanupCard })),
);
const CleanupCard = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.CleanupCard })),
);
const ScheduledCleanupCard = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.ScheduledCleanupCard })),
);
const CleanupConfirmModal = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.CleanupConfirmModal })),
);
const DiskToolsSection = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.DiskToolsSection })),
);
const DnsFlushCard = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.DnsFlushCard })),
);
const DuplicateFinder = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.DuplicateFinder })),
);
const IpMaskCard = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.IpMaskCard })),
);
const LargeFileFinder = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.LargeFileFinder })),
);
const PasswordBreachCheck = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.PasswordBreachCheck })),
);
const RedaxaPromoCard = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.RedaxaPromoCard })),
);
const UninstallerPromoCard = lazy(() =>
  import("./components/maintenance").then((m) => ({ default: m.UninstallerPromoCard })),
);
const HardwarePanel = lazy(() =>
  import("./components/hardware").then((m) => ({ default: m.HardwarePanel })),
);
const HealthPanel = lazy(() =>
  import("./components/health").then((m) => ({ default: m.HealthPanel })),
);
const LiveDashboard = lazy(() =>
  import("./components/live-dashboard").then((m) => ({ default: m.LiveDashboard })),
);
const BeforeAfterPanel = lazy(() =>
  import("./components/before-after").then((m) => ({ default: m.BeforeAfterPanel })),
);
const SystemRepairCard = lazy(() =>
  import("./components/repair").then((m) => ({ default: m.SystemRepairCard })),
);
const AppCacheCard = lazy(() =>
  import("./components/cleaners").then((m) => ({ default: m.AppCacheCard })),
);
const CookieCleanerCard = lazy(() =>
  import("./components/cleaners").then((m) => ({ default: m.CookieCleanerCard })),
);
const CrashReportsCard = lazy(() =>
  import("./components/intelligence").then((m) => ({ default: m.CrashReportsCard })),
);
const DriftWatchToggle = lazy(() =>
  import("./components/intelligence").then((m) => ({ default: m.DriftWatchToggle })),
);
const UpdateDriftCard = lazy(() =>
  import("./components/intelligence").then((m) => ({ default: m.UpdateDriftCard })),
);
const ChangeHistory = lazy(() =>
  import("./components/change-history").then((m) => ({ default: m.ChangeHistory })),
);
const ScheduledTaskManager = lazy(() =>
  import("./components/startup").then((m) => ({ default: m.ScheduledTaskManager })),
);
const StartupManager = lazy(() =>
  import("./components/startup").then((m) => ({ default: m.StartupManager })),
);
const ProfilesPanel = lazy(() =>
  import("./components/profiles").then((m) => ({ default: m.ProfilesPanel })),
);
const PricingPanel = lazy(() =>
  import("./components/pricing").then((m) => ({ default: m.PricingPanel })),
);
const GamingHudCard = lazy(() =>
  import("./components/pro").then((m) => ({ default: m.GamingHudCard })),
);
const ZeroTraceCard = lazy(() =>
  import("./components/pro").then((m) => ({ default: m.ZeroTraceCard })),
);
const GameSessionsPanel = lazy(() =>
  import("./components/gaming").then((m) => ({ default: m.GameSessionsPanel })),
);
const TurboBoostPanel = lazy(() =>
  import("./components/gaming").then((m) => ({ default: m.TurboBoostPanel })),
);
const X3dPanel = lazy(() => import("./components/x3d").then((m) => ({ default: m.X3dPanel })));
const NetworkCheckPanel = lazy(() =>
  import("./components/diagnostics").then((m) => ({ default: m.NetworkCheckPanel })),
);
const DebloatPanel = lazy(() =>
  import("./components/debloat").then((m) => ({ default: m.DebloatPanel })),
);

/** Stands in for a panel while its chunk loads: the shape of a panel rather
 *  than a spinner, so the page does not jump when the real one arrives. It is
 *  decorative - the wait is not actionable and is normally a frame or two. */
function PanelSkeleton() {
  return (
    <div
      className="tool-panel tool-card animate-card rounded-2xl border border-line bg-surface-1 p-5"
      aria-hidden="true"
    >
      <div className="skeleton h-5 w-56" />
      <div className="skeleton mt-4 h-4 w-full" />
      <div className="skeleton mt-2 h-4 w-4/5" />
      <div className="skeleton mt-6 h-40 w-full" />
    </div>
  );
}

import "./App.css";
import "./desktop-refresh.css";

function App() {
  // Dev builds only: VITE_START_LANG opens in a chosen language for review,
  // the way VITE_START_SECTION opens a chosen page.
  const [lang, setLangState] = useState<Lang>(
    () => (import.meta.env.DEV && (import.meta.env.VITE_START_LANG as Lang)) || detectInitialLang(),
  );
  // The words for the chosen language. `main.tsx` has already fetched the saved
  // one, so the first paint is in the right language; picking another fetches
  // its table and re-renders when it arrives.
  const [s, setS] = useState(() => stringsFor(lang));
  useEffect(() => {
    let live = true;
    void loadStrings(lang).then((table) => {
      if (live) setS(table);
    });
    return () => {
      live = false;
    };
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("wincraft-lang", l);
  }

  const [theme, setThemeState] = useState<ThemeName>(() => detectInitialTheme());

  function setTheme(t: ThemeName) {
    setThemeState(t);
    localStorage.setItem("wincraft-theme", t);
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Dates and numbers follow the app's language, not the Windows display
  // language: an English UI on an Italian PC must not print "27/9/2026".
  useEffect(() => {
    // European Portuguese only (owner decision, 11 Oct 2026): dates and
    // numbers use the pt-PT conventions, not the Brazilian ones.
    document.documentElement.lang = localeOf(lang) ?? "en";
  }, [lang]);

  const [auth, setAuth] = useState<AuthState>(() => {
    const email = readStoredEmail();
    const token = readToken();
    // emailVerified starts false and is corrected by refreshAccount() below as
    // soon as it resolves — avoids briefly trusting a stale/forged local value.
    return email && token
      ? {
          status: "authenticated",
          email,
          emailVerified: false,
          plan: null,
          hasBilling: false,
        }
      : { status: "anonymous" };
  });

  // WinCraft is free for everyone — every feature is unlocked regardless of
  // account or subscription state. The account payload still carries an `isPro`
  // flag, because the backend serves other products from the same tables, and
  // the app no longer keeps it: there is no paid feature left for it to
  // describe.

  // Re-reads the account from the backend. Called on mount (if already logged
  // in), right after login/register, and when the window regains focus.
  // Account status is still useful for profiles, support, and preferences
  // even though Pro gating is gone.
  const [accountRefresh] = useState(createAccountRefresh);
  function refreshAccount(force = false) {
    return accountRefresh.refresh(
      setAuth,
      logout,
      () => pushToast("error", s.toasts.accountRefreshFailed),
      force,
    );
  }

  // The server can hold every runtime adjustment to other apps for everyone
  // (off by default). Read at start and hourly; an unreachable server
  // changes nothing, so the last answer stands.
  useEffect(() => {
    async function readHold() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/flags`, {
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return;
        const flags = (await res.json()) as { processGuardHold?: unknown };
        if (typeof flags.processGuardHold === "boolean") {
          await invoke("set_process_guard_hold", { hold: flags.processGuardHold });
        }
      } catch {
        // Offline or unreachable: keep the last known state.
      }
    }
    void readHold();
    const id = window.setInterval(() => void readHold(), 60 * 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    // Mount-time account refresh. Its state updates land after the await, so
    // this is the documented fetch-then-set pattern rather than a cascading
    // render, which the rule cannot see through.
    void refreshAccount();
    // Before this version the profile photo belonged to the computer rather
    // than to an account. Whoever is signed in as the app starts is the one
    // who was using it when the update landed, so the old photo is theirs.
    // Doing this at sign-in instead would hand it to the next account.
    const signedInAs = readStoredEmail();
    if (signedInAs) void adoptLegacyAvatar(signedInAs);
    function onFocus() {
      refreshAccount();
    }
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      accountRefresh.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    authAttempt.current++;
    accountRefresh.cancel();
    clearSession();
    setAuth({ status: "anonymous" });
    // Same reasoning for the photo: a machine-wide leftover from before
    // per-account storage must not survive to be inherited by whoever signs
    // in next. Each account's own photo is untouched and waiting for them.
    void discardLegacyAvatar();
  }

  const authAttempt = useRef(0);

  async function authenticate(
    mode: "login" | "register",
    email: string,
    password: string,
    registerDetails?: { firstName: string; lastName: string; dateOfBirth: string },
    remember = true,
  ) {
    if (!API_BASE_URL) {
      throw new Error(s.auth.backendNotConfigured);
    }
    const attempt = ++authAttempt.current;
    const res = await fetch(`${API_BASE_URL}/api/auth/${mode}`, {
      signal: AbortSignal.timeout(8000),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, ...registerDetails }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}) as { error?: string });
      throw new Error(body.error || `HTTP ${res.status}`);
    }
    const data = (await res.json()) as { token: string; verificationEmailSent?: boolean };
    // "Remember me" decides *where* the session lives, not just whether we
    // prefill an address: sessionStorage is cleared when the app closes, so
    // unticking it genuinely means "don't keep me signed in on this machine"
    // rather than being a cosmetic checkbox.
    if (attempt !== authAttempt.current) return;
    if (typeof data.token !== "string" || !data.token) throw new Error("Invalid session response");
    accountRefresh.cancel();
    storeSession(data.token, email, remember);
    setAuth({
      status: "authenticated",
      email,
      emailVerified: false,
      plan: null,
      hasBilling: false,
    });
    if (mode === "register" && data.verificationEmailSent) {
      pushToast("success", format(s.auth.checkInboxAfterSignup, { email }), 12000);
    }
    await refreshAccount(true);
  }

  async function resendVerification() {
    if (!API_BASE_URL) throw new Error(s.auth.backendNotConfigured);
    const token = readToken();
    if (!token) throw new Error(s.auth.loginRequiredToResend);
    const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
      signal: AbortSignal.timeout(8000),
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}) as { error?: string });
      throw new Error(body.error || `HTTP ${res.status}`);
    }
  }

  async function forgotPassword(email: string) {
    if (!API_BASE_URL) throw new Error(s.auth.backendNotConfigured);
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      signal: AbortSignal.timeout(8000),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}) as { error?: string });
      throw new Error(body.error || `HTTP ${res.status}`);
    }
  }

  /**
   * Deletes the account for good.
   *
   * The order matters: the server has already removed everything by the time
   * this resolves, so the only correct next step is to drop the session this
   * window is holding and show the signed-out state. A failure leaves the
   * session exactly as it was, because nothing was deleted; the section in the
   * account menu turns the refusal into a sentence.
   */
  async function deleteAccount(password: string, confirm: string) {
    if (!API_BASE_URL) throw new Error(s.auth.backendNotConfigured);
    const token = readToken();
    if (!token) throw new Error(s.auth.deleteAccountNeedsLogin);
    await requestAccountDeletion({ apiBase: API_BASE_URL, token, password, confirm });
    logout();
    pushToast("success", s.auth.deleteAccountDone, 12000);
  }

  // A one-off tip. No login required — it isn't tied to an account and
  // unlocks nothing, so there's nothing to gate behind sign-in. The count is
  // sent, but the backend clamps it; this side is convenience, not the limit.
  async function buyCoffee(quantity: number) {
    if (!API_BASE_URL) {
      throw new Error(s.auth.backendNotConfigured);
    }
    const res = await fetch(`${API_BASE_URL}/api/tip`, {
      signal: AbortSignal.timeout(8000),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}) as { error?: string });
      throw new Error(body.error || `HTTP ${res.status}`);
    }
    const data = (await res.json()) as { url: string };
    await openUrl(data.url);
  }

  const CATEGORIES: { key: Section; label: string; icon: React.ReactElement }[] = [
    {
      key: "overview",
      label: s.tabs.overview,
      icon: <HeartPulseIcon className="h-[18px] w-[18px]" />,
    },
    { key: "scan", label: s.tabs.scan, icon: <RadarIcon className="h-[18px] w-[18px]" /> },
    { key: "health", label: s.tabs.health, icon: <HeartPulseIcon className="h-[18px] w-[18px]" /> },
    {
      key: "hardware",
      label: s.tabs.hardware,
      icon: <ThermometerIcon className="h-[18px] w-[18px]" />,
    },
    { key: "performance", label: s.tabs.performance, icon: CATEGORY_STYLE.performance.icon },
    { key: "gaming", label: s.tabs.gaming, icon: CATEGORY_STYLE.gaming.icon },
    { key: "privacy", label: s.tabs.privacy, icon: CATEGORY_STYLE.privacy.icon },
    { key: "startup", label: s.tabs.startup, icon: <RocketIcon className="h-[18px] w-[18px]" /> },
    { key: "debloat", label: "Debloat", icon: <LayersIcon className="h-[18px] w-[18px]" /> },
    { key: "ui", label: s.tabs.ui, icon: CATEGORY_STYLE.ui.icon },
    { key: "maintenance", label: s.tabs.maintenance, icon: CATEGORY_STYLE.maintenance.icon },
    { key: "profiles", label: s.tabs.profiles, icon: <LayersIcon className="h-[18px] w-[18px]" /> },
    { key: "ledger", label: s.tabs.ledger, icon: <HistoryIcon className="h-[18px] w-[18px]" /> },
    { key: "pricing", label: s.tabs.pricing, icon: <GemIcon className="h-[18px] w-[18px]" /> },
  ];

  const [tweaks, setTweaks] = useState<TweakInfo[]>([]);
  const [cleanupTargets, setCleanupTargets] = useState<CleanupInfo[]>([]);
  // Dev builds only: VITE_START_SECTION opens a chosen page for review.
  const [filter, setFilterState] = useState<Section>(
    () => (import.meta.env.DEV && (import.meta.env.VITE_START_SECTION as Section)) || "scan",
  );
  const scanApplying = useRef(false);
  const [query, setQuery] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * Picking a section always clears an active search.
   *
   * While `searching` is true every section panel is suppressed (see the
   * `&& !searching` guards below) and the list shows matches from every
   * section instead. That meant clicking a sidebar entry with text still in
   * the search box changed nothing on screen — the app looked frozen rather
   * than filtered. Navigating is an explicit "show me this section", so it
   * wins over a leftover query.
   */
  const setFilter = useCallback((section: Section) => {
    if (scanApplying.current) return;
    setFilterState(section);
    setQuery("");
    contentRef.current?.scrollTo({ top: 0 });
  }, []);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  /** Id of the tweak whose exact registry write is currently disclosed. */
  const [inspecting, setInspecting] = useState<string | null>(null);
  const [confirmCleanup, setConfirmCleanup] = useState<CleanupInfo | null>(null);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [consentTweak, setConsentTweak] = useState<TweakInfo | null>(null);
  const [restoring, setRestoring] = useState(false);
  // Owned here rather than inside RamCleaner so the schedule keeps running
  // when the user navigates away from the Scan screen.
  const [ramAutoMinutes, setRamAutoMinutes] = useState<number>(storedRamAutoMinutes);
  // Command Center bridge: the Pulse asks for scans and mirrors the panel.
  const pulseSamples = usePulseSamples();
  const toastSeq = useRef(0);

  const autoClean = useScheduledRamClean(ramAutoMinutes);

  // Command palette (Ctrl+K)
  const [paletteOpen, closePalette, openPalette] = useCommandPaletteShortcut();

  // Onboarding: shown once on first launch
  const [showOnboarding, setShowOnboarding] = useState(() => shouldShowOnboarding());

  function chooseRamAuto(minutes: number) {
    setRamAutoMinutes(minutes);
    localStorage.setItem(RAM_AUTO_STORAGE_KEY, String(minutes));
  }

  async function refresh() {
    const [list, cleanup] = await Promise.all([
      invoke<TweakInfo[]>("list_tweaks"),
      invoke<CleanupInfo[]>("list_cleanup_targets"),
    ]);
    setTweaks(list);
    setCleanupTargets(cleanup);
  }

  useEffect(() => {
    // Mount-time load; every setState in refresh() lands after its await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((e) => pushToast("error", String(e)));
  }, []);

  function pushToast(kind: Toast["kind"], message: string, ms = 4000) {
    // Every user-visible error funnels through here, which makes it the one
    // honest hook for opt-in error reporting: what gets reported is exactly
    // what the user saw, never more.
    if (kind === "error") reportError(message);
    const id = ++toastSeq.current;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, ms);
  }

  async function toggle(tweak: TweakInfo) {
    if (!tweak.applied && tweak.consentRequired) {
      setConsentTweak(tweak);
      return;
    }
    await performToggle(tweak);
  }

  async function performToggle(tweak: TweakInfo) {
    const text = textFor(s.tweaks, tweak.id, tweak.name, tweak.description);
    setBusyId(tweak.id);
    try {
      if (tweak.applied) {
        await invoke("rollback_tweak", { id: tweak.id });
        pushToast("success", format(s.toasts.rolledBack, { name: text.name }));
      } else {
        await invoke("apply_tweak", { id: tweak.id });
        pushToast("success", format(s.toasts.applied, { name: text.name }));
      }
      await refresh();
    } catch (e) {
      // Nothing here gates a tweak any more, so a refusal is the machine's
      // own: an administrator prompt declined, a key this PC locks down, a
      // value Windows writes back. `friendlyError` maps the markers Rust
      // sends onto the sentence that explains the fix.
      pushToast("error", friendlyError(e, s));
    } finally {
      setBusyId(null);
    }
  }

  /**
   * Turns off every applied tweak in one action. Goes through the batched
   * `rollback_tweaks` command so the whole restore costs a single UAC prompt
   * instead of one per admin-level tweak, and reports per-tweak failures
   * rather than stopping at the first one.
   */
  async function restoreAll() {
    const appliedIds = tweaks
      .filter((t) => t.applied && !CONFIGURABLE_TWEAK_IDS.has(t.id))
      .map((t) => t.id);
    setConfirmRestore(false);
    if (appliedIds.length === 0) {
      pushToast("error", s.restore.nothingToast);
      return;
    }
    setRestoring(true);
    try {
      const failures = await invoke<string[]>("rollback_tweaks", { ids: appliedIds });
      failures.forEach((f) => pushToast("error", friendlyError(f, s)));
      await refresh();
      // From what is still in effect, not from the failure list: a cancelled
      // administrator prompt is one failure for every elevated tweak.
      const after = await invoke<TweakInfo[]>("list_tweaks");
      const restored = appliedIds.filter(
        (id) => !after.some((t) => t.id === id && t.applied),
      ).length;
      if (restored > 0) pushToast("success", format(s.restore.doneToast, { count: restored }));
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setRestoring(false);
    }
  }

  async function runCleanup(info: CleanupInfo) {
    setBusyId(info.id);
    setConfirmCleanup(null);
    try {
      const result = await invoke<CleanupResult>("run_cleanup", { id: info.id });
      const base = format(s.cleanupResultToast, {
        deleted: result.deleted_count,
        freed: formatBytes(result.freed_bytes),
      });
      const suffix =
        result.skipped_count > 0
          ? format(s.cleanupResultToastSkipped, { skipped: result.skipped_count })
          : ".";
      pushToast("success", base + suffix);
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setBusyId(null);
    }
  }

  /** Cleans only the preview items the user left ticked. Same result/toast
   *  shape as the full cleanup — from the user's side it's the same action,
   *  just scoped. */
  async function runCleanupSelected(info: CleanupInfo, names: string[]) {
    setBusyId(info.id);
    setConfirmCleanup(null);
    try {
      const result = await invoke<CleanupResult>("run_cleanup_selected", {
        id: info.id,
        names,
      });
      const base = format(s.cleanupResultToast, {
        deleted: result.deleted_count,
        freed: formatBytes(result.freed_bytes),
      });
      const suffix =
        result.skipped_count > 0
          ? format(s.cleanupResultToastSkipped, { skipped: result.skipped_count })
          : ".";
      pushToast("success", base + suffix);
    } catch (e) {
      pushToast("error", String(e));
    } finally {
      setBusyId(null);
    }
  }

  const searching = query.trim().length > 0;

  const visibleTweaks = useMemo(
    () => tweaksForSection(tweaks, filter, query, s),
    [tweaks, filter, query, s],
  );

  const showCleanup = filter === "maintenance" && !searching;
  const showPrivacyExtras = filter === "privacy" && !searching;
  const showGamingExtras = filter === "gaming" && !searching;
  const showOverview = filter === "overview" && !searching;
  const showScan = filter === "scan" && !searching;
  const showHealth = filter === "health" && !searching;
  const showHardware = filter === "hardware" && !searching;
  const showStartup = filter === "startup" && !searching;
  const showPricing = filter === "pricing" && !searching;
  const showProfiles = filter === "profiles" && !searching;
  const showLedger = FEATURE_INTELLIGENCE && filter === "ledger" && !searching;
  const turboBoostApplied = tweaks.find((t) => t.id === "turbo_boost")?.applied ?? false;
  const catalogTweaks = tweaks.filter((t) => isCurrentCatalogTweak(t.id));
  const appliedCount = catalogTweaks.filter(
    (t) => t.applied && !CONFIGURABLE_TWEAK_IDS.has(t.id),
  ).length;
  const restorableCount = tweaks.filter(
    (t) => t.applied && !CONFIGURABLE_TWEAK_IDS.has(t.id),
  ).length;
  const currentLabel = CATEGORIES.find((c) => c.key === filter)?.label ?? "";

  // The title bar shows the machine as it is right now, from the same samples
  // the monitor draws. Before the first sample lands both are null, and the
  // bar leaves the meters out rather than drawing a 0% that would read as an
  // idle machine.
  const latestPulse = pulseSamples.length > 0 ? pulseSamples[pulseSamples.length - 1] : null;
  const ramPct =
    latestPulse && latestPulse.ramTotal > 0
      ? (latestPulse.ramUsed / latestPulse.ramTotal) * 100
      : null;

  return (
    <div className="desktop-refresh bg-app text-ink flex h-screen flex-col overflow-hidden [font-family:var(--font-app)]">
      {/* The window is frameless, so the app draws its own chrome. */}
      <TitleBar
        s={s}
        appliedCount={appliedCount}
        totalCount={catalogTweaks.length}
        cpuPct={latestPulse ? latestPulse.cpu : null}
        ramPct={ramPct}
      />

      <main className="flex min-h-0 flex-1">
        {/* Control Room shell: an opaque raised band for navigation, separated
          from the content floor by a hairline — depth from luminance and
          borders, never blur or shadows. */}
        <WorkspaceSidebar
          s={s}
          items={CATEGORIES}
          active={filter}
          showHistory={FEATURE_INTELLIGENCE}
          onNavigate={setFilter}
          onTip={async (quantity) => {
            try {
              await buyCoffee(quantity);
            } catch (e) {
              pushToast("error", String(e instanceof Error ? e.message : e));
            }
          }}
        />

        <div
          ref={contentRef}
          className="workspace-content app-field min-w-0 flex-1 overflow-y-auto px-8 py-7"
        >
          <div className={`workspace-page ${showPricing ? "workspace-pricing-page" : ""}`}>
            <header
              className={`workspace-header border-line flex items-start justify-between gap-4 ${filter === "debloat" ? "mb-2" : "mb-6 border-b pb-4"}`}
            >
              {/* The pricing screen leads with its own hero title, so
                the section heading would just be a duplicate above it. */}
              <div className="min-w-0">
                {!showPricing && filter !== "debloat" && (
                  <h1 className="type-page page-title">{currentLabel}</h1>
                )}
                {/* Overview and Startup provide their own counts. */}
                {!showOverview &&
                  !showScan &&
                  !showStartup &&
                  !showPricing &&
                  filter !== "debloat" && (
                    <div className="mt-1 flex items-center gap-3">
                      <p className="text-ink-3 type-data text-[12.5px]">
                        {format(s.appliedCount, {
                          applied: appliedCount,
                          total: catalogTweaks.length,
                        })}
                      </p>
                      {/* Restore supported settings from their saved values. */}
                      {restorableCount > 0 && (
                        <button
                          onClick={() => setConfirmRestore(true)}
                          disabled={restoring}
                          className="flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink-2 transition-colors hover:border-line-2 hover:bg-surface-hover hover:text-white disabled:cursor-wait disabled:opacity-60"
                        >
                          <UndoIcon className="h-3.5 w-3.5" />
                          {restoring ? s.restore.running : s.restore.button}
                        </button>
                      )}
                    </div>
                  )}
              </div>
              {!showPricing && filter !== "debloat" && (
                <div className="relative ml-auto w-56 shrink-0">
                  <MagnifierIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                  <input
                    value={query}
                    onChange={(e) => {
                      if (!scanApplying.current) setQuery(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                    aria-label={s.search.placeholder}
                    placeholder={s.search.placeholder}
                    className="w-full rounded-xl border border-line bg-surface-2 py-2 pl-9 pr-16 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-line-2 focus:bg-surface-hover"
                  />
                  {!searching && (
                    <button
                      onClick={openPalette}
                      className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-line bg-surface-1 px-1.5 py-0.5 text-[9px] font-semibold text-ink-3 transition-colors hover:text-ink"
                      title="Open command palette (Ctrl+K)"
                    >
                      ⌘K
                    </button>
                  )}
                  {searching && (
                    <button
                      onClick={() => setQuery("")}
                      aria-label={s.search.clear}
                      className="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-ink-3 hover:bg-surface-hover hover:text-ink-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              <AccountMenu
                s={s}
                lang={lang}
                setLang={setLang}
                theme={theme}
                setTheme={setTheme}
                auth={auth}
                open={accountMenuOpen}
                onOpenChange={setAccountMenuOpen}
                onAuthenticate={authenticate}
                onLogout={logout}
                onResendVerification={resendVerification}
                onForgotPassword={forgotPassword}
                onDeleteAccount={deleteAccount}
                onViewPlan={() => setFilter("pricing")}
                pushToast={pushToast}
              />
            </header>

            <div hidden={!showScan} className="workspace-view workspace-scan-view">
              <PageBoundary s={s} resetKey="scan">
                <Suspense fallback={<PanelSkeleton />}>
                  <div id="scan-results">
                    <ScanPanel
                      s={s}
                      lang={lang}
                      onFixed={refresh}
                      pushToast={pushToast}
                      onNavigate={setFilter}
                      onBusyChange={(busy) => {
                        scanApplying.current = busy;
                      }}
                    />
                    <TweakyDriverPromoCard s={s} />
                  </div>
                </Suspense>
              </PageBoundary>
            </div>

            <div key={filter} className="workspace-view">
              <PageBoundary s={s} resetKey={filter}>
                <Suspense fallback={<PanelSkeleton />}>
                  {showOverview && (
                    <Dashboard
                      s={s}
                      lang={lang}
                      tweaks={tweaks}
                      samples={pulseSamples}
                      onNavigate={setFilter}
                      onScan={() => setFilter("scan")}
                      onRestoreAll={restoreAll}
                    />
                  )}

                  {showCleanup && (
                    <>
                      <RamCleaner
                        s={s}
                        samples={pulseSamples}
                        autoMinutes={ramAutoMinutes}
                        onChangeAuto={chooseRamAuto}
                        auto={autoClean}
                        pushToast={pushToast}
                      />
                      <ul className="maintenance-drive-tools">
                        <DiskToolsSection s={s} onToast={pushToast} />
                      </ul>
                      <SystemMonitor s={s} />
                    </>
                  )}

                  {showHardware && <HardwarePanel s={s} pushToast={pushToast} />}

                  {showHealth && <LiveDashboard s={s} lang={lang} onNavigate={setFilter} />}
                  {showHealth && (
                    <BeforeAfterPanel s={s} lang={lang} tweaks={tweaks} pushToast={pushToast} />
                  )}
                  {showHealth && <SystemRepairCard s={s} pushToast={pushToast} />}

                  {showHealth && (
                    <HealthPanel
                      title={s.healthPanel.title}
                      subtitle={s.healthPanel.subtitle}
                      refreshLabel={s.healthPanel.refresh}
                      computeLabel={s.healthPanel.compute}
                      computingLabel={s.healthPanel.computing}
                      idleHint={s.healthPanel.idleHint}
                      showMore={s.healthPanel.showMore}
                      showLess={s.healthPanel.showLess}
                      stages={[
                        s.healthPanel.stageProfile,
                        s.healthPanel.stageTweaks,
                        s.healthPanel.stageSecurity,
                        s.healthPanel.stageScoring,
                      ]}
                      verdicts={{
                        excellent: s.healthPanel.verdictExcellent,
                        good: s.healthPanel.verdictGood,
                        fair: s.healthPanel.verdictFair,
                        needsWork: s.healthPanel.verdictNeedsWork,
                      }}
                      change={{
                        sinceLast: s.healthPanel.changeSinceLast,
                        noChange: s.healthPanel.changeNone,
                        firstRun: s.healthPanel.changeFirstRun,
                        whyTitle: s.healthPanel.changeWhyTitle,
                        contributes: s.healthPanel.changeContributes,
                        structural: s.healthPanel.changeStructural,
                        trend: s.healthPanel.changeTrend,
                      }}
                      categoryLabels={s.healthPanel.categories}
                    />
                  )}

                  {showLedger && (
                    <>
                      {/* Above the ledger: a crash is the one thing on this screen
                  that needs acting on, and it renders nothing at all when
                  there are no reports. */}
                      {/* Above the crash card: a reverted tweak is something the
                  user can act on right now, and it renders nothing when
                  nothing drifted. */}
                      <DriftWatchToggle s={s} pushToast={pushToast} />
                      <UpdateDriftCard
                        s={s}
                        tweaks={tweaks}
                        onChanged={refresh}
                        pushToast={pushToast}
                      />
                      <CrashReportsCard s={s} pushToast={pushToast} />
                      <ChangeHistory
                        s={s}
                        lang={lang}
                        tweaks={tweaks}
                        onChanged={refresh}
                        pushToast={pushToast}
                      />
                    </>
                  )}

                  {showStartup && <StartupManager s={s} pushToast={pushToast} />}

                  {/* Keep operation state alive when navigating during a removal. */}
                  <div hidden={filter !== "debloat" || searching}>
                    <DebloatPanel
                      lang={lang}
                      active={filter === "debloat" && !searching}
                      onNavigate={setFilter}
                    />
                  </div>

                  {showStartup && <ScheduledTaskManager s={s} pushToast={pushToast} />}

                  {showProfiles && (
                    <ProfilesPanel
                      s={s}
                      lang={lang}
                      tweaks={tweaks}
                      authed={auth.status === "authenticated"}
                      onRequireAuth={() => {
                        pushToast("error", s.profiles.signInRequired);
                        setAccountMenuOpen(true);
                      }}
                      onChanged={refresh}
                      pushToast={pushToast}
                    />
                  )}

                  {showPricing && <PricingPanel s={s} />}

                  {showPrivacyExtras && (
                    <>
                      <ZeroTraceCard s={s} pushToast={pushToast} />
                      <PasswordBreachCheck s={s} />
                      <RedaxaPromoCard s={s} />
                    </>
                  )}

                  {showGamingExtras && (
                    <>
                      <TurboBoostPanel
                        s={s}
                        applied={turboBoostApplied}
                        onChanged={refresh}
                        pushToast={pushToast}
                      />
                      <GameSessionsPanel s={s} />
                    </>
                  )}

                  {/* On the UI screen: it is a panel the user places, sizes and
              locks, which is the kind of thing that screen is for. Above the
              tweak list, like every other screen's headline card — below
              forty-odd rows nobody scrolled far enough to find it. */}
                  {filter === "ui" && !searching && <GamingHudCard s={s} pushToast={pushToast} />}

                  <ul className="flex flex-col gap-3">
                    {visibleTweaks.map((t, i) => (
                      <TweakRow
                        key={t.id}
                        tweak={t}
                        index={i}
                        priority={
                          !searching && (filter === "performance" || filter === "gaming") && i < 3
                        }
                        open={inspecting === t.id}
                        busy={busyId === t.id}
                        lang={lang}
                        s={s}
                        onToggle={toggle}
                        onInspect={() => {
                          setInspecting(inspecting === t.id ? null : t.id);
                        }}
                        onChanged={refresh}
                      />
                    ))}

                    {showGamingExtras && (
                      <li>
                        <X3dPanel s={s} pushToast={pushToast} />
                        <NetworkCheckPanel s={s} tweaks={tweaks} />
                      </li>
                    )}

                    {showPrivacyExtras && (
                      <IpMaskCard
                        s={s}
                        onExplain={() => pushToast("error", s.ipMask.explainerToast)}
                      />
                    )}

                    {showCleanup &&
                      cleanupTargets.map((c) => (
                        <CleanupCard
                          key={c.id}
                          s={s}
                          info={c}
                          text={textFor(s.cleanup, c.id, c.name, c.description)}
                          busy={busyId === c.id}
                          onRun={(info) => setConfirmCleanup(info)}
                        />
                      ))}

                    {showCleanup && <ScheduledCleanupCard s={s} onToast={pushToast} />}

                    {showCleanup && <DnsFlushCard s={s} onToast={pushToast} />}

                    {showCleanup && <BrowserCleanupCard s={s} onToast={pushToast} />}

                    {/* Directly under the browser cleaner it supersedes for cookies:
                that card wipes the whole cookie file and signs the user out of
                everything, which is why most people click it once. This one is
                the version they can use every week. */}
                    {showCleanup && <CookieCleanerCard s={s} onToast={pushToast} />}

                    {showCleanup && <AppCacheCard s={s} onToast={pushToast} />}

                    {showCleanup && <DuplicateFinder s={s} onToast={pushToast} />}

                    {showCleanup && <LargeFileFinder s={s} onToast={pushToast} />}

                    {showCleanup && <UninstallerPromoCard s={s} />}

                    {/* "No tweaks in this category" only makes sense on a screen that
                IS a tweak category. It was an opt-out list of every other
                section, which meant each new screen had to remember to add
                itself — PC Health never did, and has been telling people it
                had no tweaks coming soon ever since. Asking whether the
                current filter is a real category cannot drift that way. */}
                    {visibleTweaks.length === 0 &&
                      (searching || Object.prototype.hasOwnProperty.call(CATEGORY_STYLE, filter)) &&
                      !showCleanup &&
                      !showPrivacyExtras &&
                      !showScan &&
                      !showStartup &&
                      !showPricing && (
                        <li className="animate-card rounded-2xl border border-dashed border-line p-10 text-center text-sm text-ink-3">
                          {searching
                            ? format(s.search.noResults, { query: query.trim() })
                            : s.emptyCategory}
                        </li>
                      )}
                  </ul>

                  {/* Only where a change can be applied: on Scan, Overview, Profiles,
              Hardware, Startup and Plans the same sentence was noise. */}
                  {(Object.prototype.hasOwnProperty.call(CATEGORY_STYLE, filter) ||
                    showCleanup ||
                    showHealth) && (
                    <p className="mx-auto mt-8 max-w-lg text-center text-xs leading-relaxed text-ink-3">
                      {s.headerNote}
                    </p>
                  )}
                </Suspense>
              </PageBoundary>
            </div>
          </div>
        </div>
      </main>

      <Suspense fallback={null}>
        {confirmCleanup && (
          <CleanupConfirmModal
            s={s}
            info={confirmCleanup}
            displayName={
              textFor(s.cleanup, confirmCleanup.id, confirmCleanup.name, confirmCleanup.description)
                .name
            }
            onCancel={() => setConfirmCleanup(null)}
            onConfirmAll={() => runCleanup(confirmCleanup)}
            onConfirmSelected={(names) => runCleanupSelected(confirmCleanup, names)}
          />
        )}
      </Suspense>

      {confirmRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-6 backdrop-blur-sm">
          <div className="animate-card w-full max-w-sm rounded-2xl border border-line bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-ink">{s.restore.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-3">
              {format(s.restore.body, { count: restorableCount })}
            </p>
            <button
              onClick={restoreAll}
              className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-400"
            >
              {s.restore.confirm}
            </button>
            <button
              onClick={() => setConfirmRestore(false)}
              className="mt-2 w-full rounded-xl py-2 text-sm font-medium text-ink-3 hover:text-ink-2"
            >
              {s.restore.cancel}
            </button>
          </div>
        </div>
      )}

      {consentTweak && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-6 backdrop-blur-sm">
          <div className="animate-card w-full max-w-md rounded-2xl border border-line bg-surface-1 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-ink">
              {textFor(s.tweaks, consentTweak.id, consentTweak.name, consentTweak.description).name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-3">
              This action requires explicit acknowledgement. It modifies system-level behavior and
              may require reinstallation or manual configuration to restore.
            </p>
            {consentTweak.risk && (
              <p className="mt-3 text-xs leading-relaxed text-warn">⚠️ {consentTweak.risk}</p>
            )}
            <div className="mt-5 flex gap-2">
              <button
                onClick={async () => {
                  const target = consentTweak;
                  setConsentTweak(null);
                  try {
                    await invoke("record_barebone_consent", {
                      id: target.id,
                      text: "Acknowledged",
                    });
                  } catch {
                    // Non-fatal if backend has no consent table for this specific tweak
                  }
                  await performToggle(target);
                }}
                className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-surface-1 transition-colors hover:bg-accent/90"
              >
                Acknowledge &amp; Apply
              </button>
              <button
                onClick={() => setConsentTweak(null)}
                className="w-full rounded-xl py-2.5 text-sm font-medium text-ink-3 hover:text-ink-2"
              >
                {s.restore.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {paletteOpen && (
        <CommandPalette
          s={s}
          tweaks={tweaks}
          onClose={closePalette}
          onNavigate={(section) => {
            setFilter(section);
          }}
          onToggleTweak={(tweak) => toggle(tweak)}
          onScan={() => setFilter("scan")}
          onRestoreAll={restoreAll}
          onOpenProfiles={() => setFilter("profiles")}
        />
      )}

      {showOnboarding && (
        <OnboardingFlow
          s={s}
          tweaks={tweaks}
          onComplete={() => {
            setShowOnboarding(false);
            setFilter("scan");
          }}
          onSkip={() => setShowOnboarding(false)}
        />
      )}

      <UpdateBanner s={s} onToast={pushToast} />

      <div className="pointer-events-none fixed bottom-6 right-6 flex flex-col gap-2">
        {toasts.map((t) => (
          // Calm feedback: an opaque surface with a status-colored icon and
          // hairline. Status is carried by icon shape AND color, never color
          // alone.
          <div
            key={t.id}
            className={`animate-toast bg-surface-2 border-line-2 text-ink pointer-events-auto flex items-center gap-2.5 rounded-[10px] border px-4 py-3 text-[13px] font-medium ${
              t.kind === "success" ? "[&>svg]:text-ok" : "[&>svg]:text-danger"
            }`}
          >
            {t.kind === "success" ? (
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
                <path
                  d="m5 13 4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
                <path
                  d="M12 9v4m0 4h.01M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
