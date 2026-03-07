import type { RefObject } from "react";
import type { SignalButtonTone } from "./types.js";
import { type RgbChannels } from "./utils.js";
type UseSignalButtonCanvasOptions = {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    cooldownPercent: number;
    disabled?: boolean;
    edgeWidth?: number | string;
    fillPercent: number;
    pulseBurst: number;
    rewardChannels: RgbChannels;
    tone: SignalButtonTone;
    wakePercent: number;
};
export declare function useSignalButtonCanvas({ canvasRef, cooldownPercent, disabled, edgeWidth, fillPercent, pulseBurst, rewardChannels, tone, wakePercent, }: UseSignalButtonCanvasOptions): void;
export {};
