import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { useId } from "react";

import {
  createPixelCubePathAnimationProfile,
  getPixelCubePathAnimationSeed,
} from "./pixelCubePath/animation.js";
import {
  createPixelCubePathCubeCoordinates,
  type PixelCubePathCubeCoordinate,
} from "./pixelCubePath/geometry.js";

export type PixelCubePathTone = "primary" | "violet" | "error";

type PathStyle = CSSProperties & Record<`--signal-ui-cube-path-${string}`, string | number>;

type PixelCubePathBaseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "aria-hidden" | "aria-label" | "aria-live" | "children" | "role" | "style"
> & {
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
  size = 220,
  style,
  tone = "primary",
  usage = "decorative",
  ...props
}: PixelCubePathProps) {
  const instanceId = useId();
  const cellSize = Math.max(18, Math.round(size * 0.19));
  const gapSize = Math.max(2, Math.round(cellSize * 0.08));
  const stepSize = cellSize + gapSize;
  const sceneWidth = Math.round(size * 1.08);
  const sceneHeight = Math.round(size * 0.98);
  const perspective = Math.round(size * 6.4);
  const broken = tone === "error";
  const animationProfile = createPixelCubePathAnimationProfile({
    broken,
    count: cubeCoordinates.length,
    cycleMs: baseCycleMs,
    seed: getPixelCubePathAnimationSeed(instanceId),
  });
  const rootStyle: PathStyle = {
    "--signal-ui-cube-path-cell-size": `${cellSize}px`,
    "--signal-ui-cube-path-count": cubeCoordinates.length,
    "--signal-ui-cube-path-cycle": `${animationProfile.cycleMs}ms`,
    "--signal-ui-cube-path-gap": `${gapSize}px`,
    "--signal-ui-cube-path-perspective": `${perspective}px`,
    "--signal-ui-cube-path-scene-height": `${sceneHeight}px`,
    "--signal-ui-cube-path-scene-width": `${sceneWidth}px`,
    "--signal-ui-cube-path-scene-z": `${Math.round(stepSize * -1.45)}px`,
    "--signal-ui-cube-path-size": `${size}px`,
    "--signal-ui-cube-path-step": `${stepSize}px`,
    ...style,
  };
  const rootClassName = ["signal-ui-pixel-cube-path", toneClassName[tone], className]
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
      <div aria-hidden="true" className="signal-ui-pixel-cube-path__viewport">
        <div className="signal-ui-pixel-cube-path__scene">
          {cubeCoordinates.map((cube) => (
            <span
              className="signal-ui-pixel-cube-path__cube"
              data-break={animationProfile.breakpoints[cube.pathIndex] ? "true" : "false"}
              data-order={animationProfile.misfires[cube.pathIndex] ? "misfire" : "path"}
              data-surface={cube.surface ? "true" : "false"}
              key={cube.index}
              style={getCubeStyle(cube, animationProfile)}
            >
              <span className="signal-ui-pixel-cube-path__cube-shell">
                <span className="signal-ui-pixel-cube-path__face signal-ui-pixel-cube-path__face--front" />
                <span className="signal-ui-pixel-cube-path__face signal-ui-pixel-cube-path__face--right" />
                <span className="signal-ui-pixel-cube-path__face signal-ui-pixel-cube-path__face--top" />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const toneClassName: Record<PixelCubePathTone, string | undefined> = {
  error: "signal-ui-pixel-cube-path--error",
  primary: undefined,
  violet: "signal-ui-pixel-cube-path--violet",
};

function getCubeStyle(
  cube: PixelCubePathCubeCoordinate,
  animationProfile: ReturnType<typeof createPixelCubePathAnimationProfile>,
): CubeStyle {
  const center = 1;
  const x = cube.column - center;
  const y = cube.row - center;
  const z = cube.depth - center;
  const pathIndex = cube.pathIndex;
  const delayMs = animationProfile.delaysMs[pathIndex] ?? 0;
  const glitchOffsets = animationProfile.glitchOffsetsPx[pathIndex] ?? { x: 0, y: 0, z: 0 };
  const liftPx = animationProfile.liftsPx[pathIndex] ?? 2;
  const signalStrength = animationProfile.signalStrengths[pathIndex] ?? 1;
  const tremorAmplitudePx = animationProfile.tremorAmplitudesPx[pathIndex] ?? 0;
  const tremorCycleMs = animationProfile.tremorCyclesMs[pathIndex] ?? 2000;
  const tremorDelayMs = animationProfile.tremorDelaysMs[pathIndex] ?? 0;

  return {
    "--signal-ui-cube-path-cube-x": `calc(${x} * var(--signal-ui-cube-path-step))`,
    "--signal-ui-cube-path-cube-y": `calc(${y} * var(--signal-ui-cube-path-step))`,
    "--signal-ui-cube-path-cube-z": `calc(${z} * var(--signal-ui-cube-path-step))`,
    "--signal-ui-cube-path-delay": `${delayMs * -1}ms`,
    "--signal-ui-cube-path-glitch-x": `${glitchOffsets.x}px`,
    "--signal-ui-cube-path-glitch-y": `${glitchOffsets.y}px`,
    "--signal-ui-cube-path-glitch-z": `${glitchOffsets.z}px`,
    "--signal-ui-cube-path-lift": `${liftPx}px`,
    "--signal-ui-cube-path-signal-strength": signalStrength,
    "--signal-ui-cube-path-tremor-amplitude": `${tremorAmplitudePx}px`,
    "--signal-ui-cube-path-tremor-cycle": `${tremorCycleMs}ms`,
    "--signal-ui-cube-path-tremor-delay": `${tremorDelayMs * -1}ms`,
  };
}
