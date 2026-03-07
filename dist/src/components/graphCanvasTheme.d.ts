export declare const graphCanvasTones: readonly ["primary", "violet", "warning", "error", "neutral"];
export type GraphCanvasTone = (typeof graphCanvasTones)[number];
export declare const graphCanvasToneAccentColor: Record<GraphCanvasTone, string>;
export declare const graphCanvasToneStrokeColor: Record<GraphCanvasTone, string>;
export declare const graphCanvasToneGlowColor: Record<GraphCanvasTone, string>;
export declare function resolveGraphCanvasTone(value: unknown): GraphCanvasTone;
