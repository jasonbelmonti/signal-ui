import { jsx as _jsx } from "react/jsx-runtime";
import { App, ConfigProvider } from "antd";
import { useInsertionEffect } from "react";
import { useRef } from "react";
import { mergeThemeConfig } from "../theme/mergeThemeConfig.js";
import { createSignalTheme, createSignalThemeCssVariables, signalTheme, } from "../theme/signalTheme.js";
// Portals read vars from documentElement, so keep the newest themed provider authoritative
// and restore the previous layer when a nested/themed preview unmounts.
const activeDocumentThemeEntries = [];
const documentThemeBaseline = new Map();
function resolveAntdTheme(theme, themePreferences) {
    if (!themePreferences) {
        return theme ?? signalTheme;
    }
    const generatedTheme = createSignalTheme(themePreferences);
    return theme ? mergeThemeConfig(generatedTheme, theme) : generatedTheme;
}
function syncDocumentThemeVariables() {
    if (typeof document === "undefined") {
        return;
    }
    const rootStyle = document.documentElement.style;
    const activeVariables = activeDocumentThemeEntries.at(-1)?.variables;
    const variableNames = new Set(documentThemeBaseline.keys());
    for (const entry of activeDocumentThemeEntries) {
        for (const name of Object.keys(entry.variables)) {
            variableNames.add(name);
        }
    }
    for (const name of variableNames) {
        const value = activeVariables?.[name];
        if (value !== undefined) {
            rootStyle.setProperty(name, String(value));
            continue;
        }
        const baselineValue = documentThemeBaseline.get(name);
        if (baselineValue) {
            rootStyle.setProperty(name, baselineValue);
        }
        else {
            rootStyle.removeProperty(name);
        }
    }
    if (!activeVariables) {
        documentThemeBaseline.clear();
    }
}
function upsertDocumentThemeVariables(id, variables) {
    if (typeof document === "undefined") {
        return;
    }
    const rootStyle = document.documentElement.style;
    for (const name of Object.keys(variables)) {
        if (!documentThemeBaseline.has(name)) {
            documentThemeBaseline.set(name, rootStyle.getPropertyValue(name));
        }
    }
    const existingEntryIndex = activeDocumentThemeEntries.findIndex((entry) => entry.id === id);
    if (existingEntryIndex === -1) {
        activeDocumentThemeEntries.push({ id, variables });
    }
    else {
        activeDocumentThemeEntries[existingEntryIndex] = { id, variables };
    }
    syncDocumentThemeVariables();
}
function removeDocumentThemeVariables(id) {
    const existingEntryIndex = activeDocumentThemeEntries.findIndex((entry) => entry.id === id);
    if (existingEntryIndex === -1) {
        return;
    }
    activeDocumentThemeEntries.splice(existingEntryIndex, 1);
    syncDocumentThemeVariables();
}
function useDocumentThemeVariables(themePreferences) {
    const themeEntryIdRef = useRef(null);
    if (!themeEntryIdRef.current) {
        themeEntryIdRef.current = Symbol("signal-theme-vars");
    }
    useInsertionEffect(() => {
        if (!themePreferences || typeof document === "undefined") {
            return;
        }
        const themeVariables = createSignalThemeCssVariables(themePreferences);
        const themeEntryId = themeEntryIdRef.current;
        if (!themeEntryId) {
            return;
        }
        upsertDocumentThemeVariables(themeEntryId, themeVariables);
        return () => {
            removeDocumentThemeVariables(themeEntryId);
        };
    }, [themePreferences]);
}
export function AntdThemeProvider({ children, theme, themePreferences, }) {
    const resolvedTheme = resolveAntdTheme(theme, themePreferences);
    useDocumentThemeVariables(themePreferences);
    return (_jsx(ConfigProvider, { theme: resolvedTheme, children: _jsx(App, { children: children }) }));
}
export function installStaticAntdTheme(options = {}) {
    ConfigProvider.config({
        holderRender: (children) => _jsx(AntdThemeProvider, { ...options, children: children }),
    });
}
