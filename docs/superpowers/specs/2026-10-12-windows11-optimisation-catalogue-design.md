# WinCraft 1.20 — Windows 11 Optimisation Catalogue

**Date:** 2026-10-12
**Status:** Design approved in review; not yet implemented. Amended 2026-10-15 with §16 Barebone addendum (Atlas 0.5.x parity, opt-in).
**Supersedes:** nothing. Extends the 81-tweak catalogue shipped in 1.19.0.

---

## 1. The thesis

WinCraft does not compete with AtlasOS and ReviOS on feature count. Both ship
considerably more changes, and neither can undo them:

> **AtlasOS FAQ:** "AtlasOS does not provide a rollback or recovery option. You
> will need to reinstall Windows."
>
> **ReviOS uninstall:** "Fix problems using Windows Update → Reinstall now".

Neither project contains snapshot, restore or rollback code at all — verified by
inspection of `revision-tool`'s registry and package services, which reference
none of `backup|restore|undo|revert|rollback|snapshot|RegSaveKey`. AtlasOS's
only backup is a `BACKUP.ps1` that exports service `Start` values to a `.reg`
file, plus a `-OLD` rename trick for device power keys.

Their performance claims also do not survive independent measurement. AtlasOS
advertises Valorant 217.5 → 365.91 FPS. TechTeamGB measured fresh-vs-fresh on
identical images:

| | Avg FPS | 1% lows | Latency |
|---|---|---|---|
| AtlasOS v0.3.1 | 444 | 403 | 11.3 ms |
| Stock Windows 10 | 444 | 401.5 | **11.2 ms** |
| Windows 11 LTSC | 442 | 393 | 11.4 ms |

> "there is functionally no difference… Literally nothing in it."

XDA likewise: *"couldn't observe significant performance improvements."* The
only reproducible win is RAM-at-boot (~1–1.5 GB) and a small idle-CPU reduction.

So the claim is:

> **Every change WinCraft makes is reversible, verifiable, and labelled with
> whether it actually does anything.**

Three capabilities, all from the engine that already exists: snapshot before
write, verify the write landed, and roll back exactly. AtlasOS and ReviOS have
none of the three.

## 2. Goals

1. Close the real gap in reversible coverage: telemetry policy breadth, service
   trimming, the service-host-split fan-out, and a handful of responsiveness and
   network-hardening settings.
2. Make every card state **what it does, what it needs, when it takes effect,
   and whether it measurably helps.**
3. Make the count/gate burden regenerable, so the failure that shipped
   "46 Free and 35 Pro" in the 1.18.1 notes for several releases cannot recur at
   ~149 tweaks.
4. Publish a **"we deliberately do not do this"** page, with reasons and sources.

## 3. Non-goals

- Not an AtlasOS replacement. We are explicitly *not* attempting feature parity.
- Not a clean-install tool. Nothing here requires a fresh Windows.
- Not a debloat product. AppX and WinSxS removal are out of scope entirely
  (see §7).
- No one-shot script apply. Presets select cards; the user applies.

## 4. Licensing constraints on the research

Nothing is vendored. Everything below was read for **technique only**.

| Artefact | Licence | Consequence |
|---|---|---|
| `Atlas-OS/Atlas` playbook | **GPL-3.0** | No code or YAML copied into this MIT project |
| `meetrevision/playbook` | CC BY-SA 4.0 | Attribution only if quoted |
| `meetrevision/packages` | **CC BY-NC-SA 4.0** | **Non-commercial — must not be vendored at all** |
| `meetrevision/revision-tool` | **GPL-3.0** | Clean-room only |
| Fluent UI (`fluent_ui`) | MIT | Safe as a reference |

## 5. Architecture — engine changes

### 5.1 Typed registry values

Today two tables disagree. `RegistryTweak` (`src-tauri/src/tweaks.rs:47`) already
carries `on_value: RegValue`, but `SettingsTweak` (`settings_tweaks.rs:18`) uses
`Write { value: u32 }` — REG_DWORD only. `RegValue` itself is `Dword(u32)` and
`Str(String)` only, and `WinRegistry::read` returns `InvalidData` for anything
else, which *fails the apply before the snapshot is written* — a deliberate
fail-closed design that must be preserved.

