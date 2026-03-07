# agent-ui

Marathon-themed React and Ant Design UI package for the desktop agent apps.

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

`dist/` is checked into the repo on purpose so Bun consumers using
`"agent-ui": "file:../agent-ui"` can install the package from a fresh clone without
depending on blocked lifecycle scripts.

## Consumption

Add the package as a sibling file dependency:

```json
{
  "dependencies": {
    "agent-ui": "file:../agent-ui"
  }
}
```

Import the shared global styles once at the renderer entry, then wrap the app with the provider:

```tsx
import "agent-ui/styles.css";
import { AntdThemeProvider } from "agent-ui";
```

The package exports the provider, theme tokens, and shared components including `Panel`,
`PixelCubeLoader`, and `PixelCubePath`.
