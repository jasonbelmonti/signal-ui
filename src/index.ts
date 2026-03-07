import "@fontsource/azeret-mono/400.css";
import "@fontsource/azeret-mono/500.css";
import "@fontsource/doto/500.css";
import "@fontsource/doto/700.css";
import "@fontsource/oxanium/500.css";
import "@fontsource/oxanium/600.css";
import "@fontsource/oxanium/700.css";
import "./styles/theme.css";

export { AntdThemeProvider, installStaticAntdTheme } from "./providers/AntdThemeProvider";
export { PixelCubePath } from "./components/PixelCubePath";
export { PixelCubeLoader } from "./components/PixelCubeLoader";
export type {
  PixelCubePathProps,
  PixelCubePathTone,
} from "./components/PixelCubePath";
export type {
  PixelCubeLoaderGridSize,
  PixelCubeLoaderProps,
  PixelCubeLoaderTone,
} from "./components/PixelCubeLoader";
export { marathonDosFontStacks, marathonDosPalette, marathonDosTheme } from "./theme/marathonDosTheme";