```rust
pub enum RegValue {
    Dword(u32),
    Qword(u64),
    Str(String),
    ExpandStr(String),
    MultiSz(Vec<String>),
}
```

Changes required:

- `RegistryBackend::read`/`write` in `tweaks.rs:19-42` — map each variant to the
  corresponding `winreg` call. Keep `InvalidData` for `Binary`.
- `tests/mock_registry.rs` — `Stored` must gain the new variants; the
  `Stored::Unsupported` arm stays for anything genuinely unsupported.
- `RegValue` already derives `Serialize, Deserialize, Clone, Debug, PartialEq`,
  so `rollback.rs`, the change-history ledger and `updatewatch`'s "still
  applied?" comparison keep working unchanged.

`Binary` is deliberately omitted: its only uses found in the research are IFEO
`MitigationOptions` blobs, which are excluded (§7).

### 5.2 Two new declarative operations

```rust
pub enum Op {
    Write(Write),                    // create or overwrite a value
    DeleteValue { path, name },      // remove a value; rollback rewrites the original
    DeleteKey  { path },             // remove an empty key; rollback recreates it
}
```

`DeleteKey` matters because `HKLM\SOFTWARE\Policies\...` keys frequently do not
exist until something writes them, and several entries delete a value in order to
*reset to default* — only correct if the original was snapshotted first.

`RegistryKeyCreated` already exists as a snapshot variant (`rollback.rs:118-121`)
for the context-menu use case, so the shape is proven.

### 5.3 Three new attributes

```rust
pub evidence: Evidence,   // Measured | Modest | Neutral
pub effect:   Effect,     // Immediate | SignOut | Restart | Reboot
pub risk:     Risk,       // None | Note(&'static str)
```

`effect` does not exist today and roughly half of these policies need it. `risk`
carries the breakage warnings the research documents inline on the card.

These serialise through `TweakInfo` (`lib.rs:142-172`) and `src/types.ts:33-60`.

### 5.4 One new snapshot kind

```rust
ScheduledTask { path: String, was_enabled: bool }
```

`scheduledtasks.rs` already implements enable/disable and **already refuses to
touch `\Microsoft\*` paths** (`scheduledtasks.rs:72-83`), but its state is *not*
in the rollback store. Adding this kind makes six existing user-facing
capabilities reversible with no new user-facing surface.

### 5.5 Explicitly not added

| Not added | Reason |
|---|---|
| `fsutil` writes | No read-back — cannot verify or restore |
| `bcdedit` changes | Invisible to a registry snapshot; ReviOS #167 broke sleep |
| `MSPower_DeviceEnable` blanket write | AtlasOS's inverse re-enables hardware-disabled devices |
| ViVeTool dependency | Would require shipping `vivetool /enable` or the undo is fiction |
| `hosts` file overwrite | Destroys existing entries including corporate blocklists |
| `SetTimerResolution.exe` | Requires VBS/Core Isolation off, which is Win11 default-on |

## 6. Catalogue design

### 6.1 Evidence tiers

| Tier | Meaning | Shipping rule |
|---|---|---|
| **Measured** | A reproducible measurement exists; cited on the card | Ship, cite the source |
| **Modest** | Real but small or conditional | Ship, state the condition |
| **Neutral** | Harmless; no measurable effect | Ship — users expect it — but **never claim it helps** |

A fourth tier, **Harmful**, is not a card tier. Documented-together-with-reasons
techniques appear on the exclusion page (§7).

AtlasOS already does the equivalent in source comments — `# Disabled as there's
no evidence it helps (likely placebo)`, `# Breaks Bluetooth connectivity`. This
design makes that visible to users.

### 6.2 Grouping

`Category` is a flat five-value enum (`tweaks.rs:4`) driving the sidebar. Privacy
alone would go from ~28 to ~63 rows. Add `group: &'static str` to both tweak
structs, presentational only:

```
Privacy            Performance         Ui
├ Telemetry        ├ Responsiveness    ├ Taskbar
├ Advertising      ├ Memory & services ├ Explorer
├ Activity         ├ Power             └ Windows shell
├ Search           └ Network hardening
└ Input
```

