import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

/**
 * Entrance animation that cannot hide content from anyone who did not get the
 * script that reveals it.
 *
 * The site used an animation library for these fades, which meant the
 * prerendered HTML carried the *start* state: 47 elements on the homepage
 * shipped as `style="opacity:0;transform:translateY(28px)"`. Anyone whose
 * JavaScript was slow, blocked or broken saw a page whose section headings,
 * feature copy and metric labels were missing — and so did a crawler that does
 * not run script. The bytes arrived; the page was blank.
 *
 * This keeps the motion and removes the failure mode, by making the visible
 * state the one that is written down and treating "hidden" as something only a
 * running page can ask for, in this order:
 *
 *   1. The markup and the stylesheet are both visible by default. There is no
 *      hidden start state to fail to animate out of.
 *   2. `useReveal()` runs in a group's effect. Everything at or above the fold
 *      is marked shown immediately — never hidden, not even for a frame — so
 *      the fold never flashes and the LCP element is never in question.
 *   3. Only then does the group set `data-reveal-armed`, the one thing that
 *      lets the stylesheet hide an element, and only elements below the fold
 *      are waiting on it. Nothing is hidden unless its observer is already
 *      running, which is the invariant the old version did not have.
 *   4. `prefers-reduced-motion: reduce` never hides anything, and neither does
 *      a browser without IntersectionObserver: the effect simply returns.
 *
 * The parameters live in the `reveal` block of `src/index.css` and are the ones
 * the previous implementation animated with (0.9s settle, 28px rise, 90ms
 * stagger, 35ms head start, ease-out from cubic-bezier(0.16, 1, 0.3, 1)).
 */

export type RevealAs = ElementType;

export type RevealGroupProps = {
  as?: RevealAs;
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

export type RevealProps = RevealGroupProps & {
  /** One-element overrides, in any CSS length: "850ms", "200ms". */
  delay?: string;
  duration?: string;
};

/**
 * Wraps a section's children and reveals the `.reveal` elements inside it.
 *
 * One observer per group rather than per element: the callback does the same
 * work for every element, and a section with a dozen animated children should
 * not register a dozen observers. Children added later (an opened accordion, a
 * filtered list) are picked up by a mutation observer, which is why the group
 * owns this and not each element.
 */
export function RevealGroup({ as: Tag = "div", className, children, ...rest }: RevealGroupProps) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/** One animated element inside a `RevealGroup`. */
export function Reveal({
  as: Tag = "div",
  className,
  delay,
  duration,
  style,
  children,
  ...rest
}: RevealProps) {
  return (
    <Tag
      className={["reveal", className ?? ""].join(" ").trim()}
      // The overrides are custom properties rather than a second set of
      // keyframes, so one stylesheet rule still describes every reveal.
      style={
        {
          ...(duration ? { "--reveal-duration": duration } : null),
          ...(delay ? { "--reveal-delay": delay } : null),
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // No observer, no hiding: the stylesheet needs `data-reveal-armed` before
    // it will hide anything, so an unsupported browser simply shows the page.
    if (typeof IntersectionObserver === "undefined") return;
    // Reduced motion is read here rather than in a listener: if the preference
    // is on, nothing is ever hidden, so there is nothing to reveal later.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      // A section starts animating as its top approaches the viewport; a short
      // element must never wait for a scroll it cannot trigger itself, which is
      // why this is a margin and not an intersection ratio. The 12% inset is
      // also what `revealPending()` uses to decide what counts as already on
      // screen — if the two disagree, an element could be hidden and never
      // revealed, so they are written next to each other on purpose.
      { rootMargin: "0px 0px -12% 0px" },
    );

    /**
     * Shows what is already on screen and observes the rest.
     *
     * The order matters and is the reason this is synchronous: an element above
     * the fold is marked revealed *before* the group is armed, in the same task
     * with no paint in between, so it is never hidden at all. It also covers
     * the case where the bundle arrives after the reader has scrolled: anything
     * at or above the fold counts as on screen, including content above the
     * viewport that has already been passed.
     */
    const revealPending = () => {
      const fold = window.innerHeight * 0.88;
      const elements = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
      elements.forEach((element, index) => {
        // Document order, so the section's children stagger the way the
        // library's `staggerChildren` used to stagger them.
        element.style.setProperty("--reveal-order", String(index));
        if (element.hasAttribute("data-revealed")) return;
        if (element.getBoundingClientRect().top < fold) element.setAttribute("data-revealed", "");
        else observer.observe(element);
      });
    };

    revealPending();
    root.setAttribute("data-reveal-armed", "");

    let mutation: MutationObserver | undefined;
    if (typeof MutationObserver !== "undefined") {
      mutation = new MutationObserver(revealPending);
      mutation.observe(root, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      mutation?.disconnect();
    };
  }, []);

  return ref;
}
