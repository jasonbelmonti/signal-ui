import type { ButtonProps } from "antd";
import type { ReactNode } from "react";

export type SignalButtonTone = "primary" | "violet";

export interface SignalButtonProps extends Omit<ButtonProps, "icon"> {
  fillPercent?: number;
  edgeWidth?: number | string;
  icon?: ReactNode;
  sparkBurst?: number;
  tone?: SignalButtonTone;
  wakePercent?: number;
}