Sub-groups must not change apply or rollback semantics. A tweak's group must be
derivable from its id, so `scripts/test-starter-presets.mjs` — which parses
`tweaks.rs` **as text** — keeps working.

## 7. Exclusions — the "we deliberately do not do this" page

| Excluded | Reason | Source |
|---|---|---|
| Remove Windows Defender / SmartScreen | A security downgrade, not an optimisation. AtlasOS's most-upvoted tracker request (15 👍) is to stop | AtlasOS #704 |
| Remove AppX / WinSxS components | Atlas: "You will need to reinstall Windows." ReviOS: "Reinstall now" | atlasos.net FAQ |
| Turn off Smart App Control | Microsoft documents it as one-way; we cannot verify an inverse | AtlasOS lists it as its only permanently-deleted item |
| `fsutil` changes | No read-back | — |
| `bcdedit` changes | Invisible to a registry snapshot | ReviOS #167 |
| SMB / LLMNR / NIC-binding disables | Broke WSL, VLAN tagging, Minecraft | ReviOS #1615, #1032, #67 |
| IFEO `Debugger=taskkill.exe` | Image-name-global; a known EDR/malware-bypass primitive | — |
| Disable VBS / Core Isolation | On by default in Windows 11; required by the latency tricks | TechTeamGB |

## 8. The catalogue gap

Several techniques assumed to be new **already exist**. Verified against the
source:

| Already shipped | Existing id |
|---|---|
| `Win32PrioritySeparation` | `priority_separation` |
| Timer resolution | `global_timer_resolution` |
| TCP congestion provider | `tcp_congestion_bbr` (netshaper, reversible) |
| `SystemResponsiveness` | `system_responsiveness` |
| `MenuShowDelay` | `menu_show_delay` |
| `MinAnimate` | `disable_window_animations` |
| Background apps | `disable_background_apps` |
| Power throttling | `disable_power_throttling` |
| Telemetry policy | `disable_telemetry_tasks` — **one** location |

AtlasOS writes `AllowTelemetry=0` to 4 locations; ReviOS to 7. Writing one is how
the setting silently returns.

### 8.1 Scope by area

| Area | Have | Gap | New |
|---|---|---|---|
| **Telemetry & privacy** | 1 policy location | 7-location sweep, AppCompat, CEIP, WMI autologgers, input personalization, ~20 `ContentDeliveryManager` keys, WER, Search policies | **~35** |
| **Services** | 2 (`WSearch`, `ai_fabric`) | AtlasOS's ~12 excluding Xbox; `edgeupdate`→Manual; `condrv`→Automatic | **~14** |
| **`SvcHostSplitDisable` fan-out** | absent | Biggest process-count/RAM lever either project ships; one DWORD per service key | **1** |
| **Scheduled tasks** | mechanism exists, not journalled | Snapshot kind (§5.4) | **~6** |
| **Responsiveness extras** | core 3 exist | `StartupDelayInMSec`, `HungAppTimeout`, `WaitToKillAppTimeOut`, `WaitToKillServiceTimeout`, `DisableWpbtExecution`, Aero Peek | **~8** |
| **Network hardening** | latency tuning exists | `DisableBandwidthThrottling`, `RestrictNullSessAccess`, `RestrictAnonymous`, `RestrictAnonymousSAM` | **~4** |

**Total: 35 + 14 + 1 + 6 + 8 + 4 = 68 new. 81 → ~149.** The estimates are
per-area and will move as Phase 0 calibrates the tiers; the *total* is the sum
of the rows above, not a separate estimate. Deliberately left enabled, matching
AtlasOS v0.5
and against common debloat folklore: `SysMain`, `WSearch` (minimal indexing
only), Xbox/Game Bar services, `Spooler`, Bluetooth services, network discovery,
System Restore.

`PcaSvc` carries `risk: "removes Program Compatibility Assistant; some apps
mis-detect hardware"` — AtlasOS keeps the `Microsoft-Windows-DeviceCensus`
component specifically to cover this, and we copy that coupling.

## 9. Presets

