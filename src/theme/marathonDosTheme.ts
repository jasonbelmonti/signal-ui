import { createMarathonDosTheme } from "./createMarathonDosTheme.js";

export {
  createMarathonDosTheme,
  createMarathonDosThemeCssVariables,
  resolveMarathonDosPalette,
} from "./createMarathonDosTheme.js";
export { marathonDosFontStacks, marathonDosPalette } from "./marathonDosPalette.js";
export type { MarathonDosPalette } from "./marathonDosPalette.js";
export type { HexColor } from "./colorUtils.js";
export type {
  MarathonDosThemeColorPreferences,
  MarathonDosThemePreferences,
} from "./marathonDosThemePreferences.js";

export const marathonDosTheme = createMarathonDosTheme();
