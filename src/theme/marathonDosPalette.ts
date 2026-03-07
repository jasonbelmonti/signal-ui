export const marathonDosPalette = {
  black: "#000000",
  void: "#050505",
  panel: "#0f0f0f",
  surface: "#1c1c1c",
  grid: "#2b2b2b",
  muted: "#717171",
  text: "#f5f5f0",
  primary: "#c0fe04",
  primaryDeep: "#86b400",
  fieldPrimary: "#d9ff67",
  fieldInk: "#050505",
  accentViolet: "#9f4dff",
  fieldViolet: "#9f4dff",
  warning: "#ff9b2f",
  error: "#f24723",
} as const;

export type MarathonDosPalette = Record<keyof typeof marathonDosPalette, string>;

export const marathonDosFontStacks = {
  ui: "\"Azeret Mono\", \"SFMono-Regular\", \"Menlo\", monospace",
  display: "\"Oxanium\", \"Azeret Mono\", sans-serif",
  displaySecondary: "\"Doto\", \"Oxanium\", \"Azeret Mono\", sans-serif",
} as const;
