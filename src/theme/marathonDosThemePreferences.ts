import type { HexColor } from "./colorUtils";

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
