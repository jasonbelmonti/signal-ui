import { useRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { joinClassNames } from "../utils/joinClassNames.js";
import { getFullScreenWipePhaseDurationMs, useFullScreenWipeState } from "./fullScreenWipe/useFullScreenWipeState.js";
import { useProceduralPixelWipeCanvas } from "./fullScreenWipe/useProceduralPixelWipeCanvas.js";

export type FullScreenWipeVariant = "flat-iris" | "procedural-pixel";
export type FullScreenWipeState = "open" | "closed";

export interface FullScreenWipeProps extends HTMLAttributes<HTMLDivElement> {
  accentColor?: string;
  children?: ReactNode;
  coverColor?: string;
  durationMs?: number;
  overlayLabel?: string;
  state?: FullScreenWipeState;
  variant?: FullScreenWipeVariant;
}

type FullScreenWipeStyle = CSSProperties & {
  "--signal-ui-full-screen-wipe-accent"?: string;
  "--signal-ui-full-screen-wipe-closing-duration"?: string;
  "--signal-ui-full-screen-wipe-cover"?: string;
  "--signal-ui-full-screen-wipe-duration"?: string;
  "--signal-ui-full-screen-wipe-opening-duration"?: string;
};

const DEFAULT_DURATION_MS = 140;

export function FullScreenWipe({
  accentColor = "var(--signal-ui-primary)",
  children,
  className,
  coverColor = "rgb(4 5 8 / 0.98)",
  durationMs = DEFAULT_DURATION_MS,
  overlayLabel,
  state = "open",
  style,
  variant = "flat-iris",
  ...divProps
}: FullScreenWipeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { blocksInteraction, phase, reducedMotion, renderedState } = useFullScreenWipeState({
    durationMs,
    state,
  });
  const openingDurationMs = getFullScreenWipePhaseDurationMs(durationMs, "opening");
  const closingDurationMs = getFullScreenWipePhaseDurationMs(durationMs, "closing");
  const phaseDurationMs = phase ? getFullScreenWipePhaseDurationMs(durationMs, phase) : durationMs;

  useProceduralPixelWipeCanvas({
    canvasRef,
    durationMs: phaseDurationMs,
    phase: variant === "procedural-pixel" ? phase : undefined,
    reducedMotion,
    state: variant === "procedural-pixel" ? state : "open",
  });

  const rootStyle: FullScreenWipeStyle = {
    ...style,
    "--signal-ui-full-screen-wipe-accent": accentColor,
    "--signal-ui-full-screen-wipe-closing-duration": `${closingDurationMs}ms`,
    "--signal-ui-full-screen-wipe-cover": coverColor,
    "--signal-ui-full-screen-wipe-duration": `${durationMs}ms`,
    "--signal-ui-full-screen-wipe-opening-duration": `${openingDurationMs}ms`,
  };

  return (
    <div
      {...divProps}
      className={joinClassNames("signal-ui-full-screen-wipe", className)}
      data-signal-ui-full-screen-wipe-blocking={blocksInteraction ? "true" : "false"}
      data-signal-ui-full-screen-wipe-phase={phase}
      data-signal-ui-full-screen-wipe-rendered-state={renderedState}
      data-signal-ui-full-screen-wipe-state={state}
      data-signal-ui-full-screen-wipe-variant={variant}
      style={rootStyle}
    >
      <div
        aria-hidden={blocksInteraction}
        className="signal-ui-full-screen-wipe__content"
        inert={blocksInteraction ? true : undefined}
      >
        {children}
      </div>

      <div aria-hidden="true" className="signal-ui-full-screen-wipe__overlay">
        <div className="signal-ui-full-screen-wipe__scan" />

        {variant === "flat-iris" ? (
          <div className="signal-ui-full-screen-wipe__flat-iris">
            {flatIrisPanelClassNames.map((panelClassName) => (
              <span
                className={joinClassNames("signal-ui-full-screen-wipe__panel", panelClassName)}
                key={panelClassName}
              />
            ))}
            <span className="signal-ui-full-screen-wipe__iris-core" />
          </div>
        ) : (
          <div className="signal-ui-full-screen-wipe__procedural">
            <canvas
              className="signal-ui-full-screen-wipe__canvas"
              ref={canvasRef}
            />
          </div>
        )}

        {overlayLabel ? (
          <div className="signal-ui-full-screen-wipe__label">
            <span>{overlayLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const flatIrisPanelClassNames = [
  "signal-ui-full-screen-wipe__panel--northwest",
  "signal-ui-full-screen-wipe__panel--northeast",
  "signal-ui-full-screen-wipe__panel--southwest",
  "signal-ui-full-screen-wipe__panel--southeast",
];
