// DOM matchers (`toHaveTextContent`, `toHaveAttribute`, ...) for every test
// file, and the type augmentation that makes them visible to `tsc`.
import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";

// jsdom does not implement scrolling. The scan panel scrolls its results into
// view when a report arrives, which is exactly the behaviour that would throw
// here, so it is stubbed rather than left out of the component.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom does not implement the modal dialog API either. The scan panel opens
// its review dialog with showModal()/close(), so the two methods are mapped to
// the `open` attribute the element already has.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false;
  };
}

// Testing Library's default async margin is one second. On a loaded CI runner
// a panel with 13 results can take longer than that to paint, which shows up
// as a random failure in an unrelated file. Three seconds still fails fast on
// a real hang, but not on a slow machine.
configure({ asyncUtilTimeout: 3000 });
