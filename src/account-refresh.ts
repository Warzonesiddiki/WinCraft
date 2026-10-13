import { API_BASE_URL, adoptRenewedToken, readToken, sessionGeneration } from "./lib";
import type { AuthState } from "./types";

/** One refresh at a time per session, with stale responses discarded even when
 * a mocked/slow transport ignores AbortSignal. Never retries account writes. */
export function createAccountRefresh() {
  let active: {
    token: string;
    generation: number;
    controller: AbortController;
    promise: Promise<void>;
  } | null = null;
  let last: { token: string | null; generation: number; at: number } | null = null;
  return {
    cancel() {
      active?.controller.abort();
      active = null;
      last = null;
    },
    refresh(
      onAccount: (state: AuthState) => void,
      onExpired: () => void,
      onError: () => void,
      force = false,
    ): Promise<void> {
      const token = readToken();
      const generation = sessionGeneration();
      if (!token || !API_BASE_URL) return Promise.resolve();
      if (active?.token === token && active.generation === generation) return active.promise;
      if (
        !force &&
        last?.token === token &&
        last.generation === generation &&
        Date.now() - last.at < 30_000
      )
        return Promise.resolve();
      active?.controller.abort();
      const controller = new AbortController();
      const current = () => sessionGeneration() === generation && readToken() === token;
      let timedOut = false;
      const timer = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, 8_000);
      const promise = (async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/account`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          });
          if (!current() || controller.signal.aborted) return;
          if (response.status === 401) {
            onExpired();
            return;
          }
          if (!response.ok) throw new Error("Account refresh failed");
          const data: unknown = await response.json();
          if (!current() || controller.signal.aborted) return;
          if (
            !data ||
            typeof data !== "object" ||
            !("email" in data) ||
            typeof data.email !== "string" ||
            !("emailVerified" in data) ||
            typeof data.emailVerified !== "boolean"
          )
            throw new Error("Invalid account response");
          adoptRenewedToken(response, token, generation);
          onAccount({
            status: "authenticated",
            email: data.email,
            emailVerified: data.emailVerified,
            plan: "plan" in data && typeof data.plan === "string" ? data.plan : null,
            hasBilling: "hasBilling" in data && data.hasBilling === true,
          });
          last = { token: readToken(), generation, at: Date.now() };
        } catch {
          if (current() && (!controller.signal.aborted || timedOut)) onError();
        } finally {
          window.clearTimeout(timer);
          if (active?.controller === controller) active = null;
        }
      })();
      active = { token, generation, controller, promise };
      return promise;
    },
  };
}
