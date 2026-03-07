import type { Preview } from "@storybook/react-webpack5";

import "../src/styles.css";
import "../src/styles/storybook.css";

import { AntdThemeProvider } from "../src/index.js";

const preview: Preview = {
  decorators: [
    (Story) => (
      <AntdThemeProvider>
        <div className="storybook-shell">
          <Story />
        </div>
      </AntdThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      disable: true,
    },
    controls: {
      expanded: true,
    },
  },
};

export default preview;
