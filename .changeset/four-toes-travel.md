---
"@jasonbelmonti/signal-ui": patch
---

Fix the published stylesheet entrypoint so `dist/styles.css` ships all imported
style dependencies, including `dist/styles/chat.css`.
