import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { HashCube } from "../components/HashCube.js";
import { signalPalette } from "../theme/signalTheme.js";

const defaultHash = "8d7994e7c26d7594e54d314668f1b83e8f0d9d02";
const nearbyHash = "8d7994e7c26d7594e54d314668f1b83e8f0d9df0";
const alertHash = "f24723c0ffee9f4dff86b400d9ff67050f0f0f1c";
const viewportListEntries = createViewportListEntries();

const meta = {
  title: "Lab/Hash Cube",
  component: HashCube,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    hash: defaultHash,
    label: "commit signature",
    renderMode: "viewport",
    size: 216,
    tone: "primary",
  },
  argTypes: {
    renderMode: {
      control: "inline-radio",
      options: ["viewport", "always"],
    },
  },
  tags: ["autodocs"],
  render: (args) => (
    <Flex vertical gap={24} style={{ maxWidth: 1220, margin: "0 auto" }}>
      <Card style={heroCardStyle}>
        <Flex gap={32} wrap="wrap" align="center" justify="space-between">
          <Space direction="vertical" size={10} style={{ flex: "1 1 440px", maxWidth: 620 }}>
            <Typography.Text style={eyebrowStyle}>Deterministic Hash Geometry</Typography.Text>
            <Typography.Title level={1} className="signal-ui-text-display" style={titleStyle}>
              Let the hash become the artifact.
            </Typography.Title>
            <Typography.Paragraph style={copyStyle}>
              This prototype maps a hash onto a stable 3x3x3 voxel shell. Higher values push cubes
              solid, lower values drop them into wireframe or ghost states, and the hash also
              selects accent channels so the object feels encoded instead of randomly decorated.
            </Typography.Paragraph>
            <Typography.Paragraph style={copyStyle}>
              Viewport rendering is now the default so long lists can use the component without
              mounting every cube at once. Use <code>renderMode=&quot;always&quot;</code> when a
              pinned hero or screenshot really does need the full scene immediately.
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
            <Typography.Text style={{ ...eyebrowStyle, color: signalPalette.accentViolet }}>
              Secondary Tone
            </Typography.Text>
            <HashCube hash={alertHash} label="alert signature" size={176} tone="violet" />
            <Typography.Paragraph style={copyStyle}>
              The frame and dominant cube channel can shift to violet while the hash still pulls in
              warning and monochrome accents where it earns them.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Pinned Artifact Opt-Out" style={cardStyle}>
          <Space direction="vertical" size={12}>
            <Typography.Text style={eyebrowStyle}>Always Render</Typography.Text>
            <HashCube
              hash="a11bf2d40de49b50836fe6139cb2766ce6ea664"
              label="release beacon"
              renderMode="always"
              size={176}
            />
            <Typography.Paragraph style={copyStyle}>
              Opt out when the cube is above the fold and expected to appear fully formed on first
              paint, like a hero panel or a documentation screenshot.
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

export const ViewportGatedList: Story = {
  render: () => (
    <Flex vertical gap={24} style={{ maxWidth: 1120, margin: "0 auto" }}>
      <Card style={heroCardStyle}>
        <Space direction="vertical" size={12}>
          <Typography.Text style={eyebrowStyle}>List Differentiation</Typography.Text>
          <Typography.Title level={2} style={listTitleStyle}>
            Scroll the result set and let each cube wake up only when it matters.
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            Every row keeps its layout footprint, but only cubes near the viewport mount the full
            voxel scene. That keeps the list legible without asking each consumer to wire its own
            observer plumbing.
          </Typography.Paragraph>
        </Space>
      </Card>

      <Card style={cardStyle}>
        <div style={listViewportStyle}>
          <Flex vertical gap={16}>
            {viewportListEntries.map((entry) => (
              <Card key={entry.id} style={listItemCardStyle}>
                <Flex gap={20} wrap="wrap" align="center" justify="space-between">
                  <Space direction="vertical" size={6} style={{ flex: "1 1 420px" }}>
                    <Typography.Text style={eyebrowStyle}>{entry.id}</Typography.Text>
                    <Typography.Title level={4} style={listItemTitleStyle}>
                      {entry.title}
                    </Typography.Title>
                    <Typography.Paragraph style={copyStyle}>{entry.detail}</Typography.Paragraph>
                  </Space>

                  <HashCube
                    hash={entry.hash}
                    label={entry.label}
                    showLegend={false}
                    size={132}
                  />
                </Flex>
              </Card>
            ))}
          </Flex>
        </div>
      </Card>
    </Flex>
  ),
};

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
  maxWidth: 560,
};

const copyStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.82)",
  margin: 0,
};

const listTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 640,
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

const listViewportStyle: CSSProperties = {
  height: 760,
  overflowY: "auto",
  paddingRight: 8,
};

const listItemCardStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.028), transparent 50%), rgba(10, 10, 10, 0.94)",
  borderColor: "rgba(255, 255, 255, 0.08)",
};

const listItemTitleStyle: CSSProperties = {
  margin: 0,
};

function createViewportListEntries() {
  return Array.from({ length: 18 }, (_, index) => {
    const sequence = index + 1;
    const suffix = sequence.toString(16).padStart(2, "0");
    const hash = `${defaultHash.slice(0, -2)}${suffix}`;

    return {
      detail: `Queue position ${sequence.toString().padStart(2, "0")} keeps the hash cube visible enough to distinguish neighboring rows without turning the whole list into a tiny GPU support group.`,
      hash,
      id: `RUN-${(4200 + sequence).toString()}`,
      label: `queue sample ${sequence.toString().padStart(2, "0")}`,
      title: `Artifact window ${suffix.toUpperCase()} / ${hash.slice(8, 14)}`,
    };
  });
}
