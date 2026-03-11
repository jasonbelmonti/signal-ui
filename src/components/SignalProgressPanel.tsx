import { Typography } from "antd";
import type { ReactNode } from "react";

import { joinClassNames } from "../utils/joinClassNames.js";
import { Panel, type PanelProps } from "./Panel.js";
import {
  SignalProgressMeter,
  type SignalProgressMeterTone,
  type SignalProgressMeterVariant,
} from "./SignalProgressMeter.js";

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
  tone?: SignalProgressMeterTone;
  meterVariant?: SignalProgressMeterVariant;
}

export function SignalProgressPanel({
  className,
  description,
  eyebrow,
  frame,
  frameColor,
  metrics,
  meterVariant = "flat",
  progress,
  progressLabel = "operation progress",
  segmentCount = 24,
  status = "running",
  style,
  title,
  tone = "primary",
  ...panelProps
}: SignalProgressPanelProps) {
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
      style={style}
      title={header}
    >
      <div className="signal-ui-progress-panel__body">
        {description ? (
          <Typography.Paragraph className="signal-ui-progress-panel__description">
            {description}
          </Typography.Paragraph>
        ) : null}

        <SignalProgressMeter
          label={progressLabel}
          progress={progress}
          segmentCount={segmentCount}
          tone={tone}
          variant={meterVariant}
        />

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

const toneFrameColor: Record<SignalProgressMeterTone, string> = {
  primary: "var(--signal-ui-primary)",
  violet: "var(--signal-ui-accent-violet)",
};
export type {
  SignalProgressMeterTone as SignalProgressPanelTone,
  SignalProgressMeterVariant as SignalProgressPanelMeterVariant,
};
