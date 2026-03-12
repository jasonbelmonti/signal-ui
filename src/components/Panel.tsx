import { Card } from "antd";
import type { CardProps } from "antd";
import type { CSSProperties } from "react";

import { joinClassNames } from "../utils/joinClassNames.js";
import { PanelRevealCanvas } from "./panel/PanelRevealCanvas.js";
import { usePanelCursorTilt } from "./panel/usePanelCursorTilt.js";
import { usePanelRevealState as usePanelPixelRevealState } from "./panel/usePanelRevealState.js";
import { usePanelShellRevealState } from "./panel/usePanelShellRevealState.js";

export type PanelCutCorner = "accent" | "notch";
export type PanelCutCornerPreset = "tactical" | "architectural";
export type PanelFrame = "reticle";
export type PanelSurface = "glass";
export type PanelReveal = "holographic";
export type PanelRevealIntro = "point";
export type PanelRevealOutro = "point";
export type PanelRevealState = "open" | "closed" | "hidden";

export type PanelCutCornerPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface PanelProps extends CardProps {
  cutCornerPreset?: PanelCutCornerPreset;
  cutCorner?: PanelCutCorner;
  cutCornerPlacement?: PanelCutCornerPlacement;
  cutCornerSize?: number | string;
  cutCornerColor?: string;
  frame?: PanelFrame;
  frameColor?: string;
  frameSize?: number | string;
  surface?: PanelSurface;
  surfaceColor?: string;
  surfaceBlur?: number | string;
  reveal?: PanelReveal;
  revealColor?: string;
  revealIntro?: PanelRevealIntro;
  revealOutro?: PanelRevealOutro;
  revealState?: PanelRevealState;
  cursorTilt?: boolean;
}

type PanelStyle = CSSProperties & {
  "--signal-ui-panel-cut-color"?: string;
  "--signal-ui-panel-cut-size"?: string;
  "--signal-ui-panel-reticle-color"?: string;
  "--signal-ui-panel-reticle-size"?: string;
  "--signal-ui-panel-reveal-color"?: string;
  "--signal-ui-panel-surface-blur"?: string;
  "--signal-ui-panel-surface-color"?: string;
};

type PanelShellStyle = CSSProperties & {
  "--signal-ui-panel-reveal-color"?: string;
};

type PanelCutCornerPresetDefinition = {
  cutCorner: PanelCutCorner;
  cutCornerColor: string;
  cutCornerPlacement: PanelCutCornerPlacement;
  cutCornerSize: number | string;
};

export const panelCutCornerPresets = {
  tactical: {
    cutCorner: "accent",
    cutCornerColor: "var(--signal-ui-primary)",
    cutCornerPlacement: "top-right",
    cutCornerSize: 26,
  },
  architectural: {
    cutCorner: "notch",
    cutCornerColor: "var(--signal-ui-primary)",
    cutCornerPlacement: "bottom-left",
    cutCornerSize: 24,
  },
} satisfies Record<PanelCutCornerPreset, PanelCutCornerPresetDefinition>;

