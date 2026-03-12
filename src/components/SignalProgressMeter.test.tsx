import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { SignalProgressMeter } from "./SignalProgressMeter.js";

describe("SignalProgressMeter", () => {
  test("treats completed as an override even when progress is below 100", () => {
    const markup = renderToStaticMarkup(
      <SignalProgressMeter
        completed
        completionLabel="seal verified"
        progress={40}
        variant="splash"
      />,
    );

    expect(markup).toContain("signal-ui-progress-meter--completed");
    expect(markup).not.toContain("signal-ui-progress-meter--full");
    expect(markup).toMatch(/aria-describedby="[^"]+"/);
    expect(markup).toMatch(/aria-live="polite"[^>]*>seal verified<\/span>/);
    expect(markup).toContain('aria-valuenow="40"');
    expect(markup).toContain(">040%<");
  });

  test("normalizes NaN inputs to safe progress and segment defaults", () => {
    const markup = renderToStaticMarkup(
      <SignalProgressMeter progress={Number.NaN} segmentCount={Number.NaN} />,
    );

    expect(markup).toContain("--signal-ui-progress-meter-progress:0%");
    expect(markup).toContain('aria-valuenow="0"');
    expect(markup).toContain(">000%<");
    expect(markup).toContain("grid-template-columns:repeat(24, minmax(0, 1fr))");
    expect(markup.match(/class="signal-ui-progress-meter__cell(?:\s|")/g)).toHaveLength(24);
  });
});
