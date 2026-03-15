import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { NavigationChromeScene } from "./navigationChrome/NavigationChromeScene.js";
import "./navigationChrome/navigationChrome.css";

const meta = {
  title: "Recipes/Navigation Chrome",
  component: NavigationChromeScene,
  args: {
    scenario: "top-navigation",
  },
  argTypes: {
    scenario: {
      control: "select",
      options: ["top-navigation", "workspace-shell", "mission-control"],
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationChromeScene>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TopNavigation: Story = {};

export const WorkspaceChrome: Story = {
  args: {
    scenario: "workspace-shell",
  },
};

export const MissionControl: Story = {
  args: {
    scenario: "mission-control",
  },
};
