import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STRINGS } from "./i18n-tables";
import {
  GAUGE_C,
  LARGE_FILE_THRESHOLD_BYTES,
  arcPath,
  formatBytes,
  formatNumber,
  friendlyError,
  gbPair,
  loadColor,
  polar,
  clearCachedDriverAudit,
  hardwareSignature,
  readCachedDriverAudit,
  textFor,
  writeCachedDriverAudit,
} from "./lib";
import type { DriverAudit, SystemProfile } from "./types";

// Every formatter goes through `uiLocale()`, which reads <html lang>. jsdom
// starts with an empty attribute, so each test states the language it means.
beforeEach(() => {
  document.documentElement.lang = "en";
});

describe("formatBytes", () => {
  it("shows MB below a gigabyte and switches unit at 1024 MB", () => {
    expect(formatBytes(0)).toBe("0 MB");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
    expect(formatBytes(1023.5 * 1024 ** 2)).toBe("1,023.5 MB");
    expect(formatBytes(1024 ** 3)).toBe("1.00 GB");
    expect(formatBytes(1.5 * 1024 ** 3)).toBe("1.50 GB");
  });

  it("treats a missing or negative size as nothing reclaimed", () => {
    expect(formatBytes(-1)).toBe("0 MB");
    expect(formatBytes(Number.NaN)).toBe("0 MB");
  });

  it("formats with the app's language, not the machine's", () => {
    document.documentElement.lang = "de";
    expect(formatBytes(2.5 * 1024 ** 2)).toBe("2,5 MB");
    expect(formatNumber(1234.5, 1)).toBe("1.234,5");
  });
});

describe("gauge geometry", () => {
  it("starts a full-sweep arc at the top of the dial", () => {
    const top = polar(90, 10);
    expect(top.x).toBeCloseTo(GAUGE_C + 10, 5);
    expect(top.y).toBeCloseTo(GAUGE_C, 5);
  });

  it("uses the large-arc flag only past half a turn", () => {
    expect(arcPath(0, 0.5, 62)).toContain("A 62 62 0 0 1");
    expect(arcPath(0, 0.9, 62)).toContain("A 62 62 0 1 1");
  });

  it("shows a GB pair with the unit stated once", () => {
    expect(gbPair(1024 ** 3, 2 * 1024 ** 3)).toBe("1.0 / 2.0 GB");
  });
});

describe("loadColor", () => {
  it("moves through green, amber and red at the documented thresholds", () => {
    const green = loadColor(0);
    const amber = loadColor(60);
    const red = loadColor(85);
    expect(new Set([green, amber, red]).size).toBe(3);
    expect(loadColor(59.9)).toBe(green);
    expect(loadColor(84.9)).toBe(amber);
    expect(loadColor(100)).toBe(red);
  });
});

describe("textFor", () => {
  it("prefers the translation and falls back to the English the backend sent", () => {
    const dict = { tweak_a: { name: "A", description: "A desc" } };
    expect(textFor(dict, "tweak_a", "fallback", "fallback desc")).toEqual(dict.tweak_a);
    expect(textFor(dict, "tweak_b", "Fetched name", "Fetched desc")).toEqual({
      name: "Fetched name",
      description: "Fetched desc",
    });
  });
});

describe("friendlyError", () => {
  const s = STRINGS.en;

  it("maps the guard prefixes the Rust side sends", () => {
    expect(friendlyError("SELF_MANAGED_GAME_RUNNING: Steam", s)).toBe(s.guard.gameRunning);
    expect(friendlyError("SELF_MANAGED_GAME: Steam", s)).toBe(s.guard.selfManaged);
    expect(friendlyError("REGISTERED_GAME_RUNNING: game.exe", s)).toBe(
      s.guard.registeredGameRunning,
    );
    expect(friendlyError("NEEDS_ADMIN_SCHEDULE: cleanup", s)).toBe(s.ram.autoNeedsAdmin);
    expect(friendlyError("elevation was cancelled or failed", s)).toBe(s.toasts.elevationDeclined);
  });

  it("passes anything else through, including non-strings", () => {
    expect(friendlyError("boom", s)).toBe("boom");
    expect(friendlyError(new Error("network down"), s)).toBe("Error: network down");
  });
});

describe("LARGE_FILE_THRESHOLD_BYTES", () => {
  it("is the 100 MB the copy promises", () => {
    expect(LARGE_FILE_THRESHOLD_BYTES).toBe(100 * 1024 * 1024);
  });
});

