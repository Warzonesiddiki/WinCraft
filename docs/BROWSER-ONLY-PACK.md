# WinCraft — Browser-only optimisation pack

**Date:** 2026-10-15
**For:** a machine whose user runs a web browser and essentially nothing else.
**Why a separate pack:** on a browser-only machine the OS is not the workload. Every MB of idle
commit and every background wake is a tab that cannot stay resident and a stutter the user will
feel while scrolling. The goal is not "faster Windows" — it is *Windows out of the way*, with the
browser's own hardware path left intact.

Two rules apply throughout, and they are the reason this list is trustworthy:

1. **Only what is reversible and truthful.** Anything that cannot be undone from its own category
   or Change history does not belong in a profile.
2. **Nothing that breaks the browser's hardware path or security.** GPU acceleration, audio,
   codecs, WebView2, Defender, and the certificate/DNS stack stay untouched. A pack that breaks
   YouTube playback or TLS to win a synthetic number is a worse browser machine, not a better one.

Legend: **Ships** = present in the current app/profile · **Restore-only** = an older saved change can be undone, but new applications are blocked · **Add** = not available as described · **Partial** = only some proposed values are written · **In catalog** = a source entry exists, but Windows runtime behavior has not been verified.

---

## Part A — What ships today: the Browser Only profile

`src/components/starter-presets.mjs` → `browser_only`. Every entry is per-user (`HKCU`),
non-elevated and reversible, enforced by `scripts/test-starter-presets.mjs`.

### A.1 Background work competing with the browser (3)

| ID | Effect | Ships |
| --- | --- | --- |
| `disable_background_apps` | UWP apps stop running in the background; RAM and CPU go to tabs instead of held-open store apps | ✅ |
| `disable_restart_apps` | Apps do not reopen themselves after sign-in | ✅ |
| `disable_startup_delay` | Shell starts immediately instead of waiting for startup apps | ✅ |

### A.2 Compositor and shell effects (2)

| ID | Effect | Ships |
| --- | --- | --- |
| `disable_transparency` | Ends acrylic/blur compositing — measurable GPU/CPU saving while scrolling and on video | ✅ |
| `disable_window_animations` | Removes minimize/maximize animation latency | ✅ |

### A.3 Shell responsiveness (3)

| ID | Effect | Ships |
| --- | --- | --- |
| `menu_show_delay` | Context menus open immediately (`MenuShowDelay` 400 ms → 10 ms) | ✅ |
| `mouse_hover_delay` | Hover menus respond immediately | ✅ |
| `instant_folder_loading` | File Explorer folder windows load in sync | ✅ |

### A.4 Search stays local — no web roundtrips (7)

A browser-only user already has a perfectly good search box *in the browser*. Windows' own shell
search phoning Bing, building suggestion feeds and logging what was typed is pure overhead.

| ID | Effect | Ships |
| --- | --- | --- |
| `disable_bing_search` | Start search stops querying the web | ✅ |
| `disable_cloud_search` | Explorer search stops querying the web | ✅ |
| `disable_search_highlights` | No "highlights" carousel in search | ✅ |
| `disable_search_history` | Typed searches are not retained | ✅ |
| `disable_start_suggestions` | No suggested content in Start | ✅ |
| `disable_suggested_apps` | No promoted app installs in Start | ✅ |
| `disable_app_suggestions_start` | No "recently added"/app suggestions | ✅ |

### A.5 Prompts and promotions that interrupt a session (5)

| ID | Effect | Ships |
| --- | --- | --- |
| `disable_feedback_requests` | No feedback surveys | ✅ |
| `disable_tailored_experiences` | No targeting from diagnostic data | ✅ |
| `disable_lockscreen_spotlight` | Lock screen stops rotating promotional imagery | ✅ |
| `disable_sticky_keys_prompt` | The 5×Shift Sticky Keys pop-up cannot steal focus | ✅ |
| `disable_aero_shake` | Accidental window-minimising shake is off | ✅ |

### A.6 Collection surfaces a browser-only user does not feed (3 active; 1 legacy restore-only)

| ID | Effect | Ships |
| --- | --- | --- |
| `disable_typing_insights` | No keystroke/typing-pattern collection | ✅ |
| `disable_online_speech_privacy` | No cloud speech samples | ✅ |
| `disable_copilot` | Retired policy does not control current Copilot; old snapshots can be restored | Restore-only |
| `disable_device_history` | No cross-device activity history | ✅ |

