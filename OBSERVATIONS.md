# Observations

- Repo started as a minimal `bun init` scaffold with no React, Storybook, or Ant Design setup.
- Repo now has a React 19 + Ant Design 6 + Storybook 10 (React/Webpack) bootstrap on branch `codex/bel-270-bootstrap-react-storybook`.
- Preferred initial direction for `agent-ui` is Storybook-first, not a separate app shell.
- Locked visual direction is a modernized MS-DOS / hacker aesthetic with palette inspiration from Marathon (`#000000`, `#1c1c1c`, `#717171`, `#c0fe04`, `#f24723`), open-source fonts, and restrained terminal effects.
- Current font direction is `Oxanium` for display headings and `Azeret Mono` for UI/body copy.
- Theme assets that depend on global CSS or font-face imports should be wired through `src/index.ts`, not only Storybook preview, so package consumers match the stories.
- Theme motion effects should be exposed as opt-in CSS utilities plus Storybook demos, not forced into Ant Design token config.
- User prefers motion texture with rapid but subtle "zzt zzt" energy rather than slow ambient shimmer.
- User is interested in folding more stylized pixel/display fonts into the Marathon theme when they are applied as purposeful accents rather than indiscriminate body copy.
- Micro 5 was rejected after preview; preferred hierarchy is `Oxanium` for top-level headings and `Doto` only for secondary headline/display accents.
- If a visual effect is intended to carry the aesthetic, the default treatment needs to be visibly legible without requiring users to hunt for it.
- For textured signal text, clipped grain/raster needs to be visible at normal viewing scale; ultra-fine noise disappears even when the animation is technically present.
- Requested work items should include materially verifiable success criteria, ideally commands, named stories, or clearly observable UI states.
- User is exploring whether vivid purple should exist as a contrast accent to the highlight lime, with a preference for preserving core semantic tokens unless the new hue earns a distinct role.
- User is interested in optional 45 degree panel corner treatments, especially either a bold accent triangle or a clipped/notched corner to add diagonal rhythm without changing every surface by default.
- User prefers stylized treatments to have named presets when possible so the system can stay consistent without requiring repeated hand-tuning of low-level props.
