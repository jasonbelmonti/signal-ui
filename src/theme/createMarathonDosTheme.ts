import type { CSSProperties } from "react";
import { theme } from "antd";
import type { ThemeConfig } from "antd";

import {
  darkenHexColor,
  lightenHexColor,
  mixHexColors,
  resolveHexColor,
  toRgbTriplet,
  withAlpha,
} from "./colorUtils";
import { marathonDosFontStacks, marathonDosPalette } from "./marathonDosPalette";
import type { MarathonDosPalette as ResolvedMarathonDosPalette } from "./marathonDosPalette";
import type { MarathonDosThemePreferences } from "./marathonDosThemePreferences";

function resolveBorderRadius(borderRadius = 2) {
  return Math.max(Math.round(borderRadius), 0);
}

export function resolveMarathonDosPalette(
  preferences: MarathonDosThemePreferences = {},
): ResolvedMarathonDosPalette {
  const colors = preferences.colors ?? {};
  const background = resolveHexColor(colors.background, marathonDosPalette.black);
  const panel = resolveHexColor(colors.panel, marathonDosPalette.panel);
  const primary = resolveHexColor(colors.primary, marathonDosPalette.primary);
  const text = resolveHexColor(colors.text, marathonDosPalette.text);
  const accent = resolveHexColor(colors.accent, marathonDosPalette.accentViolet);

  return {
    ...marathonDosPalette,
    black: background,
    void: lightenHexColor(background, 0.02),
    panel,
    surface: mixHexColors(panel, text, 0.06),
    grid: mixHexColors(panel, text, 0.12),
    muted: mixHexColors(text, background, 0.55),
    text,
    primary,
    primaryDeep: darkenHexColor(primary, 0.28),
    fieldPrimary: lightenHexColor(primary, 0.12),
    fieldInk: background,
    accentViolet: accent,
    fieldViolet: accent,
  };
}

export type MarathonThemeStyleVariables = CSSProperties & Record<`--marathon-${string}`, string | number>;

export function createMarathonDosThemeCssVariables(
  preferences: MarathonDosThemePreferences = {},
): MarathonThemeStyleVariables {
  const palette = resolveMarathonDosPalette(preferences);
  const primaryRgb = toRgbTriplet(palette.primary) ?? "192 254 4";
  const accentRgb = toRgbTriplet(palette.accentViolet) ?? "159 77 255";

  return {
    "--marathon-black": palette.black,
    "--marathon-void": palette.void,
    "--marathon-panel": palette.panel,
    "--marathon-surface": palette.surface,
    "--marathon-grid": palette.grid,
    "--marathon-muted": palette.muted,
    "--marathon-text": palette.text,
    "--marathon-text-rgb": toRgbTriplet(palette.text) ?? "245 245 240",
    "--marathon-primary": palette.primary,
    "--marathon-primary-rgb": primaryRgb,
    "--marathon-primary-deep": palette.primaryDeep,
    "--marathon-field-primary": palette.fieldPrimary,
    "--marathon-field-ink": palette.fieldInk,
    "--marathon-accent-violet": palette.accentViolet,
    "--marathon-accent-violet-rgb": accentRgb,
    "--marathon-field-violet": palette.fieldViolet,
    "--marathon-warning": palette.warning,
    "--marathon-error": palette.error,
    "--marathon-font-ui": marathonDosFontStacks.ui,
    "--marathon-font-display": marathonDosFontStacks.display,
    "--marathon-font-display-secondary": marathonDosFontStacks.displaySecondary,
    "--marathon-fx-signal-ink": lightenHexColor(palette.text, 0.02),
    "--marathon-fx-signal-accent": palette.fieldPrimary,
    "--marathon-fx-signal-glow": withAlpha(palette.primary, 0.42),
    "--marathon-fx-signal-alt-accent": palette.accentViolet,
    "--marathon-fx-signal-alt-glow": withAlpha(palette.accentViolet, 0.38),
    "--marathon-loader-accent-rgb": primaryRgb,
    "--marathon-loader-frame": withAlpha(palette.primary, 0.36),
    "--marathon-loader-detail": withAlpha(palette.text, 0.72),
    "--marathon-cube-path-accent-rgb": primaryRgb,
    "--marathon-cube-path-front-tail": withAlpha(palette.primary, 0.54),
    "--marathon-cube-path-side-tail": withAlpha(palette.primary, 0.32),
  };
}

export function createMarathonDosTheme(
  preferences: MarathonDosThemePreferences = {},
): ThemeConfig {
  const palette = resolveMarathonDosPalette(preferences);
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
      fontFamily: marathonDosFontStacks.ui,
      fontFamilyCode: marathonDosFontStacks.ui,
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
