import { App, ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";
import { useInsertionEffect } from "react";
import type { PropsWithChildren } from "react";
import { useRef } from "react";

import { mergeThemeConfig } from "../theme/mergeThemeConfig.js";
import {
  createSignalTheme,
  createSignalThemeCssVariables,
  signalTheme,
  type SignalThemePreferences,
} from "../theme/signalTheme.js";

type SignalThemeVariableMap = ReturnType<typeof createSignalThemeCssVariables>;

type DocumentThemeEntry = {
  id: symbol;
  variables: SignalThemeVariableMap;
};

// Portals read vars from documentElement, so keep the newest themed provider authoritative
// and restore the previous layer when a nested/themed preview unmounts.
const activeDocumentThemeEntries: DocumentThemeEntry[] = [];
const documentThemeBaseline = new Map<string, string>();

export type AntdThemeProviderProps = PropsWithChildren<{
  theme?: ThemeConfig;
  themePreferences?: SignalThemePreferences;
}>;

function resolveAntdTheme(
  theme: ThemeConfig | undefined,
  themePreferences: SignalThemePreferences | undefined,
) {
  const baseTheme = themePreferences ? createSignalTheme(themePreferences) : signalTheme;

  return theme ? mergeThemeConfig(baseTheme, theme) : baseTheme;
}

function syncDocumentThemeVariables() {
  if (typeof document === "undefined") {
    return;
  }

  const rootStyle = document.documentElement.style;
  const activeVariables = activeDocumentThemeEntries.at(-1)?.variables;
  const variableNames = new Set<string>(documentThemeBaseline.keys());

  for (const entry of activeDocumentThemeEntries) {
    for (const name of Object.keys(entry.variables)) {
      variableNames.add(name);
    }
  }

  for (const name of variableNames) {
    const value = activeVariables?.[name as keyof SignalThemeVariableMap];

    if (value !== undefined) {
      rootStyle.setProperty(name, String(value));
      continue;
    }

    const baselineValue = documentThemeBaseline.get(name);

    if (baselineValue) {
      rootStyle.setProperty(name, baselineValue);
    } else {
      rootStyle.removeProperty(name);
    }
  }

  if (!activeVariables) {
    documentThemeBaseline.clear();
  }
}

function upsertDocumentThemeVariables(
  id: symbol,
  variables: SignalThemeVariableMap,
) {
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
  } else {
    activeDocumentThemeEntries[existingEntryIndex] = { id, variables };
  }

  syncDocumentThemeVariables();
}

function removeDocumentThemeVariables(id: symbol) {
  const existingEntryIndex = activeDocumentThemeEntries.findIndex((entry) => entry.id === id);

  if (existingEntryIndex === -1) {
    return;
  }

  activeDocumentThemeEntries.splice(existingEntryIndex, 1);
  syncDocumentThemeVariables();
}

function useDocumentThemeVariables(
  themePreferences: SignalThemePreferences | undefined,
  themeConfig: ThemeConfig | undefined,
) {
  const themeEntryIdRef = useRef<symbol | null>(null);

  if (!themeEntryIdRef.current) {
    themeEntryIdRef.current = Symbol("signal-theme-vars");
  }

  useInsertionEffect(() => {
    if ((!themePreferences && !themeConfig) || typeof document === "undefined") {
      return;
    }

    const themeVariables = createSignalThemeCssVariables(themePreferences, themeConfig);
    const themeEntryId = themeEntryIdRef.current;

    if (!themeEntryId) {
      return;
    }

    upsertDocumentThemeVariables(themeEntryId, themeVariables);

    return () => {
      removeDocumentThemeVariables(themeEntryId);
    };
  }, [themeConfig, themePreferences]);
}

export function AntdThemeProvider({
  children,
  theme,
  themePreferences,
}: AntdThemeProviderProps) {
  const resolvedTheme = resolveAntdTheme(theme, themePreferences);

  useDocumentThemeVariables(themePreferences, theme ? resolvedTheme : undefined);

  return (
    <ConfigProvider theme={resolvedTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}

export type InstallStaticAntdThemeOptions = Pick<
  AntdThemeProviderProps,
  "theme" | "themePreferences"
>;

export function installStaticAntdTheme(
  options: InstallStaticAntdThemeOptions = {},
) {
  ConfigProvider.config({
    holderRender: (children) => <AntdThemeProvider {...options}>{children}</AntdThemeProvider>,
  });
}
