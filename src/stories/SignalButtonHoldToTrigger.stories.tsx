import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SignalButtonHoldToTriggerScene } from "./signalButton/SignalButtonSecondaryScenes.js";

const meta = {
  title: "Recipes/Signal Button Hold-to-Trigger",
  component: SignalButtonHoldToTriggerScene,
  tags: ["autodocs"],
} satisfies Meta<typeof SignalButtonHoldToTriggerScene>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
