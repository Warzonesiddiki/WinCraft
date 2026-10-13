// Shared non-visual helpers: config, session, error reporting, formatting.
import { getVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";
import { format, Strings } from "./i18n";
import { DriverAudit, SystemProfile } from "./types";

// The first-party Cloudflare hostname is the stable production endpoint.
// VITE_API_BASE_URL remains available for an explicit local/staging build.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.wincraft.app";

// ---- Anonymous, opt-in error reporting --------------------------------------
// Off by default; the AccountMenu toggle flips a localStorage flag that is
// read at send time (no state plumbing). What leaves the machine: app name,
// version, and the error message the user already saw — nothing else.
export const ERROR_REPORTS_KEY = "wincraft-error-reports";

export let cachedAppVersion = "";
void getVersion()
  .then((v) => {
    cachedAppVersion = v;
  })
  .catch(() => {
    // Without a version the backend rejects the report; reporting simply
    // stays silent, which is the correct failure mode for telemetry.
  });

export function errorReportsEnabled(): boolean {
  try {
    return localStorage.getItem(ERROR_REPORTS_KEY) === "on";
  } catch {
    return false;
  }
}

export function reportError(message: string) {
  if (!API_BASE_URL || !cachedAppVersion || !errorReportsEnabled()) return;
  fetch(`${API_BASE_URL}/api/error-reports`, {
    signal: AbortSignal.timeout(8000),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app: "wincraft",
      appVersion: cachedAppVersion,
      message: message.slice(0, 500),
    }),
  }).catch(() => {
    // Fire-and-forget by design: a failed report must never surface an error.
  });
}

/** The app's language as a BCP 47 tag for `Intl` and `toLocale*` calls. App
 *  sets it on <html>; every date and number goes through it, never through
 *  the Windows display language. */
export function uiLocale(): string {
  return document.documentElement.lang || "en";
}

/** A number in the app's language, with exactly `digits` decimals. */
export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat(uiLocale(), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatBytes(bytes: number): string {
  // A missing figure is shown as zero rather than "NaN GB": callers pass
  // counters straight from a command result, and one absent field should not
  // put nonsense on screen.
  if (!Number.isFinite(bytes) || bytes <= 0) return `${formatNumber(0)} MB`;
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${formatNumber(mb, 1)} MB`;
  return `${formatNumber(mb / 1024, 2)} GB`;
}

/**
 * Resolves a tweak/cleanup id to its translated name and description, falling
 * back to the English text the Rust side ships with when a locale is missing
 * the id. Module-level so every screen resolves text the same way — the Scan
 * list used to read `tweak.name` directly and so showed English rows inside a
 * translated UI.
 */
export function textFor(
  dict: Record<string, { name: string; description: string }>,
  id: string,
  fallbackName: string,
  fallbackDescription: string,
): { name: string; description: string } {
  return dict[id] ?? { name: fallbackName, description: fallbackDescription };
}

export const LARGE_FILE_THRESHOLD_BYTES = 100 * 1024 * 1024;

/** Gauge geometry: a 260-degree arc opening at the bottom, like a rev counter.
 *  Angles run clockwise from 12 o'clock, so 230 starts at lower left. */
export const GAUGE_START = 230;
export const GAUGE_SWEEP = 260;
export const GAUGE_R = 62;
export const GAUGE_C = 80;

export function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: GAUGE_C + radius * Math.cos(rad), y: GAUGE_C + radius * Math.sin(rad) };
}

export function arcPath(fromFrac: number, toFrac: number, radius: number) {
  const a0 = GAUGE_START + GAUGE_SWEEP * fromFrac;
  const a1 = GAUGE_START + GAUGE_SWEEP * toFrac;
  const p0 = polar(a0, radius);
  const p1 = polar(a1, radius);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${large} 1 ${p1.x} ${p1.y}`;
}

/** "12.4 / 31.1 GB" — one unit shown once, so it fits next to the gauge. */
export function gbPair(used: number, total: number): string {
  const gb = (n: number) => formatNumber(n / 1024 ** 3, 1);
  return `${gb(used)} / ${gb(total)} GB`;
}

/** Green under light load, amber when it starts to matter, red when it hurts. */
export function loadColor(pct: number): string {
  if (pct >= 85) return "#f87171";
  if (pct >= 60) return "#fbbf24";
  return "#34d399";
}

/** Auto-cleanup choices, in minutes. `0` means "off". */
export const RAM_AUTO_INTERVALS = [0, 10, 30, 60, 180, 360, 720, 1440] as const;

export const RAM_AUTO_STORAGE_KEY = "wincraft-ram-auto";

/** Only honor a stored value we actually offer: a hand-edited or stale entry
 *  must not become a rogue interval (or a 0ms one, which would spin the CPU). */
export const TOKEN_KEY = "wincraft-token";

export const EMAIL_KEY = "wincraft-email";

/**
 * The session token, from whichever store it was put in.
 *
 * localStorage survives a restart, sessionStorage does not — which is exactly
 * the difference "remember me" promises. Reading checks both so the rest of
 * the app never has to care which one was used.
 */
export function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function readStoredEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY) ?? sessionStorage.getItem(EMAIL_KEY);
}

