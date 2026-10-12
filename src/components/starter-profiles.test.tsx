import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { STRINGS } from "../i18n-tables";
import type { TweakInfo } from "../types";
import { STARTER_COPY } from "./starter-copy";
import { STARTER_PRESETS } from "./starter-presets.mjs";
import { StarterProfiles } from "./starter-profiles";

const s = STRINGS.en;
const c = STARTER_COPY.en;

const tweak = (id: string, extra: Partial<TweakInfo> = {}): TweakInfo => ({
  id,
  name: id.replaceAll("_", " "),
  description: `${id} in plain words.`,
  category: "performance",
  hive: "HKCU",
  requires_admin: false,
  requires_pro: false,
  applied: false,
  changes: [],
  ...extra,
});

/** The whole catalog every preset asks for, so nothing is "missing" by accident. */
const catalog = (extra: Record<string, Partial<TweakInfo>> = {}) =>
  [...new Set(STARTER_PRESETS.flatMap((p) => p.tweaks.map((t) => t.id)))].map((id) =>
    tweak(id, extra[id] ?? {}),
  );

const onApply = vi.fn(async () => {});

function mount(tweaks = catalog(), busy = false) {
  return render(<StarterProfiles s={s} lang="en" tweaks={tweaks} busy={busy} onApply={onApply} />);
}

beforeEach(() => {
  onApply.mockClear();
});
afterEach(cleanup);

describe("StarterProfiles", () => {
  it("offers every preset and describes the selected one", () => {
    mount();
    const group = screen.getByRole("group", { name: c.heading });
    expect(group.querySelectorAll("button")).toHaveLength(6);
    expect(screen.getByRole("button", { name: new RegExp(c.gaming) })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(c.gaming);
    expect(screen.getByText(c.gamingNote)).toBeInTheDocument();
  });

  it("moves the selection and its trade-off when another preset is chosen", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: new RegExp(c.quiet) }));
    expect(screen.getByRole("button", { name: new RegExp(c.quiet) })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(c.quiet);
    expect(screen.getByText(c.quietNote)).toBeInTheDocument();
  });

  it("applies only the preset's selected controls, by id", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: `${c.apply} (2)` }));
    expect(onApply).toHaveBeenCalledWith({
      format: 1,
      name: c.gaming,
      created_at: "",
      tweaks: ["disable_game_dvr", "reduce_input_lag"],
    });
  });

  it("shows a control this PC does not support, disabled, and never applies it", () => {
    mount(catalog({ reduce_input_lag: { unavailable: "windows_version" } }));
    const row = screen.getByText(/reduce input lag/i).closest("label")!;
    expect(row.querySelector("input")).toBeDisabled();
    expect(row.querySelector("input")).not.toBeChecked();
    expect(row).toHaveTextContent(c.notHere);
    fireEvent.click(screen.getByRole("button", { name: `${c.apply} (1)` }));
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ tweaks: ["disable_game_dvr"] }));
  });

  it("says everything is already applied instead of offering the same work again", () => {
    mount(catalog({ disable_game_dvr: { applied: true }, reduce_input_lag: { applied: true } }));
    expect(screen.getByText(c.ready)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: new RegExp(c.apply) })).toBeDisabled();
  });

  it("reports a preset this build cannot complete", () => {
    mount(catalog().filter((t) => t.id !== "reduce_input_lag"));
    expect(screen.getByRole("status")).toHaveTextContent(c.missing);
    expect(screen.getByRole("button", { name: `${c.apply} (1)` })).toBeDisabled();
  });

  it("holds every control closed while an apply is running", () => {
    mount(catalog(), true);
    expect(screen.getByRole("button", { name: new RegExp(c.gaming) })).toBeDisabled();
    expect(screen.getByRole("button", { name: c.applying })).toBeDisabled();
    expect(screen.getByRole("button", { name: c.applying })).toHaveAttribute("aria-busy", "true");
  });

  it("has no accessibility violations, with a complete catalog and a partial one", async () => {
    const { container } = mount();
    expect((await axe(container)).violations).toEqual([]);
    cleanup();
    const second = mount(catalog({ reduce_input_lag: { unavailable: "windows_version" } }));
    fireEvent.click(screen.getByRole("button", { name: new RegExp(c.quiet) }));
    expect((await axe(second.container)).violations).toEqual([]);
  });
});
