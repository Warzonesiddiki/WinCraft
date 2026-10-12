import { useEffect, useRef } from "react";

/**
 * A `setInterval` that pauses when the app window is hidden and resumes
 * when it becomes visible again. Prevents CPU wake-ups and battery drain
 * when the user has minimised or alt-tabbed away from the app.
 *
 * The callback is NOT called while hidden; the first call after becoming
 * visible fires immediately so the UI never shows stale data for longer
 * than one interval.
 *
 * Returns nothing — the interval is managed entirely by the hook.
 */
export function useVisibilityInterval(callback: () => void, intervalMs: number) {
  // The latest callback is kept in a ref so the interval below is not torn
  // down and re-created on every render, while still calling the freshest
  // closure. The assignment lives in an effect: writing to a ref during
  // render makes the value the interval reads depend on render timing.
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (intervalMs <= 0) return;

    let id: ReturnType<typeof setInterval> | null = null;

    function start() {
      if (id !== null) return;
      // Fire immediately on resume so the UI catches up without waiting
      // a full interval for the first tick.
      callbackRef.current();
      id = setInterval(() => callbackRef.current(), intervalMs);
    }

    function stop() {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    }

    function onVisibilityChange() {
      if (document.hidden) stop();
      else start();
    }

    // Start only if the window is currently visible.
    if (!document.hidden) start();

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intervalMs]);
}
