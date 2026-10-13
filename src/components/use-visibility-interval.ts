import { useEffect, useRef } from "react";

/** Visual polling only: pause while hidden, catch up on resume and wait for
 * completion before scheduling another read. Background maintenance has its
 * own scheduling policy and must not use this hook. Callbacks report errors. */
export function useVisibilityInterval(callback: () => void | Promise<unknown>, intervalMs: number) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (intervalMs <= 0) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let active = !document.hidden;
    let stopped = false;
    let busy = false;
    function tick() {
      if (busy || !active || stopped) return;
      busy = true;
      void Promise.resolve()
        .then(() => {
          if (active && !stopped) return callbackRef.current();
        })
        .catch(() => {
          // Consumers own their error display; a rejected read must not stop
          // future polling or create an unhandled promise rejection.
        })
        .finally(() => {
          busy = false;
          if (active && !stopped) timer = setTimeout(tick, intervalMs);
        });
    }
    function onVisibilityChange() {
      active = !document.hidden;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      if (active) tick();
    }
    tick();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stopped = true;
      if (timer !== null) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intervalMs]);
}
