import type { HexColor } from "./colorUtils.js";

export type MarathonDosThemeColorPreferences = {
  accent?: HexColor;
  background?: HexColor;
  panel?: HexColor;
  primary?: HexColor;
  text?: HexColor;
};

export type MarathonDosThemePreferences = {
  borderRadius?: number;
  colors?: MarathonDosThemeColorPreferences;
};
