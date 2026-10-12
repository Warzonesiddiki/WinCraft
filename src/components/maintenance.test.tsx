import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { STRINGS, format } from "../i18n";
import type { CleanupInfo } from "../types";
import { CleanupCard, ScheduledCleanupCard } from "./maintenance";

vi.mock("@tauri-apps/api/core", async () => (await import("../test-bridge")).coreModule());
vi.mock("@tauri-apps/api/event", async () => (await import("../test-bridge")).eventModule());

const { bridge } = await import("../test-bridge");

const s = STRINGS.en;

/**
 * The switch holds its "Applying…" state for half a second after the state
 * read, so a fast load is still legible (useBusyPresentation). These tests
 * drive that hold with fake timers instead of sleeping: the timer is the thing
 * under test, and racing a real clock against it makes the suite flaky.
 */
async function settle() {
  // Two steps on purpose: the first flushes the read and lets the component
  // schedule its hold, the second lets that hold elapse. One long advance can
  // miss the timer the first flush schedules.
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(600);
  });
}

beforeEach(() => bridge.reset());
afterEach(cleanup);

const cleanupInfo = (extra: Partial<CleanupInfo> = {}): CleanupInfo =>
  ({
    id: "temp_files",
    name: "Temporary files",
    description: "Files nobody needs",
    requires_admin: false,
    requires_pro: false,
    ...extra,
  }) as CleanupInfo;

const text = { name: "Temporary files", description: "Files nobody needs" };

describe("CleanupCard", () => {
  it("runs the cleanup it was given when the button is pressed", () => {
    const onRun = vi.fn();
    render(
      <ul>
        <CleanupCard s={s} info={cleanupInfo()} text={text} busy={false} onRun={onRun} />
      </ul>,
    );
    fireEvent.click(screen.getByRole("button", { name: s.cleanupButton }));

    expect(onRun).toHaveBeenCalledWith(expect.objectContaining({ id: "temp_files" }));
  });

  it("shows the admin badge only where elevation is needed", () => {
    const { container, rerender } = render(
      <ul>
        <CleanupCard s={s} info={cleanupInfo()} text={text} busy={false} onRun={vi.fn()} />
      </ul>,
    );
    expect(container.querySelector(".badge")).toBeNull();

    rerender(
      <ul>
        <CleanupCard
          s={s}
          info={cleanupInfo({ requires_admin: true })}
          text={text}
          busy={false}
          onRun={vi.fn()}
        />
      </ul>,
    );
    expect(screen.getByText(s.badges.admin)).toBeInTheDocument();
  });

  it("is disabled and relabelled while a cleanup is running", () => {
    render(
      <ul>
        <CleanupCard s={s} info={cleanupInfo()} text={text} busy onRun={vi.fn()} />
      </ul>,
    );
    expect(screen.getByRole("button", { name: s.cleanupRunning })).toBeDisabled();
  });

  it("applies a cleanup the catalogue still marks requires_pro", () => {
    // The flag is catalogue metadata now: nothing may turn it back into a lock.
    const onRun = vi.fn();
    render(
      <ul>
        <CleanupCard
          s={s}
          info={cleanupInfo({ requires_pro: true })}
          text={text}
          busy={false}
          onRun={onRun}
        />
      </ul>,
    );
    const button = screen.getByRole("button", { name: s.cleanupButton });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(onRun).toHaveBeenCalledTimes(1);
  });
});

describe("ScheduledCleanupCard", () => {
  it("reflects the stored state once the read resolves", async () => {
    bridge.reply("scheduled_cleanup_enabled", true);
    render(
      <ul>
        <ScheduledCleanupCard s={s} onToast={vi.fn()} />
      </ul>,
    );

    await screen.findByText(s.scheduledCleanup.title);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: s.scheduledCleanup.title })).toHaveAttribute(
        "aria-pressed",
        "true",
      ),
    );
  });

  it("enables the task with no licence check anywhere in the path", async () => {
    vi.useFakeTimers();
    try {
      const onToast = vi.fn();
      bridge.reply("scheduled_cleanup_enabled", false);
      bridge.reply("set_scheduled_cleanup", true);
      render(
        <ul>
          <ScheduledCleanupCard s={s} onToast={onToast} />
        </ul>,
      );
      await settle();
      const toggle = screen.getByRole("button", { name: s.scheduledCleanup.title });
      expect(toggle).toBeEnabled();
      expect(toggle).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(toggle);
      await settle();

      expect(bridge.callsTo("set_scheduled_cleanup")[0]?.args).toEqual({ enabled: true });
      expect(toggle).toHaveAttribute("aria-pressed", "true");
      expect(onToast).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("turns it back off", async () => {
    vi.useFakeTimers();
    try {
      bridge.reply("scheduled_cleanup_enabled", true);
      bridge.reply("set_scheduled_cleanup", false);
      render(
        <ul>
          <ScheduledCleanupCard s={s} onToast={vi.fn()} />
        </ul>,
      );
      await settle();
      const toggle = screen.getByRole("button", { name: s.scheduledCleanup.title });
      expect(toggle).toHaveAttribute("aria-pressed", "true");

      fireEvent.click(toggle);
      await settle();

      expect(bridge.callsTo("set_scheduled_cleanup")[0]?.args).toEqual({ enabled: false });
    } finally {
      vi.useRealTimers();
    }
  });

  it("says so when the write fails and leaves the switch where it was", async () => {
    vi.useFakeTimers();
    try {
      const onToast = vi.fn();
      bridge.reply("scheduled_cleanup_enabled", false);
      bridge.reply("set_scheduled_cleanup", new Error("needs administrator rights"));
      render(
        <ul>
          <ScheduledCleanupCard s={s} onToast={onToast} />
        </ul>,
      );
      await settle();
      const toggle = screen.getByRole("button", { name: s.scheduledCleanup.title });
      expect(toggle).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(toggle);
      await settle();

      expect(onToast).toHaveBeenCalledWith("error", "Error: needs administrator rights");
      expect(toggle).toHaveAttribute("aria-pressed", "false");
    } finally {
      vi.useRealTimers();
    }
  });

  it("states the schedule in the copy it was given", async () => {
    bridge.reply("scheduled_cleanup_enabled", false);
    const { container } = render(
      <ul>
        <ScheduledCleanupCard s={s} onToast={vi.fn()} />
      </ul>,
    );
    await screen.findByText(s.scheduledCleanup.title);
    expect(container.textContent).toContain(s.scheduledCleanup.body);
  });

  it("has no detectable accessibility violations", async () => {
    bridge.reply("scheduled_cleanup_enabled", true);
    const { container } = render(
      <ul>
        <ScheduledCleanupCard s={s} onToast={vi.fn()} />
      </ul>,
    );
    await screen.findByText(s.scheduledCleanup.title);

    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("the copy these cards render", () => {
  it("has no Pro-only wording left in the cleanup strings", () => {
    const blob = [
      s.cleanupButton,
      s.cleanupRunning,
      s.scheduledCleanup.title,
      s.scheduledCleanup.body,
      ...Object.values(s.badges),
    ].join(" ");
    expect(blob).not.toMatch(/\bpro\b/i);
    expect(format(s.cleanupResultToast, { deleted: 3, freed: "1.0 MB" })).toContain("3");
  });
});
