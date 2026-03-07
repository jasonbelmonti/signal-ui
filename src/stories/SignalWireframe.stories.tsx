import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { Panel } from "../components/Panel.js";
import { SignalWireframe } from "../components/SignalWireframe.js";
import { marathonDosPalette } from "../theme/marathonDosTheme.js";

const meta = {
  title: "Effects/Signal Wireframe",
  component: SignalWireframe,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    animated: true,
    detail: "orthogonal beam lattice",
    height: 420,
    label: "Animated signal wireframe with traced beams",
    showLegend: true,
    title: "wire trace field",
    tone: "primary",
    usage: "graphic",
  },
  tags: ["autodocs"],
  render: (args) => (
    <Flex vertical gap={24} style={{ maxWidth: 1280, margin: "0 auto" }}>
      <Card style={heroCardStyle}>
        <Flex gap={32} wrap="wrap" align="stretch" justify="space-between">
          <Space direction="vertical" size={10} style={{ flex: "1 1 420px", maxWidth: 560 }}>
            <Typography.Text style={eyebrowStyle}>Three.js Signal Spike</Typography.Text>
            <Typography.Title level={1} className="marathon-text-display" style={titleStyle}>
              Wireframe motion that actually earns the GPU
            </Typography.Title>
            <Typography.Paragraph style={copyStyle}>
              The scene stays boxed inside the Marathon shell, uses a hard-edged lattice instead
              of mushy particles, and traces beam segments across the geometry so it reads like a
              live system scan instead of random chrome. The computer yearns for the grid.
            </Typography.Paragraph>
          </Space>

          <div style={{ flex: "1 1 520px", minWidth: 320 }}>
            <SignalWireframe {...args} />
          </div>
        </Flex>
      </Card>

      <Flex gap={24} wrap="wrap" align="stretch">
        <Panel
          cutCornerPreset="tactical"
          style={{ ...panelStyle, flex: "1 1 380px" }}
          title="Violet Event Channel"
        >
          <Space direction="vertical" size={14} style={{ width: "100%" }}>
            <Typography.Text style={{ ...eyebrowStyle, color: marathonDosPalette.accentViolet }}>
              Alternate Tone
            </Typography.Text>
            <SignalWireframe
              animated
              detail="secondary uplink sweep"
              height={320}
              label="Animated violet wireframe trace scene"
              title="event lattice"
              tone="violet"
              usage="graphic"
            />
            <Typography.Paragraph style={copyStyle}>
              Tone stays semantic instead of turning into a raw color picker, which keeps the 3D
              layer aligned with the existing component API.
            </Typography.Paragraph>
          </Space>
        </Panel>

        <Card style={cardStyle} title="Embedded Surface">
          <Space direction="vertical" size={14} style={{ width: "100%" }}>
            <Typography.Text style={eyebrowStyle}>Compact Panel Mode</Typography.Text>
            <SignalWireframe
              animated={false}
              detail="static fallback frame"
              height={280}
              showLegend={false}
              tone="primary"
            />
            <Typography.Paragraph style={copyStyle}>
              This is the calmer embedded treatment for dashboard chrome or a future graph loading
              surface, without turning the whole page into a nightclub error. Restraint is a cruel
              but necessary manager.
            </Typography.Paragraph>
          </Space>
        </Card>
      </Flex>
    </Flex>
  ),
} satisfies Meta<typeof SignalWireframe>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultSignalWireframe: Story = {};

const eyebrowStyle: CSSProperties = {
  display: "block",
  color: marathonDosPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  marginBottom: 2,
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  lineHeight: 0.96,
  maxWidth: 520,
};

const copyStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.82)",
  margin: 0,
};

const heroCardStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(192, 254, 4, 0.12), transparent 32%), linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 52%), #090909",
  borderColor: "rgba(192, 254, 4, 0.38)",
};

const panelStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 52%), rgba(12, 12, 12, 0.96)",
};

const cardStyle: CSSProperties = {
  ...panelStyle,
  flex: "1 1 380px",
};
