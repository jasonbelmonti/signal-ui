import { createMarathonDosTheme } from "./createMarathonDosTheme";

export {
  createMarathonDosTheme,
  createMarathonDosThemeCssVariables,
  resolveMarathonDosPalette,
} from "./createMarathonDosTheme";
export { marathonDosFontStacks, marathonDosPalette } from "./marathonDosPalette";
export type { MarathonDosPalette } from "./marathonDosPalette";
export type { HexColor } from "./colorUtils";
export type {
  MarathonDosThemeColorPreferences,
  MarathonDosThemePreferences,
} from "./marathonDosThemePreferences";

export const marathonDosTheme = createMarathonDosTheme();
