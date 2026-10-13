# CI workflow changes — applied

**These changes are in `.github/workflows/`. They are no longer held back.**

They lived in `ci-workflow-changes.patch` because the connection this work ran
through was a GitHub App installation without the `workflows` permission, and
GitHub refuses any push whose net effect updates a file under
`.github/workflows/`:

```
refusing to allow a GitHub App to create or update workflow
`.github/workflows/build.yml` without `workflows` permission
```

The rule is evaluated on the diff, not on the commits, so a branch whose tip has
the workflows as they were on `master` pushes fine even when earlier commits in
it edited them.

The permission is in place and the patch was applied in commit `48bfbbb`
("Fix the language-default gate, and apply the CI patch the fork could not").
The patch file itself is removed so it cannot be applied a second time and
revert the workflows.

## What changed

Cut against `master` at `fb97d48`, against the workflows as they then stood:

| File              | Change                                                                                                                                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `build.yml`       | dropped the release step that ran `check-no-test-pro.mjs`, a script Batch AE deleted; the step was a guaranteed failure                                                                                                                                            |
| `checks.yml`      | added the site build and its SEO gate, ESLint, Prettier, the six remaining model suites, the language-default and change-history models, the component suite with the coverage ratchet, and the isolated native policy tests; dropped the `check-no-test-pro` step |
| `deploy-site.yml` | rebuild the site when the shared modules it imports from `src/` change                                                                                                                                                                                             |

That last one is a correctness fix, not a convenience. `site/src/promo.tsx`
renders the offer banner from `src/components/halloween-offer.tsx` and reads
the offer format from `src/promo.ts`; `site/src/pages/Uninstaller.tsx` reads
`src/promo.ts` too. A change under `src/` could therefore break the site build
without touching `site/`, which is how a deleted component left the deploy
workflow's own `npm run check:seo` failing on all 17 routes while nothing in the
app's checks noticed.

## The lesson, kept as a gate

A workflow cannot run a check on its own edits before it runs — the two dead
`check-no-test-pro.mjs` steps sat on `master` through several releases because
CI had never executed. `scripts/check-workflow-scripts.mjs` now resolves every
script, `npm run` and `.ps1` a workflow names against the tree and
`package.json`, and runs in `checks.yml` as its own step. It is part of
`npm run check` too, so it is enforced locally as well.

## Pending patches: two files, one blocker

Further changes are **not applied**, because the connection this work runs
through is again a GitHub App installation without the `workflows` permission:

```
refusing to allow a GitHub App to create or update workflow
`.github/workflows/checks.yml` without `workflows` permission
```

Both patches are held rather than dropped — they are the two halves of work
whose point is not to rot:

| Patch                            | Touches                                | What it does                                                                                                                                                                                                                                                                                                       |
| -------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs/checks-annotation.patch`   | `checks.yml`                           | Replaces the `Rust unit tests` step's plain `npm run check:rust` with a run that captures cargo's output and re-emits the lines that matter — `error[E…]`, `warning: unused`, `panicked at`, `test result: FAILED`, the failing test's `----` header — as `::error::` annotations. A failed run's log is a download that few people open, and the reason sits hundreds of lines above the last line; annotations are what the run page and the checks API show. |
| `docs/workflows-pending.patch`   | `checks.yml`, `deploy-site.yml`        | Adds a `backend` job with a `postgres:16` service and `TEST_DATABASE_URL` + `DATABASE_ALLOW_PLAINTEXT` so the three database tests stop being skipped; and passes `enablement: true` to `actions/configure-pages` so the site deploy can create the Pages site, which is the one thing every deploy job has failed on so far.               |

Apply either with:

```sh
git apply docs/checks-annotation.patch
git apply docs/workflows-pending.patch
```

The `workflows-pending` patch moves the remaining checks into CI. Two of the
three it was written for now have a home that does not need a workflow edit:

- `scripts/check-no-new-privileges.mjs`, `scripts/check-data-inventory.mjs`,
  `scripts/check-download-links.mjs`, `scripts/check-site-links.mjs` and
  `scripts/check-license-claims.mjs` have no step of their own in `checks.yml`.
  They are enforced anyway: `src/repo-gates.test.ts` runs them through the
  Vitest suite, which is a step in that workflow, so a red gate still fails the
  run. A step would be the tidier home, not the only enforcement.
- `scripts/test-quick-installer.ps1` is Windows-only — and it runs in CI now,
  through `src/repo-gates.test.ts`, in the same `checks` job, on the same
  Windows image (the suite plus a parse of every `.ps1` in the tree). It used to
  need this patch; it no longer does, and the patch no longer adds a step for
  it, because running the same suite twice in one job buys nothing.
- the three PostgreSQL-backed backend tests (transaction rollback, account
  deletion eligibility, retention) skip themselves without `TEST_DATABASE_URL`,
  which is the state CI has been in: 194 passing, 3 skipped. With the job in
  the patch they run against a real server, which is how they were verified
  locally (197 passing, 0 skipped).

It is held back rather than dropped because the two workflow test steps this
project has already had that "ran" for several releases without ever
executing showed what an unread failure costs.
