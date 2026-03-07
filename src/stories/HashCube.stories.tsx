import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { HashCube } from "../components/HashCube.js";
import { marathonDosPalette } from "../theme/marathonDosTheme.js";

const defaultHash = "8d7994e7c26d7594e54d314668f1b83e8f0d9d02";
const nearbyHash = "8d7994e7c26d7594e54d314668f1b83e8f0d9df0";
const alertHash = "f24723c0ffee9f4dff86b400d9ff67050f0f0f1c";

const meta = {
  title: "Effects/Hash Cube",
  component: HashCube,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    hash: defaultHash,
    label: "commit signature",
    size: 216,
    tone: "primary",
  },
  tags: ["autodocs"],
  render: (args) => (
    <Flex vertical gap={24} style={{ maxWidth: 1220, margin: "0 auto" }}>
      <Card style={heroCardStyle}>
        <Flex gap={32} wrap="wrap" align="center" justify="space-between">
          <Space direction="vertical" size={10} style={{ flex: "1 1 440px", maxWidth: 620 }}>
            <Typography.Text style={eyebrowStyle}>Deterministic Hash Geometry</Typography.Text>
            <Typography.Title level={1} className="marathon-text-display" style={titleStyle}>
              Let the hash become the artifact.
            </Typography.Title>
            <Typography.Paragraph style={copyStyle}>
              This prototype maps a hash onto a stable 3x3x3 voxel shell. Higher values push cubes
              solid, lower values drop them into wireframe or ghost states, and the hash also
              selects accent channels so the object feels encoded instead of randomly decorated.
            </Typography.Paragraph>
            <Typography.Paragraph style={copyStyle}>
              The camera motion is intentionally slow and mechanical. The point is to inspect the
              structure, not watch a disco cube have feelings.
            </Typography.Paragraph>
          </Space>

          <HashCube {...args} />
        </Flex>
      </Card>

      <Flex gap={24} wrap="wrap" align="stretch">
        <Card title="Short Commit Hash" style={cardStyle}>
          <Space direction="vertical" size={12}>
            <Typography.Text style={eyebrowStyle}>Seed Expansion</Typography.Text>
            <HashCube hash="8d7994e" label="abbreviated sha" size={176} />
            <Typography.Paragraph style={copyStyle}>
              Short hashes still resolve cleanly. Direct hex digits seed the first pass, then a
              deterministic expansion fills the rest of the volume so the object stays stable
              instead of collapsing into front-loaded noise.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Nearby Revisions" style={cardStyle}>
          <Space direction="vertical" size={12}>
            <Typography.Text style={eyebrowStyle}>Single Tail Change</Typography.Text>
            <Flex gap={16} wrap="wrap" align="center">
              <HashCube hash={defaultHash} label="revision a" showLegend={false} size={132} />
              <HashCube hash={nearbyHash} label="revision b" showLegend={false} size={132} />
            </Flex>
            <Typography.Paragraph style={copyStyle}>
              These hashes differ only at the tail, but the cube still rebalances. The structure is
              deterministic, just not sentimental.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Alternate Event Channel" style={violetCardStyle}>
          <Space direction="vertical" size={12}>
            <Typography.Text style={{ ...eyebrowStyle, color: marathonDosPalette.accentViolet }}>
              Secondary Tone
            </Typography.Text>
            <HashCube hash={alertHash} label="alert signature" size={176} tone="violet" />
            <Typography.Paragraph style={copyStyle}>
              The frame and dominant cube channel can shift to violet while the hash still pulls in
              warning and monochrome accents where it earns them.
            </Typography.Paragraph>
          </Space>
        </Card>
      </Flex>
    </Flex>
  ),
} satisfies Meta<typeof HashCube>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultHashCube: Story = {};

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
  lineHeight: 0.98,
  maxWidth: 560,
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
  flex: "1 1 360px",
};

const violetCardStyle: CSSProperties = {
  ...cardStyle,
  background:
    "linear-gradient(135deg, rgba(159, 77, 255, 0.16), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 52%), rgba(12, 12, 12, 0.96)",
  borderColor: "rgba(159, 77, 255, 0.42)",
};
