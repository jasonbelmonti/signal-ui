import { useRef } from "react";
import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";

import { joinClassNames } from "../utils/joinClassNames.js";
import { useSignalProgressMeterCompletionSurface } from "./useSignalProgressMeterCompletionSurface.js";

type SignalProgressMeterStyle = CSSProperties & {
  "--signal-ui-progress-meter-progress"?: string;
};

type CellState = "idle" | "filled" | "active";

export type SignalProgressMeterTone = "primary" | "violet";
export type SignalProgressMeterVariant = "flat" | "splash";

export interface SignalProgressMeterProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "style"> {
  completed?: boolean;
  completionLabel?: ReactNode;
  label?: ReactNode;
  progress: number;
  segmentCount?: number;
  showPercent?: boolean;
  style?: SignalProgressMeterStyle;
  tone?: SignalProgressMeterTone;
  variant?: SignalProgressMeterVariant;
}

export function SignalProgressMeter({
  className,
  completed = false,
  completionLabel,
  label = "operation progress",
  progress,
  segmentCount = 24,
  showPercent = true,
  style,
  tone = "primary",
  variant = "flat",
  ...props
}: SignalProgressMeterProps) {
  const clampedProgress = clamp(progress, 0, 100);
  const isFull = clampedProgress >= 100;
  const isCompleted = completed && isFull;
  const resolvedSegmentCount = Math.max(8, Math.min(40, Math.round(segmentCount)));
  const filledSegments = Math.round((clampedProgress / 100) * resolvedSegmentCount);
  const completionSurfaceRef = useRef<HTMLCanvasElement | null>(null);
  const activeIndex =
    clampedProgress <= 0
      ? 0
      : Math.min(
          resolvedSegmentCount - 1,
          clampedProgress >= 100 ? resolvedSegmentCount - 1 : filledSegments,
        );

  useSignalProgressMeterCompletionSurface({
    canvasRef: completionSurfaceRef,
    enabled: variant === "splash" && isCompleted,
    tone,
  });

  const rootStyle: SignalProgressMeterStyle = {
    ...style,
    "--signal-ui-progress-meter-progress": `${clampedProgress}%`,
  };
  const cells = Array.from({ length: resolvedSegmentCount }, (_, index) => ({
    index,
    state:
      index < filledSegments
        ? "filled"
        : index === activeIndex && clampedProgress > 0 && clampedProgress < 100
          ? "active"
          : "idle",
  }));

  return (
    <div
      className={joinClassNames(
        "signal-ui-progress-meter",
        tone === "violet" && "signal-ui-progress-meter--violet",
        isFull && "signal-ui-progress-meter--full",
        isCompleted && "signal-ui-progress-meter--completed",
        variant === "splash" && "signal-ui-progress-meter--splash",
        className,
      )}
      style={rootStyle}
      {...props}
    >
      {(label || showPercent) && (
        <div className="signal-ui-progress-meter__header">
          {label ? <span className="signal-ui-progress-meter__label">{label}</span> : <span />}
          {showPercent ? (
            <span className="signal-ui-progress-meter__percent">{formatPercent(clampedProgress)}</span>
          ) : null}
        </div>
      )}

      <div
        aria-label={`${formatPercent(clampedProgress)} complete`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(clampedProgress)}
        className="signal-ui-progress-meter__track"
        role="progressbar"
      >
        <div
          className="signal-ui-progress-meter__cells"
          style={{ gridTemplateColumns: `repeat(${resolvedSegmentCount}, minmax(0, 1fr))` }}
        >
          {variant === "splash" ? (
            <canvas
              aria-hidden="true"
              className="signal-ui-progress-meter__completion-surface"
              ref={completionSurfaceRef}
            />
          ) : null}
          {cells.map((cell) => (
            <span
              aria-hidden="true"
              className={joinClassNames(
                "signal-ui-progress-meter__cell",
                cell.state === "filled" && "signal-ui-progress-meter__cell--filled",
                cell.state === "active" && "signal-ui-progress-meter__cell--active",
              )}
              key={cell.index}
            />
          ))}
        </div>
        {completionLabel ? (
          <div aria-hidden="true" className="signal-ui-progress-meter__completion">
            <span className="signal-ui-progress-meter__completion-label">{completionLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatPercent(value: number) {
  return `${Math.round(value).toString().padStart(3, "0")}%`;
}
