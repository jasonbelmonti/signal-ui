import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { joinClassNames } from "../utils/joinClassNames.js";
import {
  formatSignalStatusTagLabel,
  resolveSignalStatusTagTone,
  type SignalStatusTagContext,
  type SignalStatusTagTone,
} from "./signalStatusTagTheme.js";

export type { SignalStatusTagContext, SignalStatusTagTone } from "./signalStatusTagTheme.js";

export interface SignalStatusTagProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode;
  context?: SignalStatusTagContext;
  tone?: SignalStatusTagTone;
  value?: string | null;
}

export function SignalStatusTag({
  children,
  className,
  context,
  tone,
  value,
  ...props
}: SignalStatusTagProps) {
  const resolvedTone = tone ?? resolveSignalStatusTagTone(context, value);
  const resolvedLabel = children ?? formatSignalStatusTagLabel(value);

  return (
    <span
      className={joinClassNames(
        "signal-ui-status-tag",
        `signal-ui-status-tag--${resolvedTone}`,
        className,
      )}
      {...props}
    >
      {resolvedLabel}
    </span>
  );
}