describe("the cached driver audit", () => {
  const audit: DriverAudit = {
    entries: [],
    excluded_inbox: 3,
    total_scanned: 40,
    classes_scanned: 12,
  };
  const at = new Date(Date.now() - 60_000);

  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("survives a relaunch with its timestamp intact", () => {
    writeCachedDriverAudit(audit, at);
    const read = readCachedDriverAudit();
    expect(read?.audit).toEqual(audit);
    // The Date comes back as a Date, not as the string it was stored as —
    // the panel formats it and would otherwise print an ISO timestamp.
    expect(read?.at).toBeInstanceOf(Date);
    expect(read?.at.toISOString()).toBe(at.toISOString());
  });

  it("has nothing to say when the key was never written", () => {
    expect(readCachedDriverAudit()).toBeNull();
  });

  it("throws away a corrupted entry rather than showing it", () => {
    localStorage.setItem("wincraft-driver-audit", "{not json");
    expect(readCachedDriverAudit()).toBeNull();
    // Worth exactly one re-scan: leaving it there would break every launch.
    expect(localStorage.getItem("wincraft-driver-audit")).toBeNull();
  });

  it("ignores an entry whose date did not parse", () => {
    localStorage.setItem("wincraft-driver-audit", JSON.stringify({ audit, at: "not a date" }));
    expect(readCachedDriverAudit()).toBeNull();
  });

  it("rejects parseable but incomplete data, old schemas and stale environments", () => {
    writeCachedDriverAudit(audit, at);
    const valid = JSON.parse(localStorage.getItem("wincraft-driver-audit")!);
    for (const change of [
      { audit: {} },
      { version: 0 },
      { environment: "other OS" },
      { at: new Date(Date.now() - 8 * 86400_000).toISOString() },
      { at: new Date(Date.now() + 86400_000).toISOString() },
      { audit: { ...audit, entries: [{}] } },
    ]) {
      localStorage.setItem("wincraft-driver-audit", JSON.stringify({ ...valid, ...change }));
      expect(readCachedDriverAudit()).toBeNull();
    }
  });

  it("survives blocked reads and blocked cleanup", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readCachedDriverAudit()).toBeNull();
  });

  it("stays quiet when storage refuses the write", () => {
    // Private-mode and quota-full browsers throw here; the session cache in
    // memory still works, so this must not reach the user.
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    try {
      expect(() => writeCachedDriverAudit(audit, at)).not.toThrow();
    } finally {
      setItem.mockRestore();
    }
  });
});

describe("the hardware signature behind the driver cache", () => {
  const profile = (extra: Partial<SystemProfile> = {}): SystemProfile => ({
    windows_version: "Windows 11 24H2",
    windows_build: "26100.1742",
    cpu: "AMD Ryzen 7 7800X3D",
    cpu_physical_cores: 8,
    cpu_logical_cores: 16,
    gpu: "NVIDIA GeForce RTX 4070",
    ram_total_bytes: 34_359_738_368,
    system_disk: "nvme",
    form_factor: "desktop",
    power_plan_guid: "381b4222-f694-41f0-9685-ff5bb260df2e",
    power_plan: "Balanced",
    ...extra,
  });

  it("changes when hardware the scan depends on changes", () => {
    const base = hardwareSignature(profile());
    expect(base).toBe(hardwareSignature(profile()));
    // A replaced card, more memory, a different CPU, a different disk type and
    // a Windows feature update each describe a different set of devices.
    for (const change of [
      { gpu: "AMD Radeon RX 7900 XT" },
      { ram_total_bytes: 68_719_476_736 },
      { cpu: "Intel Core i9-14900K" },
      { cpu_logical_cores: 24 },
      { system_disk: "hdd" },
      { windows_build: "26100.2033" },
      { form_factor: "laptop" },
    ] as Partial<SystemProfile>[]) {
      expect(hardwareSignature(profile(change))).not.toBe(base);
    }
  });

  it("ignores what a driver list does not depend on", () => {
    const base = hardwareSignature(profile());
    // Switching power plan or installing a cumulative-label update changes
    // neither the installed drivers nor which are stale.
    expect(
      hardwareSignature(profile({ power_plan: "High performance", power_plan_guid: "other" })),
    ).toBe(base);
    expect(hardwareSignature(profile({ windows_version: "Windows 11 25H2" }))).toBe(base);
  });

  it("refuses to call an unknown machine a signature", () => {
    // An all-unknown profile would compare equal everywhere and make the cache
    // look verified on a machine it knows nothing about.
    const empty = {
      windows_version: null,
      windows_build: null,
      cpu: null,
      cpu_physical_cores: null,
      cpu_logical_cores: null,
      gpu: null,
      ram_total_bytes: null,
      system_disk: "unknown" as const,
      form_factor: "unknown" as const,
      power_plan_guid: null,
      power_plan: null,
    };
    expect(hardwareSignature(empty)).toBeNull();
    expect(hardwareSignature(null)).toBeNull();
    expect(hardwareSignature(undefined)).toBeNull();
    // One known field is enough to make it specific.
    expect(hardwareSignature({ ...empty, gpu: "NVIDIA GeForce RTX 4070" })).toContain("RTX 4070");
  });

  it("is recorded with the scan and read back with it", () => {
    const audit: DriverAudit = {
      entries: [],
      excluded_inbox: 0,
      total_scanned: 1,
      classes_scanned: 1,
    };
    const at = new Date(Date.now() - 1000);
    localStorage.clear();
    writeCachedDriverAudit(audit, at, "cpu|8|16");
    expect(readCachedDriverAudit()?.hardware).toBe("cpu|8|16");
    // A scan stored without one (or by an older version) reads back as unknown
    // rather than as a wrong answer.
    writeCachedDriverAudit(audit, at);
    expect(readCachedDriverAudit()?.hardware).toBeNull();
    expect(clearCachedDriverAudit()).toBeUndefined();
    expect(readCachedDriverAudit()).toBeNull();
    // Blocked storage is not an error worth surfacing: nothing to clear.
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(clearCachedDriverAudit()).toBeUndefined();
    vi.restoreAllMocks();
  });
});
