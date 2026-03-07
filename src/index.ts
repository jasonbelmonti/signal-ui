import "@fontsource/azeret-mono/400.css";
import "@fontsource/azeret-mono/500.css";
import "@fontsource/doto/500.css";
import "@fontsource/doto/700.css";
import "@fontsource/oxanium/500.css";
import "@fontsource/oxanium/600.css";
import "@fontsource/oxanium/700.css";
import "./styles/theme.css";

export { AntdThemeProvider, installStaticAntdTheme } from "./providers/AntdThemeProvider";
export { Panel, panelCutCornerPresets } from "./components/Panel";
export type {
  PanelCutCorner,
  PanelCutCornerPlacement,
  PanelCutCornerPreset,
  PanelProps,
} from "./components/Panel";
export { marathonDosFontStacks, marathonDosPalette, marathonDosTheme } from "./theme/marathonDosTheme";
