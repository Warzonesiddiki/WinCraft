import { describe, expect, it, vi } from "vitest";
import { AccountDeletionError, requestAccountDeletion } from "./account-deletion";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const request = (response: Response | Error) => {
  const fetchImpl = vi.fn(async () => {
    if (response instanceof Error) throw response;
    return response;
  });
  return fetchImpl as unknown as typeof fetch;
};

const call = (
  fetchImpl: typeof fetch,
  overrides: Partial<Parameters<typeof requestAccountDeletion>[0]> = {},
) =>
  requestAccountDeletion({
    apiBase: "https://api.example.test",
    token: "session-token",
    password: "correct horse battery",
    confirm: "DELETE",
    fetchImpl,
    ...overrides,
  });

describe("requesting account deletion", () => {
  it("sends the password and confirmation word to the account endpoint", async () => {
    let seen: { url: string; init?: RequestInit } | null = null;
    const fetchImpl = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      seen = { url: String(url), init };
      return json({ deleted: true });
    }) as unknown as typeof fetch;

    await call(fetchImpl);

    expect(seen!.url).toBe("https://api.example.test/api/account");
    expect(seen!.init!.method).toBe("DELETE");
    expect((seen!.init!.headers as Record<string, string>).Authorization).toBe(
      "Bearer session-token",
    );
    expect(JSON.parse(String(seen!.init!.body))).toEqual({
      password: "correct horse battery",
      confirm: "DELETE",
    });
  });

  it("reports each refusal the server can name", async () => {
    const cases: [string, number, string][] = [
      ["confirmation-required", 400, "Confirmation required"],
      ["password-required", 400, "Password required"],
      ["password-mismatch", 401, "That password does not match this account."],
      ["active-subscription", 409, "This account has an active subscription."],
    ];
    for (const [code, status, message] of cases) {
      await expect(call(request(json({ code, error: message }, status)))).rejects.toMatchObject({
        name: "AccountDeletionError",
        problem: code,
        message,
      });
    }
  });

  it("keeps the server's own words when it refuses for a reason this client does not know", async () => {
    await expect(
      call(request(json({ code: "still-processing", error: "A refund is in flight." }, 409))),
    ).rejects.toMatchObject({ problem: "unknown", message: "A refund is in flight." });
    // No JSON at all: still a message, still not a blank screen.
    await expect(
      call(request(new Response("<html>gateway error</html>", { status: 502 }))),
    ).rejects.toMatchObject({ problem: "unknown", message: "HTTP 502" });
  });

  it("treats an unauthenticated response as a session problem", async () => {
    await expect(
      call(request(json({ error: "invalid or expired token" }, 401))),
    ).rejects.toMatchObject({
      problem: "unauthenticated",
    });
  });

  it("reports an unreachable server as a network problem, not a rejection", async () => {
    await expect(call(request(new Error("Failed to fetch")))).rejects.toBeInstanceOf(
      AccountDeletionError,
    );
    await expect(call(request(new Error("Failed to fetch")))).rejects.toMatchObject({
      problem: "unreachable",
    });
  });

  it("resolves when the account really was deleted", async () => {
    await expect(call(request(json({ deleted: true })))).resolves.toBeUndefined();
  });
});
