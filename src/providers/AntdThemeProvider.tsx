import { App, ConfigProvider } from "antd";
import type { PropsWithChildren } from "react";

import { marathonDosTheme } from "../theme/marathonDosTheme";

export function AntdThemeProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider theme={marathonDosTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}

export function installStaticAntdTheme() {
  ConfigProvider.config({
    holderRender: (children) => <AntdThemeProvider>{children}</AntdThemeProvider>,
  });
}
