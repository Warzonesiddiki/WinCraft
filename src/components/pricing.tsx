import type { Lang } from "../i18n";
import { Strings } from "../i18n";
import { ProPlan } from "../lib";
import { CheckIcon } from "./icons";
import "./pricing.css";

export function PricingPanel({
  s,
}: {
  s: Strings;
  lang?: Lang;
  isPro?: boolean;
  heldPlan?: string | null;
  hasBilling?: boolean;
  freeTweakCount?: number;
  onChoosePro?: (plan: ProPlan) => void | Promise<void>;
  onManageBilling?: () => void | Promise<void>;
  onOpenLifetimeTools?: () => void;
}) {
  return (
    <section className="pricing-workspace" aria-labelledby="pricing-heading">
      <header className="pricing-heading">
        <p className="pricing-eyebrow">{s.tabs.pricing}</p>
        <h1 id="pricing-heading">Free for Everyone</h1>
        <p>
          PC Tweaker is now completely free and open source. All features, all
          tools, no subscriptions, no paywalls. Just download and start
          optimizing.
        </p>
      </header>

      <div className="pricing-plans">
        <article className="pricing-plan pricing-plan-pro">
          <div className="pricing-plan-name">
            <h2>Everything Included</h2>
          </div>
          <p className="pricing-plan-description">
            Every tool, every tweak, every feature — no restrictions.
          </p>
          <div className="pricing-price">
            <strong>$0</strong>
            <span>forever</span>
          </div>
          <ul className="pricing-highlights">
            <li>
              <CheckIcon className="h-4 w-4" />
              <span>All system tweaks and optimizations</span>
            </li>
            <li>
              <CheckIcon className="h-4 w-4" />
              <span>Advanced gaming and privacy tools</span>
            </li>
            <li>
              <CheckIcon className="h-4 w-4" />
              <span>Disk cleanup, defragmentation and system repair</span>
            </li>
            <li>
              <CheckIcon className="h-4 w-4" />
              <span>Driver updates and diagnostics</span>
            </li>
            <li>
              <CheckIcon className="h-4 w-4" />
              <span>Game Sessions and monitoring profiles</span>
            </li>
            <li>
              <CheckIcon className="h-4 w-4" />
              <span>Zero-Trace memory purge and secure shredder</span>
            </li>
            <li>
              <CheckIcon className="h-4 w-4" />
              <span>All future updates included</span>
            </li>
          </ul>
        </article>
      </div>

      <section className="pricing-comparison" aria-labelledby="pricing-commitment-heading">
        <h2 id="pricing-commitment-heading">Our Commitment</h2>
        <p style={{ maxWidth: "600px", margin: "1rem auto", lineHeight: 1.6, color: "var(--ink-3, #9ca3af)" }}>
          PC Tweaker is and will remain free. We believe everyone should have
          access to tools that help them understand and optimize their PC. No
          hidden costs, no feature gates, no subscriptions. Just powerful tools
          for everyone.
        </p>
      </section>
    </section>
  );
}
