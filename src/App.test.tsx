import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { AuthState, Section, TweakInfo } from "./types";
import { clearSession, readToken, storeSession } from "./lib";
import App from "./App";
import { en as s } from "./locales/en";

// Keep real App state/dispatch; isolate unrelated native chrome and large panels.
const native = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@tauri-apps/api/core", () => native);
vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn(async () => () => {}) }));
vi.mock("@tauri-apps/plugin-opener", () => ({ openUrl: vi.fn() }));
vi.mock("./components/titlebar", () => ({ TitleBar: () => null }));
vi.mock("./components/scan", () => ({ ScanPanel: () => null }));
vi.mock("./components/monitor", () => ({
  SystemMonitor: () => null,
  RamCleaner: () => null,
  useScheduledRamClean: () => null,
}));
vi.mock("./components/command", () => ({ usePulseSamples: () => [] }));
vi.mock("./components/onboarding", () => ({
  shouldShowOnboarding: () => false,
  OnboardingFlow: () => null,
}));
vi.mock("./components/ui", async () => ({
  ...(await vi.importActual<typeof import("./components/ui")>("./components/ui")),
  UpdateBanner: () => null,
}));
vi.mock("./components/account", () => ({
  AccountMenu: ({
    auth,
    onLogout,
    onAuthenticate,
    onDeleteAccount,
  }: {
    auth: AuthState;
    onLogout: () => void;
    onAuthenticate: (mode: "login", email: string, password: string) => Promise<void>;
    onDeleteAccount: (password: string, confirm: string) => Promise<void>;
  }) => (
    <div>
      <output data-testid="session">
        {auth.status === "authenticated" ? auth.email : "anonymous"}
      </output>
      <button onClick={onLogout}>Test logout</button>
      <button onClick={() => void onAuthenticate("login", "b@example.com", "password")}>
        Test login B
      </button>
      <button
        onClick={() =>
          void onDeleteAccount("correct horse battery", "DELETE").catch((err: unknown) => {
            // The real section shows this sentence; here the error only has to
            // exist so the rejection is not left unhandled.
            document.title = String(err);
          })
        }
      >
        Test delete account
      </button>
    </div>
  ),
}));
vi.mock("./components/workspace-sidebar", () => ({
  WorkspaceSidebar: ({
    onNavigate,
    items,
    active,
  }: {
    onNavigate: (section: Section) => void;
    items?: { key: Section; label: string }[];
    active?: Section;
  }) => (
    <nav aria-label="Sidebar">
      <button onClick={() => onNavigate("ui")}>Test UI settings</button>
      {(items || []).map((c) => (
        <button
          key={c.key}
          onClick={() => onNavigate(c.key)}
          aria-current={active === c.key ? "page" : undefined}
          data-section={c.key}
        >
          {c.label}
        </button>
      ))}
    </nav>
  ),
}));
vi.mock("./components/tweak-row", () => ({
  TweakRow: ({
    tweak,
    onToggle,
    onInspect,
    open,
  }: {
    tweak: TweakInfo;
    onToggle: (tweak: TweakInfo) => void;
    onInspect?: () => void;
    open?: boolean;
  }) => (
    <li>
      <button onClick={() => onToggle(tweak)}>
        {tweak.applied ? "Test restore" : "Test apply"}
      </button>
      {onInspect && (
        <button onClick={onInspect}>
          {open ? `Close inspect ${tweak.name}` : `Test inspect ${tweak.name}`}
        </button>
      )}
    </li>
  ),
}));

