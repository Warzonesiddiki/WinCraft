import { useEffect, useState, type ReactNode } from "react";
import { text } from "../i18n/dictionary";
import { Reveal, RevealGroup } from "../reveal";

/**
 * An answer that expands from zero height.
 *
 * The panel is mounted before it starts opening and unmounted after it has
 * finished closing, which is what the previous animation library's enter/exit
 * pair did for us. Without that two-step the height transition never runs: an
 * element that appears with `grid-template-rows: 1fr` already applied has
 * nothing to animate from.
 *
 * The mechanism is `grid-template-rows: 0fr` → `1fr`, which animates a box
 * whose content height is unknown to CSS — the same job `height: auto` did,
 * without measuring anything in JavaScript and re-measuring on every resize.
 * Browsers that cannot interpolate `fr` (anything older than the 2022/2023
 * releases) open the panel in one step, which is the fallback this wanted.
 */
function AccordionAnswer({ open, children }: { open: boolean; children: ReactNode }) {
  const [mounted, setMounted] = useState(open);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      // Stay mounted for the length of the collapse, then leave the DOM.
      const timer = setTimeout(() => setMounted(false), 550);
      return () => clearTimeout(timer);
    }
    setMounted(true);
    // The class that starts the transition has to arrive one frame *after* the
    // element does. Setting both in the same render would insert the panel
    // already open, and a transition has nothing to run from.
    const frame = requestAnimationFrame(() => setExpanded(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!mounted) return null;

  return (
    <div className={`faq-answer${expanded ? " is-open" : ""}`}>
      <div className="faq-answer-inner">
        <p className="max-w-2xl pb-6 text-[14.5px] leading-relaxed text-[var(--fg-dim)]">
          {children}
        </p>
      </div>
    </div>
  );
}

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-white/5 px-5 py-24 md:px-12">
      <RevealGroup className="mx-auto max-w-7xl">
        <Reveal className="font-mono-t mb-4 text-[11.5px] tracking-[0.18em] text-[var(--fg-dim)]">
          <span className="text-accent">{text.faq.tag.split(" / ")[0]}</span> /{" "}
          {text.faq.tag.split(" / ")[1]}
        </Reveal>
        <Reveal
          as="h2"
          className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold tracking-tight text-[var(--fg)]"
        >
          {text.faq.title}
        </Reveal>

        <Reveal className="mt-12 max-w-3xl">
          {text.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`faq-row border-b border-white/5${isOpen ? " is-open" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-5 py-6 text-left text-[16.5px] font-semibold text-[var(--fg)]"
                >
                  {item.q}
                  <span className="faq-plus font-mono-t shrink-0 text-[18px]">+</span>
                </button>
                <AccordionAnswer open={isOpen}>{item.a}</AccordionAnswer>
              </div>
            );
          })}
        </Reveal>
      </RevealGroup>
    </section>
  );
}
