import { Card, Col, Row, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SignalProgressMeter } from "../components/SignalProgressMeter.js";

const meta = {
  title: "Components/SignalProgressMeter",
  component: SignalProgressMeter,
  args: {
    completed: false,
    completionLabel: "seal verified",
    label: "Transfer Progress",
    progress: 64,
    segmentCount: 24,
    showPercent: true,
    tone: "primary",
    variant: "flat",
  },
  argTypes: {
    progress: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    segmentCount: {
      control: {
        type: "range",
        min: 8,
        max: 32,
        step: 2,
      },
    },
    tone: {
      control: "inline-radio",
      options: ["primary", "violet"],
    },
    variant: {
      control: "inline-radio",
      options: ["flat", "splash"],
    },
    completed: {
      control: "boolean",
    },
    completionLabel: {
      control: "text",
    },
  },
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <SignalProgressMeter {...args} />
    </div>
  ),
} satisfies Meta<typeof SignalProgressMeter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EmbeddedStates: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="Compact Row">
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Typography.Text>Cache shard rebuild is streaming in the background.</Typography.Text>
            <SignalProgressMeter label="Shard 4 / 7" progress={42} segmentCount={18} />
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Quiet Secondary Lane">
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Typography.Text>
              Same meter, less panel ceremony. Small enough to live beside status copy.
            </Typography.Text>
            <SignalProgressMeter
              label="Envelope routing"
              progress={81}
              segmentCount={16}
              tone="violet"
            />
          </Space>
        </Card>
      </Col>
    </Row>
  ),
};

export const SplashVariants: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="Primary Splash">
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Typography.Text>
              Faux-3D wireframe cells for the loader when you want a little extra theater.
            </Typography.Text>
            <SignalProgressMeter
              label="Field uplink"
              progress={58}
              segmentCount={18}
              variant="splash"
            />
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Violet Splash">
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Typography.Text>
              Same meter, alternate tone. Slightly sci-fi, but still compact enough to behave.
            </Typography.Text>
            <SignalProgressMeter
              label="Phase spool"
              progress={83}
              segmentCount={16}
              tone="violet"
              variant="splash"
            />
          </Space>
        </Card>
      </Col>
    </Row>
  ),
};

export const CompletedSplash: Story = {
  args: {
    completed: true,
    completionLabel: "seal verified",
    progress: 100,
    segmentCount: 24,
    variant: "splash",
  },
};
