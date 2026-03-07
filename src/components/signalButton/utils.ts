import type { SignalButtonTone } from "./types";

export const toneAccentRgb = {
  primary: "192 254 4",
  violet: "159 77 255",
} satisfies Record<SignalButtonTone, string>;

export const toneAccentChannels = {
  primary: [192, 254, 4],
  violet: [159, 77, 255],
} satisfies Record<SignalButtonTone, [number, number, number]>;

export const toneClassName = {
  primary: "marathon-signal-button--primary",
  violet: "marathon-signal-button--violet",
} satisfies Record<SignalButtonTone, string>;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

export function toCssLength(value: number | string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

export function toPixelLength(value: number | string | undefined, fallback = 24) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}
