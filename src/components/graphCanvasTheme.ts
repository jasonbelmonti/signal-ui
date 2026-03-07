export const graphCanvasTones = [
  "primary",
  "violet",
  "warning",
  "error",
  "neutral",
] as const;

export type GraphCanvasTone = (typeof graphCanvasTones)[number];

export const graphCanvasToneAccentColor: Record<GraphCanvasTone, string> = {
  error: "#f24723",
  neutral: "#b0b0aa",
  primary: "#c0fe04",
  violet: "#9f4dff",
  warning: "#ff9b2f",
};

export const graphCanvasToneStrokeColor: Record<GraphCanvasTone, string> = {
  error: "rgba(242, 71, 35, 0.58)",
  neutral: "rgba(176, 176, 170, 0.34)",
  primary: "rgba(192, 254, 4, 0.56)",
  violet: "rgba(159, 77, 255, 0.52)",
  warning: "rgba(255, 155, 47, 0.56)",
};

export const graphCanvasToneGlowColor: Record<GraphCanvasTone, string> = {
  error: "rgba(242, 71, 35, 0.18)",
  neutral: "rgba(176, 176, 170, 0.12)",
  primary: "rgba(192, 254, 4, 0.18)",
  violet: "rgba(159, 77, 255, 0.2)",
  warning: "rgba(255, 155, 47, 0.18)",
};

export function resolveGraphCanvasTone(value: unknown): GraphCanvasTone {
  if (typeof value !== "string") {
    return "primary";
  }

  return graphCanvasTones.includes(value as GraphCanvasTone)
    ? (value as GraphCanvasTone)
    : "primary";
}
