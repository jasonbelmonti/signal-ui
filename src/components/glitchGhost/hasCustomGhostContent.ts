import { Fragment, isValidElement } from "react";
import type { ReactNode } from "react";

export function hasCustomGhostContent(ghost: ReactNode): boolean {
  if (ghost === null || ghost === undefined || typeof ghost === "boolean") {
    return false;
  }

  if (Array.isArray(ghost)) {
    return ghost.some((child) => hasCustomGhostContent(child));
  }

  if (isValidElement<{ children?: ReactNode }>(ghost) && ghost.type === Fragment) {
    return hasCustomGhostContent(ghost.props.children);
  }

  return true;
}