### A.7 Downloads-folder hygiene (1) and taskbar (shown, not preselected) (5)

| ID | Effect | Preselected | Ships |
| --- | --- | --- | --- |
| `show*file*extensions` | File extensions visible — you can see what you actually downloaded | ✅ yes | ✅ |
| `hide_taskbar_widgets` | Widgets/feed off the taskbar | ✅ yes | ✅ |
| `hide_taskbar_search` | Taskbar search box hidden (frees taskbar space and the search host) | opt-in | ✅ |
| `hide_taskbar_chat` | Chat/Meet Now off the taskbar | opt-in | ✅ |
| `taskbar_align_left` | Taskbar alignment | opt-in | ✅ |
| `disable_drag_full_windows` | Drag-to-maximise off | opt-in | ✅ |
| `dark_mode` | Dark shell | opt-in | ✅ |

**Total: 30 controls, 25 preselected, 5 shown for review.**

(`disable_copilot` is retired and excluded from this set; the backend refuses new applications
but keeps old snapshots restorable. The same rollback-only rule applies to the historical
`keyboard_delay_zero` and `keyboard_speed_fast` IDs, which wrote to the wrong registry key.
The count is measured from
`src/components/starter-presets.mjs`, not copied by hand.)

---

## Part B — Add: registry and UI controls a browser-only user benefits from

