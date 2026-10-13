import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useVisibilityInterval } from "./use-visibility-interval";
let hidden = false;
beforeEach(() => {
  hidden = false;
  vi.useFakeTimers();
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it("waits for slow reads and does not overlap on repeated visibility changes", async () => {
  let release!: () => void;
  const read = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        release = resolve;
      }),
  );
  const hook = renderHook(() => useVisibilityInterval(read, 1000));
  await act(() => vi.advanceTimersByTimeAsync(0));
  expect(read).toHaveBeenCalledOnce();
  await act(() => vi.advanceTimersByTimeAsync(5000));
  expect(read).toHaveBeenCalledOnce();
  act(() => {
    hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(read).toHaveBeenCalledOnce();
  await act(async () => {
    release();
    await Promise.resolve();
  });
  await act(() => vi.advanceTimersByTimeAsync(1000));
  expect(read).toHaveBeenCalledTimes(2);
  hook.unmount();
  await act(async () => {
    release();
    await Promise.resolve();
  });
  await act(() => vi.advanceTimersByTimeAsync(5000));
  expect(read).toHaveBeenCalledTimes(2);
});

it("starts no hidden reads, catches up on resume and pauses timers", async () => {
  hidden = true;
  const read = vi.fn(async () => {});
  renderHook(() => useVisibilityInterval(read, 1000));
  await act(() => vi.advanceTimersByTimeAsync(5000));
  expect(read).not.toHaveBeenCalled();
  act(() => {
    hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await act(() => vi.advanceTimersByTimeAsync(0));
  expect(read).toHaveBeenCalledOnce();
  act(() => {
    hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await act(() => vi.advanceTimersByTimeAsync(5000));
  expect(read).toHaveBeenCalledOnce();
});

it("a failed read does not stop future reads", async () => {
  const read = vi.fn().mockRejectedValueOnce(new Error("failed")).mockResolvedValue(undefined);
  renderHook(() => useVisibilityInterval(read, 1000));
  await act(() => vi.advanceTimersByTimeAsync(1000));
  expect(read).toHaveBeenCalledTimes(2);
});
