import { Strings } from "../i18n";
import { CheckIcon } from "./icons";
import "./pricing.css";

/**
 * The plans tab. WinCraft has one plan — free — so the page states what is
 * included and why, instead of comparing tiers that no longer exist. All copy
 * comes from `s.pricing` so it stays translated in every locale.
 */
export function PricingPanel({ s }: { s: Strings }) {
  const c = s.pricing;
  return (
    <section className="pricing-workspace" aria-labelledby="pricing-heading">
      <header className="pricing-heading">
        <p className="pricing-eyebrow">{s.tabs.pricing}</p>
        <h1 id="pricing-heading">{c.title}</h1>
        <p>{c.intro}</p>
      </header>

      <div className="pricing-plans">
        <article className="pricing-plan pricing-plan-pro">
          <div className="pricing-plan-name">
            <h2>{c.planName}</h2>
          </div>
          <p className="pricing-plan-description">{c.planTagline}</p>
          <div className="pricing-price">
            <strong>{c.priceAmount}</strong>
            <span>{c.priceNote}</span>
          </div>
          <ul className="pricing-highlights">
            {c.features.map((feature) => (
              <li key={feature}>
                <CheckIcon className="h-4 w-4" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <section className="pricing-comparison" aria-labelledby="pricing-commitment-heading">
        <h2 id="pricing-commitment-heading">{c.commitmentTitle}</h2>
        <p
          style={{
            maxWidth: "600px",
            margin: "1rem auto",
            lineHeight: 1.6,
            color: "var(--ink-3, #9ca3af)",
          }}
        >
          {c.commitmentBody}
        </p>
      </section>
    </section>
  );
}