export function Panel({
  className,
  cursorTilt,
  cutCorner,
  cutCornerColor,
  cutCornerPreset,
  cutCornerPlacement,
  cutCornerSize,
  frame,
  frameColor,
  frameSize,
  surface,
  surfaceColor,
  surfaceBlur,
  reveal,
  revealColor,
  revealIntro,
  revealOutro,
  revealState = "open",
  style,
  onPointerCancel,
  onPointerLeave,
  onPointerMove,
  ...cardProps
}: PanelProps) {
  const preset = cutCornerPreset ? panelCutCornerPresets[cutCornerPreset] : undefined;
  const resolvedCutCorner = cutCorner ?? preset?.cutCorner;
  const resolvedCutCornerColor = cutCornerColor ?? preset?.cutCornerColor ?? "var(--signal-ui-primary)";
  const resolvedCutCornerPlacement = cutCornerPlacement ?? preset?.cutCornerPlacement ?? "top-right";
  const resolvedCutCornerSize = cutCornerSize ?? preset?.cutCornerSize ?? 26;
  const resolvedSurfaceColor = surfaceColor ?? frameColor ?? resolvedCutCornerColor;
  const resolvedRevealColor = revealColor ?? resolvedSurfaceColor;
  const { renderedRevealState, revealPhase } = usePanelShellRevealState({
    reveal,
    revealIntro,
    revealOutro,
    revealState,
  });
  const shouldRenderPixelReveal = reveal === "holographic" && surface === "glass";
  const { renderedRevealState: renderedPixelRevealState, revealPhase: pixelRevealPhase } =
    usePanelPixelRevealState({
      reveal: shouldRenderPixelReveal ? reveal : undefined,
      revealIntro,
      revealOutro,
      revealState,
    });
  const { surfacePointerHandlers, surfaceRef } = usePanelCursorTilt({
    enabled: cursorTilt,
  });

  const panelStyle: PanelStyle = {
    ...style,
    ...(resolvedCutCorner
      ? {
          "--signal-ui-panel-cut-color": resolvedCutCornerColor,
          "--signal-ui-panel-cut-size": toCssLength(resolvedCutCornerSize) ?? "26px",
        }
      : {}),
    ...(frame === "reticle" || frameColor || frameSize
      ? {
          "--signal-ui-panel-reticle-color": frameColor ?? "var(--signal-ui-primary)",
          "--signal-ui-panel-reticle-size": toCssLength(frameSize) ?? "28px",
        }
      : {}),
    ...(surface === "glass"
      ? {
          "--signal-ui-panel-surface-color": resolvedSurfaceColor,
          "--signal-ui-panel-surface-blur": toCssLength(surfaceBlur) ?? "30px",
        }
      : {}),
    ...(reveal === "holographic"
      ? {
          "--signal-ui-panel-reveal-color": resolvedRevealColor,
        }
      : {}),
  };
  const panelCard = (
    <Card
      {...cardProps}
      onPointerCancel={
        reveal === "holographic"
          ? onPointerCancel
          : cursorTilt
            ? composeEventHandlers(onPointerCancel, surfacePointerHandlers.onPointerCancel)
            : onPointerCancel
      }
      onPointerLeave={
        reveal === "holographic"
          ? onPointerLeave
          : cursorTilt
            ? composeEventHandlers(onPointerLeave, surfacePointerHandlers.onPointerLeave)
            : onPointerLeave
      }
      onPointerMove={
        reveal === "holographic"
          ? onPointerMove
          : cursorTilt
            ? composeEventHandlers(onPointerMove, surfacePointerHandlers.onPointerMove)
            : onPointerMove
      }
      className={joinClassNames(
        "signal-ui-panel",
        cursorTilt && reveal !== "holographic" ? "signal-ui-panel--cursor-tilt" : undefined,
        frame && `signal-ui-panel--frame-${frame}`,
        surface && `signal-ui-panel--surface-${surface}`,
        resolvedCutCorner && `signal-ui-panel--cut-${resolvedCutCorner}`,
        resolvedCutCorner && `signal-ui-panel--corner-${resolvedCutCornerPlacement}`,
        reveal && `signal-ui-panel--reveal-${reveal}`,
        className,
      )}
      ref={cursorTilt && reveal !== "holographic" ? surfaceRef : undefined}
      style={panelStyle}
    />
  );

  if (reveal !== "holographic") {
    return panelCard;
  }

  const shellStyle: PanelShellStyle = {
    "--signal-ui-panel-reveal-color": panelStyle["--signal-ui-panel-reveal-color"],
  };

  return (
    <div
      onPointerCancel={cursorTilt ? surfacePointerHandlers.onPointerCancel : undefined}
      onPointerLeave={cursorTilt ? surfacePointerHandlers.onPointerLeave : undefined}
      onPointerMove={cursorTilt ? surfacePointerHandlers.onPointerMove : undefined}
      ref={cursorTilt ? surfaceRef : undefined}
      className={joinClassNames(
        "signal-ui-panel-shell",
        "signal-ui-panel-shell--reveal-holographic",
        shouldRenderPixelReveal && "signal-ui-panel-shell--pixel-reveal",
        cursorTilt ? "signal-ui-panel-shell--cursor-tilt" : undefined,
      )}
      data-signal-ui-panel-reveal-phase={revealPhase}
      data-signal-ui-panel-reveal-state={renderedRevealState}
      style={shellStyle}
    >
      <div aria-hidden="true" className="signal-ui-panel-shell__pixels" />
      <div aria-hidden="true" className="signal-ui-panel-shell__beam" />
      <div aria-hidden="true" className="signal-ui-panel-shell__edges" />
      <div
        aria-hidden={renderedRevealState !== "open"}
        className="signal-ui-panel-shell__stage"
        inert={renderedRevealState !== "open" ? true : undefined}
      >
        {shouldRenderPixelReveal ? (
          <div aria-hidden="true" className="signal-ui-panel-shell__pixel-layer">
            <PanelRevealCanvas revealPhase={pixelRevealPhase} revealState={renderedPixelRevealState} />
          </div>
        ) : undefined}
        {panelCard}
      </div>
    </div>
  );
}

function composeEventHandlers<Event>(
  ...handlers: Array<((event: Event) => void) | undefined>
) {
  return (event: Event) => {
    handlers.forEach((handler) => {
      handler?.(event);
    });
  };
}

function toCssLength(value: number | string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}
