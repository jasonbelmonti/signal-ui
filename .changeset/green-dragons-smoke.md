---
"@jasonbelmonti/signal-ui": minor
---

Add runtime theme customization support for Signal UI.

- export `createSignalTheme`, `createSignalThemeCssVariables`, `resolveSignalPalette`, and theme preference types
- allow `AntdThemeProvider` and `installStaticAntdTheme` to accept runtime `theme` and `themePreferences` overrides
- keep document-level CSS variables in sync for themed portals and nested providers