This table is a research target, not a guarantee that each proposed value is already written. Ownership is split across current controls: `ads_in_settings` writes `SubscribedContent-338393Enabled`, while `disable_windows_suggestions` writes the `353694` and `353696` Settings-content values; it also writes the Windows Welcome value `SubscribedContent-310093Enabled`, the finish-setup value `ScoobeSystemSettingEnabled`, and the tips value `SubscribedContent-338389Enabled`. Start-menu suggestion values are separate: `disable_start_suggestions` writes `SubscribedContent-338388Enabled`, and `disable_app_suggestions_start` writes `SystemPaneSuggestionsEnabled`. These names and labels are community-derived, not Microsoft policy documentation; see [Win11Debloat’s Windows-suggestions registry file](https://github.com/Raphire/Win11Debloat/blob/master/Regfiles/Disable_Windows_Suggestions.reg), and treat Windows behavior as build-dependent until tested. `quick_access_no_cloud` is intentionally limited to `ShowCloudFilesInQuickAccess`: `ShowRecent` and `ShowFrequent` are separate history/folder-visibility preferences, not additional cloud-content switches ([Winhelponline](https://www.winhelponline.com/blog/show-recently-used-files-in-quick-access-unchecked-automatically/), [Stack Overflow](https://stackoverflow.com/questions/76435309/disable-quick-access-folder-options-using-powershell)). Likewise, opening File Explorer to This PC (`LaunchTo = 1`) and hiding the Home navigation node are separate behaviors. `snap_assist_off` writes only `SnapAssist`; sources describe a separate Snap Layouts flyout using either `SnapAssistFlyout` ([NinjaOne](https://www.ninjaone.com/blog/enable-or-disable-snap-assist-in-windows-11/)) or `EnableSnapAssistFlyout` ([NinjaOne](https://www.ninjaone.com/blog/how-to-enable-or-disable-windows-11-snap-layouts/)). Treat the flyout as a separate, unresolved control and do not add a value until its exact behavior is verified on Windows. Keyboard repeat is owned by the combined `reduce_keyboard_delay` control, so it must not be added as independent current controls. The two historical wrong-key IDs are retained only for snapshot rollback and excluded from the live catalogue.

| Control | Path / value | Effect | Scope | Status |
| --- | --- | --- | --- | --- |
| Ads in Settings | `SubscribedContent-338393Enabled = 0`, `SubscribedContent-353694/353696Enabled = 0` (ContentDeliveryManager) | Settings stops advertising Microsoft services | HKCU | **Split across controls:** `ads_in_settings` writes `338393Enabled`; `disable_windows_suggestions` writes `353694Enabled` and `353696Enabled`. |
| Windows Welcome experience | `SubscribedContent-310093Enabled = 0` (ContentDeliveryManager) | Turns off the welcome experience after updates and sign-in | HKCU | Covered by `disable_windows_suggestions`; no separate control is needed. |
| "Finish setting up your device" | `ScoobeSystemSettingEnabled = 0` (UserProfileEngagement) | Stops the finish-setup prompt | HKCU | Covered by `disable_windows_suggestions`; no separate control is needed. |
| Tips and suggestions while using Windows | `SubscribedContent-338389Enabled = 0`, `SoftLandingEnabled = 0` (ContentDeliveryManager) | Turns off Windows tips, tricks and suggestions | HKCU | Covered by `disable_windows_suggestions`; no separate control is needed. |
| Occasional Start-menu suggestions | `SubscribedContent-338388Enabled = 0`, `SystemPaneSuggestionsEnabled = 0` (ContentDeliveryManager) | Stops suggested apps and promotional tips in Start | HKCU | In catalog: `disable_start_suggestions` and `disable_app_suggestions_start` write these values; Windows behavior is not runtime-verified. |
| File Explorer start page / Home node | `LaunchTo = 1` opens to This PC; hiding Home is a separate shell change | Opens on This PC; the Home navigation entry remains available | HKCU | **Split:** `explorer_open_this_pc` sets the starting page. Hiding Home is separate and not implemented or Windows-validated. |
| Quick Access cloud files | `ShowCloudFilesInQuickAccess = 0` | Hides cloud/account-based content in Quick Access | HKCU | **In catalog:** `quick_access_no_cloud` writes this value. `ShowRecent` and `ShowFrequent` are independent history/folder preferences and are intentionally unchanged. |
| Snap Assist suggestions | `SnapAssist = 0` | Limits suggestions after snapping a window | HKCU | **In catalog:** `snap_assist_off` writes this setting; it does not change the separate Snap Layouts flyout. |
| Snap Layouts flyout | `SnapAssistFlyout` or `EnableSnapAssistFlyout` (name/behavior not settled) | Show or hide the maximize-button layout flyout | HKCU | **Unresolved:** separate from post-snap suggestions; do not add until the exact value and effect are validated on Windows. |
| Gallery in Explorer | Hide the Windows 11 **Gallery** node | One less shell surface with its own background work | HKCU | **In catalog:** `hide_gallery_explorer`; Windows behavior is not runtime-verified. |
| Alt+Tab tab strip | `MultiTaskingAltTabFilter = 3` (windows only, not Edge tabs) | Alt+Tab stops restoring browser tabs as separate entries | HKCU | **In catalog:** `alt_tab_no_browser_tabs`; Windows behavior is not runtime-verified. |
| Taskbar "Search highlights" | covered by `disable_search_highlights` | ✅ already | HKCU | Ships. |
| Taskbar button combining | `TaskbarGlomLevel = 0` | More taskbar room for browser windows | HKCU | **In catalog:** `taskbar_button_combining`; Windows behavior is not runtime-verified. |
| Notification toasts during fullscreen video | `NOC_GLOBAL_SETTING_TOASTS_ENABLED = 0` | Nothing pops over fullscreen video | HKCU | **In catalog:** `no_toasts_fullscreen_video`; the setting may affect other toast contexts too. |
| Window snap on drag | `WindowArrangementActive = 0` | No accidental snap while moving a browser window | HKCU | **In catalog:** `no_window_snap_drag`; Windows behavior is not runtime-verified. |
| Menu/keyboard delay | `MenuShowDelay` (`menu_show_delay`); `KeyboardDelay = 0` and `KeyboardSpeed = 31` (`reduce_keyboard_delay`) | Snappier menu and keyboard response | HKCU | Already covered by existing controls; no duplicate keyboard controls should be added. |
| "Show more options" context menu | Classic Win32 context menu (catalog: `ui_classic_context_menu`) | Instant right-click in Explorer | HKCU | **In catalog:** Windows behavior is not runtime-verified. |
| Startup Boost for the shell | — | n/a — see Part J for browser-side | — | — |

---

## Part C — Add: services a browser-only machine does not need

All of these are `HKLM\SYSTEM\CurrentControlSet\Services\<name>\Start` (admin, journaled).
The rule: **manual or disabled, never deleted**, and each states what stops working.

| Service | Suggested | What a browser-only user loses |
| --- | --- | --- |
| `Spooler` | Manual | Printing stops working until something asks for it (PDF export still works if the driver is installed) |
| `Fax` | Disabled | Nothing — fax is not a browser feature |
| `RemoteRegistry` | Disabled | Nothing |
| `RetailDemo` | Disabled | Nothing |
| `DiagTrack` | Disabled | Telemetry only |
| `dmwappushservice` | Disabled | Enterprise MDM push only |
| `WMPNetworkSvc` | Disabled | Windows Media Player network sharing |
| `MapsBroker` | Disabled | Offline Maps |
| `lfsvc` | Manual | Geolocation for sites that ask for it (weather, maps in browser) — **manual, not disabled** |
| `PhoneSvc` | Disabled | Phone Link |
| `XblAuthManager`, `XblGameSave`, `XboxNetApiSvc`, `XboxGipSvc` | Disabled | Xbox app/Game Pass; **never** disable `XblAuthManager` if any Microsoft account sign-in flow is used by a game-adjacent app |
| `WSearch` | Manual | Start-menu *file* search; the browser's own search is unaffected. Manual keeps the index from running in the background |
| `SysMain` | Disabled (SSD only) | Nothing measurable on NVMe; on a mechanical disk it can slow first loads — gate on media type |
| `PcaSvc` | Manual | The compatibility shim engine idles at zero; keeping it Manual preserves legacy app fixes |
| `WerSvc` | Manual (not Disabled) | Crash dialogs; Disabled breaks developer debugging of the browser itself |
| `WerSvc`/`DeviceAssociationService`, `SensrSvc`, `SensorService` | Manual | Rotation/light sensors — irrelevant on a browser-only desktop, needed on a tablet |
| `TabletInputService` | Disabled on desktop | Touch keyboard |
| `SharedAccess` | Disabled | Internet Connection Sharing |
| `BTAGService` | Disabled (no Bluetooth audio) | Bluetooth audio endpoints |

**Add** — WinCraft has service-start management for a subset (`WerSvc`, `MapsBroker`, `lfsvc`)
plus the DiagTrack/dmwappush pair. The full browser-only service set above is not exposed.

---

## Part D — Add: scheduled tasks worth disabling

40 allowlisted telemetry/diagnostic tasks ship today (`disable_telemetry_tasks` + the startup
manager list). The ones that specifically matter when the machine is idle-at-the-desktop:

| Task | Why it matters for a browser user |
| --- | --- |
| `\Microsoft\Windows\Application Experience\*` | Re-inventories installed software while you browse |
| `\Microsoft\Windows\DiskFootprint\*` | Scans disk usage in the background |
| `\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem` | CPU-heavy energy trace on idle |
| `\Microsoft\Windows\WindowsAI\ClickToDo\ModelCaching*` | Caches AI models — pure disk/CPU cost if you never use Click to Do |
| `\Microsoft\EdgeUpdate\EdgeUpdateTaskMachineCore/UA` | Reinstalls/updates Edge components in the background |
| `\Microsoft\Windows\Feedback\Siuf\*` | Surveys |
| `\Microsoft\Windows\Maintenance\WinSAT` | Benchmarks the machine while you are working |
| `\Microsoft\Windows\Windows Error Reporting\QueueReporting` | Uploads crash queues |
| `\Microsoft\Windows\Defrag\ScheduledDefrag` | Keep on SSD (it is a retrim), reassess on HDD |

**Add** — `WindowsAI\ClickToDo\ModelCaching*` and the Edge-update pair are named in the research
specs (`docs/research/SCHEDULED_TASKS_FULL_CATALOG.md`) but not in the shipped allowlist.

---

## Part E — Debloat: what to remove on a browser-only machine

The 25-package catalog ships; for a browser-only user the selection is nearly the whole list.
Safe to remove (a browser-only user never opens these):

`BingWeather` · `BingNews` · `MicrosoftSolitaireCollection` · `ZuneMusic` · `ZuneVideo` ·
`Clipchamp.Clipchamp` · `Todos` · `MicrosoftOfficeHub` · `WindowsMaps` · `GetHelp` ·
`Getstarted` · `People` · `MicrosoftStickyNotes` · `WindowsAlarms` · `QuickAssist` ·
`PowerAutomateDesktop` · `Microsoft3DViewer` · `MSPaint` · `549981C3F5F10` (Cortana) ·
`Windows.DevHome` · `WindowsFeedbackHub` · `YourPhone` · `OutlookForWindows` · `SpotifyAB` ·
`Disney` · `BytedancePte.Ltd.TikTok`

Debatable — decide per user: `Microsoft.WindowsSoundRecorder` (may record a voice note),
`Microsoft.Copilot` (a browser already has an assistant), `MicrosoftTeams` (consumer chat).

**Never remove** (would break the browser or the OS): `Microsoft.EdgeWebView2` /
`Microsoft.Win32WebViewHost` (**Discord, Teams, PowerToys, and WinCraft itself** depend on it),
`Microsoft.WindowsStore` + Store Purchase App, `Microsoft.DesktopAppInstaller` (WinGet),
`Microsoft.WindowsTerminal`, `Microsoft.WindowsCalculator`, `Microsoft.WindowsNotepad`,
`Microsoft.GamingServices`, `Microsoft.XboxIdentityProvider`, `Microsoft.SecHealthUI`,
`Microsoft.UI.Xaml*`, `Microsoft.VCLibs*`, `Microsoft.NET.Native.*`,
`Microsoft.ShellExperienceHost`, `Microsoft.StartMenuExperienceHost`,
`Microsoft.Windows.Photos` (an image you download opens here), `Microsoft.WindowsCamera` if present.

**Add** — the deprovision (reinstall-proof) step is still the `dism.exe` string-parsing stub
(see `docs/2.0-REMAINING-WORK.md` §2.4). Until it is finished, a feature update or a new local
account can re-provision removed apps.

---

## Part F — Privacy and telemetry fixes for a browser-only user

| Measure | Ships | Notes |
| --- | --- | --- |
| `AllowTelemetry = 0` across the policy locations (+ WOW6432Node) | ✅ | The core lockdown |
| Telemetry autologger registry `Start = 0` (5 sessions) | ✅ | Registry-level; the live ETW teardown is **not** implemented |
| Advertising ID off | ✅ | |
| Activity feed / publish / upload user activities | ✅ (HKLM) | Not per-user, so not in the profile |
| Delivery Optimization peer sharing | ✅ partial | `DODownloadMode = 0` prevents peer-to-peer exchange; HTTP downloads from Microsoft and the service remain available. This is not a full service shutdown. |
| Block telemetry IPs (firewall rules) | ❌ **Add** | The one measure registry policies cannot make. Must be off by default and labelled bypassable |
| Hosts-based blocking | ❌ **Add** | Same caveat |
| SmartScreen / Defender | leave ON | A browser-only user is exactly who needs them |
| DNS over HTTPS | ⚠️ partial | A DNS control exists; per-resolver DoH selection (Cloudflare/Quad9/Google/AdGuard/OpenDNS) is **Add** |
| Edge telemetry (metrics, shopping, personalization, wallet, collections, quick search, startup boost, background mode) | ✅ 8 controls | The browser-side privacy layer already exists |
| Brave/Chrome bloat | ❌ **Add** | Win11Debloat ships Brave de-bloat; WinCraft has none |
| Cookie/cache cleanup with a keep-list | ✅ | Already in the browser cleaner |

---

## Part G — Add: network, because the browser is the only network consumer

| Measure | Why | Ships |
| --- | --- | --- |
| `TCPNoDelay = 1`, `TcpAckFrequency = 1`, `TcpDelkAckTicks = 0` on the active adapter | Removes Nagle/delayed-ACK latency for page loads | ✅ partial (has the values; per-adapter selection is thin) |
| DNS-over-HTTPS selection | Encrypted, faster resolution | ⚠️ partial |
| NIC **power management off** ("Allow the computer to turn off this device") | Prevents the adapter sleeping between page loads / while streaming | ❌ **Add** |
| NIC interrupt moderation / RSS / checksum offload | Jitter on some NICs | ❌ **Add** |
| Metered-connection awareness | Avoids surprise background downloads over a hotspot | ❌ **Add** |
| Windows Update deferral | Reversible 7-day quality and 30-day feature deferrals; quality deferral delays security fixes | ✅ partial — Pro-or-higher only; pause, Active Hours, and version targeting remain unimplemented |
| Windows Update driver offers | Withhold standalone driver-classified updates from the normal quality-update cycle; bundled/feature-update drivers may still arrive | ✅ `exclude_windows_update_drivers`; Pro-or-higher, not a performance tweak; manage standalone drivers yourself |
| No scheduled auto-restart while signed in | Avoids a scheduled Windows Update restart during a signed-in session | ✅ `prevent_auto_restart_while_logged_on`; updates still install, and reboot-required security fixes wait for restart |
| Delivery Optimization fully off | Stops peer-to-peer exchange; Microsoft-hosted HTTP downloads must remain available | ⚠️ peer sharing is already off with `DODownloadMode = 0`; do not disable the service without Windows servicing tests |

---

## Part H — Display, GPU and media playback

A browser-only user watches video in that browser. This is the one area where "optimising" too
aggressively makes things **worse**, so the pack is deliberately conservative:

| Setting | Recommendation | Reason |
| --- | --- | --- |
| Hardware acceleration in the browser | **Keep ON** | Offloading decode to the GPU is the single biggest battery/CPU win for video |
| WDDM hardware-accelerated GPU scheduling (`HwSchMode`) | On where supported | Lower submission latency; already a catalog control (`hardware_gpu_scheduling`) |
| MPO / overlay | Leave at driver default unless stutter is *measured* with the DPC tracer | Disabling MPO helps some combos and hurts others |
| Fullscreen optimisations | Leave default; the existing `disable_fullscreen_optimizations_global` control should only be applied after a measured frame-time test | |
| Transparency/animations | Off (in the profile) | Safe, measurable |
| Video playback during fullscreen | Enable "Do not disturb" style toast suppression (Part B) | |

---

## Part I — Browser-side settings WinCraft should surface

Everything in Parts A–H is Windows. The browser itself has settings that matter as much, and no
Windows optimiser configures them. This is the clearest gap and the most on-brand addition
(WinCraft already edits Edge policy keys):

| Browser | Setting | Why |
| --- | --- | --- |
| Edge | Sleeping tabs on, efficiency mode balanced | Frees RAM from background tabs — the browser's own version of what Part A does for Windows |
| Edge | Startup boost **off**, background extensions off | ✅ already shipped |
| Chrome/Edge | "Continue running background apps when closed" off | Stops a hidden browser process competing with nothing |
| Chrome/Edge/Firefox | Hardware acceleration ON (report, don't force) | |
| Firefox | `browser.tabs.unloadOnLowMemory = true`, `browser.sessionstore.interval` raised | Equivalent of sleeping tabs |
| All | DoH on, tracking protection strict, third-party cookies off, autofill/password-manager review | Privacy posture |
| All | Search engine suggestion requests off | The browser's own version of `disable_bing_search` |

**Add** — a read-only "Browser posture" panel that *reports* these (with the exact setting path)
and explains how to change them, rather than writing into another application's profile. Writing
into a browser profile is a data-loss risk; reporting is not.

---

## Part J — Keep-list: never touched on a browser-only machine

| Item | Why |
| --- | --- |
| Edge WebView2 runtime and `Microsoft.Win32WebViewHost` | Discord, Teams, PowerToys and WinCraft are built on it |
| Microsoft Defender / SmartScreen | A browser-only user browses the public internet all day |
| `Dnscache`, `Dhcp`, `nsi`, `RpcSs`, `DcomLaunch`, `PlugPlay`, `Power`, `ProfSvc`, `Themes` | Core networking/compositor/services — the browser does not start without them |
| `Audiosrv`, `AudioEndpointBuilder` | Video has sound |
| Codecs / `Windows Media Foundation`, HEVC/VP9 support | Video playback |
| GPU driver services | Hardware decode |
| `wlidsvc` (Microsoft Account) if the browser profile syncs | Sign-in |
| `Spooler` **if** the user prints PDFs/tickets | Pick manual, not disabled, unless known |
| Certificate/TLS stack, `cryptsvc` | HTTPS |

---

## Part K — How to prove any of this helped

A browser-only machine has one honest metric set, and WinCraft's Before & After engine already
computes it with a rank test at p<0.01:

1. **Free RAM at idle** with the browser closed — the headroom tabs get.
2. **Commit with N tabs open** — measure at a fixed tab set, e.g. 10 pinned URLs.
3. **Process count at idle** — the closest thing to the AtlasOS "~85 processes" number.
4. **Page-load timing** for a fixed set of cached and uncached URLs.
5. **Frame-time 1% low during a 1080p60 video** in the browser — catches compositor regressions.
6. **DPC/ISR max** via the existing tracer — catches a network driver misbehaving after the NIC changes.

Claim no more than what those numbers show. This is the same rule the rest of the project follows.

---

## Part L — Implementation order

1. **Finish the profile** — the 30-control Browser Only set is live and tested (done).
2. **Part B registry controls** as catalog entries (HKCU only; each reversible) — highest value per unit of work.
3. **Part J browser-posture report** — read-only, no risk, unique to WinCraft.
4. **Part C/D service-and-task expansion** — needs the same journalling the other controls have.
5. **Part F/G** (telemetry IP blocking, DoH set, NIC power management, metered-connection awareness and the remaining Windows Update controls). Peer-sharing, signed-in restart protection, bounded 7-/30-day deferrals and the standalone driver-offer policy already ship; pause, Active Hours and version targeting remain open. A full Delivery Optimization shutdown is not the goal.
6. **Part E deprovision fix** — so removals survive a feature update.
