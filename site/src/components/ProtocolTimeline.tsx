import { text } from "../i18n/dictionary";
import { Reveal, RevealGroup } from "../reveal";

export function ProtocolTimeline() {
  return (
    <section id="protocol" className="border-t border-white/5 px-5 py-24 md:px-12">
      <RevealGroup className="mx-auto max-w-7xl">
        <Reveal className="font-mono-t mb-4 text-[11.5px] tracking-[0.18em] text-[var(--fg-dim)]">
          <span className="text-accent">{text.protocol.tag.split(" / ")[0]}</span> /{" "}
          {text.protocol.tag.split(" / ")[1]}
        </Reveal>
        <Reveal
          as="h2"
          className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold tracking-tight text-[var(--fg)]"
        >
          {text.protocol.title}
        </Reveal>

        <div className="relative mt-16">
          <div className="absolute top-2 bottom-2 left-[27px] w-px bg-white/5" />
          {text.protocol.steps.map((s, i) => (
            <Reveal
              key={s.mono}
              duration="850ms"
              className="relative grid grid-cols-[56px_1fr] gap-7 pb-14 last:pb-0"
            >
              {/* The badge lights up a beat after its row lands. It is a
                  descendant of the element the observer marks, so the
                  stylesheet keys the accent off `[data-revealed]` instead of a
                  second animation — one observer, two animations. */}
              <div className="timeline-badge font-mono-t z-10 grid h-14 w-14 place-items-center rounded-xl border bg-[var(--bg-2)] text-[14px] font-bold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="font-mono-t mb-2 text-[11px] tracking-[0.14em] text-[var(--fg-dim)]">
                  {s.mono}
                </div>
                <h3 className="font-display mb-2 text-[20px] font-bold tracking-tight text-[var(--fg)]">
                  {s.title}
                </h3>
                <p className="max-w-2xl text-[14.5px] leading-relaxed text-[var(--fg-dim)]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
