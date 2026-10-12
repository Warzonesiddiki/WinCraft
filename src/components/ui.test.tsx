import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { axe } from "jest-axe";
import { STRINGS } from "../i18n";
import { Badge, Toggle } from "./ui";

afterEach(cleanup);

const s = STRINGS.en;

function badge(kind: Parameters<typeof Badge>[0]["kind"], label: string) {
  const { container } = render(<Badge kind={kind}>{label}</Badge>);
  const tag = container.querySelector<HTMLElement>(".badge");
  if (!tag) throw new Error("badge did not render");
  return tag;
}

describe("Badge", () => {
  it("renders one shape for every kind and states the kind in the markup", () => {
    expect(badge("admin", s.badges.admin)).toHaveAttribute("data-kind", "admin");
    expect(badge(undefined, "Plain")).toHaveAttribute("data-kind", "neutral");
    expect(badge("warn", "Careful")).toHaveTextContent("Careful");
  });

  it("marks only the admin tag with an icon", () => {
    expect(badge("admin", s.badges.admin).querySelector("svg")).not.toBeNull();
    expect(badge("info", "Info").querySelector("svg")).toBeNull();
  });

  it("keeps the layout class it is given alongside its own", () => {
    const { container } = render(
      <Badge kind="ok" className="hidden sm:inline">
        Done
      </Badge>,
    );
    expect(container.querySelector(".badge")).toHaveClass("badge", "hidden");
  });
});

describe("Toggle", () => {
  const click = () => {};

  it("reports its state through aria-pressed and flips its caption", () => {
    const { container, rerender } = render(
      <Toggle checked={false} busy={false} onClick={click} s={s} />,
    );
    const button = container.querySelector<HTMLButtonElement>("button");
    if (!button) throw new Error("toggle did not render");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveTextContent(s.toggle.off);

    rerender(<Toggle checked busy={false} onClick={click} s={s} />);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent(s.toggle.on);
  });

  it("calls back once per click and stays quiet while a write is in flight", () => {
    const onClick = vi.fn();
    const { container, rerender } = render(
      <Toggle checked={false} busy={false} onClick={onClick} s={s} />,
    );
    const button = container.querySelector<HTMLButtonElement>("button");
    if (!button) throw new Error("toggle did not render");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<Toggle checked={false} busy onClick={onClick} s={s} busyLabel="Saving..." />);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveTextContent("Saving...");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("uses the shared applying caption when no busy label is given", () => {
    const { container } = render(<Toggle checked busy onClick={click} s={s} />);
    expect(container.textContent).toBe(s.profiles.applying);
  });

  it("has no detectable accessibility violations in either state", async () => {
    const { container } = render(
      <div>
        <Toggle checked={false} busy={false} onClick={click} s={s} label="Cookie cleaner" />
        <Toggle checked busy={false} onClick={click} s={s} label="Scheduled cleanup" />
      </div>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