export function storeSession(token: string, email: string, remember: boolean) {
  // Clear both first, so switching the choice can never leave a stale token
  // behind in the store that is no longer being written to.
  clearSession();
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
  store.setItem(EMAIL_KEY, email);
}

/** Keeps a session alive: once the current token is a day old, authenticated
 * API calls return a replacement, stored wherever the old one lives. */
export function adoptRenewedToken(
  res: Response,
  expectedToken: string,
  expectedGeneration: number,
) {
  if (readToken() !== expectedToken || sessionGeneration() !== expectedGeneration) return;
  const next = res.headers.get("X-Session-Token");
  if (!next) return;
  if (localStorage.getItem(TOKEN_KEY)) localStorage.setItem(TOKEN_KEY, next);
  else if (sessionStorage.getItem(TOKEN_KEY)) sessionStorage.setItem(TOKEN_KEY, next);
}

let sessionEpoch = 0;
export const sessionGeneration = () => sessionEpoch;

export function clearSession() {
  sessionEpoch++;
  for (const store of [localStorage, sessionStorage]) {
    store.removeItem(TOKEN_KEY);
    store.removeItem(EMAIL_KEY);
  }
}

export function storedRamAutoMinutes(): number {
  const stored = Number(localStorage.getItem(RAM_AUTO_STORAGE_KEY));
  return (RAM_AUTO_INTERVALS as readonly number[]).includes(stored) ? stored : 0;
}

export function ramIntervalLabel(minutes: number, s: Strings): string {
  if (minutes === 0) return s.ram.autoOff;
  const text = minutes < 60 ? `${minutes} min` : `${minutes / 60} h`;
  return format(s.ram.autoEvery, { interval: text });
}

export function formatEpochDate(epochSeconds: string): string {
  const n = Number(epochSeconds);
  if (!Number.isFinite(n) || n <= 0) return "";
  return new Date(n * 1000).toLocaleDateString(uiLocale());
}

/** SHA-1 hex digest via the Web Crypto API already available in the webview. */
export async function sha1Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/**
 * Device-local profile photo. It never leaves this machine: the backend has
 * no avatar endpoint on purpose — a picture of the user is not data a PC
 * tweaker needs to hold.
 *
 * Stored as a file by the Rust side rather than in localStorage, which was
 * losing photos to quota eviction, to this app's own duplicate scanner, and
 * to the MSIX build getting a different storage origin than the .exe build.
 * See src-tauri/src/avatar.rs.
 */
export const AVATAR_KEY = "wincraft-avatar";

/**
 * Reads the signed-in account's photo.
 *
 * Every one of these takes the address because the photo belongs to an
 * account, not to the computer. It used to belong to the computer, which
 * meant signing out and registering a second account showed the new account
 * the previous person's face.
 */
export async function readAvatar(email: string): Promise<string | null> {
  if (!email) return null;
  try {
    const stored = await invoke<string | null>("read_avatar", { email });
    if (stored && stored.startsWith("data:image/")) return stored;
  } catch {
    // An unreadable file degrades to "no photo", which shows the initial.
  }
  return null;
}

export async function writeAvatar(email: string, dataUrl: string): Promise<void> {
  await invoke("save_avatar", { email, dataUrl });
}

export async function removeAvatar(email: string): Promise<void> {
  await invoke("clear_avatar", { email });
}

