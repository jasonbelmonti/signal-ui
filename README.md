# @jasonbelmonti/signal-ui

Signal-driven React and Ant Design UI package for desktop apps.

## Development

```bash
bun install
bun run storybook
bun run typecheck
bun run build
```

The Storybook catalog is organized in this order:

1. `Overview` – landing, getting started, and catalog context.
2. `Foundations` – baseline visual and token references.
3. `Components` – primary reusable components.
4. `Recipes` – recommended patterns and composition examples for real product flows.
5. `Lab` – secondary experimental or edge-case surfaces.

Pushes to `main` also publish the static Storybook to GitHub Pages via
`.github/workflows/storybook-pages.yml`, so the theme can be shared without a local build.
The default URL for this repository is `https://jasonbelmonti.github.io/signal-ui/`.

`Recipes` and `Lab` remain in the catalog intentionally, but they are secondary to
`Foundations` and `Components` so designers and integrators can quickly separate stable
reference surfaces from exploratory patterns.

`bun run build` emits the consumable package contract in `dist/`:

- `dist/index.js`
- `dist/index.d.ts`
- `dist/styles.css`

`dist/` is generated, not checked into git. Local builds, CI, and the release workflow recreate it
from source.

## Consumption

When published, install it from npm:

```bash
bun add @jasonbelmonti/signal-ui
# or
npm install @jasonbelmonti/signal-ui
```

For a local checkout, build the package first and then add it as a sibling file dependency:

```bash
bun run build
```

```json
{
  "dependencies": {
    "@jasonbelmonti/signal-ui": "file:../signal-ui"
  }
}
```

Import the shared global styles once at the renderer entry, then wrap the app with the provider:

```tsx
import "@jasonbelmonti/signal-ui/styles.css";
import { AntdThemeProvider } from "@jasonbelmonti/signal-ui";
```

The package exports the provider, theme tokens, shared components including `Panel`,
`PixelCubeLoader`, and `PixelCubePath`, plus procedural audio helpers such as
`materializeNoiseCue`, `playNoiseCue`, and `primeNoiseEngine`.

## Release

Create a changeset for any user-facing package change:

```bash
bun run changeset
```

Versioning and publishing are handled through GitHub Actions:

```bash
bun run version-packages
```

Configure the repository `NPM_TOKEN` secret so the release workflow can publish
`@jasonbelmonti/signal-ui` to npm after the Changesets version PR merges.
