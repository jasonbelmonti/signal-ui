import { useLayoutEffect, useState } from "react";

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
    return {
      accentViolet: signalPalette.accentViolet,
      fieldPrimary: signalPalette.fieldPrimary,
      primary: signalPalette.primary,
      primaryDeep: signalPalette.primaryDeep,
      text: signalPalette.text,
      warning: signalPalette.warning,
    };
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

function palettesMatch(current: RuntimePalette, next: RuntimePalette) {
  return (
    current.accentViolet === next.accentViolet
    && current.fieldPrimary === next.fieldPrimary
    && current.primary === next.primary
    && current.primaryDeep === next.primaryDeep
    && current.text === next.text
    && current.warning === next.warning
  );
}

export function useSignalRuntimePalette() {
  const [palette, setPalette] = useState<RuntimePalette>(() => readSignalRuntimePalette());

  useLayoutEffect(() => {
    const nextPalette = readSignalRuntimePalette();
    setPalette((currentPalette) =>
      palettesMatch(currentPalette, nextPalette) ? currentPalette : nextPalette);
  });

  return palette;
}
