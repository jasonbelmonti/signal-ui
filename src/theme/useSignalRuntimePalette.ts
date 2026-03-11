import { useSyncExternalStore } from "react";

import { normalizeColor } from "./colorUtils.js";
import { signalPalette } from "./signalPalette.js";
import type { SignalPalette } from "./signalPalette.js";

type RuntimePaletteKey =
  | "accentViolet"
  | "fieldPrimary"
  | "primary"
  | "primaryDeep"
  | "text"
  | "warning";

type RuntimePalette = Pick<SignalPalette, RuntimePaletteKey>;

const runtimePaletteVariableMap = {
  accentViolet: "--signal-ui-accent-violet",
  fieldPrimary: "--signal-ui-field-primary",
  primary: "--signal-ui-primary",
  primaryDeep: "--signal-ui-primary-deep",
  text: "--signal-ui-text",
  warning: "--signal-ui-warning",
} satisfies Record<RuntimePaletteKey, `--signal-ui-${string}`>;

function resolveRuntimePaletteColor(
  rootStyles: CSSStyleDeclaration,
  key: RuntimePaletteKey,
  fallback: SignalPalette[RuntimePaletteKey],
) {
  return normalizeColor(rootStyles.getPropertyValue(runtimePaletteVariableMap[key]).trim()) ?? fallback;
}

function readSignalRuntimePalette(): RuntimePalette {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return getSignalRuntimePaletteFallback();
  }

  const rootStyles = window.getComputedStyle(document.documentElement);

  return {
    accentViolet: resolveRuntimePaletteColor(rootStyles, "accentViolet", signalPalette.accentViolet),
    fieldPrimary: resolveRuntimePaletteColor(rootStyles, "fieldPrimary", signalPalette.fieldPrimary),
    primary: resolveRuntimePaletteColor(rootStyles, "primary", signalPalette.primary),
    primaryDeep: resolveRuntimePaletteColor(rootStyles, "primaryDeep", signalPalette.primaryDeep),
    text: resolveRuntimePaletteColor(rootStyles, "text", signalPalette.text),
    warning: resolveRuntimePaletteColor(rootStyles, "warning", signalPalette.warning),
  };
}

function getSignalRuntimePaletteFallback(): RuntimePalette {
  return {
    accentViolet: signalPalette.accentViolet,
    fieldPrimary: signalPalette.fieldPrimary,
    primary: signalPalette.primary,
    primaryDeep: signalPalette.primaryDeep,
    text: signalPalette.text,
    warning: signalPalette.warning,
  };
}

function subscribeToSignalRuntimePalette(onStoreChange: () => void) {
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
    return () => {};
  }

  const rootElement = document.documentElement;
  const observer = new MutationObserver((mutationList) => {
    if (
      mutationList.some(
        (mutation) =>
          mutation.type === "attributes"
          && (mutation.attributeName === "style" || mutation.attributeName === "class"),
      )
    ) {
      onStoreChange();
    }
  });

  observer.observe(rootElement, {
    attributeFilter: ["class", "style"],
    attributes: true,
  });

  return () => {
    observer.disconnect();
  };
}

export function useSignalRuntimePalette() {
  return useSyncExternalStore(
    subscribeToSignalRuntimePalette,
    readSignalRuntimePalette,
    getSignalRuntimePaletteFallback,
  );
}