/**
 * Hands both older machine-wide photos — the file, and the localStorage key
 * before it — to the account signed in at this moment.
 *
 * Called once at startup and never at sign-in. The app is running as whoever
 * was using it when the update landed, so that account is the owner. Doing it
 * at sign-in would hand the photo to whoever signs in next, which is the leak
 * being closed.
 *
 * The old localStorage key is deleted rather than left for a downgrade to
 * find. Keeping it was deliberate once, to survive rolling back to an older
 * build; but a key that survives is a key the next account inherits, and
 * showing someone a stranger's photograph is worse than making them pick
 * theirs again after a downgrade.
 */
export async function adoptLegacyAvatar(email: string): Promise<void> {
  if (!email) return;
  try {
    await invoke("adopt_legacy_avatar", { email });
  } catch {
    // Nothing to adopt, or the folder is unreadable. Not worth a toast.
  }

  let legacy: string | null;
  try {
    legacy = localStorage.getItem(AVATAR_KEY);
  } catch {
    return; // Storage blocked entirely; there is nothing there to inherit.
  }
  if (!legacy || !legacy.startsWith("data:image/")) return;

  try {
    // Only if this account has no photo of its own, so adoption can never
    // overwrite a newer picture with an older one.
    const existing = await invoke<string | null>("read_avatar", { email });
    if (!existing) await invoke("save_avatar", { email, dataUrl: legacy });
  } catch {
    // Leave the key in place and try again next launch.
    return;
  }
  try {
    localStorage.removeItem(AVATAR_KEY);
  } catch {
    // Blocked; discardLegacyAvatar gets another chance at sign-out.
  }
}

/** Destroys the machine-wide leftovers without giving them to anyone. Called
 *  on sign-out, when the next person may not be the last one. */
export async function discardLegacyAvatar(): Promise<void> {
  try {
    await invoke("discard_legacy_avatar");
  } catch {
    // Already gone, or unreachable; the localStorage half still matters.
  }
  try {
    localStorage.removeItem(AVATAR_KEY);
  } catch {
    // Storage blocked; nothing readable there either.
  }
}

/**
 * Downscales a picked image to a 128px cover-cropped square JPEG so the
 * stored data URL stays a few KB instead of megabytes of phone photo.
 */
export function fileToAvatarDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const SIZE = 128;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas unavailable"));
        return;
      }
      // Cover crop: scale the short side to SIZE and center the long one.
      const scale = SIZE / Math.min(img.width, img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("not an image"));
    };
    img.src = url;
  });
}

/**
 * Feature flag for the WinCraft Intelligence slice (Advisor + Change
 * Ledger). Compile-time on purpose: flipping it to false removes the nav
 * entry and both surfaces in one place, with no dead UI left behind.
 */
export const FEATURE_INTELLIGENCE = true;

// ---- Driver scan cache -------------------------------------------------------
// Walking every device class takes about sixteen seconds. A module-level
// variable alone survives switching screens but not relaunching the app -
// which is what made "open Hardware" look like it was scanning on its own
// again every time the app started, even though nothing had changed since
// the last read. Persisting the last result means a relaunch shows it
// immediately; only the explicit Rescan button ever pays the sixteen
// seconds again.
const DRIVER_AUDIT_KEY = "wincraft-driver-audit";

// v2 added `hardware`: the browser facts alone cannot tell that the graphics
// card was replaced inside the same Windows install, so a scan could outlive
// the machine it describes. A v1 entry carries no hardware signature and is
// simply re-scanned once.
const DRIVER_CACHE_VERSION = 2;
const DRIVER_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60_000;
const driverEnvironment = () => `${navigator.platform}|${navigator.userAgent}`;

/**
 * The hardware facts a driver scan depends on, as one comparable string.
 *
 * Deliberately excludes the power plan and the marketing Windows version:
 * switching from Balanced to High performance changes neither which drivers
 * are installed nor which ones are stale, so including either would throw away
 * a good scan for no reason. `windows_build` is included because a feature
 * update does change what a device class reports.
 */
