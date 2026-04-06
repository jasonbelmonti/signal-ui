# @jasonbelmonti/signal-ui

## 0.11.0

### Minor Changes

- 29685d8: Split `SignalChat` into the `@jasonbelmonti/signal-ui/chat` subpath export so Bun HTML bundles can import other package components without pulling in `@ant-design/x` through the main barrel.

  `SignalChat` is no longer exported from `@jasonbelmonti/signal-ui`. Update chat consumers to import from `@jasonbelmonti/signal-ui/chat` instead.

## 0.10.1

### Patch Changes

- 857978a: Improve Signal Button contrast so text and state styling read more clearly across themes.

## 0.10.0

### Minor Changes

- 700ae9f: Add the `GlitchGhost` component to the public package and preserve ghost snapshot updates for
  canvas-backed content.

## 0.9.0

### Minor Changes

- a99c513: Add exported `SignalProgressMeter` and `SignalProgressPanel` primitives, including the animated splash progress treatment, completion payoff surface, and example loading flows used in Storybook.

  Polish progress-meter completion behavior, semantics, and audio arming so package-owned progress surfaces render and complete consistently.

## 0.8.0

### Minor Changes

- 89eb145: Add a new `frame="reticle"` option to `Panel` so highlighted surfaces can render the animated acquisition-style border treatment exposed in the latest Storybook examples.

  Update graph canvas and wireframe theming to read from runtime theme variables so custom Signal theme overrides propagate consistently through canvas surfaces, minimap accents, and palette-driven visual effects.

## 0.7.1

### Patch Changes

- 720e897: Fix the published stylesheet entrypoint so `dist/styles.css` ships all imported
  style dependencies, including `dist/styles/chat.css`.

## 0.7.0

### Minor Changes

- c058c24: Add a Signal Chat pattern built on Ant Design X, including a reusable `SignalChat`
  component, Storybook coverage, themed transcript/composer styling, and console-style
  role markers for message authors.

## 0.6.0

### Minor Changes

- Add the new `SignalChat` primitive and ship the latest Signal UI chat styling/theme support.

  Refresh the `SignalButton` hold-to-trigger story with procedural loot-box audio and updated demo controls.

## 0.5.0

### Minor Changes

- f7efe6d: Export procedural audio cue utilities and playback helpers so apps can share the same signal sound engine.

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
