import { text } from "../i18n/dictionary";
import { Reveal, RevealGroup } from "../reveal";
import { DOWNLOAD_EXE } from "../constants";

/**
 * The price. WinCraft has one plan — free — so this states what is included
 * instead of comparing tiers that no longer exist.
 *
 * The campaign pricing that used to live here (three cards, struck prices, a
 * countdown) went with the paid plans: there is nothing left for a discount to
 * apply to, and a page that keeps offering one while the app gates nothing is
 * worse than a page that says the price once.
 */
export function AccessPricing() {
  const { free, note } = text.pricing;

  return (
    <section id="access" className="border-t border-white/5 px-5 py-24 md:px-12">
      <RevealGroup className="mx-auto max-w-7xl">
        <Reveal className="font-mono-t mb-4 text-[11.5px] tracking-[0.18em] text-[var(--fg-dim)]">
          <span className="text-accent">{text.pricing.tag.split(" / ")[0]}</span> /{" "}
          {text.pricing.tag.split(" / ")[1]}
        </Reveal>
        <Reveal
          as="h2"
          className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold tracking-tight text-[var(--fg)]"
        >
          {text.pricing.title}
        </Reveal>

        <Reveal
          className="glow-accent mt-14 rounded-2xl border p-9"
          style={{
            borderColor: "var(--accent-glow)",
            background: "linear-gradient(160deg, var(--bg-2) 60%, var(--accent-soft))",
          }}
        >
          <div className="font-mono-t mb-4 text-[12px] tracking-[0.14em] text-[var(--fg-dim)]">
            {free.plan}
          </div>
          <div className="font-display text-[44px] leading-none font-bold text-[var(--fg)]">
            {free.price}
          </div>
          <div className="mt-2 text-[13px] text-[var(--fg-dim)]">{free.per}</div>
          <ul className="my-7 grid gap-2.5 sm:grid-cols-2">
            {free.features.map((f) => (
              <li key={f} className="relative pl-5 text-[14px] text-[var(--fg-dim)]">
                <span className="text-accent absolute left-0">—</span>
                {f}
              </li>
            ))}
          </ul>
          <a
            href={DOWNLOAD_EXE}
            className="bg-accent block rounded-xl border border-transparent py-3.5 text-center text-[14.5px] font-bold text-[var(--bg)] transition-transform hover:-translate-y-0.5"
          >
            {free.cta}
          </a>
        </Reveal>

        <Reveal as="p" className="mt-5 max-w-3xl text-[13px] leading-relaxed text-[var(--fg-dim)]">
          {note}
        </Reveal>
      </RevealGroup>
    </section>
  );
}
