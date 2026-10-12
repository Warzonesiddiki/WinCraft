// One row of a section: what the control is, what it changes, what it needs,
// and the switch that applies it.
//
// Extracted from App.tsx unchanged. The list is rendered inside the shell, which
// mounts the whole workspace at once, so no part of a row could be tested on its
// own; the state and the IPC stay in the shell, and this file only draws one row
// and reports what was clicked.
import { lazy, type CSSProperties } from "react";
import { format, type Lang, type Strings } from "../i18n";
import { textFor } from "../lib";
import type { TweakInfo } from "../types";
import { CATEGORY_STYLE } from "../categories";
import { buildName } from "../catalog";
import { Badge, Toggle } from "./ui";
import { TweakIcon } from "./tweak-icon";
import { TechnicalDetails, TechnicalToggle } from "./technical";

// The three configurable controls open their own card. It is loaded lazily here,
// where it is rendered, so it stays out of the entry chunk.
const AdvancedControlCard = lazy(() =>
  import("./advanced-controls").then((m) => ({ default: m.AdvancedControlCard })),
);

type TweakRowProps = {
  tweak: TweakInfo;
  /** Its position on screen: the entry animation staggers by it. */
  index: number;
  /** One of the first three rows of Performance or Gaming, while not searching. */
  priority: boolean;
  /** This row's exact changes are open. One row at a time. */
  open: boolean;
  /** This row's own switch is mid-flight. */
  busy: boolean;
  lang: Lang;
  s: Strings;
  onToggle: (tweak: TweakInfo) => void;
  onInspect: () => void;
  onChanged: () => Promise<void>;
};

export function TweakRow({
  tweak,
  index,
  priority,
  open,
  busy,
  lang,
  s,
  onToggle,
  onInspect,
  onChanged,
}: TweakRowProps) {
  // These three are not simple on/off settings: they open a card of their own,
  // so the row is just the list item that holds it.
  if (
    tweak.id === "ecoqos_rules" ||
    tweak.id === "limit_do_background_download" ||
    tweak.id === "monitor_refresh_profile"
  ) {
    return (
      <li data-tweak-id={tweak.id} data-priority={priority} className="animate-card section-tweak">
        <AdvancedControlCard id={tweak.id} lang={lang} onChanged={onChanged} />
      </li>
    );
  }

  const style = CATEGORY_STYLE[tweak.category];
  const text = textFor(s.tweaks, tweak.id, tweak.name, tweak.description);
  return (
    <li
      data-tweak-id={tweak.id}
      data-priority={priority}
      style={{ animationDelay: `${index * 40}ms` }}
      className="animate-card section-tweak panel panel-hover group relative overflow-hidden p-4"
    >
      <div className="relative flex items-center gap-4">
        <div
          className="icon-module grid shrink-0 place-items-center"
          style={{ "--module-tint": style.tint } as CSSProperties}
        >
          <TweakIcon id={tweak.id} fallback={style.icon} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{text.name}</h2>
            {/* The (i) is the door to the exact system change.
                            A description can be argued with; a registry path
                            can be checked in regedit, so it is one click away
                            rather than buried in a FAQ. */}
            {tweak.changes.length > 0 ? (
              <TechnicalToggle
                open={open}
                label={s.transparency.title}
                hive={tweak.hive}
                onClick={onInspect}
              />
            ) : (
              tweak.hive !== "—" && <Badge>{tweak.hive}</Badge>
            )}
            {tweak.requires_admin && <Badge kind="admin">{s.badges.admin}</Badge>}
            {(tweak.min_build || tweak.pro_edition || tweak.enterprise_edition) && (
              <Badge kind="muted">
                {[
                  tweak.min_build
                    ? format(s.requirements.minBuild, {
                        version: buildName(tweak.min_build),
                      })
                    : null,
                  tweak.pro_edition ? s.requirements.proEdition : null,
                  tweak.enterprise_edition ? s.requirements.enterpriseEdition : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Badge>
            )}
          </div>
          <p className="mt-1 max-w-[52ch] text-[12.5px] leading-[1.55] text-ink-3">
            {text.description}
          </p>
          {tweak.unavailable && !tweak.applied && (
            <p className="mt-1.5 max-w-[52ch] text-[12px] leading-[1.5] text-warn">
              {tweak.unavailable === "windows_version"
                ? format(s.requirements.unavailableVersion, {
                    version: buildName(tweak.min_build ?? 22000),
                  })
                : tweak.unavailable === "windows_edition"
                  ? s.requirements.unavailableEdition
                  : tweak.unavailable === "windows_edition_enterprise"
                    ? s.requirements.unavailableEnterpriseEdition
                    : tweak.unavailable === "windows_protected"
                      ? s.requirements.windowsProtected
                      : s.requirements.notPresent}
            </p>
          )}
          {open && <TechnicalDetails changes={tweak.changes} s={s} previewId={tweak.id} />}
        </div>
        <Toggle
          label={text.name}
          busyLabel={tweak.applied ? s.restore.running : s.profiles.applying}
          checked={tweak.applied}
          busy={busy}
          disabled={!!tweak.unavailable && !tweak.applied}
          onClick={() => onToggle(tweak)}
          s={s}
        />
      </div>
    </li>
  );
}
