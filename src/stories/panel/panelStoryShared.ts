import type { CSSProperties } from "react";

import type { PanelProps } from "../../components/Panel.js";
import { signalPalette } from "../../theme/signalTheme.js";

export type SignalReadoutStyle = CSSProperties &
  Record<`--signal-ui-fx-signal-${string}`, string | number>;

export type PanelRevealStyle = CSSProperties &
  Partial<Record<`--signal-ui-panel-reveal-${string}`, string | number>>;

export type RevealState = NonNullable<PanelProps["revealState"]>;

export function getNextRevealState(current: RevealState): RevealState {
  if (current === "open") {
    return "closed";
  }

  if (current === "closed") {
    return "hidden";
  }

  return "open";
}

export const eyebrowStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: signalPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

export const metricBlockStyle: CSSProperties = {
  padding: "10px 12px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.02)",
};

export const metricLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: "rgba(245, 245, 240, 0.72)",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

export const metricValueStyle: CSSProperties = {
  fontSize: 18,
  letterSpacing: "0.14em",
  lineHeight: 1,
};

export const reticleReadoutStyle: SignalReadoutStyle = {
  "--signal-ui-fx-signal-accent": signalPalette.primary,
  "--signal-ui-fx-signal-glow": "rgb(var(--signal-ui-primary-rgb) / 0.4)",
  fontSize: 24,
  letterSpacing: "0.16em",
  lineHeight: 0.98,
};

export const violetReticleReadoutStyle: SignalReadoutStyle = {
  ...reticleReadoutStyle,
  "--signal-ui-fx-signal-accent": signalPalette.accentViolet,
  "--signal-ui-fx-signal-glow": "rgba(159, 77, 255, 0.34)",
  fontSize: 20,
};
