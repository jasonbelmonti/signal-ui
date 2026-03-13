import { describe, expect, test } from "bun:test";

import { hasCanvasSnapshotSource } from "./hasCanvasSnapshotSource.js";

describe("hasCanvasSnapshotSource", () => {
  test("returns true when the subtree includes a canvas", () => {
    expect(
      hasCanvasSnapshotSource({
        querySelector: (selector: string) => (selector === "canvas" ? ({} as Element) : null),
      }),
    ).toBe(true);
  });

  test("returns false when the subtree does not include a canvas", () => {
    expect(
      hasCanvasSnapshotSource({
        querySelector: () => null,
      }),
    ).toBe(false);
  });
});
