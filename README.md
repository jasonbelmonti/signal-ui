# @jasonbelmonti/signal-ui

Signal-driven React and Ant Design UI package for desktop apps.

## Development

```bash
bun install
bun run storybook
bun run typecheck
bun run build
```

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

The package exports the provider, theme tokens, and shared components including `Panel`,
`PixelCubeLoader`, and `PixelCubePath`.

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