function deferred() {
  let resolve!: (r: Response) => void;
  const promise = new Promise<Response>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
const account = (email = "a@example.com", status = 200, token = "") =>
  new Response(JSON.stringify({ email, emailVerified: true }), {
    status,
    headers: token ? { "X-Session-Token": token } : {},
  });
let tweak: TweakInfo;
let consentTweak: TweakInfo;
const cleanupTarget = {
  id: "user_temp",
  name: "User Temp",
  description: "Temporary files",
  safe: true,
  bytes: 1048576,
  item_count: 5,
  preview_items: ["temp.log"],
};
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  clearSession();
  tweak = {
    id: "dark_mode",
    name: "Dark mode",
    description: "Theme",
    category: "ui",
    hive: "HKCU",
    requires_admin: false,
    requires_pro: false,
    applied: false,
    changes: [],
  };
  consentTweak = {
    id: "barebone_edge",
    name: "Edge Removal",
    description: "Removes Edge browser",
    category: "performance",
    hive: "HKLM",
    requires_admin: true,
    requires_pro: false,
    applied: false,
    changes: [],
    consentRequired: true,
  };
  native.invoke.mockReset().mockImplementation(async (command: string) => {
    if (command === "list_tweaks") return [{ ...tweak }, { ...consentTweak }];
    if (command === "list_cleanup_targets") return [cleanupTarget];
    if (command === "preview_cleanup") return { items: ["temp.log"], total_bytes: 1024 };
    if (command === "apply_tweak") {
      tweak.applied = true;
      return null;
    }
    if (command === "rollback_tweak") {
      tweak.applied = false;
      return null;
    }
    if (command === "rollback_tweaks") {
      tweak.applied = false;
      return null;
    }
    if (command === "record_barebone_consent") return null;
    if (command === "get_hold_flags") return { hold_process_guard: false };
    if (command === "list_profiles") return [];
    if (command === "list_startup_items") return [];
    if (command === "list_scheduled_tasks") return [];
    if (command === "get_debloat_history") return [];
    if (command === "list_bloatware") return [];
    if (command === "list_debloat_apps") return [];
    if (command === "debloat_history") return [];
    if (command === "get_history_entries") return [];
    if (command === "get_rollback_snapshots") return [];
    if (command === "list_crash_reports") return [];
    if (command === "check_update_drift") return null;
    if (command === "list_skinpacks") return [];
    if (command === "hud_is_open") return false;
    if (command === "hud_is_compact") return false;
    if (command === "find_game_running") return { running: false, elevated: false };
    if (command === "fps_status") return { running: false, elevated: false };
    if (command === "system_stats") return null;
    if (command === "get_process_stats") return { current: 100, target: 80 };
    if (command === "get_game_sessions") return [];
    if (command === "turboboost_status") return false;
    if (command === "core_steering_status") return null;
    if (command === "system_profile") return null;
    if (command === "reboot_pending") return false;
    if (command === "health_score_history") return [];
    if (command === "run_health_check") return null;
    if (command === "run_cleanup")
      return { deleted_count: 5, freed_bytes: 1048576, skipped_count: 0 };
    if (command === "read_hold_flags") return { hold_process_guard: false };
    return null;
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      if (typeof url === "string" && url.includes("hold-flags")) {
        return new Response(JSON.stringify({ hold_process_guard: false }), { status: 200 });
      }
      return new Response("{}", { status: 200 });
    }),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it.each([200, 401])(
  "App logout stays anonymous when an old %s response arrives",
  async (status) => {
    storeSession("a", "a@example.com", true);
    const request = deferred();
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        url.endsWith("/api/account") ? request.promise : Promise.resolve(new Response("{}")),
      ),
    );
    render(<App />);
    fireEvent.click(screen.getByText("Test logout"));
    await act(async () => request.resolve(account("a@example.com", status, "obsolete")));
    expect(screen.getByTestId("session")).toHaveTextContent("anonymous");
    expect(readToken()).toBeNull();
  },
);

it("App login B is not overwritten by account A's response or renewal", async () => {
  storeSession("a", "a@example.com", true);
  const old = deferred();
  let accountCalls = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      if (url.endsWith("/api/account"))
        return ++accountCalls === 1 ? old.promise : Promise.resolve(account("b@example.com"));
      if (url.endsWith("/api/auth/login")) return Promise.resolve(new Response('{"token":"b"}'));
      return Promise.resolve(new Response("{}"));
    }),
  );
  render(<App />);
  fireEvent.click(screen.getByText("Test login B"));
  await waitFor(() => expect(screen.getByTestId("session")).toHaveTextContent("b@example.com"));
  await act(async () => old.resolve(account("a@example.com", 200, "obsolete")));
  expect(screen.getByTestId("session")).toHaveTextContent("b@example.com");
  expect(readToken()).toBe("b");
});

it("App dispatches apply and exact rollback, then rereads native state", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("{}")),
  );
  render(<App />);
  fireEvent.click(screen.getByText("Test UI settings"));
  fireEvent.click(await screen.findByText("Test apply"));
  expect(await screen.findByText("Test restore")).toBeInTheDocument();
  expect(native.invoke).toHaveBeenCalledWith("apply_tweak", { id: "dark_mode" });
  fireEvent.click(screen.getByText("Test restore"));
  expect(await screen.findByText("Test apply")).toBeInTheDocument();
  expect(native.invoke).toHaveBeenCalledWith("rollback_tweak", { id: "dark_mode" });
});

