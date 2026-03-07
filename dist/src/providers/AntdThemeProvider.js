import { jsx as _jsx } from "react/jsx-runtime";
import { App, ConfigProvider } from "antd";
import { useInsertionEffect } from "react";
import { createMarathonDosTheme, createMarathonDosThemeCssVariables, marathonDosTheme, } from "../theme/marathonDosTheme.js";
function useDocumentThemeVariables(themePreferences) {
    useInsertionEffect(() => {
        if (!themePreferences || typeof document === "undefined") {
            return;
        }
        const themeVariables = createMarathonDosThemeCssVariables(themePreferences);
        const rootStyle = document.documentElement.style;
        const previousValues = new Map();
        for (const [name, value] of Object.entries(themeVariables)) {
            previousValues.set(name, rootStyle.getPropertyValue(name));
            rootStyle.setProperty(name, String(value));
        }
        return () => {
            for (const [name, value] of previousValues) {
                if (value) {
                    rootStyle.setProperty(name, value);
                }
                else {
                    rootStyle.removeProperty(name);
                }
            }
        };
    }, [themePreferences]);
}
export function AntdThemeProvider({ children, theme, themePreferences, }) {
    const resolvedTheme = theme ?? (themePreferences ? createMarathonDosTheme(themePreferences) : marathonDosTheme);
    useDocumentThemeVariables(themePreferences);
    return (_jsx(ConfigProvider, { theme: resolvedTheme, children: _jsx(App, { children: children }) }));
}
export function installStaticAntdTheme(options = {}) {
    ConfigProvider.config({
        holderRender: (children) => _jsx(AntdThemeProvider, { ...options, children: children }),
    });
}
