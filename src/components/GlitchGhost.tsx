import { useEffect, useEffectEvent, useRef } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

import { syncGhostSnapshotLayers } from "./glitchGhost/snapshot.js";
import { joinClassNames } from "../utils/joinClassNames.js";

export type GlitchGhostMask = "signal" | "lattice";
export type GlitchGhostBlendMode = "screen" | "plus-lighter" | "exclusion";

type CssLength = number | string;
type CssAngle = number | string;

export interface GlitchGhostProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  animated?: boolean;
  blendMode?: GlitchGhostBlendMode;
  blur?: CssLength;
  children: ReactNode;
  depth?: CssLength;
  ghost?: ReactNode;
  ghostColor?: string;
  ghostCount?: 1 | 2 | 3;
  ghostOpacity?: number;
  mask?: GlitchGhostMask;
  offsetX?: CssLength;
  offsetY?: CssLength;
  perspective?: CssLength;
  tiltX?: CssAngle;
  tiltY?: CssAngle;
}

type GlitchGhostStyle = CSSProperties & {
  "--signal-ui-glitch-ghost-blend-mode"?: GlitchGhostBlendMode;
  "--signal-ui-glitch-ghost-blur"?: string;
  "--signal-ui-glitch-ghost-color"?: string;
  "--signal-ui-glitch-ghost-depth"?: string;
  "--signal-ui-glitch-ghost-offset-x"?: string;
  "--signal-ui-glitch-ghost-offset-y"?: string;
  "--signal-ui-glitch-ghost-opacity"?: number;
  "--signal-ui-glitch-ghost-perspective"?: string;
  "--signal-ui-glitch-ghost-tilt-x"?: string;
  "--signal-ui-glitch-ghost-tilt-y"?: string;
};

const glitchGhostLayers = [
  "signal-ui-glitch-ghost__ghost--lead",
  "signal-ui-glitch-ghost__ghost--trail",
  "signal-ui-glitch-ghost__ghost--echo",
] as const;

function toCssLength(value: CssLength | undefined, fallback: string) {
  if (value === undefined) {
    return fallback;
  }

  return typeof value === "number" ? `${value}px` : value;
}

function toCssAngle(value: CssAngle | undefined, fallback: string) {
  if (value === undefined) {
    return fallback;
  }

  return typeof value === "number" ? `${value}deg` : value;
}

export function GlitchGhost({
  animated = true,
  blendMode = "screen",
  blur = 0.85,
  children,
  className,
  depth = 18,
  ghost,
  ghostColor = "rgb(var(--signal-ui-primary-rgb) / 0.74)",
  ghostCount = 3,
  ghostOpacity = 0.42,
  mask = "signal",
  offsetX = 12,
  offsetY = 7,
  perspective = 580,
  style,
  tiltX = 7,
  tiltY = -8,
  ...props
}: GlitchGhostProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const ghostCopyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ghostStyle: GlitchGhostStyle = {
    ...style,
    "--signal-ui-glitch-ghost-blend-mode": blendMode,
    "--signal-ui-glitch-ghost-blur": toCssLength(blur, "0.85px"),
    "--signal-ui-glitch-ghost-color": ghostColor,
    "--signal-ui-glitch-ghost-depth": toCssLength(depth, "18px"),
    "--signal-ui-glitch-ghost-offset-x": toCssLength(offsetX, "12px"),
    "--signal-ui-glitch-ghost-offset-y": toCssLength(offsetY, "7px"),
    "--signal-ui-glitch-ghost-opacity": ghostOpacity,
    "--signal-ui-glitch-ghost-perspective": toCssLength(perspective, "580px"),
    "--signal-ui-glitch-ghost-tilt-x": toCssAngle(tiltX, "7deg"),
    "--signal-ui-glitch-ghost-tilt-y": toCssAngle(tiltY, "-8deg"),
  };
  const syncGhostSnapshots = useEffectEvent(() => {
    if (ghost !== undefined) {
      return;
    }

    const mainElement = mainRef.current;
    const targetElements = ghostCopyRefs.current
      .slice(0, ghostCount)
      .filter((element): element is HTMLDivElement => element !== null);

    if (!mainElement || targetElements.length === 0) {
      return;
    }

    syncGhostSnapshotLayers(mainElement, targetElements);
  });

  useEffect(() => {
    ghostCopyRefs.current.length = ghostCount;

    if (ghost !== undefined || typeof window === "undefined") {
      return undefined;
    }

    const mainElement = mainRef.current;

    if (!mainElement) {
      return undefined;
    }

    let animationFrameId: number | null = null;
    const scheduleSnapshotSync = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        syncGhostSnapshots();
      });
    };

    scheduleSnapshotSync();

    const observer = new MutationObserver(() => {
      scheduleSnapshotSync();
    });

    observer.observe(mainElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      for (const ghostCopyElement of ghostCopyRefs.current) {
        ghostCopyElement?.replaceChildren();
      }
    };
  }, [ghost, ghostCount, syncGhostSnapshots]);

  return (
    <div
      className={joinClassNames(
        "signal-ui-glitch-ghost",
        animated && "signal-ui-glitch-ghost--animated",
        className,
      )}
      data-mask={mask}
      style={ghostStyle}
      {...props}
    >
      <div aria-hidden="true" className="signal-ui-glitch-ghost__layers">
        {glitchGhostLayers.slice(0, ghostCount).map((layerClassName, index) => (
          <div
            key={layerClassName}
            inert
            className={joinClassNames("signal-ui-glitch-ghost__ghost", layerClassName)}
          >
            <div
              ref={(element) => {
                ghostCopyRefs.current[index] = element;
              }}
              className="signal-ui-glitch-ghost__copy"
            >
              {ghost}
            </div>
          </div>
        ))}
      </div>
      <div ref={mainRef} className="signal-ui-glitch-ghost__main">
        {children}
      </div>
    </div>
  );
}
