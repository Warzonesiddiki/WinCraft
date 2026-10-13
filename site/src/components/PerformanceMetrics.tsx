import { text } from "../i18n/dictionary";
import { Reveal, RevealGroup } from "../reveal";

/* ---------- deterministic pseudo-random frame-time traces ---------- */
function buildTrace(jitter: number, base: number, seed: number): string {
  const pts: string[] = [];
  let s = seed;
  const rand = () => {
    /* xorshift — deterministic, so SSR/rerenders never disagree */
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1000) / 1000;
  };
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * 560;
    const spike = rand() < 0.12 ? rand() * jitter * 1.8 : 0;
    const y = base + (rand() - 0.5) * jitter + spike;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

const STOCK_TRACE = buildTrace(34, 60, 42);
const TWEAKED_TRACE = buildTrace(6, 118, 1337);

export function PerformanceMetrics() {
  return (
    <section id="results" className="border-t border-white/5 px-5 py-24 md:px-12">
      <RevealGroup className="mx-auto max-w-7xl">
        <div className="mb-16 grid items-end gap-10 md:grid-cols-2">
          <div>
            <Reveal className="font-mono-t mb-4 text-[11.5px] tracking-[0.18em] text-[var(--fg-dim)]">
              <span className="text-accent">{text.metrics.tag.split(" / ")[0]}</span> /{" "}
              {text.metrics.tag.split(" / ")[1]}
            </Reveal>
            <Reveal
              as="h2"
              className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] leading-tight font-bold tracking-tight text-[var(--fg)]"
            >
              {text.metrics.title}
            </Reveal>
          </div>
          <Reveal as="p" className="text-[15px] leading-relaxed text-[var(--fg-dim)]">
            {text.metrics.sub}
          </Reveal>
        </div>

        {/* stat strip */}
        <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-4">
          {text.metrics.stats.map((s) => (
            <div key={s.label} className="bg-[var(--bg)] px-7 py-9">
              <div className="font-mono-t text-[clamp(2rem,3.6vw,3rem)] leading-none font-bold text-[var(--fg)] tabular-nums">
                <span>{s.value}</span>
                <span className="text-accent ml-0.5 text-[0.45em]">{s.unit}</span>
              </div>
              <div className="font-mono-t mt-3 text-[12px] tracking-wide text-[var(--fg-dim)]">
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>

        {/* frame-time telemetry graph */}
        <Reveal className="mt-14 overflow-hidden rounded-2xl border border-white/5 bg-[var(--bg-2)] p-7 md:p-9">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono-t text-[11px] tracking-[0.16em] text-[var(--fg-dim)]">
              {text.metrics.graphTitle}
            </span>
            <div className="font-mono-t flex gap-6 text-[11px] tracking-wider">
              <span className="flex items-center gap-2 text-[var(--fg-dim)]">
                <span className="inline-block h-0.5 w-6 bg-[var(--line)]" />{" "}
                {text.metrics.graphStock} · {text.metrics.fpsStock} FPS
              </span>
              <span className="text-accent flex items-center gap-2">
                <span className="bg-accent inline-block h-0.5 w-6" /> {text.metrics.graphTweaked} ·{" "}
                {text.metrics.fpsTweaked} FPS
              </span>
            </div>
          </div>

          <svg
            viewBox="0 0 560 160"
            className="w-full"
            role="img"
            aria-label="Example frame-time traces, not measured benchmark data"
          >
            {[0, 40, 80, 120, 160].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="560"
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            ))}
            <polyline
              points={STOCK_TRACE}
              fill="none"
              stroke="var(--line)"
              strokeWidth="1.6"
              pathLength={1}
              className="trace-draw"
            />
            <polyline
              points={TWEAKED_TRACE}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              pathLength={1}
              className="trace-draw trace-draw--delayed"
            />
          </svg>

          <div className="font-mono-t mt-5 text-[11.5px] text-[var(--fg-dim)]">
            {text.metrics.graphNote}
          </div>
        </Reveal>
      </RevealGroup>
    </section>
  );
}
