---
"@jasonbelmonti/signal-ui": minor
---

Split `SignalChat` into the `@jasonbelmonti/signal-ui/chat` subpath export so Bun HTML bundles can import other package components without pulling in `@ant-design/x` through the main barrel.

`SignalChat` is no longer exported from `@jasonbelmonti/signal-ui`. Update chat consumers to import from `@jasonbelmonti/signal-ui/chat` instead.
