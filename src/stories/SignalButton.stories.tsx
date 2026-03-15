import { ThunderboltOutlined } from "@ant-design/icons";
import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { SignalButton } from "../components/SignalButton.js";

const meta = {
  title: "Components/SignalButton",
  component: SignalButton,
  args: {
    block: true,
    children: "Launch Cycle",
    cooldownPercent: 0,
    edgeWidth: 24,
    fillPercent: 68,
    pulseBurst: 0,
    rewardColor: "#58e6ff",
    size: "large",
    tone: "primary",
    wakePercent: 0,
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["primary", "violet"],
    },
    cooldownPercent: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    rewardColor: {
      control: "text",
    },
    fillPercent: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    edgeWidth: {
      control: {
        type: "range",
        min: 14,
        max: 40,
        step: 1,
      },
    },
    wakePercent: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    pulseBurst: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
  },
  tags: ["autodocs"],
  render: (args) => (
    <Flex vertical gap={24} style={{ maxWidth: 820, margin: "0 auto" }}>
      <Card title="Control Surface" style={cardStyle}>
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <Typography.Paragraph style={copyStyle}>
            Tweak the exported surface directly from Controls to inspect fill, wake-up, pulse, and
            cooldown layers. Composed interaction recipes and effect studies now live under
            `Recipes` and `Lab` so this entry stays focused on the component API.
          </Typography.Paragraph>
          <div style={{ maxWidth: 420 }}>
            <SignalButton {...args} icon={<ThunderboltOutlined />}>
              {args.children}
            </SignalButton>
          </div>
        </Space>
      </Card>
    </Flex>
  ),
} satisfies Meta<typeof SignalButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const copyStyle: CSSProperties = {
  margin: 0,
  color: "rgba(245, 245, 240, 0.84)",
  maxWidth: 680,
};

const cardStyle: CSSProperties = {
  minHeight: 220,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 52%), rgba(12, 12, 12, 0.94)",
};