`scripts/test-starter-presets.mjs:5-23` reads `tweaks.rs` **as text** and asserts
every id named in `STARTER_PRESETS` has `requires_admin: false`, `requires_pro:
false`, `hive: Hive::Hkcu`. Existing presets are HKCU-only by construction.
Nearly every tweak in this plan is HKLM + admin.

**Decision: presets are selection-only.** A preset pre-ticks N cards; the user
reviews the preview and applies. No gate change is needed, the human stays in the
loop before a large change, and it matches the "no opaque one-shot script" thesis.
Options (a) relax the gate to allow admin ids via `split_by_elevation`, and (c)
one-click apply with a full preview, can follow once the preset model moves out
of text.

A preset must exclude `unavailable` cards and `MANUAL_ONLY_TWEAKS`
(`disable_memory_integrity`), and report **"N of M cards do not apply on this
PC"** rather than silently dropping them.

## 10. Gates — and the generator

### 10.1 Touchpoints per new tweak

| # | Touchpoint |
|---|---|
| 1 | Rust row in `tweaks.rs` or `settings_tweaks.rs` |
| 2–7 | `tweaks.<id>` in **six** locale files |
| 8 | `lib.rs:2717` hardcoded catalogue count |
| 9–15 | Public count: README (7 places), `site/src/i18n/dictionary.ts`, `site/src/pages/practical-guides.ts`, 6 store listings, release notes, `site/scripts/check-seo.mjs` |
| 16 | `scripts/vm/tweak-matrix.json` (settings tweaks only) |
| 17 | Seam-test entry in `tests/mock_registry.rs` |

~68 tweaks × ~17 = **~1,200 manual edits**, each a chance to miss a gate. This is
the real engineering risk of the release — not the Rust.

### 10.2 `scripts/gen-tweaks.mjs`

Reads the Rust tables and emits the six locale entry sets, the public-count
numbers, and the seam-test id list. Converting ~1,200 remembered edits into one
command is what makes the phase gates survivable, and it makes it *impossible* to
add a tweak without updating the count.

`check-public-counts.mjs` then verifies the generator missed nothing. Its regexes
against `lib.rs` must stay whitespace-tolerant — the first `cargo fmt` broke
them and silently unverified every public count.

### 10.3 Existing gates every phase must pass

- `cargo fmt --check` — failing on 38 of 72 files before this session.
- `cargo clippy --all-targets -- -D warnings` — failing with 22 errors across 14 files before this session.
- `cargo test --lib` (523 passing) — notably `the_catalogue_is_eighty_one_tweaks_all_free_in_output` (bump the number), `no_value_is_written_twice_or_by_another_tweak`, `every_id_is_translated_in_every_language`, `every_visible_tweak_is_covered_by_a_seam_test_or_is_panel_only`.
- `check-i18n`, `check:i18n-quality` — a copy-pasted English description **fails** `audit-i18n.mjs` unless whitelisted in `REVIEWED_AS_CORRECT`.
- `check-public-counts`, `check-design-tokens`, `test:coverage` ratchet.
- `npm run check` end to end before merge, not at release.

## 11. Testing strategy

Per new card:

1. **Seam test** in `mock_registry.rs` — apply → snapshot → mutate externally → rollback restores exactly; re-apply keeps the oldest original; write-doesn't-stick is refused; preview is read-only.
2. **Tweaks test** for effect/evidence/risk wiring.
3. **Axe-clean row test** (`tweak-row.test.tsx` pattern) — 23 files / 326 tests today.
4. **i18n** — present in all six locales, shape-matched to English.

New for the fan-out (Phase 3): a test proving Xbox services are **never** touched,
and that every touched key appears in the snapshot.

## 12. Phasing

Each phase ends green on `npm run check`.

### Phase 0 — Foundations *(no user-visible change)*
`RegValue` widening; `evidence`/`effect`/`risk`/`group` on both structs plus
`TweakInfo` and `types.ts`; `scripts/gen-tweaks.mjs`; annotate all **81 existing**
tweaks.

**Done when:** `cargo test` and `npm run check` green; the generator reproduces
all six locale tables byte-identically; the exclusion page exists in six
languages.

