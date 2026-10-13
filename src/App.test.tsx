import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { AuthState, Section, TweakInfo } from "./types";
import { clearSession, readToken, storeSession } from "./lib";
import App from "./App";

// Keep real App state/dispatch; isolate unrelated native chrome and large panels.
const native = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@tauri-apps/api/core", () => native);
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
  WorkspaceSidebar: ({ onNavigate }: { onNavigate: (section: Section) => void }) => (
    <button onClick={() => onNavigate("ui")}>Test UI settings</button>
  ),
}));
vi.mock("./components/tweak-row", () => ({
  TweakRow: ({ tweak, onToggle }: { tweak: TweakInfo; onToggle: (tweak: TweakInfo) => void }) => (
    <li>
      <button onClick={() => onToggle(tweak)}>
        {tweak.applied ? "Test restore" : "Test apply"}
      </button>
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
  native.invoke.mockReset().mockImplementation(async (command: string) => {
    if (command === "list_tweaks") return [{ ...tweak }];
    if (command === "list_cleanup_targets") return [];
    if (command === "apply_tweak") tweak.applied = true;
    if (command === "rollback_tweak") tweak.applied = false;
    return null;
  });
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
