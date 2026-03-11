export const graphCanvasTones = [
  "primary",
  "violet",
  "warning",
  "error",
  "neutral",
] as const;

export type GraphCanvasTone = (typeof graphCanvasTones)[number];

export const graphCanvasToneAccentColor: Record<GraphCanvasTone, string> = {
  error: "var(--signal-ui-error)",
  neutral: "var(--signal-ui-muted)",
  primary: "var(--signal-ui-primary)",
  violet: "var(--signal-ui-accent-violet)",
  warning: "var(--signal-ui-warning)",
};

export const graphCanvasToneStrokeColor: Record<GraphCanvasTone, string> = {
  error: "rgb(var(--signal-ui-error-rgb) / 0.58)",
  neutral: "rgb(var(--signal-ui-muted-rgb) / 0.34)",
  primary: "rgb(var(--signal-ui-primary-rgb) / 0.56)",
  violet: "rgb(var(--signal-ui-accent-violet-rgb) / 0.52)",
  warning: "rgb(var(--signal-ui-warning-rgb) / 0.56)",
};

export const graphCanvasToneGlowColor: Record<GraphCanvasTone, string> = {
  error: "rgb(var(--signal-ui-error-rgb) / 0.18)",
  neutral: "rgb(var(--signal-ui-muted-rgb) / 0.12)",
  primary: "rgb(var(--signal-ui-primary-rgb) / 0.18)",
  violet: "rgb(var(--signal-ui-accent-violet-rgb) / 0.2)",
  warning: "rgb(var(--signal-ui-warning-rgb) / 0.18)",
};

export function resolveGraphCanvasTone(value: unknown): GraphCanvasTone {
  if (typeof value !== "string") {
    return "primary";
  }

  return graphCanvasTones.includes(value as GraphCanvasTone)
    ? (value as GraphCanvasTone)
    : "primary";
}
