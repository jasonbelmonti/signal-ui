import type { HexColor } from "./colorUtils.js";

export type SignalThemeColorPreferences = {
  accent?: HexColor;
  background?: HexColor;
  panel?: HexColor;
  primary?: HexColor;
  text?: HexColor;
};

export type SignalThemePreferences = {
  borderRadius?: number;
  colors?: SignalThemeColorPreferences;
};
