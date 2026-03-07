import type { SignalButtonColor, SignalButtonTone } from "./types.js";

export type RgbChannels = [number, number, number];

export const toneAccentRgb = {
  primary: "192 254 4",
  violet: "159 77 255",
} satisfies Record<SignalButtonTone, string>;

export const toneAccentChannels = {
  primary: [192, 254, 4],
  violet: [159, 77, 255],
} satisfies Record<SignalButtonTone, RgbChannels>;

export const toneCooldownChannels = {
  primary: [88, 230, 255],
  violet: [255, 174, 92],
} satisfies Record<SignalButtonTone, RgbChannels>;

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

export function blendChannels(start: RgbChannels, end: RgbChannels, amount: number): RgbChannels {
  const mix = clamp(amount, 0, 1);

  return [
    Math.round(lerp(start[0], end[0], mix)),
    Math.round(lerp(start[1], end[1], mix)),
    Math.round(lerp(start[2], end[2], mix)),
  ];
}

export function formatRgbChannels(channels: RgbChannels) {
  return channels.join(" ");
}

export function resolveRewardChannels(
  tone: SignalButtonTone,
  rewardColor: SignalButtonColor | undefined,
) {
  if (Array.isArray(rewardColor) && rewardColor.length === 3) {
    return rewardColor.map((channel) => clamp(Math.round(channel), 0, 255)) as RgbChannels;
  }

  if (typeof rewardColor === "string") {
    const parsed = parseRgbChannels(rewardColor);

    if (parsed) {
      return parsed;
    }
  }

  return toneCooldownChannels[tone];
}

function parseRgbChannels(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (hexMatch) {
    const hexValue = hexMatch[1];

    if (hexValue) {
      return parseHexChannels(hexValue);
    }
  }

  const channelMatches = normalized.match(/\d+(\.\d+)?/g);

  if (!channelMatches || channelMatches.length < 3) {
    return null;
  }

  const channels = channelMatches.slice(0, 3).map((channel) => clamp(Math.round(Number(channel)), 0, 255));

  return channels as RgbChannels;
}

function parseHexChannels(value: string): RgbChannels {
  const expandedValue =
    value.length === 3
      ? value
          .split("")
          .map((channel) => `${channel}${channel}`)
          .join("")
      : value;

  return [
    Number.parseInt(expandedValue.slice(0, 2), 16),
    Number.parseInt(expandedValue.slice(2, 4), 16),
    Number.parseInt(expandedValue.slice(4, 6), 16),
  ];
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
