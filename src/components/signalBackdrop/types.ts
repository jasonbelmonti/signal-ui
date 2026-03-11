import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export type SignalBackdropVariant = "contour";
export type SignalBackdropTone = "primary" | "violet";
export type SignalBackdropDensity = "low" | "medium" | "high";

export interface SignalBackdropTelemetry {
  activity?: number;
  alert?: number;
  focus?: number;
}

export interface SignalBackdropFocusPoint {
  radius?: number;
  strength?: number;
  x: number;
  y: number;
}

export type SignalBackdropStyle = CSSProperties &
  Record<`--signal-ui-signal-backdrop-${string}`, string | number>;

type SignalBackdropBaseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "aria-hidden" | "aria-label" | "children" | "role" | "style"
> & {
  animated?: boolean;
  density?: SignalBackdropDensity;
  focusPoint?: SignalBackdropFocusPoint;
  height?: number | string;
  seed?: number | string;
  style?: SignalBackdropStyle;
  telemetry?: SignalBackdropTelemetry;
  tone?: SignalBackdropTone;
  variant?: SignalBackdropVariant;
};

export type SignalBackdropDecorativeProps = SignalBackdropBaseProps & {
  label?: never;
  usage?: "decorative";
};

export type SignalBackdropGraphicProps = SignalBackdropBaseProps & {
  label: string;
  usage: "graphic";
};

export type SignalBackdropProps = SignalBackdropDecorativeProps | SignalBackdropGraphicProps;
