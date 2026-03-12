import { describe, expect, test } from "bun:test";

import { hasCustomGhostContent } from "./hasCustomGhostContent.js";

describe("hasCustomGhostContent", () => {
  test("treats nullish and boolean ghost values as missing custom content", () => {
    expect(hasCustomGhostContent(undefined)).toBe(false);
    expect(hasCustomGhostContent(null)).toBe(false);
    expect(hasCustomGhostContent(false)).toBe(false);
    expect(hasCustomGhostContent(true)).toBe(false);
  });

  test("treats renderable ghost values as custom content", () => {
    expect(hasCustomGhostContent("Echo shell")).toBe(true);
    expect(hasCustomGhostContent(0)).toBe(true);
    expect(hasCustomGhostContent(["Echo shell"])).toBe(true);
  });
});
