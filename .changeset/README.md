# Changesets

This directory stores release intent files for `@jasonbelmonti/signal-ui`.

- Run `bun run changeset` for any change that should affect the published package version.
- Merge those changes to `main` and the release workflow will open or update the version PR.
- When the version PR merges, the release workflow publishes the package to npm using the
  repository `NPM_TOKEN` secret.
