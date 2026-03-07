import type { SignalButtonTone } from "./types.js";
import { type RgbChannels } from "./utils.js";
type SignalButtonBufferOptions = {
    ctx: CanvasRenderingContext2D;
    cols: number;
    cooldownPercent: number;
    disabled?: boolean;
    edgeWidthPx: number;
    fillPercent: number;
    pulseBurst: number;
    rewardChannels: RgbChannels;
    rows: number;
    tone: SignalButtonTone;
    timeMs: number;
    wakePercent: number;
};
export declare function renderSignalButtonBuffer({ ctx, cols, cooldownPercent, disabled, edgeWidthPx, fillPercent, pulseBurst, rewardChannels, rows, tone, timeMs, wakePercent, }: SignalButtonBufferOptions): void;
export {};
