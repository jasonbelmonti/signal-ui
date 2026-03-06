import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { marathonDosPalette } from "../theme/marathonDosTheme";

const meta = {
  title: "Effects/Signal Text",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  render: () => (
    <Flex vertical gap={24} style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Card
        style={{
          background:
            "linear-gradient(135deg, rgba(192, 254, 4, 0.08), transparent 28%), #090909",
          borderColor: "rgba(192, 254, 4, 0.38)",
        }}
      >
        <Space direction="vertical" size={12}>
          <Typography.Text style={eyebrowStyle}>Motion Texture / Signal Type</Typography.Text>
          <Typography.Title level={1} className="marathon-signal-text" style={heroStyle}>
            LV-426 UPLINK ONLINE
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            Procedural scan grain and restrained flicker live in the shared theme stylesheet, so
            this stays an opt-in text treatment rather than a bespoke one-off effect.
          </Typography.Paragraph>
        </Space>
      </Card>

      <Flex gap={24} wrap="wrap" align="stretch">
        <Card title="Inline Usage" style={cardStyle}>
          <Space direction="vertical" size={10}>
            <Typography.Text style={eyebrowStyle}>Default Signal</Typography.Text>
            <Typography.Paragraph style={copyStyle}>
              Mission status:
              {" "}
              <Typography.Text className="marathon-signal-text" style={inlineSignalStyle}>
                GREEN-LINE STABLE
              </Typography.Text>
            </Typography.Paragraph>
            <Typography.Paragraph style={copyStyle}>
              Reduced-motion mode keeps the same tone, but freezes the shimmer instead of blinking
              at the viewer like a tiny cursed microwave.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Scoped Override" style={cardStyle}>
          <Space direction="vertical" size={10}>
            <Typography.Text style={eyebrowStyle}>Local CSS Vars</Typography.Text>
            <Typography.Title level={2} className="marathon-signal-text" style={overrideStyle}>
              NOSTROMO FEED SYNCED
            </Typography.Title>
            <Typography.Paragraph style={copyStyle}>
              This example overrides only the local accent, glow, noise size, and flicker depth to
              prove the API can be customized per element without changing the base class.
            </Typography.Paragraph>
          </Space>
        </Card>
      </Flex>
    </Flex>
  ),
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultSignalText: Story = {};

type SignalStyle = CSSProperties & Record<`--marathon-fx-signal-${string}`, string | number>;

const eyebrowStyle: CSSProperties = {
  display: "block",
  color: marathonDosPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  marginBottom: 2,
  textTransform: "uppercase",
};

const heroStyle: CSSProperties = {
  margin: 0,
  lineHeight: 1.02,
};

const copyStyle: CSSProperties = {
  margin: 0,
  color: "rgba(245, 245, 240, 0.86)",
  maxWidth: 680,
};

const cardStyle: CSSProperties = {
  flex: "1 1 320px",
  minHeight: 240,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 52%), rgba(12, 12, 12, 0.94)",
};

const inlineSignalStyle: SignalStyle = {
  display: "inline-block",
  fontSize: 15,
  letterSpacing: "0.12em",
};

const overrideStyle: SignalStyle = {
  "--marathon-fx-signal-accent": "#74f1ff",
  "--marathon-fx-signal-glow": "rgba(116, 241, 255, 0.34)",
  "--marathon-fx-signal-noise-size": "108px",
  "--marathon-fx-signal-flicker-depth": 0.04,
  margin: 0,
};
