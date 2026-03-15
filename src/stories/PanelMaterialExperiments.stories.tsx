import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { PanelMaterialExperimentsScene } from "./panel/PanelSecondaryScenes.js";

const meta = {
  title: "Lab/Panel Material Experiments",
  component: PanelMaterialExperimentsScene,
  args: {
    controls: true,
    initialRevealState: "open",
  },
  argTypes: {
    controls: {
      control: "boolean",
    },
    initialRevealState: {
      control: "inline-radio",
      options: ["open", "closed", "hidden"],
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PanelMaterialExperimentsScene>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const ClosedState: Story = {
  args: {
    controls: false,
    initialRevealState: "closed",
  },
};
