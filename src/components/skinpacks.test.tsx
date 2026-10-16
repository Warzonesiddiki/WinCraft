import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SkinpacksPanel } from "./skinpacks";
import { STRINGS } from "../i18n-tables";
import { format } from "../i18n";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());
vi.mock("@tauri-apps/api/dialog", () => ({}));
vi.mock("@tauri-apps/plugin-dialog", async () => (await import("../test-bridge")).dialogModule());

const { bridge } = await import("../test-bridge");
const s = STRINGS.en;

const shipped = { id: "cosmic_dark", active: false, valueCount: 9 };

describe("SkinpacksPanel", () => {
  beforeEach(() => bridge.reset());
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("states what the look is and what it is not", async () => {
    bridge.reply("list_skinpacks", [shipped]);
    render(<SkinpacksPanel s={s} pushToast={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(s.skinpacks.packName)).toBeInTheDocument();
    });
    // The scope line is the claim: a shell re-theme, not a desktop environment.
    expect(screen.getByText(s.skinpacks.scope)).toBeInTheDocument();
    expect(screen.getByText(s.skinpacks.scope)).toHaveTextContent(/does not install/i);
    expect(screen.getByText(format(s.skinpacks.valuesSummary, { count: 9 }))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: s.skinpacks.apply })).toBeInTheDocument();
    expect(screen.queryByText(s.skinpacks.active)).toBeNull();
  });

  it("applies the look, then offers to restore it", async () => {
    bridge.reply("list_skinpacks", [shipped]);
    bridge.reply("apply_skinpack", { ...shipped, active: true });
    render(<SkinpacksPanel s={s} pushToast={vi.fn()} />);

    const applyButton = await screen.findByRole("button", { name: s.skinpacks.apply });
    await act(async () => {
      fireEvent.click(applyButton);
    });

    await waitFor(() => {
      expect(bridge.callsTo("apply_skinpack")).toHaveLength(1);
    });
    expect(bridge.argsOf("apply_skinpack")).toEqual({ id: "cosmic_dark" });
    expect(await screen.findByText(s.skinpacks.active)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: s.skinpacks.restore })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: s.skinpacks.apply })).toBeNull();
  });

  it("restores the Windows look and re-reads what is applied", async () => {
    bridge.reply("list_skinpacks", [{ ...shipped, active: true }]);
    bridge.reply("rollback_skinpack", undefined);
    bridge.reply("list_skinpacks", [shipped]);
    render(<SkinpacksPanel s={s} pushToast={vi.fn()} />);

    const restoreButton = await screen.findByRole("button", { name: s.skinpacks.restore });
    await act(async () => {
      fireEvent.click(restoreButton);
    });

    await waitFor(() => {
      expect(bridge.callsTo("rollback_skinpack")).toHaveLength(1);
    });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: s.skinpacks.apply })).toBeInTheDocument();
    });
    expect(screen.queryByText(s.skinpacks.active)).toBeNull();
  });

  it("reports a refused apply instead of showing it as applied", async () => {
    const pushToast = vi.fn();
    bridge.reply("list_skinpacks", [shipped]);
    bridge.reply("apply_skinpack", new Error("access denied"));
    render(<SkinpacksPanel s={s} pushToast={pushToast} />);

    const applyButton = await screen.findByRole("button", { name: s.skinpacks.apply });
    await act(async () => {
      fireEvent.click(applyButton);
    });

    await waitFor(() => {
      expect(pushToast).toHaveBeenCalledWith("error", expect.any(String));
    });
    // The panel must not claim the look is on when the write was refused.
    expect(screen.queryByText(s.skinpacks.active)).toBeNull();
    expect(screen.getByRole("button", { name: s.skinpacks.apply })).toBeInTheDocument();
  });

  it("shows nothing but the header when no look is available for this build", async () => {
    bridge.reply("list_skinpacks", []);
    render(<SkinpacksPanel s={s} pushToast={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(s.skinpacks.title)).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: s.skinpacks.apply })).toBeNull();
    expect(screen.queryByText(s.skinpacks.scope)).toBeNull();
  });
});
