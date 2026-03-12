import type { ReactNode } from "react";

export function hasCustomGhostContent(ghost: ReactNode) {
  return ghost !== null && ghost !== undefined && typeof ghost !== "boolean";
}