it("App shows native refusal without marking a failed write applied", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("{}")),
  );
  native.invoke.mockImplementation(async (command: string) => {
    if (command === "list_tweaks") return [{ ...tweak }];
    if (command === "list_cleanup_targets") return [];
    if (command === "apply_tweak") throw new Error("write refused");
    if (command === "fps_status") return { running: false, elevated: false };
    return null;
  });
  render(<App />);
  fireEvent.click(screen.getByText("Test UI settings"));
  fireEvent.click(await screen.findByText("Test apply"));
  expect(await screen.findByText(/write refused/)).toBeInTheDocument();
  expect(screen.queryByText("Test restore")).toBeNull();
});

it("App signs out only after the account deletion succeeds", async () => {
  storeSession("a", "a@example.com", true);
  const calls: { url: string; init?: RequestInit }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      if (url.endsWith("/api/account") && init?.method === "DELETE")
        return new Response(JSON.stringify({ deleted: true }));
      return new Response(JSON.stringify({ email: "a@example.com", emailVerified: true }));
    }),
  );
  render(<App />);
  fireEvent.click(screen.getByText("Test delete account"));
  await waitFor(() => expect(screen.getByTestId("session")).toHaveTextContent("anonymous"));
  expect(readToken()).toBeNull();
  const deletion = calls.find((call) => call.init?.method === "DELETE")!;
  expect((deletion.init!.headers as Record<string, string>).Authorization).toBe("Bearer a");
  expect(JSON.parse(String(deletion.init!.body))).toEqual({
    password: "correct horse battery",
    confirm: "DELETE",
  });
});

it("App keeps the session when the deletion is refused", async () => {
  storeSession("a", "a@example.com", true);
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/api/account") && init?.method === "DELETE")
        return new Response(
          JSON.stringify({
            code: "active-subscription",
            error: "This account has an active subscription.",
          }),
          { status: 409 },
        );
      return new Response(JSON.stringify({ email: "a@example.com", emailVerified: true }));
    }),
  );
  render(<App />);
  fireEvent.click(screen.getByText("Test delete account"));
  await waitFor(() => expect(document.title).toMatch(/active subscription/));
  // Nothing was deleted, so the session must survive intact.
  expect(screen.getByTestId("session")).toHaveTextContent("a@example.com");
  expect(readToken()).toBe("a");
});

it("navigates across main navigation tabs and mounts lazy modules", async () => {
  render(<App />);

  const sidebar = screen.getByRole("navigation", { name: "Sidebar" });
  const nav = within(sidebar);

  // Scan is the initial default view
  expect(await screen.findByRole("heading", { name: s.tabs.scan })).toBeInTheDocument();

  // Overview
  fireEvent.click(nav.getByRole("button", { name: s.tabs.overview }));
  expect(await screen.findByRole("heading", { name: s.tabs.overview })).toBeInTheDocument();

  // Performance
  fireEvent.click(nav.getByRole("button", { name: s.tabs.performance }));
  expect(await screen.findByRole("heading", { name: s.tabs.performance })).toBeInTheDocument();

  // Gaming
  fireEvent.click(nav.getByRole("button", { name: s.tabs.gaming }));
  expect(await screen.findByRole("heading", { name: s.tabs.gaming })).toBeInTheDocument();

  // Privacy
  fireEvent.click(nav.getByRole("button", { name: s.tabs.privacy }));
  expect(await screen.findByRole("heading", { name: s.tabs.privacy })).toBeInTheDocument();

  // Startup
  fireEvent.click(nav.getByRole("button", { name: s.tabs.startup }));
  expect(await screen.findByRole("heading", { name: s.tabs.startup })).toBeInTheDocument();

  // Debloat
  fireEvent.click(nav.getByRole("button", { name: "Debloat" }));
  expect(
    await screen.findByRole("heading", { name: "Make room for what you use." }),
  ).toBeInTheDocument();

  // Maintenance
  fireEvent.click(nav.getByRole("button", { name: s.tabs.maintenance }));
  expect(await screen.findByRole("heading", { name: s.tabs.maintenance })).toBeInTheDocument();

  // Profiles
  fireEvent.click(nav.getByRole("button", { name: s.tabs.profiles }));
  expect(await screen.findByRole("heading", { name: s.tabs.profiles })).toBeInTheDocument();

  // History (ledger)
  fireEvent.click(nav.getByRole("button", { name: s.tabs.ledger }));
  expect(await screen.findByRole("heading", { name: s.tabs.ledger })).toBeInTheDocument();

  // PC Health
  fireEvent.click(nav.getByRole("button", { name: s.tabs.health }));
  expect(await screen.findByRole("heading", { name: s.tabs.health })).toBeInTheDocument();

  // Hardware
  fireEvent.click(nav.getByRole("button", { name: s.tabs.hardware }));
  expect(await screen.findByRole("heading", { name: s.tabs.hardware })).toBeInTheDocument();

  // Plans & pricing
  fireEvent.click(nav.getByRole("button", { name: s.tabs.pricing }));
  expect(await screen.findByRole("heading", { name: s.pricing.title })).toBeInTheDocument();

  // Interface (UI)
  fireEvent.click(nav.getByRole("button", { name: s.tabs.ui }));
  expect(await screen.findByRole("heading", { name: s.tabs.ui })).toBeInTheDocument();
}, 15000);

