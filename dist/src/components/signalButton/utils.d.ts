import type { SignalButtonColor, SignalButtonTone } from "./types.js";
export type RgbChannels = [number, number, number];
export declare const toneAccentRgb: {
    primary: string;
    violet: string;
};
export declare const toneAccentChannels: {
    primary: [number, number, number];
    violet: [number, number, number];
};
export declare const toneCooldownChannels: {
    primary: [number, number, number];
    violet: [number, number, number];
};
export declare const toneClassName: {
    primary: string;
    violet: string;
};
export declare function clamp(value: number, min: number, max: number): number;
export declare function lerp(start: number, end: number, amount: number): number;
export declare function blendChannels(start: RgbChannels, end: RgbChannels, amount: number): RgbChannels;
export declare function formatRgbChannels(channels: RgbChannels): string;
export declare function resolveRewardChannels(tone: SignalButtonTone, rewardColor: SignalButtonColor | undefined): [number, number, number];
export declare function toCssLength(value: number | string | undefined): string | undefined;
export declare function toPixelLength(value: number | string | undefined, fallback?: number): number;
export declare function joinClassNames(...classNames: Array<string | undefined>): string;
