import { theme } from "antd";
import type { ThemeConfig } from "antd";
import type { CSSProperties } from "react";

import {
  darkenHexColor,
  isHexColor,
  lightenHexColor,
  mixHexColors,
  resolveHexColor,
  toRgbTriplet,
  withAlpha,
} from "./colorUtils.js";
import { signalFontStacks, signalPalette } from "./signalPalette.js";
import type { SignalPalette as ResolvedSignalPalette } from "./signalPalette.js";
import type { SignalThemePreferences } from "./signalThemePreferences.js";

function resolveBorderRadius(borderRadius = 2) {
  return Math.max(Math.round(borderRadius), 0);
}

export function resolveSignalPalette(
  preferences: SignalThemePreferences = {},
): ResolvedSignalPalette {
  const colors = preferences.colors ?? {};
  const hasBackgroundOverride = isHexColor(colors.background);
  const hasPanelOverride = isHexColor(colors.panel);
  const hasPrimaryOverride = isHexColor(colors.primary);
  const hasTextOverride = isHexColor(colors.text);
  const hasAccentOverride = isHexColor(colors.accent);

  if (
    !hasBackgroundOverride &&
    !hasPanelOverride &&
    !hasPrimaryOverride &&
    !hasTextOverride &&
    !hasAccentOverride
  ) {
    return signalPalette;
  }

  const background = resolveHexColor(colors.background, signalPalette.black);
  const panel = resolveHexColor(colors.panel, signalPalette.panel);
  const primary = resolveHexColor(colors.primary, signalPalette.primary);
  const text = resolveHexColor(colors.text, signalPalette.text);
  const accent = resolveHexColor(colors.accent, signalPalette.accentViolet);

  return {
    ...signalPalette,
    black: background,
    void: hasBackgroundOverride ? lightenHexColor(background, 0.02) : signalPalette.void,
    panel,
    surface:
      hasPanelOverride || hasTextOverride ? mixHexColors(panel, text, 0.06) : signalPalette.surface,
    grid: hasPanelOverride || hasTextOverride ? mixHexColors(panel, text, 0.12) : signalPalette.grid,
    muted:
      hasTextOverride || hasBackgroundOverride
        ? mixHexColors(text, background, 0.55)
        : signalPalette.muted,
    text,
    primary,
    primaryDeep: hasPrimaryOverride ? darkenHexColor(primary, 0.28) : signalPalette.primaryDeep,
    fieldPrimary: hasPrimaryOverride
      ? lightenHexColor(primary, 0.12)
      : signalPalette.fieldPrimary,
    fieldInk: hasBackgroundOverride ? background : signalPalette.fieldInk,
    accentViolet: accent,
    fieldViolet: hasAccentOverride ? accent : signalPalette.fieldViolet,
  };
}

export type SignalThemeStyleVariables =
  CSSProperties & Record<`--signal-ui-${string}`, string | number>;

export function createSignalThemeCssVariables(
  preferences: SignalThemePreferences = {},
): SignalThemeStyleVariables {
  const palette = resolveSignalPalette(preferences);
  const primaryRgb = toRgbTriplet(palette.primary) ?? "192 254 4";
  const accentRgb = toRgbTriplet(palette.accentViolet) ?? "159 77 255";

  return {
    "--signal-ui-black": palette.black,
    "--signal-ui-void": palette.void,
    "--signal-ui-panel": palette.panel,
    "--signal-ui-surface": palette.surface,
    "--signal-ui-grid": palette.grid,
    "--signal-ui-muted": palette.muted,
    "--signal-ui-text": palette.text,
    "--signal-ui-text-rgb": toRgbTriplet(palette.text) ?? "245 245 240",
    "--signal-ui-primary": palette.primary,
    "--signal-ui-primary-rgb": primaryRgb,
    "--signal-ui-primary-deep": palette.primaryDeep,
    "--signal-ui-field-primary": palette.fieldPrimary,
    "--signal-ui-field-ink": palette.fieldInk,
    "--signal-ui-accent-violet": palette.accentViolet,
    "--signal-ui-accent-violet-rgb": accentRgb,
    "--signal-ui-field-violet": palette.fieldViolet,
    "--signal-ui-warning": palette.warning,
    "--signal-ui-error": palette.error,
    "--signal-ui-font-ui": signalFontStacks.ui,
    "--signal-ui-font-display": signalFontStacks.display,
    "--signal-ui-font-display-secondary": signalFontStacks.displaySecondary,
    "--signal-ui-font-pixel": signalFontStacks.pixel,
    "--signal-ui-fx-signal-ink": lightenHexColor(palette.text, 0.02),
    "--signal-ui-fx-signal-accent": palette.fieldPrimary,
    "--signal-ui-fx-signal-glow": withAlpha(palette.primary, 0.42),
    "--signal-ui-fx-signal-alt-accent": palette.accentViolet,
    "--signal-ui-fx-signal-alt-glow": withAlpha(palette.accentViolet, 0.38),
    "--signal-ui-loader-accent-rgb": primaryRgb,
    "--signal-ui-loader-frame": withAlpha(palette.primary, 0.36),
    "--signal-ui-loader-detail": withAlpha(palette.text, 0.72),
    "--signal-ui-cube-path-accent-rgb": primaryRgb,
    "--signal-ui-cube-path-front-tail": withAlpha(palette.primary, 0.54),
    "--signal-ui-cube-path-side-tail": withAlpha(palette.primary, 0.32),
  };
}

