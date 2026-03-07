import { Button } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";

import type { SignalButtonProps } from "./signalButton/types.js";
import { useSignalButtonCanvas } from "./signalButton/useSignalButtonCanvas.js";
import {
  blendChannels,
  clamp,
  formatRgbChannels,
  joinClassNames,
  resolveRewardChannels,
  toCssLength,
  toneAccentChannels,
  toneClassName,
} from "./signalButton/utils.js";

export type { SignalButtonProps, SignalButtonTone } from "./signalButton/types.js";

type SignalButtonStyle = CSSProperties & {
  "--marathon-signal-button-accent-rgb"?: string;
  "--marathon-signal-button-burst-flash"?: string;
  "--marathon-signal-button-cooldown"?: string;
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
  cooldownPercent = 0,
  edgeWidth = 24,
  fillPercent = 64,
  icon,
  pulseBurst = 0,
  rewardColor,
  style,
  tone = "primary",
  wakePercent = 0,
  ...buttonProps
}: SignalButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resolvedCooldownPercent = clamp(cooldownPercent, 0, 100);
  const resolvedFillPercent = clamp(fillPercent, 0, 100);
  const resolvedPulseBurst = clamp(pulseBurst, 0, 100);
  const resolvedWakePercent = clamp(wakePercent, 0, 100);
  const cooldownMix = resolvedCooldownPercent / 100;
  const rewardChannels = resolveRewardChannels(tone, rewardColor);
  const accentChannels = blendChannels(toneAccentChannels[tone], rewardChannels, cooldownMix);
  const burstProgress = resolvedPulseBurst / 100;
  const burstFlash = Math.pow(Math.sin(burstProgress * Math.PI), 0.65) || 0;

  useSignalButtonCanvas({
    canvasRef,
    cooldownPercent: resolvedCooldownPercent,
    disabled: buttonProps.disabled,
    edgeWidth,
    fillPercent: resolvedFillPercent,
    pulseBurst: resolvedPulseBurst,
    rewardChannels,
    tone,
    wakePercent: resolvedWakePercent,
  });

  const signalButtonStyle: SignalButtonStyle = {
    ...style,
    "--marathon-signal-button-accent-rgb": formatRgbChannels(accentChannels),
    "--marathon-signal-button-burst-flash": `${burstFlash}`,
    "--marathon-signal-button-cooldown": `${cooldownMix}`,
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
