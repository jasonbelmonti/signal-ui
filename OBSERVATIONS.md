# Observations

- Repo started as a minimal `bun init` scaffold with no React, Storybook, or Ant Design setup.
- Repo now has a React 19 + Ant Design 6 + Storybook 10 (React/Webpack) bootstrap on branch `codex/bel-270-bootstrap-react-storybook`.
- Preferred initial direction for `agent-ui` is Storybook-first, not a separate app shell.
- Locked visual direction is a modernized MS-DOS / hacker aesthetic with palette inspiration from Marathon (`#000000`, `#1c1c1c`, `#717171`, `#c0fe04`, `#f24723`), open-source fonts, and restrained terminal effects.
- Current font direction is `Oxanium` for display headings and `Azeret Mono` for UI/body copy.
- Theme assets that depend on global CSS or font-face imports should be wired through `src/index.ts`, not only Storybook preview, so package consumers match the stories.
- Requested work items should include materially verifiable success criteria, ideally commands, named stories, or clearly observable UI states.