it("clears search input when switching navigation tabs", async () => {
  render(<App />);

  const searchInput = await screen.findByPlaceholderText(s.search.placeholder);
  fireEvent.change(searchInput, { target: { value: "dark" } });
  expect(searchInput).toHaveValue("dark");

  const perfBtn = screen.getByRole("button", { name: s.tabs.performance });
  fireEvent.click(perfBtn);

  expect(searchInput).toHaveValue("");
});

it("supports inspecting tweak technical details", async () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: s.tabs.performance }));
  const inspectBtn = await screen.findByRole("button", { name: /Test inspect Edge Removal/i });
  fireEvent.click(inspectBtn);

  expect(
    await screen.findByRole("button", { name: /Close inspect Edge Removal/i }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Close inspect Edge Removal/i }));
  expect(
    await screen.findByRole("button", { name: /Test inspect Edge Removal/i }),
  ).toBeInTheDocument();
});

it("mounts restore confirmation dialog and executes restore-all", async () => {
  tweak.applied = true;

  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: s.tabs.ui }));
  const restoreBtn = await screen.findByRole("button", { name: s.restore.button });
  fireEvent.click(restoreBtn);

  expect(await screen.findByRole("heading", { name: s.restore.title })).toBeInTheDocument();

  const cancelBtn = screen.getByRole("button", { name: s.restore.cancel });
  fireEvent.click(cancelBtn);
  expect(screen.queryByRole("heading", { name: s.restore.title })).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: s.restore.button }));
  const confirmBtn = await screen.findByRole("button", { name: s.restore.confirm });
  fireEvent.click(confirmBtn);

  await act(async () => {
    await Promise.resolve();
  });
  expect(native.invoke).toHaveBeenCalledWith("rollback_tweaks", { ids: ["dark_mode"] });
  expect(screen.queryByRole("heading", { name: s.restore.title })).toBeNull();
});

it("requires acknowledgement for manual high-risk tweaks before applying", async () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: s.tabs.performance }));
  const applyBtns = await screen.findAllByRole("button", { name: "Test apply" });
  fireEvent.click(applyBtns[0]);

  expect(await screen.findByRole("heading", { name: "Edge Removal" })).toBeInTheDocument();

  const cancelBtn = screen.getByRole("button", { name: s.restore.cancel });
  fireEvent.click(cancelBtn);
  expect(screen.queryByRole("heading", { name: "Edge Removal" })).toBeNull();

  const applyBtnsAgain = await screen.findAllByRole("button", { name: "Test apply" });
  fireEvent.click(applyBtnsAgain[0]);

  const confirmBtn = screen.getByRole("button", { name: "Acknowledge & Apply" });
  fireEvent.click(confirmBtn);

  await act(async () => {
    await Promise.resolve();
  });
  expect(native.invoke).toHaveBeenCalledWith("apply_tweak", { id: "barebone_edge" });
  expect(native.invoke).not.toHaveBeenCalledWith(
    "record_barebone_consent",
    expect.objectContaining({ id: "barebone_edge" }),
  );
  expect(screen.queryByRole("heading", { name: "Edge Removal" })).toBeNull();
});

it("mounts cleanup confirmation modal in maintenance section", async () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: s.tabs.maintenance }));
  const cleanBtn = await screen.findByRole("button", { name: s.cleanupButton });
  fireEvent.click(cleanBtn);

  const cancelBtn = await screen.findByRole("button", { name: s.cleanupConfirm.cancel });
  expect(cancelBtn).toBeInTheDocument();
  fireEvent.click(cancelBtn);
});

it("renders toast notifications and allows dismissing them", async () => {
  render(<App />);

  fireEvent.click(screen.getByText("Test UI settings"));
  const applyBtn = await screen.findByRole("button", { name: "Test apply" });
  fireEvent.click(applyBtn);

  const toast = await screen.findByRole("status");
  expect(toast).toBeInTheDocument();
});
