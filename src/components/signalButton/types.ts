import type { ButtonProps } from "antd";
import type { ReactNode } from "react";

export type SignalButtonTone = "primary" | "violet";
export type SignalButtonColor = [number, number, number] | string;

export interface SignalButtonProps extends Omit<ButtonProps, "icon"> {
  cooldownPercent?: number;
  fillPercent?: number;
  edgeWidth?: number | string;
  icon?: ReactNode;
  pulseBurst?: number;
  rewardColor?: SignalButtonColor;
  tone?: SignalButtonTone;
  wakePercent?: number;
}
