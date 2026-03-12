import { Card } from "antd";
import type { CardProps } from "antd";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { usePanelCursorTilt } from "./panel/usePanelCursorTilt.js";

export type PanelCutCorner = "accent" | "notch";
export type PanelCutCornerPreset = "tactical" | "architectural";
export type PanelFrame = "reticle";
export type PanelReveal = "holographic";
export type PanelRevealIntro = "point";
export type PanelRevealOutro = "point";
export type PanelRevealState = "open" | "closed" | "hidden";

const PANEL_HOLOGRAPHIC_REVEAL_DURATION_MS = 520;
const PANEL_POINT_REVEAL_BEAM_DURATION_MS = 220;

type ResolvedPanelRevealState = PanelRevealState;
type PanelRevealPhase = "intro-point" | "outro-point";

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

function toCssLength(value: PanelProps["cutCornerSize"]) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
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

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The public API stays simple while the shell runs a small hidden/line/open state machine.
function usePanelRevealState({
  reveal,
  revealIntro,
  revealOutro,
  revealState,
}: {
  reveal?: PanelReveal;
  revealIntro?: PanelRevealIntro;
  revealOutro?: PanelRevealOutro;
  revealState: PanelRevealState;
}) {
  const reducedMotion = prefersReducedMotion();
  const shouldRenderPointRevealOnOpen =
    reveal === "holographic" && revealIntro === "point" && revealState === "open" && !reducedMotion;
  const [renderedRevealState, setRenderedRevealState] = useState<ResolvedPanelRevealState>(
    shouldRenderPointRevealOnOpen ? "hidden" : revealState,
  );
  const [revealPhase, setRevealPhase] = useState<PanelRevealPhase | undefined>(
    shouldRenderPointRevealOnOpen ? "intro-point" : undefined,
  );
  const renderedRevealStateRef = useRef<ResolvedPanelRevealState>(renderedRevealState);

  useEffect(() => {
    renderedRevealStateRef.current = renderedRevealState;
  }, [renderedRevealState]);

  useEffect(() => {
    if (reveal !== "holographic") {
      return undefined;
    }

    const setResolvedRevealState = (nextState: ResolvedPanelRevealState) => {
      renderedRevealStateRef.current = nextState;
      setRenderedRevealState(nextState);
    };
    const timeoutIds: number[] = [];
    const animationFrameIds: number[] = [];
    const schedule = (callback: () => void, delayMs: number) => {
      timeoutIds.push(window.setTimeout(callback, delayMs));
    };
    const scheduleFrame = (callback: () => void) => {
      animationFrameIds.push(window.requestAnimationFrame(callback));
    };
    const currentRenderedRevealState = renderedRevealStateRef.current;

    if (reducedMotion) {
      setRevealPhase(undefined);
      setResolvedRevealState(revealState);
      return () => {
        timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
        animationFrameIds.forEach((animationFrameId) => window.cancelAnimationFrame(animationFrameId));
      };
    }

    if (revealState === "open" && revealIntro === "point" && currentRenderedRevealState === "hidden") {
      setRevealPhase("intro-point");
      schedule(() => {
        setRevealPhase(undefined);
        setResolvedRevealState("closed");
        scheduleFrame(() => {
          setResolvedRevealState("open");
        });
      }, PANEL_POINT_REVEAL_BEAM_DURATION_MS);
    } else if (
      revealState === "hidden" &&
      revealOutro === "point" &&
      currentRenderedRevealState !== "hidden"
    ) {
      setRevealPhase("outro-point");

      if (currentRenderedRevealState === "open") {
        setResolvedRevealState("closed");
        schedule(() => {
          setResolvedRevealState("hidden");
        }, PANEL_HOLOGRAPHIC_REVEAL_DURATION_MS);
        schedule(() => {
          setRevealPhase(undefined);
        }, PANEL_HOLOGRAPHIC_REVEAL_DURATION_MS + PANEL_POINT_REVEAL_BEAM_DURATION_MS);
      } else {
        setResolvedRevealState("hidden");
        schedule(() => {
          setRevealPhase(undefined);
        }, PANEL_POINT_REVEAL_BEAM_DURATION_MS);
      }
    } else {
      setRevealPhase(undefined);
      setResolvedRevealState(revealState);
    }

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      animationFrameIds.forEach((animationFrameId) => window.cancelAnimationFrame(animationFrameId));
    };
  }, [reducedMotion, reveal, revealIntro, revealOutro, revealState]);

  return {
    revealPhase,
    renderedRevealState,
  };
}

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
  const resolvedRevealColor = revealColor ?? frameColor ?? resolvedCutCornerColor;
  const { revealPhase, renderedRevealState } = usePanelRevealState({
    reveal,
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
        cursorTilt && reveal !== "holographic"
          ? composeEventHandlers(onPointerCancel, surfacePointerHandlers.onPointerCancel)
          : onPointerCancel
      }
      onPointerLeave={
        cursorTilt && reveal !== "holographic"
          ? composeEventHandlers(onPointerLeave, surfacePointerHandlers.onPointerLeave)
          : onPointerLeave
      }
      onPointerMove={
        cursorTilt && reveal !== "holographic"
          ? composeEventHandlers(onPointerMove, surfacePointerHandlers.onPointerMove)
          : onPointerMove
      }
      className={joinClassNames(
        "signal-ui-panel",
        cursorTilt && reveal !== "holographic" ? "signal-ui-panel--cursor-tilt" : undefined,
        frame ? `signal-ui-panel--frame-${frame}` : undefined,
        resolvedCutCorner ? `signal-ui-panel--cut-${resolvedCutCorner}` : undefined,
        resolvedCutCorner ? `signal-ui-panel--corner-${resolvedCutCornerPlacement}` : undefined,
        reveal ? `signal-ui-panel--reveal-${reveal}` : undefined,
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
      onPointerCancel={
        cursorTilt
          ? composeEventHandlers(surfacePointerHandlers.onPointerCancel)
          : undefined
      }
      onPointerLeave={
        cursorTilt
          ? composeEventHandlers(surfacePointerHandlers.onPointerLeave)
          : undefined
      }
      onPointerMove={
        cursorTilt
          ? composeEventHandlers(surfacePointerHandlers.onPointerMove)
          : undefined
      }
      ref={cursorTilt ? surfaceRef : undefined}
      className={joinClassNames(
        "signal-ui-panel-shell",
        "signal-ui-panel-shell--reveal-holographic",
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
        {panelCard}
      </div>
    </div>
  );
}
