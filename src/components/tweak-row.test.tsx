import type { ComponentProps } from "react";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { format } from "../i18n";
import { STRINGS } from "../i18n-tables";
import type { TechnicalChange, TweakInfo } from "../types";
import { buildName } from "../catalog";
import { TweakRow } from "./tweak-row";
import { ADVANCED_COPY } from "./advanced-copy";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());

const { bridge } = await import("../test-bridge");

const s = STRINGS.en;
const onToggle = vi.fn();
const onInspect = vi.fn();
const onChanged = vi.fn(async () => {});

beforeEach(() => {
  bridge.reset();
  onToggle.mockReset();
  onInspect.mockReset();
  onChanged.mockReset();
});
afterEach(cleanup);

const change: TechnicalChange = {
  kind: "registry",
  path: "HKCU\\Control Panel\\Desktop",
  valueName: "MenuShowDelay",
  valueType: "REG_SZ",
  setsTo: "0",
};

const row = (extra: Partial<TweakInfo> = {}): TweakInfo => ({
  // A control the dictionary does not name, so the catalogue's own words are the
  // ones on screen and an assertion can name them.
  id: "made_up_control",
  name: "Made up control",
  description: "A control the catalogue sends.",
  category: "performance",
  hive: "HKCU",
  requires_admin: false,
  requires_pro: false,
  applied: false,
  changes: [],
  ...extra,
});

function renderRow(
  tweak: Partial<TweakInfo> = {},
  props: Partial<ComponentProps<typeof TweakRow>> = {},
) {
  return render(
    <ul>
      <TweakRow
        tweak={row(tweak)}
        index={0}
        priority={false}
        open={false}
        busy={false}
        lang="en"
        s={s}
        onToggle={onToggle}
        onInspect={onInspect}
        onChanged={onChanged}
        {...props}
      />
    </ul>,
  );
}

const switchFor = (name: string) => screen.getByRole("button", { name });

