import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STRINGS } from "./i18n";
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
  readCachedDriverAudit,
  textFor,
  writeCachedDriverAudit,
} from "./lib";
import type { DriverAudit } from "./types";

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
  const at = new Date("2026-10-12T09:30:00.000Z");

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