export function hardwareSignature(profile: SystemProfile | null | undefined): string | null {
  if (!profile) return null;
  // "unknown" is how the Rust side spells "could not read it" for the two
  // enum fields, and it must not count as a fact here any more than null does.
  const part = (value: string | number | null | undefined) =>
    value === null || value === undefined || value === "" || value === "unknown"
      ? "-"
      : String(value);
  const fields = [
    part(profile.cpu),
    part(profile.cpu_physical_cores),
    part(profile.cpu_logical_cores),
    part(profile.gpu),
    part(profile.ram_total_bytes),
    part(profile.system_disk),
    part(profile.form_factor),
    part(profile.windows_build),
  ];
  // An all-unknown profile is not a signature: it would compare equal across
  // every machine and re-introduce exactly the staleness this prevents.
  return fields.every((field) => field === "-") ? null : fields.join("|");
}

function isDriverAudit(value: unknown): value is DriverAudit {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const count = (n: unknown) => typeof n === "number" && Number.isSafeInteger(n) && n >= 0;
  return (
    count(v.excluded_inbox) &&
    count(v.total_scanned) &&
    count(v.classes_scanned) &&
    Array.isArray(v.entries) &&
    v.entries.length <= 20_000 &&
    v.entries.every((entry: unknown) => {
      if (!entry || typeof entry !== "object") return false;
      const e = entry as Record<string, unknown>;
      return (
        ["device", "version", "date", "class", "provider"].every(
          (key) => typeof e[key] === "string",
        ) &&
        count(e.age_days) &&
        ["current", "aging", "stale"].includes(String(e.tier)) &&
        typeof e.important === "boolean" &&
        (e.vendor_url === null || typeof e.vendor_url === "string")
      );
    })
  );
}

export function readCachedDriverAudit(): {
  audit: DriverAudit;
  at: Date;
  /** The hardware signature recorded with the scan, when it had one. */
  hardware: string | null;
} | null {
  try {
    const raw = localStorage.getItem(DRIVER_AUDIT_KEY);
    if (!raw) return null;
    if (raw.length > 8_000_000) throw new Error("Oversized cache");
    const parsed = JSON.parse(raw);
    const at = new Date(parsed?.at);
    const age = Date.now() - at.getTime();
    if (
      parsed?.version !== DRIVER_CACHE_VERSION ||
      parsed.environment !== driverEnvironment() ||
      !isDriverAudit(parsed.audit) ||
      !Number.isFinite(age) ||
      age < -300_000 ||
      age > DRIVER_CACHE_MAX_AGE_MS
    ) {
      throw new Error("Stale or invalid cache");
    }
    return {
      audit: parsed.audit,
      at,
      hardware: typeof parsed.hardware === "string" ? parsed.hardware : null,
    };
  } catch {
    try {
      localStorage.removeItem(DRIVER_AUDIT_KEY);
    } catch {
      /* Storage can be blocked. */
    }
    return null;
  }
}

export function writeCachedDriverAudit(
  audit: DriverAudit,
  at: Date,
  hardware: string | null = null,
) {
  try {
    if (!isDriverAudit(audit)) return;
    localStorage.setItem(
      DRIVER_AUDIT_KEY,
      JSON.stringify({
        version: DRIVER_CACHE_VERSION,
        environment: driverEnvironment(),
        hardware,
        audit,
        at: at.toISOString(),
      }),
    );
  } catch {
    // Over quota or blocked storage: the current session still works.
  }
}

/**
 * Removes the stored scan. Used when the cache is known to describe different
 * hardware: leaving it on disk would re-show it on the next launch, after the
 * in-session check had already decided it was not this machine's.
 */
export function clearCachedDriverAudit(): void {
  try {
    localStorage.removeItem(DRIVER_AUDIT_KEY);
  } catch {
    /* Storage can be blocked. */
  }
}

/** The backend's stable error prefixes, in the user's language. Anything
 *  else is shown as it came. */
export function friendlyError(error: unknown, s: Strings): string {
  const message = String(error);
  if (message.startsWith("SELF_MANAGED_GAME_RUNNING: ")) return s.guard.gameRunning;
  if (message.startsWith("SELF_MANAGED_GAME: ")) return s.guard.selfManaged;
  if (message.startsWith("REGISTERED_GAME_RUNNING: ")) return s.guard.registeredGameRunning;
  if (message.startsWith("NEEDS_ADMIN_SCHEDULE: ")) return s.ram.autoNeedsAdmin;
  // The UAC prompt was declined or closed (elevation.rs).
  if (message.startsWith("elevation was cancelled or failed")) return s.toasts.elevationDeclined;
  return message;
}
