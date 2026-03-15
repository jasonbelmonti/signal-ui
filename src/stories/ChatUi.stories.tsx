import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ChatUiScene } from "./chatUi/ChatUiScene.js";
import "./chatUi/chatUi.css";

const meta = {
  title: "Recipes/Chat UI",
  id: "patterns-chat-ui",
  component: ChatUiScene,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatUiScene>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
