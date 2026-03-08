import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { PixelCubePath } from "../components/PixelCubePath.js";
import { signalPalette } from "../theme/signalTheme.js";

const meta = {
  title: "Effects/Pixel Cube Path",
  component: PixelCubePath,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    size: 220,
    tone: "primary",
    usage: "decorative",
  },
  tags: ["autodocs"],
  render: (args) => (
    <Flex vertical gap={24} style={{ maxWidth: 1220, margin: "0 auto" }}>
      <Card style={heroCardStyle}>
        <Flex gap={32} wrap="wrap" align="center" justify="space-between">
          <Space direction="vertical" size={10} style={{ flex: "1 1 420px", maxWidth: 620 }}>
            <Typography.Text style={eyebrowStyle}>Procedural Cube Sweep</Typography.Text>
            <Typography.Title level={1} className="signal-ui-text-display" style={titleStyle}>
              Flat. Symmetric. Alive.
            </Typography.Title>
            <Typography.Paragraph style={copyStyle}>
              This recasts the reference effect as a compact 3x3x3 voxel cube, keeps the flatter
              hard-edge geometry, and swaps hover-triggered glow for a deterministic path that
              continuously sweeps across the visible faces.
            </Typography.Paragraph>
          </Space>

          <PixelCubePath {...args} />
        </Flex>
      </Card>

      <Flex gap={24} wrap="wrap" align="stretch">
        <Card title="Violet Event Channel" style={violetCardStyle}>
          <Space direction="vertical" size={12}>
            <Typography.Text style={{ ...eyebrowStyle, color: signalPalette.accentViolet }}>
              Alternate Tone
            </Typography.Text>
            <PixelCubePath size={208} tone="violet" />
            <Typography.Paragraph style={copyStyle}>
              The same path logic rides the violet accent without inventing a new color API, which
              keeps the component aligned with the rest of the theme vocabulary.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Semantic Loader" style={cardStyle}>
          <Space direction="vertical" size={12}>
            <Typography.Text style={eyebrowStyle}>Accessible Status</Typography.Text>
            <PixelCubePath label="asset field is syncing" size={196} usage="loader" />
            <Typography.Paragraph style={copyStyle}>
              `usage=&quot;loader&quot;` keeps the same visual treatment but promotes the component
              into a real live status node for pending-state UI instead of decorative chrome.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Async Sweep Bank" style={cardStyle}>
          <Space direction="vertical" size={12}>
            <Typography.Text style={eyebrowStyle}>Desynced Instances</Typography.Text>
            <Flex gap={14} wrap="wrap">
              <PixelCubePath size={132} />
              <PixelCubePath size={132} />
              <PixelCubePath size={132} />
            </Flex>
            <Typography.Paragraph style={copyStyle}>
              Each instance seeds its own step cadence and phase offset, so the path keeps the
              same geometry while feeling closer to a jittery loader bank than a synchronized demo
              loop.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Tight Panel Fit" style={cardStyle}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Typography.Text style={eyebrowStyle}>Centered Under Constraint</Typography.Text>
            <div style={constraintDemoStyle}>
              <PixelCubePath size={188} />
            </div>
            <Typography.Paragraph style={copyStyle}>
              The component now collapses to the parent width instead of forcing a wider minimum
              box, so narrow panels keep the projection centered without custom wrapper layout.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Error Trace" style={errorCardStyle}>
          <Space direction="vertical" size={12}>
            <Typography.Text style={{ ...eyebrowStyle, color: signalPalette.error }}>
              Broken Path
            </Typography.Text>
            <PixelCubePath size={208} tone="error" />
            <Typography.Paragraph style={copyStyle}>
              `tone=&quot;error&quot;` swaps to the theme error channel and inserts pauses,
              dropped segments, and sharper jitter so the sweep reads as faulted rather than
              merely recolored.
            </Typography.Paragraph>
          </Space>
        </Card>
      </Flex>
    </Flex>
  ),
} satisfies Meta<typeof PixelCubePath>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultPixelCubePath: Story = {};

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

const errorCardStyle: CSSProperties = {
  ...cardStyle,
  background:
    "linear-gradient(135deg, rgba(242, 71, 35, 0.14), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 52%), rgba(12, 12, 12, 0.96)",
  borderColor: "rgba(242, 71, 35, 0.4)",
};

const constraintDemoStyle: CSSProperties = {
  width: 248,
  maxWidth: "100%",
  padding: "10px 0",
  border: "1px dashed rgba(245, 245, 240, 0.12)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 70%), rgba(255, 255, 255, 0.015)",
};
