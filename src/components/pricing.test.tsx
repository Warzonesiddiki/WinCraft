import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { LANGUAGES } from "../i18n";
import { STRINGS } from "../i18n-tables";
import { PricingPanel } from "./pricing";

afterEach(cleanup);

// A price with decimals (7.99 €, $9.99). The free page states "$0", which has
// none, so this catches a paid amount coming back through the copy table.
const PAID_AMOUNT = /[$€£]\s?\d+[.,]\d{1,2}|\d+[.,]\d{2}\s?[$€£]/;
const UPSELL = /upgrade to pro|passa a pro|pasa a pro|passer à pro|auf pro upgraden|fazer upgrade/i;

describe("the plans page", () => {
  for (const { code, native } of LANGUAGES) {
    it(`states one free plan in ${native}`, () => {
      const s = STRINGS[code];
      const { container } = render(<PricingPanel s={s} />);
      const page = within(container);

      expect(page.getByRole("heading", { level: 1, name: s.pricing.title })).toBeInTheDocument();
      expect(page.getByText(s.pricing.planName)).toBeInTheDocument();
      expect(page.getByText(s.pricing.priceAmount)).toBeInTheDocument();
      expect(page.getByText(s.pricing.commitmentTitle)).toBeInTheDocument();
      expect(container.querySelectorAll(".pricing-highlights li")).toHaveLength(
        s.pricing.features.length,
      );

      // The page used to compare tiers and quote a monthly price.
      expect(container.textContent).not.toMatch(PAID_AMOUNT);
      expect(container.textContent).not.toMatch(UPSELL);
      expect(container.querySelector(".pricing-plan-pro")).not.toBeNull();
    });
  }

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<PricingPanel s={STRINGS.en} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
