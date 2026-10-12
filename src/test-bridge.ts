import { vi } from "vitest";

/**
 * A stand-in for the Tauri IPC bridge, for components that call `invoke` and
 * `listen` on mount or on click.
 *
 * A test file mocks the two modules at the top and imports this harness:
 *
 * ```ts
 * vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
 * vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());
 * ```
 *
 * Replies are queued per command, so a test can make the second call return
 * something different from the first — the same shape as the real bridge, where
 * a rescan after a write sees new numbers. A queued `Error` is thrown instead
 * of returned.
 */
type Reply = unknown | Error;
/** `raw` marks a rejection that is not an `Error`: Tauri rejects with a plain
 *  string carrying the backend's own prefix, and the app's friendly-error
 *  mapping reads exactly that string. */
type Queued = { value: Reply; raw?: boolean };
type Recorded = { command: string; args?: Record<string, unknown> };

// Wrapped, because `undefined` is both a legitimate reply for a command that
// returns nothing and the value a failed lookup would produce.
const queues = new Map<string, Queued[]>();
const log: Recorded[] = [];
const listeners = new Map<string, ((event: { payload: unknown }) => void)[]>();
const gates = new Map<string, Promise<void>>();
const openGate = new Map<string, () => void>();

async function reply(command: string): Promise<unknown> {
  // A held command waits here, which is how a test keeps a component in its
  // loading state long enough to interact with it.
  await gates.get(command);
  const queued = queues.get(command)?.shift();
  if (!queued) {
    throw new Error(
      `test-bridge: no reply queued for "${command}". Queue one with bridge.reply("${command}", value).`,
    );
  }
  if (queued.raw || queued.value instanceof Error) throw queued.value;
  return queued.value;
}

async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  log.push({ command, args });
  return (await reply(command)) as T;
}

async function listen<T>(event: string, handler: (e: { payload: T }) => void) {
  const forEvent = listeners.get(event) ?? [];
  forEvent.push(handler as (e: { payload: unknown }) => void);
  listeners.set(event, forEvent);
  return () => {
    listeners.set(
      event,
      (listeners.get(event) ?? []).filter((h) => h !== handler),
    );
  };
}

export const bridge = {
  /** Queues replies for one command, in call order. */
  reply(command: string, ...values: Reply[]) {
    queues.set(command, [...(queues.get(command) ?? []), ...values.map((value) => ({ value }))]);
  },
  /**
   * Queues a rejection whose value is the string the backend sends, which is
   * how Tauri reports a failed command (`invoke` rejects with the raw payload,
   * often one of the `PREFIX: detail` markers the app maps to its own copy).
   * `reply(command, new Error(...))` rejects with an `Error` object instead.
   */
  fail(command: string, ...messages: string[]) {
    queues.set(command, [
      ...(queues.get(command) ?? []),
      ...messages.map((value) => ({ value, raw: true })),
    ]);
  },
  /** Makes every later call to `command` wait until `release(command)`. */
  hold(command: string) {
    gates.set(command, new Promise<void>((resolve) => openGate.set(command, resolve)));
  },
  /** Lets a held command through. */
  release(command: string) {
    openGate.get(command)?.();
    gates.delete(command);
    openGate.delete(command);
  },
  /** Every call so far, in order. */
  calls: () => [...log],
  callsTo: (command: string) => log.filter((entry) => entry.command === command),
  argsOf: (command: string) => log.find((entry) => entry.command === command)?.args,
  /** Emits a backend event to whoever called `listen` for it. */
  emit(event: string, payload: unknown) {
    for (const handler of listeners.get(event) ?? []) handler({ payload });
  },
  listenerCount: (event: string) => (listeners.get(event) ?? []).length,
  reset() {
    queues.clear();
    log.length = 0;
    listeners.clear();
    resetDialogs();
    for (const release of openGate.values()) release();
    gates.clear();
    openGate.clear();
  },
};

/** `vi.mock("@tauri-apps/api/core", ...)` target. */
export const coreModule = () => ({ invoke: vi.fn(invoke) });
/** `vi.mock("@tauri-apps/api/event", ...)` target: `listen` plus the types. */
export const eventModule = () => ({ listen: vi.fn(listen) });

/**
 * `vi.mock("@tauri-apps/plugin-opener", ...)` target. `openUrl` only launches
 * the system browser, so a spy is the whole fake: a test asserts on the call
 * and its argument through `toHaveBeenCalledWith`, which needs no parameter
 * here and so keeps the spy free of an unused one.
 */
export const openerModule = () => ({ openUrl: vi.fn(async () => {}) });

/**
 * `vi.mock("@tauri-apps/plugin-dialog", ...)` target. The native file dialogs
 * return a path or null, and a test sets the answer per call with
 * `setDialog("open", ...)` / `setDialog("save", ...)`; the queue behaviour is
 * the same as `reply`, so a cancelled dialog (null) is expressible.
 */
const dialogReplies = { open: [] as unknown[], save: [] as unknown[] };
async function takeDialog(kind: "open" | "save"): Promise<unknown> {
  const queued = dialogReplies[kind].shift();
  if (queued instanceof Error) throw queued;
  return queued ?? null;
}
export const dialogModule = () => ({
  open: vi.fn(async () => takeDialog("open")),
  save: vi.fn(async () => takeDialog("save")),
});
export const setDialog = (kind: "open" | "save", ...values: unknown[]) => {
  dialogReplies[kind].push(...values);
};
export const resetDialogs = () => {
  dialogReplies.open.length = 0;
  dialogReplies.save.length = 0;
};
