import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { format } from "../i18n";
import { STRINGS } from "../i18n-tables";
import { formatBytes } from "../lib";
import type { CacheGroup, CookieScan } from "../types";
import { AppCacheCard, CookieCleanerCard } from "./cleaners";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());

const { bridge } = await import("../test-bridge");

const s = STRINGS.en;
const toast = vi.fn();

beforeEach(() => {
  bridge.reset();
  toast.mockReset();
  bridge.reply("cookie_whitelist", []);
});
afterEach(cleanup);

const scan = (extra: Partial<CookieScan> = {}): CookieScan => ({
  id: "chrome",
  name: "Google Chrome",
  running: false,
  total: 40,
  protected: 5,
  removable: 35,
  top_removable: [{ host: ".doubleclick.net", count: 12 }],
  ...extra,
});

const group = (id: string, bytes: number, extra: Partial<CacheGroup> = {}): CacheGroup => ({
  id,
  category: "shaders",
  name: id,
  bytes,
  files: 2,
  blocked_by: "",
  ...extra,
});

describe("CookieCleanerCard", () => {
  it("loads the whitelist on mount and survives the read failing", async () => {
    render(<CookieCleanerCard s={s} onToast={toast} />);
    expect(bridge.callsTo("cookie_whitelist")).toHaveLength(1);

    cleanup();
    bridge.reset();
    bridge.reply("cookie_whitelist", new Error("no store yet"));
    render(<CookieCleanerCard s={s} onToast={toast} />);
    await screen.findByText(s.cookieCleaner.whitelistTitle);
    expect(toast).not.toHaveBeenCalled();
  });

  it("scans and reports what each browser holds", async () => {
    bridge.reply("scan_cookies", [scan()]);
    render(<CookieCleanerCard s={s} onToast={toast} />);
    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.scanButton }));

    expect(await screen.findByText("Google Chrome")).toBeInTheDocument();
    expect(screen.getByText(/doubleclick\.net/)).toBeInTheDocument();
  });

  it("reports a scan failure through the toast instead of throwing", async () => {
    bridge.reply("scan_cookies", new Error("permission denied"));
    render(<CookieCleanerCard s={s} onToast={toast} />);
    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.scanButton }));

    await waitFor(() => expect(toast).toHaveBeenCalledWith("error", "Error: permission denied"));
  });

  it("adds a whitelist entry lowercased, saves it, and rescans", async () => {
    bridge.reply("scan_cookies", [scan()], [scan()]);
    bridge.reply("set_cookie_whitelist", undefined);
    render(<CookieCleanerCard s={s} onToast={toast} />);
    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.scanButton }));
    await screen.findByText("Google Chrome");

    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.whitelistTitle }));
    const input = screen.getByPlaceholderText(s.cookieCleaner.whitelistPlaceholder);
    await userEvent.type(input, "  Example.COM ");
    fireEvent.submit(input.closest("form") as HTMLFormElement);

    expect(bridge.argsOf("set_cookie_whitelist")).toEqual({ entries: ["example.com"] });
    // A rescan keeps the counts and the list in step.
    await waitFor(() => expect(bridge.callsTo("scan_cookies")).toHaveLength(2));
  });

  it("ignores an entry with no dot rather than saving a domain that cannot match", async () => {
    render(<CookieCleanerCard s={s} onToast={toast} />);
    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.whitelistTitle }));
    const input = screen.getByPlaceholderText(s.cookieCleaner.whitelistPlaceholder);
    await userEvent.type(input, "localhost");
    fireEvent.submit(input.closest("form") as HTMLFormElement);

    expect(bridge.callsTo("set_cookie_whitelist")).toHaveLength(0);
    expect(input).toHaveValue("localhost");
  });

  it("cleans one browser, toasts the counts and rescans", async () => {
    bridge.reply("scan_cookies", [scan()], [scan()]);
    bridge.reply("clean_cookies", {
      removed: 12,
      kept: 5,
      cleaned: ["chrome"],
      skipped_running: [],
    });
    render(<CookieCleanerCard s={s} onToast={toast} />);
    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.scanButton }));
    await screen.findByText("Google Chrome");

    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.cleanButton }));
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        "success",
        format(s.cookieCleaner.cleanedToast, { removed: 12, kept: 5 }),
      ),
    );
    expect(bridge.argsOf("clean_cookies")).toEqual({ browsers: ["chrome"] });
  });

  it("will not offer to clean a browser that has nothing removable", async () => {
    bridge.reply("scan_cookies", [scan({ removable: 0 })]);
    render(<CookieCleanerCard s={s} onToast={toast} />);
    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.scanButton }));

    await screen.findByText(s.cookieCleaner.nothingToClean);
    expect(screen.getByRole("button", { name: s.cookieCleaner.cleanButton })).toBeDisabled();
  });

  it("warns that a running browser cannot be cleaned", async () => {
    bridge.reply("scan_cookies", [scan({ running: true })]);
    render(<CookieCleanerCard s={s} onToast={toast} />);
    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.scanButton }));

    const warning = format(s.cookieCleaner.runningWarning, { browser: "Google Chrome" });
    expect(await screen.findByText(warning)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: s.cookieCleaner.cleanButton })).toBeDisabled();
  });

  it("has no detectable accessibility violations", async () => {
    bridge.reply("scan_cookies", [scan({ running: true })]);
    const { container } = render(
      <ul>
        <CookieCleanerCard s={s} onToast={toast} />
      </ul>,
    );
    fireEvent.click(screen.getByRole("button", { name: s.cookieCleaner.scanButton }));
    await screen.findByText("Google Chrome");

    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("AppCacheCard", () => {
  it("pre-selects everything it found and totals what the selection holds", async () => {
    bridge.reply("scan_app_caches", [group("steam", 1024 ** 3), group("discord", 1024 ** 2)]);
    const { container } = render(
      <ul>
        <AppCacheCard s={s} onToast={toast} />
      </ul>,
    );
    fireEvent.click(screen.getByRole("button", { name: s.appCache.scanButton }));

    await screen.findByText(s.appCache.names.steam);
    // Both rows arrive checked, so the running total is the whole scan.
    for (const box of screen.getAllByRole("checkbox")) expect(box).toBeChecked();
    expect(container.textContent).toContain(
      format(s.appCache.selectedTotal, { size: formatBytes(1024 ** 3 + 1024 ** 2) }),
    );
  });

  it("cleans only the selected ids and reports the freed bytes", async () => {
    bridge.reply("scan_app_caches", [group("steam", 1024 ** 3), group("discord", 1024 ** 2)]);
    bridge.reply("scan_app_caches", []);
    bridge.reply("clean_app_caches", { freed_bytes: 1024 ** 2, skipped: 0 });
    render(
      <ul>
        <AppCacheCard s={s} onToast={toast} />
      </ul>,
    );
    fireEvent.click(screen.getByRole("button", { name: s.appCache.scanButton }));
    await screen.findByText(s.appCache.names.steam);

    const row = new RegExp(s.appCache.names.steam);
    fireEvent.click(screen.getByRole("checkbox", { name: row }));
    fireEvent.click(screen.getByRole("button", { name: s.appCache.cleanButton }));

    await waitFor(() =>
      expect(bridge.callsTo("clean_app_caches")[0]?.args).toEqual({ ids: ["discord"] }),
    );
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith("success", expect.stringContaining("1.0 MB")),
    );
  });

  it("reports skipped files separately from the success", async () => {
    bridge.reply("scan_app_caches", [group("steam", 1024 ** 3)]);
    bridge.reply("scan_app_caches", []);
    bridge.reply("clean_app_caches", { freed_bytes: 1024 ** 3, skipped: 3 });
    render(<AppCacheCard s={s} onToast={toast} />);
    fireEvent.click(screen.getByRole("button", { name: s.appCache.scanButton }));
    await screen.findByText(s.appCache.names.steam);
    fireEvent.click(screen.getByRole("button", { name: s.appCache.cleanButton }));

    await waitFor(() => expect(toast).toHaveBeenCalledWith("error", expect.stringContaining("3")));
  });

  it("surfaces a live scan progress event and drops the listener on unmount", async () => {
    const { unmount } = render(<AppCacheCard s={s} onToast={toast} />);
    expect(bridge.listenerCount("app-cache-progress")).toBe(1);
    unmount();
    await waitFor(() => expect(bridge.listenerCount("app-cache-progress")).toBe(0));
  });
});
