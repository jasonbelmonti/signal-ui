import { describe, expect, test } from "bun:test";

import { rewriteGhostReferenceValue } from "./rewriteGhostReferenceValue.js";

describe("rewriteGhostReferenceValue", () => {
  const idMap = new Map([
    ["ghost-fill", "signal-ui-glitch-ghost-1-ghost-fill"],
    ["ghost-mask", "signal-ui-glitch-ghost-1-ghost-mask"],
  ]);

  test("rewrites url() SVG references", () => {
    expect(rewriteGhostReferenceValue("fill", "url(#ghost-fill)", idMap)).toBe(
      "url(#signal-ui-glitch-ghost-1-ghost-fill)",
    );
    expect(
      rewriteGhostReferenceValue(
        "style",
        "filter:url(#ghost-mask);clip-path:url(#ghost-fill)",
        idMap,
      ),
    ).toBe(
      "filter:url(#signal-ui-glitch-ghost-1-ghost-mask);clip-path:url(#signal-ui-glitch-ghost-1-ghost-fill)",
    );
  });

  test("rewrites direct and tokenized ID references", () => {
    expect(rewriteGhostReferenceValue("href", "#ghost-fill", idMap)).toBe(
      "#signal-ui-glitch-ghost-1-ghost-fill",
    );
    expect(
      rewriteGhostReferenceValue("aria-labelledby", "ghost-fill ghost-mask", idMap),
    ).toBe(
      "signal-ui-glitch-ghost-1-ghost-fill signal-ui-glitch-ghost-1-ghost-mask",
    );
  });
});
