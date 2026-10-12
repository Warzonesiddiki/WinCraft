# API reference

Two surfaces: the **HTTP API** in `backend/` (accounts, licenses, commerce) and
the **desktop IPC commands** in `src-tauri/`. The desktop app also reads a few
static files served by the backend.

## HTTP API

Base URL in production is the API host configured in `src/lib.ts`
(`https://api.wincraft.app`). Local development runs `npm run dev` inside
`backend/`, which serves the same routes on `PORT` (default 8080).

### Conventions

- Bodies are JSON, except `POST /api/stripe-webhook`, which needs the raw bytes.
- Browsers are restricted by an origin allowlist (`CORS_ORIGINS`); the desktop
  app sends a bearer token instead of a cookie.
- Authenticated routes take `Authorization: Bearer <jwt>`. Tokens are signed
  with `JWT_SECRET` (HS256) and invalidated by bumping `token_version`.
- Operator routes take `x-admin-token: <ADMIN_TOKEN>`, compared in constant time.
  Missing or wrong tokens answer `404 Not found` on purpose.
- Server-to-server routes take `Authorization: Bearer <ECOSYSTEM_API_KEY>`.
- Errors are `{ "error": "message" }` with a 4xx/5xx status. Unconfigured
  dependencies answer `503` rather than pretending to work.
- `Cache-Control: no-store` is set on every `/api` response, and a service-wide
  limit of 1200 requests / 15 min per client applies to all of them. Sensitive
  auth routes add their own limits (noted below).

### Health and metadata

| Method | Path      | Auth | Response                                                                  |
| ------ | --------- | ---- | ------------------------------------------------------------------------- |
| GET    | `/health` | none | `{ ok: true }`                                                            |
| GET    | `/ready`  | none | `{ ok: true }`, or `503` when the database is unconfigured or unavailable |
| GET    | `/`       | none | Landing page; legal pages and checkout result pages are served statically |

### Accounts and auth (`/api/auth`, `/api/account`)

| Method | Path                            | Auth   | Body / query                                            | Response                                                                                                                                   |
| ------ | ------------------------------- | ------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/api/auth/register`            | none   | `{ email, password, firstName, lastName, dateOfBirth }` | `201 { token, verificationEmailSent }`; `400` on invalid email/password/name/date, `409` when the email exists. Extra limit: 60 min window |
| POST   | `/api/auth/login`               | none   | `{ email, password }`                                   | `{ token }` or `401`. Extra limit: 15 min window                                                                                           |
| POST   | `/api/auth/logout-all`          | bearer | —                                                       | `{ ok: true }`, invalidates every token for the account                                                                                    |
| POST   | `/api/auth/resend-verification` | bearer | —                                                       | `{ ok: true }` or `{ ok: true, alreadyVerified: true }`                                                                                    |
| GET    | `/api/auth/verify-email`        | none   | `?token=`                                               | HTML confirmation page                                                                                                                     |
| POST   | `/api/auth/forgot-password`     | none   | `{ email }`                                             | `{ ok: true }` (always, so the endpoint cannot be used to probe accounts). Extra limit: 60 min                                             |
| GET    | `/api/auth/reset-password`      | none   | `?token=`                                               | HTML form                                                                                                                                  |
| POST   | `/api/auth/reset-password`      | none   | `{ token, newPassword, confirmPassword }`               | `{ ok: true }`; extra limit: 60 min                                                                                                        |
| GET    | `/api/account`                  | bearer | —                                                       | `{ email, isPro, emailVerified, plan, hasBilling }`                                                                                        |

`isPro` is computed from the entitlement logic (`isEntitled`), not from the
stored flag alone, so a lapsed billing period revokes access even if no webhook
arrived. `hasBilling` only tells the client whether a Stripe customer exists.

### Licenses and entitlements

| Method | Path                      | Auth          | Body / query                     | Response                                                                                                                                                                                       |
| ------ | ------------------------- | ------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/license`            | bearer        | `?product=` (default `wincraft`) | Signed license payload: `{ userId, isPro, plan, product, issuedAt, expiresAt, signature }`. `400` for an unknown product; `503` when the database or the signing key is missing (fails closed) |
| GET    | `/api/entitlements`       | bearer        | —                                | `{ products: [...] }` — the caller's own entitlements                                                                                                                                          |
| GET    | `/api/entitlements/check` | ecosystem key | `?email=`                        | `{ anyActive, products: ["wincraft", "uninstaller", …] }`; `400` invalid email, `429` when the lookup budget is spent, `404` for a caller without the key                                      |

Product ids live in `backend/src/products.ts`. `pctweaker` stays valid as a
legacy alias of `wincraft`, and `uninstaller` is a separate product with its own
entitlement rows.

