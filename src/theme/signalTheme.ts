import { createSignalTheme } from "./createSignalTheme.js";

export {
  createSignalTheme,
  createSignalThemeCssVariables,
  resolveSignalPalette,
} from "./createSignalTheme.js";
export { signalFontStacks, signalPalette } from "./signalPalette.js";
export type { SignalPalette } from "./signalPalette.js";
export type { HexColor } from "./colorUtils.js";
export type {
  SignalThemeColorPreferences,
  SignalThemePreferences,
} from "./signalThemePreferences.js";

export const signalTheme = createSignalTheme();