export function createSignalTheme(
  preferences: SignalThemePreferences = {},
): ThemeConfig {
  const palette = resolveSignalPalette(preferences);
  const borderRadius = resolveBorderRadius(preferences.borderRadius);
  const compactRadius = Math.max(borderRadius - 2, 0);
  const headerSurface = lightenHexColor(palette.black, 0.035);

  return {
    algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    token: {
      colorPrimary: palette.primary,
      colorInfo: palette.primary,
      colorSuccess: "#94db19",
      colorWarning: palette.warning,
      colorError: palette.error,
      colorLink: palette.primary,
      colorTextBase: palette.text,
      colorBgBase: palette.black,
      colorBorder: palette.muted,
      colorBorderSecondary: palette.grid,
      colorSplit: palette.grid,
      colorText: palette.text,
      colorTextSecondary: mixHexColors(palette.text, palette.black, 0.32),
      colorTextTertiary: palette.muted,
      colorTextQuaternary: mixHexColors(palette.text, palette.black, 0.65),
      colorBgContainer: palette.panel,
      colorBgElevated: lightenHexColor(palette.panel, 0.02),
      colorBgLayout: palette.void,
      colorFillSecondary: withAlpha(palette.primary, 0.08),
      colorFillTertiary: withAlpha(palette.primary, 0.12),
      colorFillQuaternary: withAlpha("#ffffff", 0.05),
      controlItemBgHover: withAlpha(palette.primary, 0.08),
      controlItemBgActive: withAlpha(palette.primary, 0.14),
      controlItemBgActiveHover: withAlpha(palette.primary, 0.18),
      controlOutline: withAlpha(palette.primary, 0.26),
      controlOutlineWidth: 1,
      lineWidth: 1,
      fontFamily: signalFontStacks.ui,
      fontFamilyCode: signalFontStacks.ui,
      fontSize: 13,
      fontSizeHeading1: 42,
      fontSizeHeading2: 28,
      fontSizeHeading3: 20,
      fontSizeHeading4: 16,
      lineHeight: 1.5,
      wireframe: false,
      borderRadius,
      borderRadiusXS: compactRadius,
      borderRadiusSM: compactRadius,
      borderRadiusLG: borderRadius,
      borderRadiusOuter: borderRadius,
      boxShadow: "none",
      boxShadowSecondary: `0 0 0 1px ${withAlpha(palette.primary, 0.12)}`,
      padding: 16,
      paddingLG: 20,
      controlHeight: 40,
      controlHeightSM: 34,
      controlHeightLG: 46,
    },
    components: {
      Button: {
        fontWeight: 600,
        defaultBg: lightenHexColor(palette.black, 0.063),
        defaultColor: palette.text,
        defaultBorderColor: palette.muted,
        defaultHoverBg: lightenHexColor(palette.black, 0.082),
        defaultHoverColor: palette.primary,
        defaultHoverBorderColor: palette.primary,
        defaultActiveBg: lightenHexColor(palette.black, 0.051),
        defaultActiveColor: palette.primary,
        defaultActiveBorderColor: palette.primaryDeep,
        primaryColor: palette.black,
        defaultShadow: "none",
        primaryShadow: "none",
        dangerShadow: "none",
        textHoverBg: withAlpha(palette.primary, 0.08),
        linkHoverBg: "transparent",
        contentFontSize: 13,
        contentFontSizeLG: 14,
        contentFontSizeSM: 12,
        paddingInline: 18,
        paddingInlineLG: 22,
        paddingInlineSM: 14,
      },
      Input: {
        addonBg: lightenHexColor(palette.black, 0.031),
        hoverBg: lightenHexColor(palette.black, 0.063),
        activeBg: lightenHexColor(palette.black, 0.063),
        hoverBorderColor: palette.primary,
        activeBorderColor: palette.primary,
        activeShadow: `0 0 0 2px ${withAlpha(palette.primary, 0.16)}`,
        errorActiveShadow: `0 0 0 2px ${withAlpha(palette.error, 0.18)}`,
        warningActiveShadow: `0 0 0 2px ${withAlpha(palette.warning, 0.18)}`,
        inputFontSize: 13,
        inputFontSizeLG: 14,
        inputFontSizeSM: 12,
        paddingBlock: 8,
        paddingBlockLG: 10,
        paddingBlockSM: 6,
        paddingInline: 12,
        paddingInlineLG: 14,
        paddingInlineSM: 10,
      },
      Card: {
        headerBg: headerSurface,
        actionsBg: headerSurface,
        extraColor: palette.primary,
        headerFontSize: 12,
        headerFontSizeSM: 11,
        headerHeight: 52,
        headerHeightSM: 44,
        bodyPadding: 20,
        bodyPaddingSM: 16,
        headerPadding: 20,
        headerPaddingSM: 16,
        tabsMarginBottom: 16,
      },
      Typography: {
        titleMarginBottom: "0.3em",
        titleMarginTop: "1.1em",
      },
    },
  };
}