### Commerce (`/api/stripe`, `/api/offers`)

| Method | Path                   | Auth             | Body / query                | Response                                                                                                                                                                                                                                                                                       |
| ------ | ---------------------- | ---------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/stripe/checkout` | bearer           | `{ product, plan, promo? }` | `{ url }` — a Stripe Checkout session URL. `400` for an unknown product/plan, `403` when the account may not buy that plan (e.g. a second Uninstaller year), `503` when the price is unconfigured                                                                                              |
| POST   | `/api/stripe/tip`      | bearer           | `{ quantity?, utm? }`       | `{ url }` — one-off support payment (`STRIPE_PRICE_COFFEE`)                                                                                                                                                                                                                                    |
| POST   | `/api/stripe/portal`   | bearer           | —                           | `{ url }` — Stripe billing portal; `404` when the account has no customer                                                                                                                                                                                                                      |
| POST   | `/api/stripe-webhook`  | Stripe signature | raw JSON                    | `{ received: true }`. Verifies `Stripe-Signature` with `STRIPE_WEBHOOK_SECRET` before trusting anything; handles `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created/updated/deleted`, `charge.refunded`, `charge.dispute.created/closed` |
| GET    | `/api/offers/lifetime` | none             | —                           | Lifetime-offer state (`503` when the offer configuration is invalid). Kept for installed clients; the current app no longer reads it                                                                                                                                                           |
| GET    | `/api/offers/promo`    | none             | —                           | Current campaign/promo state. Separate from `/lifetime` because builds up to 1.16.x drew a hardcoded struck-through price from that payload                                                                                                                                                    |

The webhook is mounted before `express.json()` in `backend/src/index.ts` because
signature verification needs the unparsed body. Entitlement decisions made from
webhook payloads pass through `stripe-policy.ts`, which canonicalises the product
id and rejects metadata that contradicts the price that was actually charged.

### Public forms

| Method | Path                          | Auth        | Body / query                                                       | Notes                                                                                                       |
| ------ | ----------------------------- | ----------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| POST   | `/api/support`                | none        | `{ name, email, subject, message, category, systemInfo, company }` | `company` is a honeypot; replies are rate limited and a shared budget bounds abuse                          |
| POST   | `/api/error-reports`          | none        | `{ app, appVersion, message, context }`                            | `app` must be one of the accepted ids (`wincraft`, `uninstaller`, `pctweaker`)                              |
| POST   | `/api/newsletter`             | none        | `{ email, source, company }`                                       | `200 { ok: true }` either way; honeypot and budget apply                                                    |
| GET    | `/api/newsletter/unsubscribe` | signed link | `?email=&sig=`                                                     | HTML result page                                                                                            |
| POST   | `/api/newsletter/unsubscribe` | signed link | `{ email, sig }`                                                   | `{ ok: true }`                                                                                              |
| GET    | `/api/reviews`                | none        | —                                                                  | `{ average, count }` over published ratings                                                                 |
| POST   | `/api/reviews`                | none        | `{ rating, body, name?, email? }`                                  | `201 { rating }`; `400` for a rating outside 1–5 or an over-long body                                       |
| GET    | `/api/reviews/pending`        | admin       | —                                                                  | Ratings excluded from the public average                                                                    |
| PATCH  | `/api/reviews/:id`            | admin       | `{ published: boolean }`                                           | `{ ok: true, id, published }`                                                                               |
| POST   | `/api/download`               | none        | `?utm_source=&utm_medium=&utm_campaign=&utm_content=`              | `204` — beacon for tagged social posts; labels are filtered through the same allowlist as Checkout metadata |
| GET    | `/api/download/stats`         | admin       | `?days=` (1–365, default 30)                                       | `{ days, rows }` — per-label download counts                                                                |
| GET    | `/api/flags`                  | none        | —                                                                  | `{ processGuardHold }` — runtime switches the desktop app reads at start and hourly                         |

### Environment

Every variable is documented in `backend/.env.example`: `PORT`, `DATABASE_URL`,
`JWT_SECRET`, `LICENSE_SIGNING_PRIVATE_KEY`, `CORS_ORIGINS`, `APP_URL`,
`RESEND_API_KEY` / `SMTP_*` / `MAIL_FROM`, the `STRIPE_*` price and key
variables, `ECOSYSTEM_API_KEY`, `SUPPORT_EMAIL`, `ADMIN_TOKEN` and the checkout
result URLs. Never commit a filled-in `.env`.

## Desktop IPC commands

The frontend talks to Rust through Tauri's `invoke()`. The authoritative list of
command names is `src-tauri/src/ipc_commands.rs` (`APP_COMMANDS`); a Rust test
compares it with the handlers registered in `lib.rs`, and
`src-tauri/capabilities/default.json` decides which of them the main window may
call. The HUD overlay is a separate window with its own manifest
(`src-tauri/capabilities/hud.json`) and a much smaller set: `hud_snapshot`,
`hud_is_open`, `hud_is_compact`, `open_hud_overlay`, `close_hud_overlay`,
`set_hud_click_through`, `set_hud_compact`.

Commands are grouped by area (every name below is in `APP_COMMANDS`):

- **Tweaks** — `list_tweaks`, `preview_tweak`, `apply_tweak`, `rollback_tweak`,
  `apply_tweaks`, `rollback_tweaks`, `scan_relevant_ids`, `advise_tweaks`,
  `active_changes`, `list_audit_log`, `clear_audit_log`
- **Scan and health** — `health_report`, `list_health_history`, `run_baseline`,
  `before_after`, `system_profile`, `system_stats`, `driver_audit`,
  `reboot_pending`, `boot_times`, `check_update_drift`, `drift_watch_enabled`,
  `set_drift_watch`, `is_store_install`
- **Cleanup and repair** — `list_cleanup_targets`, `preview_cleanup`,
  `run_cleanup`, `run_cleanup_selected`, `run_system_repair`, `optimize_disk`,
  `disk_health`, `secure_defrag`, `purge_standby_memory`, `shred_files`,
  `delete_files`, `scan_duplicates`, `scan_large_files`, `clean_ram`,
  `top_memory_processes`, `flush_dns_cache`, `clean_cookies`, `scan_cookies`,
  `restore_cookies`, `cookie_whitelist`, `set_cookie_whitelist`,
  `clean_app_caches`, `scan_app_caches`, `run_browser_cleanup`,
  `list_browser_cleanup`, `clear_crash_reports`, `list_crash_reports`
- **Debloat and startup** — `list_debloat_apps`, `remove_debloat_app`,
  `debloat_history`, `debloat_reinstall_link`, `read_debloat_list`,
  `write_debloat_list`, `list_startup_items`, `set_startup_enabled`,
  `list_scheduled_tasks`, `set_scheduled_task_enabled`,
  `scheduled_cleanup_enabled`, `set_scheduled_cleanup`
- **Gaming and performance** — `game_sessions_enabled`,
  `set_game_sessions_enabled`, `list_game_sessions`, `add_game_session`,
  `remove_game_session`, `turbo_boost_already_set`, `ecoqos_status`,
  `ecoqos_add_rule`, `ecoqos_remove_rule`, `ecoqos_set_enabled`,
  `priority_rules_status`, `priority_rules_add`, `priority_rules_remove`,
  `priority_rules_set_priority`, `priority_rules_set_enabled`,
  `monitor_profiles_state`, `monitor_save_rule`, `monitor_remove_rule`,
  `monitor_set_enabled`, `monitor_preview`, `monitor_confirm`,
  `monitor_restore`, `core_steering_status`, `set_core_steering`,
  `x3d_report`, `x3d_processes`, `x3d_align`, `x3d_reset`, `fps_status`,
  `fps_snapshot`, `start_fps_capture`, `stop_fps_capture`, `trace_dpc_latency`,
  `cpu_clock`, `cpu_benchmark`, `boost_probe`, `gpu_readings`, `gpu_power_info`,
  `set_gpu_profile`, `live_sample`, `thermal_report`, `process_guard_status`,
  `set_process_guard`, `set_process_guard_hold`, `verify_network`,
  `last_network_verification`, `download_limit_state`, `set_download_limit`,
  `restore_download_limit`
- **Scan sessions** — `cancel_scan`, `discard_scan_session`,
  `cancel_folder_scan`, `ram_schedule_ready`, `resource_users`
- **Profiles and reports** — `list_profiles`, `capture_profile`, `save_profile`,
  `delete_profile`, `read_profile_file`, `write_profile_file`, `export_profile`,
  `import_profile`, `save_history_export`, `save_report_png`,
  `compare_lifetime_profiles`, `preview_lifetime_report`, `save_lifetime_report`
- **License and updates** — `license_status`, `save_license`, `clear_license`,
  `search_driver_updates`, `install_driver_updates`, `open_windows_update`,
  `reboot_now`
- **HUD and window** — `hud_snapshot`, `hud_is_open`, `hud_is_compact`,
  `open_hud_overlay`, `close_hud_overlay`, `set_hud_click_through`,
  `set_hud_compact`
- **Avatars** — `save_avatar`, `read_avatar`, `clear_avatar`,
  `adopt_legacy_avatar`, `discard_legacy_avatar`

Command arguments and return payloads are typed in `src/types.ts` on the
frontend side and in the handler signatures under `src-tauri/src/`. Anything the
UI can read comes from one of these commands or from `src/catalog.ts`; there is
no other channel into the system.
