import { describe, expect, test } from "bun:test";
import { createElement, Fragment } from "react";

import { hasCustomGhostContent } from "./hasCustomGhostContent.js";

describe("hasCustomGhostContent", () => {
  test("treats nullish, boolean, and empty render trees as missing custom content", () => {
    expect(hasCustomGhostContent(undefined)).toBe(false);
    expect(hasCustomGhostContent(null)).toBe(false);
    expect(hasCustomGhostContent(false)).toBe(false);
    expect(hasCustomGhostContent(true)).toBe(false);
    expect(hasCustomGhostContent([])).toBe(false);
    expect(hasCustomGhostContent([null, false, undefined])).toBe(false);
    expect(hasCustomGhostContent(createElement(Fragment, null))).toBe(false);
    expect(
      hasCustomGhostContent(createElement(Fragment, null, null, false, undefined)),
    ).toBe(false);
  });

  test("treats renderable ghost values as custom content", () => {
    expect(hasCustomGhostContent("Echo shell")).toBe(true);
    expect(hasCustomGhostContent(0)).toBe(true);
    expect(hasCustomGhostContent(["Echo shell"])).toBe(true);
    expect(hasCustomGhostContent([null, "Echo shell"])).toBe(true);
    expect(hasCustomGhostContent(createElement(Fragment, null, "Echo shell"))).toBe(true);
  });
});
