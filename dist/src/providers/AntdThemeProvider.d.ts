import type { ThemeConfig } from "antd";
import type { PropsWithChildren } from "react";
import { type MarathonDosThemePreferences } from "../theme/marathonDosTheme.js";
export type AntdThemeProviderProps = PropsWithChildren<{
    theme?: ThemeConfig;
    themePreferences?: MarathonDosThemePreferences;
}>;
export declare function AntdThemeProvider({ children, theme, themePreferences, }: AntdThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export type InstallStaticAntdThemeOptions = Pick<AntdThemeProviderProps, "theme" | "themePreferences">;
export declare function installStaticAntdTheme(options?: InstallStaticAntdThemeOptions): void;
