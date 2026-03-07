import { Button } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";

import type { SignalButtonProps } from "./signalButton/types";
import { useSignalButtonCanvas } from "./signalButton/useSignalButtonCanvas";
import { clamp, joinClassNames, toCssLength, toneAccentRgb, toneClassName } from "./signalButton/utils";

export type { SignalButtonProps, SignalButtonTone } from "./signalButton/types";

type SignalButtonStyle = CSSProperties & {
  "--marathon-signal-button-accent-rgb"?: string;
  "--marathon-signal-button-burst-flash"?: string;
  "--marathon-signal-button-edge-width"?: string;
  "--marathon-signal-button-fill-size"?: string;
  "--marathon-signal-button-shake-amp"?: string;
};

function renderSignalContent(icon: ReactNode, children: ReactNode) {
  return (
    <span className="marathon-signal-button__content">
      {icon ? <span className="marathon-signal-button__icon">{icon}</span> : null}
      <span className="marathon-signal-button__text">{children}</span>
    </span>
  );
}

export function SignalButton({
  children,
  className,
  edgeWidth = 24,
  fillPercent = 64,
  icon,
  sparkBurst = 0,
  style,
  tone = "primary",
  wakePercent = 0,
  ...buttonProps
}: SignalButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resolvedFillPercent = clamp(fillPercent, 0, 100);
  const resolvedSparkBurst = clamp(sparkBurst, 0, 100);
  const resolvedWakePercent = clamp(wakePercent, 0, 100);
  const burstProgress = resolvedSparkBurst / 100;
  const burstFlash = Math.pow(Math.sin(burstProgress * Math.PI), 0.65) || 0;

  useSignalButtonCanvas({
    canvasRef,
    disabled: buttonProps.disabled,
    edgeWidth,
    fillPercent: resolvedFillPercent,
    sparkBurst: resolvedSparkBurst,
    tone,
    wakePercent: resolvedWakePercent,
  });

  const signalButtonStyle: SignalButtonStyle = {
    ...style,
    "--marathon-signal-button-accent-rgb": toneAccentRgb[tone],
    "--marathon-signal-button-burst-flash": `${burstFlash}`,
    "--marathon-signal-button-edge-width": toCssLength(edgeWidth) ?? "24px",
    "--marathon-signal-button-fill-size": `${resolvedFillPercent}%`,
    "--marathon-signal-button-shake-amp": `${burstFlash * 1.65}px`,
  };

  return (
    <Button
      {...buttonProps}
      className={joinClassNames("marathon-signal-button", toneClassName[tone], className)}
      style={signalButtonStyle}
    >
      <span aria-hidden="true" className="marathon-signal-button__surface">
        <canvas ref={canvasRef} className="marathon-signal-button__canvas" />
        <span className="marathon-signal-button__sheen" />
      </span>
      <span className="marathon-signal-button__label">{renderSignalContent(icon, children)}</span>
    </Button>
  );
}
