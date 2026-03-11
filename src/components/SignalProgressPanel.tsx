import { Typography } from "antd";
import type { CSSProperties, ReactNode } from "react";

import { joinClassNames } from "../utils/joinClassNames.js";
import { Panel, type PanelProps } from "./Panel.js";

type SignalProgressPanelStyle = CSSProperties & {
  "--signal-ui-progress-panel-progress"?: string;
};

export type SignalProgressPanelTone = "primary" | "violet";

export interface SignalProgressPanelMetric {
  label: ReactNode;
  value: ReactNode;
}

export interface SignalProgressPanelProps extends Omit<PanelProps, "children" | "title"> {
  description?: ReactNode;
  eyebrow?: ReactNode;
  metrics?: SignalProgressPanelMetric[];
  progress: number;
  progressLabel?: ReactNode;
  segmentCount?: number;
  status?: ReactNode;
  title: ReactNode;
  tone?: SignalProgressPanelTone;
}

type CellState = "idle" | "filled" | "active";

export function SignalProgressPanel({
  className,
  description,
  eyebrow,
  frame,
  frameColor,
  metrics,
  progress,
  progressLabel = "operation progress",
  segmentCount = 24,
  status = "running",
  style,
  title,
  tone = "primary",
  ...panelProps
}: SignalProgressPanelProps) {
  const clampedProgress = clamp(progress, 0, 100);
  const resolvedSegmentCount = Math.max(8, Math.min(40, Math.round(segmentCount)));
  const filledSegments = Math.round((clampedProgress / 100) * resolvedSegmentCount);
  const activeIndex =
    clampedProgress <= 0
      ? 0
      : Math.min(
          resolvedSegmentCount - 1,
          clampedProgress >= 100 ? resolvedSegmentCount - 1 : filledSegments,
        );
  const panelStyle: SignalProgressPanelStyle = {
    ...style,
    "--signal-ui-progress-panel-progress": `${clampedProgress}%`,
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
  const header = (
    <div className="signal-ui-progress-panel__header">
      <div className="signal-ui-progress-panel__header-copy">
        {eyebrow ? (
          <Typography.Text className="signal-ui-progress-panel__eyebrow">
            {eyebrow}
          </Typography.Text>
        ) : null}
        <span className="signal-ui-progress-panel__title">{title}</span>
      </div>
      <span className="signal-ui-progress-panel__status">{status}</span>
    </div>
  );

  return (
    <Panel
      {...panelProps}
      className={joinClassNames(
        "signal-ui-progress-panel",
        tone === "violet" && "signal-ui-progress-panel--violet",
        className,
      )}
      frame={frame ?? "reticle"}
      frameColor={frameColor ?? toneFrameColor[tone]}
      style={panelStyle}
      title={header}
    >
      <div className="signal-ui-progress-panel__body">
        {description ? (
          <Typography.Paragraph className="signal-ui-progress-panel__description">
            {description}
          </Typography.Paragraph>
        ) : null}

        <div className="signal-ui-progress-panel__meter-block">
          <div className="signal-ui-progress-panel__meter-header">
            <span className="signal-ui-progress-panel__progress-label">{progressLabel}</span>
            <span className="signal-ui-progress-panel__percent">
              {formatPercent(clampedProgress)}
            </span>
          </div>

          <div
            aria-label={`${formatPercent(clampedProgress)} complete`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={Math.round(clampedProgress)}
            className="signal-ui-progress-panel__meter"
            role="progressbar"
          >
            <div
              className="signal-ui-progress-panel__cells"
              style={{ gridTemplateColumns: `repeat(${resolvedSegmentCount}, minmax(0, 1fr))` }}
            >
              {cells.map((cell) => (
                <span
                  aria-hidden="true"
                  className={joinClassNames(
                    "signal-ui-progress-panel__cell",
                    cell.state === "filled" && "signal-ui-progress-panel__cell--filled",
                    cell.state === "active" && "signal-ui-progress-panel__cell--active",
                  )}
                  key={cell.index}
                />
              ))}
            </div>
          </div>
        </div>

        {metrics?.length ? (
          <div className="signal-ui-progress-panel__metrics">
            {metrics.map((metric, index) => (
              <div className="signal-ui-progress-panel__metric" key={index}>
                <span className="signal-ui-progress-panel__metric-label">{metric.label}</span>
                <span className="signal-ui-progress-panel__metric-value">{metric.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

const toneFrameColor: Record<SignalProgressPanelTone, string> = {
  primary: "var(--signal-ui-primary)",
  violet: "var(--signal-ui-accent-violet)",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatPercent(value: number) {
  return `${Math.round(value).toString().padStart(3, "0")}%`;
}
