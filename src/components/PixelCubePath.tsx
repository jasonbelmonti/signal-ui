import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { useId } from "react";

import { useViewportRenderGate } from "../utils/useViewportRenderGate.js";
import {
  createPixelCubePathAnimationProfile,
  getPixelCubePathAnimationSeed,
} from "./pixelCubePath/animation.js";
import {
  createPixelCubePathCubeCoordinates,
  type PixelCubePathCubeCoordinate,
} from "./pixelCubePath/geometry.js";

export type PixelCubePathTone = "primary" | "violet";
type PixelCubePathRenderMode = "viewport" | "always";

type PathStyle = CSSProperties & Record<`--signal-ui-cube-path-${string}`, string | number>;

type PixelCubePathBaseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "aria-hidden" | "aria-label" | "aria-live" | "children" | "role" | "style"
> & {
  renderMode?: PixelCubePathRenderMode;
  size?: number;
  style?: PathStyle;
  tone?: PixelCubePathTone;
};

type PixelCubePathDecorativeProps = PixelCubePathBaseProps & {
  label?: never;
  usage?: "decorative";
};

type PixelCubePathLoaderProps = PixelCubePathBaseProps & {
  label: string;
  usage: "loader";
};

export type PixelCubePathProps = PixelCubePathDecorativeProps | PixelCubePathLoaderProps;

type CubeStyle = PathStyle;

const baseCycleMs = 3240;
const cubeCoordinates = createPixelCubePathCubeCoordinates();

export function PixelCubePath({
  className,
  label,
  renderMode = "viewport",
  size = 220,
  style,
  tone = "primary",
  usage = "decorative",
  ...props
}: PixelCubePathProps) {
  const instanceId = useId();
  const shouldViewportGate = renderMode === "viewport";
  const cellSize = Math.max(18, Math.round(size * 0.19));
  const gapSize = Math.max(2, Math.round(cellSize * 0.08));
  const stepSize = cellSize + gapSize;
  const sceneWidth = Math.round(size * 1.34);
  const sceneHeight = Math.round(size * 1.18);
  const perspective = Math.round(size * 6.4);
  const { hasResolvedViewport, isInViewport, targetRef } = useViewportRenderGate<HTMLDivElement>({
    disabled: !shouldViewportGate,
    rootMargin: "160px 0px",
    threshold: 0,
  });
  const isIdle = shouldViewportGate && hasResolvedViewport && !isInViewport;
  const shouldRenderScene = !shouldViewportGate || isInViewport;
  const animationProfile = shouldRenderScene
    ? createPixelCubePathAnimationProfile({
        count: cubeCoordinates.length,
        cycleMs: baseCycleMs,
        seed: getPixelCubePathAnimationSeed(instanceId),
      })
    : null;
  const rootStyle: PathStyle = {
    "--signal-ui-cube-path-cell-size": `${cellSize}px`,
    "--signal-ui-cube-path-count": cubeCoordinates.length,
    "--signal-ui-cube-path-cycle": `${animationProfile?.cycleMs ?? baseCycleMs}ms`,
    "--signal-ui-cube-path-gap": `${gapSize}px`,
    "--signal-ui-cube-path-perspective": `${perspective}px`,
    "--signal-ui-cube-path-scene-height": `${sceneHeight}px`,
    "--signal-ui-cube-path-scene-width": `${sceneWidth}px`,
    "--signal-ui-cube-path-scene-z": `${Math.round(stepSize * -1.45)}px`,
    "--signal-ui-cube-path-size": `${size}px`,
    "--signal-ui-cube-path-step": `${stepSize}px`,
    ...style,
  };
  const rootClassName = [
    "signal-ui-pixel-cube-path",
    isIdle ? "signal-ui-pixel-cube-path--idle" : undefined,
    toneClassName[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const accessibilityProps =
    usage === "loader"
      ? {
          "aria-label": label,
          "aria-live": "polite" as const,
          role: "status" as const,
        }
      : {
          "aria-hidden": true,
        };

  return (
    <div className={rootClassName} style={rootStyle} {...accessibilityProps} {...props}>
      <div
        aria-hidden="true"
        className="signal-ui-pixel-cube-path__viewport"
        ref={targetRef}
        suppressHydrationWarning={shouldViewportGate}
      >
        {shouldRenderScene && animationProfile ? (
          <div className="signal-ui-pixel-cube-path__scene">
            {cubeCoordinates.map((cube) => (
              <span
                className="signal-ui-pixel-cube-path__cube"
                data-surface={cube.surface ? "true" : "false"}
                key={cube.index}
                style={getCubeStyle(cube, animationProfile.delaysMs)}
              >
                <span className="signal-ui-pixel-cube-path__face signal-ui-pixel-cube-path__face--front" />
                <span className="signal-ui-pixel-cube-path__face signal-ui-pixel-cube-path__face--right" />
                <span className="signal-ui-pixel-cube-path__face signal-ui-pixel-cube-path__face--top" />
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const toneClassName: Record<PixelCubePathTone, string | undefined> = {
  primary: undefined,
  violet: "signal-ui-pixel-cube-path--violet",
};

function getCubeStyle(cube: PixelCubePathCubeCoordinate, delaysMs: number[]): CubeStyle {
  const center = 1;
  const x = cube.column - center;
  const y = cube.row - center;
  const z = cube.depth - center;
  const delayMs = delaysMs[cube.pathIndex] ?? 0;

  return {
    "--signal-ui-cube-path-cube-x": `calc(${x} * var(--signal-ui-cube-path-step))`,
    "--signal-ui-cube-path-cube-y": `calc(${y} * var(--signal-ui-cube-path-step))`,
    "--signal-ui-cube-path-cube-z": `calc(${z} * var(--signal-ui-cube-path-step))`,
    "--signal-ui-cube-path-delay": `${delayMs * -1}ms`,
  };
}
