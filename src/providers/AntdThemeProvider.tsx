import { App, ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";
import type { PropsWithChildren } from "react";

import {
  createMarathonDosTheme,
  createMarathonDosThemeCssVariables,
  marathonDosTheme,
  type MarathonDosThemePreferences,
} from "../theme/marathonDosTheme";

export type AntdThemeProviderProps = PropsWithChildren<{
  theme?: ThemeConfig;
  themePreferences?: MarathonDosThemePreferences;
}>;

export function AntdThemeProvider({
  children,
  theme,
  themePreferences,
}: AntdThemeProviderProps) {
  const resolvedTheme = theme ?? (themePreferences ? createMarathonDosTheme(themePreferences) : marathonDosTheme);
  const themeScopeStyle = createMarathonDosThemeCssVariables(themePreferences);

  return (
    <div style={themeScopeStyle}>
      <ConfigProvider theme={resolvedTheme}>
        <App>{children}</App>
      </ConfigProvider>
    </div>
  );
}

export type InstallStaticAntdThemeOptions = Pick<AntdThemeProviderProps, "theme" | "themePreferences">;

export function installStaticAntdTheme(options: InstallStaticAntdThemeOptions = {}) {
  ConfigProvider.config({
    holderRender: (children) => <AntdThemeProvider {...options}>{children}</AntdThemeProvider>,
  });
}
