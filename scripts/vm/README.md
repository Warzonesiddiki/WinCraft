# VM verification of the settings-based controls

Checks, on clean virtual machines, that all 18 settings-based controls in the
current catalogue write exactly what they declare where supported, leave the PC
untouched where unavailable, and restore the exact original values.

`verify-tweaks.ps1` is read-only: WinCraft applies and restores, the script
only compares the registry and the service configuration with
`tweak-matrix.json`. That file is generated from the app's catalogue by
`cargo test settings_tweaks::tests::the_vm_matrix_matches_the_catalogue`
(set `PCT_WRITE_VM_MATRIX=1` to rewrite it), so it cannot drift.

## Machines

| VM | Image | Build | EditionID |
|---|---|---|---|
| A | Windows 11 Pro 24H2 | 26100 | Professional |
| B | Windows 11 Home 24H2 | 26100 | Core |
| C | Windows 11 Education 24H2 | 26100 | Education |
| D | Windows 10 22H2 Pro | 19045 | Professional |

Expected verdict per control and VM: the `expected` field of each entry in
`tweak-matrix.json`, or `.\verify-tweaks.ps1 -Phase Plan` on the VM itself.
In short: Home refuses Click to Do, Paint AI, Widgets and all four Pro-or-higher
Windows Update policies; only Education accepts the Start Recommended policy;
Windows 10 refuses Paint AI, Notepad AI, End task, the drag tray, Widgets and
Start Recommended; the AI Components Host control is offered only where
`WSAIFabricSvc` exists.

## Manual procedure (each VM, about 15 minutes)

1. Take a VM checkpoint. Install the WinCraft build under test. There is no
   licence to sign in with and no paid controls; Windows edition/build gates still apply.
2. In a normal, non-elevated PowerShell as the same user:
   `.\verify-tweaks.ps1 -Phase Baseline`
3. In WinCraft, search each control by name and apply it. Unsupported ones
   must show "Not available on this PC" and must not be applied.
4. `.\verify-tweaks.ps1 -Phase Applied`: every supported control PASS,
   every unsupported one "N/A (…, untouched)".
5. Change history > Restore active tweaks.
6. `.\verify-tweaks.ps1 -Phase Reverted`: every control PASS (each value back
   to exactly what the baseline recorded, including values that did not
   exist before).
7. Optional: restart, run `-Phase Reverted` again, then revert the VM to the
   checkpoint.

Results are written to `results\<computer>-<phase>.json` (git-ignored). The
exit code is the number of failed checks, so a run can gate a release.

## Result sheet

| Control | A Pro | B Home | C Edu | D Win10 |
|---|---|---|---|---|
| disable_click_to_do | | | | |
| disable_edge_ai | | | | |
| disable_paint_ai | | | | |
| disable_notepad_ai | | | | |
| disable_fast_startup | | | | |
| disable_storage_sense | | | | |
| taskbar_end_task | | | | |
| disable_drag_tray | | | | |
| explorer_open_this_pc | | | | |
| block_oem_device_apps | | | | |
| disable_windows_suggestions | | | | |
| disable_widgets | | | | |
| hide_start_recommended | | | | |
| disable_game_bar_captures | | | | |
| prevent_auto_restart_while_logged_on | | | | |
| defer_quality_updates_7_days | | | | |
| defer_feature_updates_30_days | | | | |
| exclude_windows_update_drivers | | | | |
| disable_ai_fabric_service | | | | |

Beyond the registry: on A and C, also check by eye that the taskbar and
system tray icons are all present after applying the AI Components Host
control (it now sets Manual rather than Disabled for this reason), and that
`edge://policy` lists the Edge policies.

## Debloat check (non-elevated)

In a normal PowerShell as the test user, from a clean snapshot: open WinCraft's
Debloat panel, remove Solitaire, Microsoft News and Feedback Hub through the
app's own removal path (identity checks, journal, verification), then confirm
with `Get-AppxPackage` that they are gone and with the panel's own receipt that
each removal is reported as verified. Reinstalling is a Store action; revert the
snapshot afterwards.