### Phase 1 — Rollback completion *(independently shippable)*
`SnapshotEntry::ScheduledTask` wired into `scheduledtasks.rs`.

**Done when:** every task toggle is rollback-able and covered by the mock-registry
suite; existing journals still validate.

### Phase 2 — Telemetry & privacy *(~35)*
**Done when:** every card tiered, translated, seam + axe + preview tested; the
public count regenerated, not hand-edited.

### Phase 3 — Services & the fan-out *(~15)*
The only phase needing a genuinely new module: dependency and in-use analysis
before disabling anything.

**Done when:** the fan-out snapshots every key it touches, rolls back all of
them, refuses when a dependent service is running, and a test proves Xbox
services are never touched. **Manual test on real hardware before shipping.**

### Phase 4 — Responsiveness & network hardening *(~12)*
**Done when:** same gate as Phase 2, plus the `Effect` badge verified against a
real sign-out on at least one card per tier.

### Phase 5 — Presets, exclusion page, UI
**Done when:** a preset on a Home-edition laptop reports "N of M do not apply on
this PC"; the exclusion page renders in six languages.

## 13. Risks

| Risk | Mitigation |
|---|---|
| Phase 0's annotation of all 81 existing tweaks overruns | It is the phase most likely to overrun. Calibrating the tier standard on known cases before 67 new ones depend on it is worth it |
| The `SvcHostSplitDisable` fan-out is the only genuinely risky item | Phase 3 ships separately with a manual hardware test |
| `check-i18n-quality` rejects copy-pasted English | Real translation work, not machine translation; the gate is doing its job |
| Coverage ratchet drops as new untested files appear | Raise the ratchet with the suite, never lower it |
| A future `cargo fmt` breaks a layout-sensitive gate | Already fixed for `check-public-counts`; `check-workflow-scripts` parses structure, not layout |

## 14. Open questions

1. **Sub-group naming** — §6.2 proposes a structure; the names are a starting
   point for user review, not a settled taxonomy.
2. **Preset composition** — which groups each preset selects is a product
   decision deferred to Phase 5, once the cards exist.
3. **`effect` accuracy** — some registry policies take effect at an unpredictable
   moment (Explorer restart, logoff). Phase 4 verifies these on real hardware
   rather than trusting documentation.

## 15. Sources

- AtlasOS: <https://github.com/Atlas-OS/Atlas> · <https://atlasos.net> · <https://docs.atlasos.net>
- ReviOS: <https://revi.cc> · <https://github.com/meetrevision/playbook> · <https://github.com/meetrevision/revision-tool>
- AME Wizard / Ameliorated: <https://amelabs.net>
- Independent benchmark: <https://techteamgb.co.uk/2024/01/12/custom-windows-os-claims-lower-latency-and-more-performance-atlas-os>
- XDA review: <https://www.xda-developers.com/tried-kinder-windows-experience-atlasos-how-should-be>
- Key issues: AtlasOS #704, #1016, #1556, #1615, #1672; ReviOS #49, #167, #228

---

## 16. Addendum 2026-10-15 — Barebone (Atlas 0.5.x parity, opt-in)

### 16.1 Version correction

There is no modern `0.5.2` AME playbook. Current Atlas line is `0.5.0` +
`0.5.0-hotfix` (21 Oct 2025) supporting Windows 11 24H2 `26100` + 25H2 `26200`.
`archive.org/details/atlasos-20h2` labelled `v0.5.2` is the legacy NTLite-ISO era,
not the current playbook. Where the request says `0.5.2`, this spec reads
`0.5.x = 0.5.0 / hotfix`.

Playbook conf: `SupportedBuilds 26100,26200`, `UpgradableFrom 0.4.1`.

### 16.2 What Atlas barebone actually is (0.5.x)

Not a deep component strip. Live-system AME Wizard playbook:

