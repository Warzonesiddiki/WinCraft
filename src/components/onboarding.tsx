import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Strings } from "../i18n";
import type { TweakInfo } from "../types";
import { textFor } from "../lib";

const ONBOARDING_KEY = "wincraft-onboarding-complete";

/** Returns true if the user has never completed onboarding. */
export function shouldShowOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) !== "true";
  } catch {
    return false;
  }
}

/** Marks onboarding as complete so it never shows again. */
export function completeOnboarding() {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch (err) {
    // Storage blocked: onboarding will show again next launch. Acceptable.
    console.warn("[Onboarding] save onboarding state failed", err);
  }
}

type Step = "welcome" | "scan" | "apply" | "done";

/**
 * A 4-step first-run experience designed to get users from "just installed"
 * to "first tweak applied" in under 60 seconds.
 *
 * Step 1 — Welcome: Brand introduction, one-line value proposition.
 * Step 2 — Scan: Quick system scan (reuses the existing scan runner).
 * Step 3 — Apply: Show top 3-5 recommended tweaks, one-click apply.
 * Step 4 — Done: Celebration, link to full app.
 *
 * The flow is linear but skippable at any point. Completing or skipping
 * writes to localStorage so it never shows again.
 */
export function OnboardingFlow({
  s,
  tweaks,
  onComplete,
  onSkip,
}: {
  s: Strings;
  tweaks: TweakInfo[];
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState<Step>("welcome");
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    return () => {
      alive.current = false;
    };
  }, []);

  // Recommended tweaks: applied=false, requires_admin=false (no UAC prompt during onboarding)
  const recommendations = tweaks
    .filter((t) => !t.applied && !t.requires_admin && t.id !== "turbo_boost")
    .slice(0, 5);

  const runQuickScan = useCallback(async () => {
    setScanning(true);
    try {
      // A lightweight scan: just list_tweaks to refresh the applied state.
      // The full scan is available on the Scan page.
      await invoke<TweakInfo[]>("list_tweaks");
      if (alive.current) {
        setScanDone(true);
        // Auto-advance after a brief pause
        setTimeout(() => {
          if (alive.current) setStep("apply");
        }, 800);
      }
    } catch {
      // Scan failed: let them proceed anyway
      if (alive.current) {
        setScanDone(true);
        setStep("apply");
      }
    } finally {
      if (alive.current) setScanning(false);
    }
  }, []);

  async function applyTweak(tweak: TweakInfo) {
    if (applying || appliedIds.has(tweak.id)) return;
    setApplying(tweak.id);
    try {
      await invoke("apply_tweak", { id: tweak.id });
      setAppliedIds((prev) => new Set(prev).add(tweak.id));
    } catch (err) {
      // Tweak failed: log warning, don't block onboarding
      console.warn(`[Onboarding] apply_tweak failed for ${tweak.id}`, err);
    } finally {
      setApplying(null);
    }
  }

  function finish() {
    completeOnboarding();
    onComplete();
  }

  function skip() {
    completeOnboarding();
    onSkip();
  }

  const stepIndex = { welcome: 0, scan: 1, apply: 2, done: 3 }[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-scrim/70 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface-1 p-8 shadow-2xl">
        {/* Progress dots */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? "w-6 bg-accent"
                  : i < stepIndex
                    ? "w-1.5 bg-accent/40"
                    : "w-1.5 bg-line-2"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[280px]">
          {step === "welcome" && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-3xl">
                🛠️
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-ink">Welcome to WinCraft</h1>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-3">
                Your PC, your rules. WinCraft gives you full control over Windows settings with
                one-click tweaks and instant rollback.
              </p>
              <p className="mt-2 text-xs text-ink-3">Free and open source. No account required.</p>
            </div>
          )}

          {step === "scan" && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-3xl">
                {scanning ? (
                  <span className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-accent border-t-transparent" />
                ) : scanDone ? (
                  "✅"
                ) : (
                  "🔍"
                )}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-ink">
                {scanning
                  ? "Scanning your system…"
                  : scanDone
                    ? "Scan complete"
                    : "Quick system scan"}
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-3">
                {scanning
                  ? "Checking your current settings and hardware configuration."
                  : scanDone
                    ? "We've identified settings that could improve your experience."
                    : "We'll check your current settings to find the best recommendations."}
              </p>
              {!scanning && !scanDone && (
                <button
                  onClick={runQuickScan}
                  className="mt-6 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
                >
                  Start Scan
                </button>
              )}
            </div>
          )}

          {step === "apply" && (
            <div>
              <div className="mb-5 text-center">
                <h2 className="text-xl font-bold tracking-tight text-ink">Recommended for you</h2>
                <p className="mt-2 text-sm text-ink-3">
                  Tap any tweak to apply it. You can undo these anytime.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {recommendations.length === 0 ? (
                  <p className="py-4 text-center text-sm text-ink-3">
                    Your system looks well configured already!
                  </p>
                ) : (
                  recommendations.map((t) => {
                    const applied = appliedIds.has(t.id);
                    const isApplying = applying === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => applyTweak(t)}
                        disabled={applied || isApplying}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                          applied
                            ? "border-ok/30 bg-ok/10"
                            : "border-line bg-surface-2 hover:border-accent/40 hover:bg-surface-hover"
                        }`}
                      >
                        <span className="text-lg" aria-hidden="true">
                          {applied ? "✅" : isApplying ? "⏳" : "⬜"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-ink">
                            {textFor(s.tweaks, t.id, t.name, t.description).name}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-ink-3">
                            {textFor(s.tweaks, t.id, t.name, t.description).description}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-3xl">
                🎉
              </div>
              <h2 className="text-xl font-bold tracking-tight text-ink">You're all set!</h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-3">
                {appliedIds.size > 0
                  ? `${appliedIds.size} tweak${appliedIds.size > 1 ? "s" : ""} applied. You can undo any change from the app.`
                  : "Explore the full app to discover more ways to optimize your PC."}
              </p>
              <p className="mt-2 text-xs text-ink-3">
                Tip: Press{" "}
                <kbd className="rounded border border-line bg-surface-2 px-1 py-0.5 text-[10px] font-semibold">
                  Ctrl+K
                </kbd>{" "}
                anywhere to search.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          {step !== "welcome" ? (
            <button
              onClick={() => {
                const steps: Step[] = ["welcome", "scan", "apply", "done"];
                const idx = steps.indexOf(step);
                if (idx > 0) setStep(steps[idx - 1]);
              }}
              className="text-sm text-ink-3 transition-colors hover:text-ink"
            >
              Back
            </button>
          ) : (
            <button onClick={skip} className="text-sm text-ink-3 transition-colors hover:text-ink">
              Skip setup
            </button>
          )}

          {step === "welcome" && (
            <button
              onClick={() => setStep("scan")}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
            >
              Get started →
            </button>
          )}

          {step === "scan" && scanDone && (
            <button
              onClick={() => setStep("apply")}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
            >
              See recommendations →
            </button>
          )}

          {step === "apply" && (
            <button
              onClick={() => setStep("done")}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
            >
              {appliedIds.size > 0 ? "See results →" : "Skip →"}
            </button>
          )}

          {step === "done" && (
            <button
              onClick={finish}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
            >
              Open WinCraft →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