describe("TweakRow", () => {
  it("shows the dictionary's words for a control it knows, and the catalogue's otherwise", () => {
    renderRow({ id: "disable_click_to_do" });
    expect(
      screen.getByRole("heading", { name: s.tweaks.disable_click_to_do.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(s.tweaks.disable_click_to_do.description)).toBeInTheDocument();

    cleanup();
    renderRow();
    expect(screen.getByRole("heading", { name: "Made up control" })).toBeInTheDocument();
    expect(screen.getByText("A control the catalogue sends.")).toBeInTheDocument();
  });

  it("offers the exact registry change when there is one, and the hive when there is not", () => {
    renderRow({ changes: [change] });
    expect(screen.getByRole("button", { name: s.transparency.title })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    // One door or the other: the hive is not repeated beside the disclosure.
    expect(document.querySelectorAll(".badge")).toHaveLength(1);

    cleanup();
    renderRow({ hive: "HKLM" });
    expect(screen.getByText("HKLM")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: s.transparency.title })).not.toBeInTheDocument();
    expect(document.querySelectorAll(".badge")).toHaveLength(1);
  });

  it("says what the control needs, in one badge", () => {
    renderRow({ min_build: 26100, pro_edition: true });

    const needs = format(s.requirements.minBuild, { version: buildName(26100) });
    expect(screen.getByText(`${needs} · ${s.requirements.proEdition}`)).toBeInTheDocument();
  });

  it("marks a control that needs administrator rights", () => {
    renderRow({ requires_admin: true });
    expect(screen.getByText(s.badges.admin)).toBeInTheDocument();
  });

  it("shows the Windows Update restart and security caveat before the switch is used", () => {
    const text = s.tweaks.prevent_auto_restart_while_logged_on;
    renderRow({
      id: "prevent_auto_restart_while_logged_on",
      name: text.name,
      description: text.description,
      category: "maintenance",
      requires_admin: true,
      pro_edition: true,
    });

    expect(screen.getByRole("heading", { name: text.name })).toBeInTheDocument();
    expect(screen.getByText(text.description)).toBeInTheDocument();
    expect(screen.getByText(s.badges.admin)).toBeInTheDocument();
    expect(screen.getByText(s.requirements.proEdition)).toBeInTheDocument();
    fireEvent.click(switchFor(text.name));
    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: "prevent_auto_restart_while_logged_on" }),
    );
  });

  it("shows bounded Windows Update deferrals and their security caveats", () => {
    const controls = [
      {
        id: "defer_quality_updates_7_days",
        text: s.tweaks.defer_quality_updates_7_days,
        caveat: "Security fixes remain unapplied",
      },
      {
        id: "defer_feature_updates_30_days",
        text: s.tweaks.defer_feature_updates_30_days,
        caveat: "Monthly quality and security updates continue",
      },
    ];

    for (const { id, text, caveat } of controls) {
      cleanup();
      renderRow({
        id,
        name: text.name,
        description: text.description,
        category: "maintenance",
        requires_admin: true,
        pro_edition: true,
      });

      expect(screen.getByRole("heading", { name: text.name })).toBeInTheDocument();
      expect(screen.getByText(text.description)).toBeInTheDocument();
      expect(text.description).toContain(caveat);
      expect(screen.getByText(s.badges.admin)).toBeInTheDocument();
      expect(screen.getByText(s.requirements.proEdition)).toBeInTheDocument();
      fireEvent.click(switchFor(text.name));
      expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ id }));
      onToggle.mockClear();
    }
  });

  it("explains the limits of excluding driver updates from Windows Update", () => {
    const text = s.tweaks.exclude_windows_update_drivers;
    renderRow({
      id: "exclude_windows_update_drivers",
      name: text.name,
      description: text.description,
      category: "maintenance",
      requires_admin: true,
      pro_edition: true,
    });

    expect(screen.getByRole("heading", { name: text.name })).toBeInTheDocument();
    expect(screen.getByText(text.description)).toBeInTheDocument();
    expect(text.description).toContain("security or critical updates");
    expect(text.description).toContain("dynamically during feature updates");
    expect(text.description).toContain("manage standalone drivers yourself");
    expect(screen.getByText(s.badges.admin)).toBeInTheDocument();
    expect(screen.getByText(s.requirements.proEdition)).toBeInTheDocument();
    fireEvent.click(switchFor(text.name));
    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: "exclude_windows_update_drivers" }),
    );
  });

  it("explains why a control cannot be applied on this PC", () => {
    const reasons: [TweakInfo["unavailable"], string][] = [
      ["windows_version", format(s.requirements.unavailableVersion, { version: buildName(22000) })],
      ["windows_edition", s.requirements.unavailableEdition],
      ["windows_edition_enterprise", s.requirements.unavailableEnterpriseEdition],
      ["windows_protected", s.requirements.windowsProtected],
      ["retired", s.requirements.retired],
      ["not_present", s.requirements.notPresent],
    ];
    for (const [unavailable, text] of reasons) {
      cleanup();
      renderRow({ unavailable });
      expect(screen.getByText(text)).toBeInTheDocument();
      expect(switchFor("Made up control")).toBeDisabled();
    }
  });

  it("uses the build the control asks for in that note, not a fixed one", () => {
    renderRow({ unavailable: "windows_version", min_build: 26100 });
    expect(
      screen.getByText(format(s.requirements.unavailableVersion, { version: buildName(26100) })),
    ).toBeInTheDocument();
  });

  it("leaves an applied control switchable, whatever the PC reports", () => {
    renderRow({ unavailable: "retired", applied: true });
    expect(switchFor("Made up control")).toBeEnabled();
    expect(switchFor("Made up control")).toHaveAttribute("aria-pressed", "true");
  });

  it("reports a click on the switch with the control it belongs to", () => {
    renderRow();
    fireEvent.click(switchFor("Made up control"));
    expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ id: "made_up_control" }));
  });

  it("shows a write in flight as busy, with the caption for it", () => {
    renderRow({ applied: true }, { busy: true });
    // Applying and restoring are different waits and say so differently.
    expect(switchFor("Made up control")).toBeDisabled();
    expect(switchFor("Made up control")).toHaveTextContent(s.restore.running);

    cleanup();
    renderRow({}, { busy: true });
    expect(switchFor("Made up control")).toHaveTextContent(s.profiles.applying);
  });

  it("opens the exact changes on request, and shows them when open", async () => {
    bridge.reply("preview_tweak", {
      id: "made_up_control",
      rows: [{ change, current: "400", changes: true }],
      applied: false,
      willChange: true,
      requiresAdmin: false,
      unavailable: null,
    });
    const { rerender } = renderRow({ changes: [change] });
    expect(screen.queryByText(s.transparency.note)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: s.transparency.title }));
    expect(onInspect).toHaveBeenCalledTimes(1);

    rerender(
      <TweakRow
        tweak={row({ changes: [change] })}
        index={0}
        priority={false}
        open
        busy={false}
        lang="en"
        s={s}
        onToggle={onToggle}
        onInspect={onInspect}
        onChanged={onChanged}
      />,
    );
    expect(screen.getByRole("button", { name: s.transparency.title })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    // The live read of what the key holds now, next to what it will be set to.
    expect(await screen.findByText("REG_SZ")).toBeInTheDocument();
    expect(screen.getByText("HKCU\\Control Panel\\Desktop")).toBeInTheDocument();
    await waitFor(() => expect(bridge.callsTo("preview_tweak")).toHaveLength(1));
  });

  it("staggers the entry animation by its position on screen", () => {
    renderRow({}, { index: 3 });
    expect(document.querySelector(".section-tweak")).toHaveStyle({ animationDelay: "120ms" });
  });

  it("marks the leading rows of a category so they can be emphasised", () => {
    renderRow({}, { priority: true });
    expect(document.querySelector(".section-tweak")).toHaveAttribute("data-priority", "true");

    cleanup();
    renderRow();
    expect(document.querySelector(".section-tweak")).toHaveAttribute("data-priority", "false");
  });

  it("gives the three configurable controls their own card instead of a switch", async () => {
    bridge.reply("ecoqos_status", {
      enabled: false,
      engine_running: false,
      blocked_global: false,
      rules: [],
      active_processes: 0,
      pending_restore: 0,
    });
    render(
      <Suspense fallback={<p>loading</p>}>
        <ul>
          <TweakRow
            tweak={row({ id: "ecoqos_rules", name: "Background app efficiency" })}
            index={0}
            priority={false}
            open={false}
            busy={false}
            lang="en"
            s={s}
            onToggle={onToggle}
            onInspect={onInspect}
            onChanged={onChanged}
          />
        </ul>
      </Suspense>,
    );

    expect(await screen.findByText(ADVANCED_COPY.en.ecoTitle)).toBeInTheDocument();
    // No switch of its own: the card carries its own.
    expect(screen.queryByRole("button", { name: "Background app efficiency" })).toBeNull();
  });

  it("has no automatic accessibility violations", async () => {
    const { container } = renderRow({ changes: [change], requires_admin: true });
    expect((await axe(container)).violations).toEqual([]);
  });
});
