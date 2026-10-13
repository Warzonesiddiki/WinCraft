import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAccountRefresh } from "./account-refresh";
import { clearSession, readToken, storeSession } from "./lib";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
const response = (status = 200, token?: string) =>
  new Response(JSON.stringify({ email: "a@example.com", emailVerified: true }), {
    status,
    headers: token ? { "X-Session-Token": token } : {},
  });

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  sessionStorage.clear();
  clearSession();
  storeSession("a", "a@example.com", true);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("session-aware account refresh", () => {
  it.each([200, 401])("ignores a late %s after logout", async (status) => {
    const request = deferred<Response>();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => request.promise),
    );
    const refresh = createAccountRefresh();
    const update = vi.fn(),
      expired = vi.fn(),
      error = vi.fn();
    const pending = refresh.refresh(update, expired, error);
    clearSession();
    request.resolve(response(status, "old-renewal"));
    await pending;
    expect(update).not.toHaveBeenCalled();
    expect(expired).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(readToken()).toBeNull();
  });

  it.each([200, 401])("late %s cannot overwrite or expire a newer account", async (status) => {
    const request = deferred<Response>();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => request.promise),
    );
    const refresh = createAccountRefresh();
    const update = vi.fn(),
      expired = vi.fn();
    const pending = refresh.refresh(update, expired, vi.fn());
    storeSession("b", "b@example.com", false);
    request.resolve(response(status, "obsolete"));
    await pending;
    expect(update).not.toHaveBeenCalled();
    expect(expired).not.toHaveBeenCalled();
    expect(readToken()).toBe("b");
  });

  it("checks the session again after asynchronous JSON parsing", async () => {
    const body = deferred<unknown>();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: () => body.promise,
        headers: new Headers(),
      })),
    );
    const update = vi.fn();
    const pending = createAccountRefresh().refresh(update, vi.fn(), vi.fn());
    await Promise.resolve();
    clearSession();
    body.resolve({ email: "a@example.com", emailVerified: true });
    await pending;
    expect(update).not.toHaveBeenCalled();
  });

  it("deduplicates focus bursts, renews only the current token and respects freshness", async () => {
    const request = deferred<Response>();
    const fetcher = vi.fn(() => request.promise);
    vi.stubGlobal("fetch", fetcher);
    const refresh = createAccountRefresh();
    const update = vi.fn();
    const first = refresh.refresh(update, vi.fn(), vi.fn());
    expect(refresh.refresh(update, vi.fn(), vi.fn())).toBe(first);
    request.resolve(response(200, "renewed"));
    await first;
    expect(readToken()).toBe("renewed");
    expect(update).toHaveBeenCalledOnce();
    await refresh.refresh(update, vi.fn(), vi.fn());
    expect(fetcher).toHaveBeenCalledOnce();
    await refresh.refresh(update, vi.fn(), vi.fn(), true);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("cancelled work cannot update state and a new mount can refresh", async () => {
    const request = deferred<Response>();
    const fetcher = vi.fn().mockReturnValueOnce(request.promise).mockResolvedValue(response());
    vi.stubGlobal("fetch", fetcher);
    const refresh = createAccountRefresh();
    const update = vi.fn();
    const first = refresh.refresh(update, vi.fn(), vi.fn());
    refresh.cancel();
    request.resolve(response());
    await first;
    expect(update).not.toHaveBeenCalled();
    await refresh.refresh(update, vi.fn(), vi.fn());
    expect(update).toHaveBeenCalledOnce();
  });

  it("times out a stalled request without retrying it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal!.addEventListener("abort", () => reject(new Error("aborted")));
          }),
      ),
    );
    const error = vi.fn();
    const pending = createAccountRefresh().refresh(vi.fn(), vi.fn(), error);
    await vi.advanceTimersByTimeAsync(8000);
    await pending;
    expect(error).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("rejects malformed account data without adopting renewal", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response('{"email":false}', { headers: { "X-Session-Token": "bad" } })),
    );
    const error = vi.fn();
    await createAccountRefresh().refresh(vi.fn(), vi.fn(), error);
    expect(error).toHaveBeenCalledOnce();
    expect(readToken()).toBe("a");
  });
});
