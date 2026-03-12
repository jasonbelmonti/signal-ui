import { useId, useRef } from "react";
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
  const clampedProgress = normalizeProgress(progress);
  const isFull = clampedProgress >= 100;
  const isCompleted = completed || isFull;
  const resolvedSegmentCount = normalizeSegmentCount(segmentCount);
  const displayPercentValue = toDisplayPercentValue(clampedProgress);
  const labelId = useId();
  const completionMessageId = useId();
  const filledSegments = isFull
    ? resolvedSegmentCount
    : Math.floor((clampedProgress / 100) * resolvedSegmentCount);
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
          {label ? (
            <span className="signal-ui-progress-meter__label" id={labelId}>
              {label}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          {showPercent ? (
            <span className="signal-ui-progress-meter__percent">{formatPercent(displayPercentValue)}</span>
          ) : null}
        </div>
      )}

      <div
        aria-describedby={isCompleted && completionLabel ? completionMessageId : undefined}
        aria-label={label ? undefined : "progress"}
        aria-labelledby={label ? labelId : undefined}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={displayPercentValue}
        className="signal-ui-progress-meter__track"
        role="progressbar"
      >
        {variant === "splash" ? (
          <canvas
            aria-hidden="true"
            className="signal-ui-progress-meter__completion-surface"
            ref={completionSurfaceRef}
          />
        ) : null}
        <div
          className="signal-ui-progress-meter__cells"
          style={{ gridTemplateColumns: `repeat(${resolvedSegmentCount}, minmax(0, 1fr))` }}
        >
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
            <span className="signal-ui-progress-meter__completion-label">
              <span className="signal-ui-progress-meter__completion-text">{completionLabel}</span>
            </span>
          </div>
        ) : null}
      </div>

      {completionLabel ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          id={completionMessageId}
          style={screenReaderOnlyStyle}
        >
          {isCompleted ? completionLabel : null}
        </span>
      ) : null}
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeProgress(value: number) {
  return clamp(replaceNaN(value, 0), 0, 100);
}

function normalizeSegmentCount(value: number) {
  return Math.max(8, Math.min(40, Math.round(replaceNaN(value, 24))));
}

function replaceNaN(value: number, fallback: number) {
  return Number.isNaN(value) ? fallback : value;
}

function formatPercent(value: number) {
  return `${value.toString().padStart(3, "0")}%`;
}

function toDisplayPercentValue(value: number) {
  return value >= 100 ? 100 : Math.floor(value);
}

const screenReaderOnlyStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};