- Deprovisions ~30 AppX families (Store-reinstallable), optional Edge + Snipping Tool.
- Removes 1 DISM capability by default (`App.StepsRecorder`), strips OneDrive setup via script unless set up, installs `Z-Atlas-NoTelemetry-Package` always and `Z-Atlas-NoDefender-Package` only if user picks Disable Defender.
- Disables ~8 services + 3 drivers (`startup=4`), disables ~7 scheduled tasks, sets ~100 registry policies.
- Leaves Defender ON by default (recommended), UAC ON, Firewall ON, WinRE ON, Store functional, Windows Update manual-but-present. Security-weakening choices are explicit opt-in radios.
- Only documented irreversible-without-reinstall item is Smart App Control (`VerifiedAndReputablePolicyState=0`).

Removed-features, security and configuration docs:

- <https://docs.atlasos.net/faq/install-faq/removed-features/>
- <https://docs.atlasos.net/post-install/atlas-folder/security/>
- <https://docs.atlasos.net/post-install/atlas-folder/configuration/>
- <https://docs.atlasos.net/faq/general-faq/atlas-and-security/>

Relevance for WinCraft: Atlas-parity Barebone must be **default-safe + opt-in aggressive**, not default-aggressive.

### 16.3 Reversal of §3, scoped

§3 said not a debloat product and no AppX/WinSxS removal. That thesis stands for the **core catalogue**, which remains Tier 1 reversible-only.

Barebone is a **separate opt-in surface** with its own tier model and consent, so the core promise — every default change is reversible, verifiable, labelled — is intact:

