import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { PanelModalScene } from "./panel/PanelSecondaryScenes.js";

const meta = {
  title: "Recipes/Panel Modal",
  component: PanelModalScene,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PanelModalScene>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
