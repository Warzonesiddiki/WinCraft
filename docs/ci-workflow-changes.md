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

| File | Change |
| --- | --- |
| `build.yml` | dropped the release step that ran `check-no-test-pro.mjs`, a script Batch AE deleted; the step was a guaranteed failure |
| `checks.yml` | added the site build and its SEO gate, ESLint, Prettier, the six remaining model suites, the language-default and change-history models, the component suite with the coverage ratchet, and the isolated native policy tests; dropped the `check-no-test-pro` step |
| `deploy-site.yml` | rebuild the site when the shared modules it imports from `src/` change |

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
