# @jasonbelmonti/signal-ui

## 0.4.0

### Minor Changes

- 4c85ce7: Improve `PixelCubePath` centering in constrained layouts and add a broken `error` tone for failed states.

## 0.3.0

### Minor Changes

- 2987ea2: Add runtime theme customization support for Signal UI.

  - export `createSignalTheme`, `createSignalThemeCssVariables`, `resolveSignalPalette`, and theme preference types
  - allow `AntdThemeProvider` and `installStaticAntdTheme` to accept runtime `theme` and `themePreferences` overrides
  - keep document-level CSS variables in sync for themed portals and nested providers

## 0.2.1

### Patch Changes

- 1ce79c1: Ship the shared primitives stylesheet in the published package so `styles.css` resolves cleanly from npm consumers.

## 0.2.0

### Minor Changes

- 1818e0c: Add shared console primitives for branded headers, empty states, and semantic status tags.
