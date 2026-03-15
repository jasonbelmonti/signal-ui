import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SignalButtonEffectsScene } from "./signalButton/SignalButtonSecondaryScenes.js";

const meta = {
  title: "Lab/Signal Button Effects",
  component: SignalButtonEffectsScene,
  tags: ["autodocs"],
} satisfies Meta<typeof SignalButtonEffectsScene>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
