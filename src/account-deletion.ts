/**
 * Closing an account, from the app's side.
 *
 * The server decides what deletion means; this module exists so the request
 * and its refusal reasons are one testable unit rather than a fetch call
 * buried in a component. Failures carry a machine-readable `problem` so the
 * window can say the same thing in the reader's language instead of showing
 * the backend's English sentence — with the server's own text kept as the
 * fallback for anything this client has never heard of, because a new refusal
 * reason must never arrive as a blank message.
 */

export type DeletionProblem =
  | "confirmation-required"
  | "password-required"
  | "password-mismatch"
  | "active-subscription"
  | "unauthenticated"
  | "unreachable"
  | "unknown";

export class AccountDeletionError extends Error {
  problem: DeletionProblem;
  constructor(problem: DeletionProblem, message: string) {
    super(message);
    this.name = "AccountDeletionError";
    this.problem = problem;
  }
}

/** What the person has to type to confirm, exactly. */
export const DELETION_WORD = "DELETE";

/** The problems the server names, plus the ones this client can see for
 *  itself. An unrecognised code falls through to `unknown`, which still shows
 *  the server's message. */
function problemFor(status: number): DeletionProblem {
  if (status === 401) return "unauthenticated";
  return "unknown";
}

export async function requestAccountDeletion(input: {
  apiBase: string;
  token: string;
  password: string;
  confirm: string;
  /** Injected in tests; the real call is bounded so a hung request cannot
   *  leave the button spinning forever. */
  fetchImpl?: typeof fetch;
}): Promise<void> {
  const doFetch = input.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await doFetch(`${input.apiBase}/api/account`, {
      signal: AbortSignal.timeout(8000),
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${input.token}` },
      body: JSON.stringify({ password: input.password, confirm: input.confirm }),
    });
  } catch (error) {
    throw new AccountDeletionError(
      "unreachable",
      error instanceof Error ? error.message : String(error),
    );
  }

  if (response.ok) return;

  const body = (await response.json().catch(() => ({}))) as { code?: string; error?: string };
  const known: DeletionProblem[] = [
    "confirmation-required",
    "password-required",
    "password-mismatch",
    "active-subscription",
  ];
  const problem = known.includes(body.code as DeletionProblem)
    ? (body.code as DeletionProblem)
    : problemFor(response.status);
  throw new AccountDeletionError(problem, body.error || `HTTP ${response.status}`);
}
