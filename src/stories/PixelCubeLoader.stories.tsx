import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { PixelCubeLoader } from "../components/PixelCubeLoader.js";
import { signalPalette } from "../theme/signalTheme.js";

const meta = {
  title: "Components/PixelCubeLoader",
  component: PixelCubeLoader,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    detail: "collapse / expand / collapse",
    gridSize: 3,
    label: "volume loop",
    size: 168,
    tone: "primary",
  },
  tags: ["autodocs"],
  render: (args) => (
    <Flex vertical gap={24} style={{ maxWidth: 1220, margin: "0 auto" }}>
      <Card style={heroCardStyle}>
        <Flex gap={32} wrap="wrap" align="center" justify="space-between">
          <Space direction="vertical" size={10} style={{ flex: "1 1 420px", maxWidth: 620 }}>
            <Typography.Text style={eyebrowStyle}>Loading / Dimensional Reveal</Typography.Text>
            <Typography.Title level={1} className="signal-ui-text-display" style={titleStyle}>
              Collapse. Expand. Snap.
            </Typography.Title>
            <Typography.Paragraph style={copyStyle}>
              The loader now lives in a square frame, cycles continuously, and behaves more like a
              mechanical volume lock: collapsed front plane, full 3D expansion, a little jerk into
              position, then back down to flat.
            </Typography.Paragraph>
          </Space>

          <PixelCubeLoader {...args} />
        </Flex>
      </Card>

      <Flex gap={24} wrap="wrap" align="stretch">
        <Card title="Queue Panel Fit" style={cardStyle}>
          <Flex gap={18} align="center" wrap="wrap">
            <PixelCubeLoader
              detail="compact loop"
              gridSize={2}
              label="asset 04"
              size={104}
              style={{ flexShrink: 0 }}
            />

            <Space direction="vertical" size={6} style={{ maxWidth: 360 }}>
              <Typography.Text style={eyebrowStyle}>Compact Usage</Typography.Text>
              <Typography.Paragraph style={copyStyle}>
                The compact panel version stays square and drops to a 2x2 front grid so it still
                reads as a chunky status icon instead of a tiny cube museum.
              </Typography.Paragraph>
              <Typography.Text style={statusStyle}>Operator queue / shell alignment 78%</Typography.Text>
            </Space>
          </Flex>
        </Card>

        <Card title="Alternate Event Channel" style={violetCardStyle}>
          <Flex gap={18} align="center" wrap="wrap">
            <PixelCubeLoader
              detail="phase loop"
              gridSize={3}
              label="rift echo"
              size={128}
              tone="violet"
            />

            <Space direction="vertical" size={6} style={{ maxWidth: 360 }}>
              <Typography.Text style={{ ...eyebrowStyle, color: signalPalette.accentViolet }}>
                Secondary Tone
              </Typography.Text>
              <Typography.Paragraph style={copyStyle}>
                The same voxel rig can ride the violet event channel when it needs to signal a
                distinct feed without replacing the default lime interaction language.
              </Typography.Paragraph>
              <Typography.Text style={{ ...statusStyle, color: signalPalette.accentViolet }}>
                Slipstream cache / face rotation locked
              </Typography.Text>
            </Space>
          </Flex>
        </Card>

        <Card title="Inline Mini" style={cardStyle}>
          <Space direction="vertical" size={10}>
            <Typography.Text style={eyebrowStyle}>Legendless</Typography.Text>
            <Typography.Paragraph style={copyStyle}>
              Mission status{" "}
              <PixelCubeLoader
                detail="inline volume loop"
                gridSize={2}
                label="inline mesh"
                showLegend={false}
                size={34}
                style={{ marginInline: 8 }}
              />
              awaiting uplink confirmation.
            </Typography.Paragraph>
            <Typography.Paragraph style={copyStyle}>
              This keeps the square frame and the looping motion, but strips the legend so it can
              sit inline with copy or next to a status label without taking over the row.
            </Typography.Paragraph>
          </Space>
        </Card>
      </Flex>
    </Flex>
  ),
} satisfies Meta<typeof PixelCubeLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const eyebrowStyle: CSSProperties = {
  display: "block",
  color: signalPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  marginBottom: 2,
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  lineHeight: 0.98,
  maxWidth: 520,
};

const copyStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.82)",
  margin: 0,
};

const statusStyle: CSSProperties = {
  color: signalPalette.primary,
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const heroCardStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(192, 254, 4, 0.12), transparent 32%), linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 52%), #090909",
  borderColor: "rgba(192, 254, 4, 0.38)",
};

const cardStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 52%), rgba(12, 12, 12, 0.96)",
  flex: "1 1 380px",
};

const violetCardStyle: CSSProperties = {
  ...cardStyle,
  background:
    "linear-gradient(135deg, rgba(159, 77, 255, 0.16), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 52%), rgba(12, 12, 12, 0.96)",
  borderColor: "rgba(159, 77, 255, 0.42)",
};