| Tier | Meaning | Examples | Rollback story | UX gate |
|---|---|---|---|---|
| 1 Reversible | Rollback store restores exact prior value | All current `tweaks.rs` / `settings_tweaks.rs` / `services.rs` | `rollback_by_id` verified | Standard preview + apply |
| 2 Reinstallable | No in-place undo; recovery via Store / re-enable | Current `debloat.rs` CATALOG (current-user MSIX, 25 items) | Journal + reinstall link + `impact` copy | Per-app what-you-lose, N-of-M |
| 3 Irreversible / Barebone-only | Affects other users, provisioning, or servicing | Provisioned-package removal, `\Microsoft\` task disables, `Disabled` services, servicing-tattoo policies | Restore point (best-effort) + export; **no rollback promise** | Separate consent, typed confirm, per-item checkboxes, excluded from bulk/scan/reapply |

Implementation: add `reversibility` / `tier` to `CatalogItem` (`debloat.rs:14`), `ServiceTweak` (`services.rs:10`), `SettingsTweak`, and a `BareboneItem{tier}` for the new surface. Expose `tier` + `consentRequired` via `tweak_infos()` and `DebloatApp`. `rollback::validate_snapshot` rejects Tier 3 from the reversible store — Tier 3 goes to a separate `barebone_history.json` with `Applied / Reverted-Unknown`, never `SnapshotEntry::Registry`.

Licensing guard (binding): AtlasOS GPL-3.0, `meetrevision/packages` CC BY-NC-SA non-commercial, `revision-tool` GPL-3.0. Read for technique classes only. No vendoring. Every candidate independently verified on clean VM.

### 16.4 Barebone scope (Atlas parity)

Default ON (safe, Atlas-default): AppX deprovision list (keep Store, Photos, modern Media Player, Xbox overlay optional), StepsRecorder capability removal, ContentDeliveryManager hardening, `AllowTelemetry=0` + DiagTrack/Wer/CEIP/UCPD-velocity tasks off, Feeds/Copilot/Recall policies, auto-app-archival off, background-apps off, minimal indexing, file-sharing/location off, visual FX off, delivery-optimization off.

Opt-in (radio, default OFF, warn): Defender removal, Edge removal (with WebView keep option), mitigations off, VBS off, auto-updates off, hibernation off, power-saving off, Bluetooth/print stacks off, CPU-Idle off.

Never by default (explicit ack + restore-media check): Smart App Control disable, `Reset this PC` disable, WebExperience firewall blocks, InstallService deletions.

Must implement: service/task backup (`winServices.reg` equivalent), default-user hive handling, per-item state file, Store `wsreset -i` repair path, Bluetooth/Print/FSO/GameBar one-click restores, WU re-enable before Store/Xbox downloads. Order: Tier 1 CDM policies → Tier 2 AppX → Tier 1 service/task so Store does not rehydrate removed apps.

Current WinCraft base already present: `debloat.rs` CATALOG (25 items, publisher + Store URL + journal + `eligible()` / `verified_candidate()` re-checks), `services.rs` snapshot + verify + `not_present` UX, `scheduledtasks.rs` third-party-only guard + XML state read, `restore_point.rs` best-effort checkpoint, `split_by_elevation` single-UAC batch.

### 16.5 Extension points for vibe coding

- **Debloat catalog:** keep `CATALOG` Tier 2 as-is. New `barebone_packages.rs` holds Atlas-class candidates, each with `package_name`, `publisher_id`, `publisher`, `store_url`, `tier`, `min_build`, `edition`, `depends_on`. Reuse `eligible()` verbatim; add `barebone_eligible()` refusing frameworks, Store/DesktopAppInstaller/ShellExperienceHost/StartMenuExperienceHost/UI.Xaml/VCLibs, GamingServices, and dependents. Provisioned removal is Tier 3, admin-only, separate journal + restore-point attempt first.
- **Services:** grow `SERVICE_TWEAKS` via allowlist only, default `manual:true`. Reuse `apply_service` / `rollback_service`, `installed()` pattern, extend VM matrix + `verify-tweaks.ps1` `Read-Service`.
- **Tasks:** new `SnapshotEntry::ScheduledTask { path, previously_enabled }`, allowlisted `BAREBONE_TASKS` exact paths (no wildcards), `snapshot_targets: task:{lowercased path}`, XML read → `schtasks /change /disable` → re-read verify. Default `list_scheduled_tasks` keeps hiding `\Microsoft\`; new `list_barebone_tasks()` shows allowlist only.
- **Preflight `barebone::preflight()` (read-only):** build+edition via `settings_tweaks::machine()` + `availability()`, laptop vs desktop via scan profile, gaming/Xbox/Store deps via installed-package scan, multi-user provisioned check, elevation/session via `elevation::is_elevated()`, UCPD via `user_choice_protected()` → `windows_protected`.
- **Presets stay selection-only:** Tier-2 subset pre-checked, Tier-3 shown unchecked in gated group, `{selection, missing, unavailable}` + `N-of-M` badge. `bulk_applicable()` / `fits_this_pc()` exclude Tier-3; scan/profiles/reapply never include them. `MANUAL_ONLY_TWEAKS` gains Tier-3 ids. Fix `debloat-copy.ts:138` `presetBareboneHint` wording in all six locales.

### 16.6 Vibe-coding phases (each ends green on `npm run check`)

- **Phase B0 Tier plumbing:** `tier` field + passthrough + `validate_snapshot` rejection. Done: `cargo test` green, count untouched, no new surface.
- **Phase B1 Package table read-only:** 5–10 VM-verified candidates, list-only command. Done: identity test covers table, VM shows `removable`/`reason`, no removal wired.
- **Phase B2 Service fan-out 1–2 services:** Manual telemetry-adjacent service, matrix + verify coverage. Done: Baseline→Applied→Reverted PASS on Pro VM, N/A where absent.
- **Phase B3 Task snapshot 1–2 tasks:** oldest-original + overlap rejection unit tests. Done: VM disable→verify→re-enable restores exact `<Enabled>`.
- **Phase B4 Preflight + consent + restore-point gating:** Tier-3 blocked without consent, outcome displayed, audit origin logged. Done: Home/Win10/Education show correct `unavailable` codes.
- **Phase B5 Preset + i18n + counts:** N-of-M, bulk exclusion, six-locale copy, `check-i18n`, `check-public-counts`, count test, `PCT_WRITE_VM_MATRIX=1` refresh. Done: `npm run checks` green.
- **Phase B6 VM sign-off:** full `verify-tweaks.ps1` Baseline/Applied/Reverted on VMs A–D + Debloat check + result sheets (git-ignored, attached to release). Done: 0 failures.

Explicit non-goals for Barebone: no provisioned removal in default flow, no `\Microsoft\` tasks in Startup screen, no `Disabled` services without per-service VM evidence, no bulk/scan inclusion of Tier 3, no FPS/latency claims.
