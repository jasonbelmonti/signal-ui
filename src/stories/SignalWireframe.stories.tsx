import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { Panel } from "../components/Panel.js";
import { SignalWireframe } from "../components/SignalWireframe.js";
import { signalPalette } from "../theme/signalTheme.js";

const viewportStackEntries = createViewportStackEntries();

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
    renderMode: "viewport",
    showLegend: true,
    title: "wire trace field",
    tone: "primary",
    usage: "graphic",
  },
  argTypes: {
    renderMode: {
      control: "inline-radio",
      options: ["viewport", "always"],
    },
  },
  tags: ["autodocs"],
  render: (args) => (
    <Flex vertical gap={24} style={{ maxWidth: 1280, margin: "0 auto" }}>
      <Card style={heroCardStyle}>
        <Flex gap={32} wrap="wrap" align="stretch" justify="space-between">
          <Space direction="vertical" size={10} style={{ flex: "1 1 420px", maxWidth: 560 }}>
            <Typography.Text style={eyebrowStyle}>Three.js Signal Spike</Typography.Text>
            <Typography.Title level={1} className="signal-ui-text-display" style={titleStyle}>
              Wireframe motion that actually earns the GPU
            </Typography.Title>
            <Typography.Paragraph style={copyStyle}>
              The scene stays boxed inside the shared shell, uses a hard-edged lattice instead of
              mushy particles, and traces beam segments across the geometry so it reads like a
              live system scan instead of random chrome. The computer yearns for the grid.
            </Typography.Paragraph>
            <Typography.Paragraph style={copyStyle}>
              Viewport rendering is now the default, so consuming apps can stack these without
              managing their own observer plumbing. Use{" "}
              <code>renderMode=&quot;always&quot;</code> when the canvas is part of the first paint
              and should mount immediately.
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
            <Typography.Text style={{ ...eyebrowStyle, color: signalPalette.accentViolet }}>
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

        <Card style={cardStyle} title="Pinned Hero Opt-Out">
          <Space direction="vertical" size={14} style={{ width: "100%" }}>
            <Typography.Text style={eyebrowStyle}>Always Render</Typography.Text>
            <SignalWireframe
              animated
              detail="hero lattice mount"
              height={300}
              renderMode="always"
              showLegend={false}
              tone="primary"
            />
            <Typography.Paragraph style={copyStyle}>
              Use the opt-out when the scene is intentionally above the fold and should mount as
              part of the opening surface rather than waiting for viewport confirmation.
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

export const ViewportGatedStack: Story = {
  render: () => (
    <Flex vertical gap={24} style={{ maxWidth: 1180, margin: "0 auto" }}>
      <Card style={heroCardStyle}>
        <Space direction="vertical" size={12}>
          <Typography.Text style={eyebrowStyle}>Viewport Gated Stack</Typography.Text>
          <Typography.Title level={2} style={stackTitleStyle}>
            Scroll through a wireframe stack without mounting every Three.js canvas at once.
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            Each row keeps its frame and supporting copy mounted, but only wireframes near the
            viewport instantiate their canvas scene.
          </Typography.Paragraph>
        </Space>
      </Card>

      <Card style={cardStyle}>
        <div style={stackViewportStyle}>
          <Flex vertical gap={16}>
            {viewportStackEntries.map((entry) => (
              <Card key={entry.id} style={stackItemCardStyle}>
                <Flex gap={20} wrap="wrap" align="stretch" justify="space-between">
                  <Space direction="vertical" size={6} style={{ flex: "1 1 360px" }}>
                    <Typography.Text style={eyebrowStyle}>{entry.id}</Typography.Text>
                    <Typography.Title level={4} style={stackItemTitleStyle}>
                      {entry.title}
                    </Typography.Title>
                    <Typography.Paragraph style={copyStyle}>{entry.detail}</Typography.Paragraph>
                  </Space>

                  <div style={{ flex: "1 1 360px", minWidth: 280 }}>
                    <SignalWireframe
                      animated
                      detail={entry.legend}
                      height={220}
                      showLegend={false}
                      tone={entry.tone}
                    />
                  </div>
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
  lineHeight: 0.96,
  maxWidth: 520,
};

const copyStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.82)",
  margin: 0,
};

const stackTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 680,
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

const stackViewportStyle: CSSProperties = {
  height: 780,
  overflowY: "auto",
  paddingRight: 8,
};

const stackItemCardStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.028), transparent 50%), rgba(10, 10, 10, 0.94)",
  borderColor: "rgba(255, 255, 255, 0.08)",
};

const stackItemTitleStyle: CSSProperties = {
  margin: 0,
};

function createViewportStackEntries() {
  return Array.from({ length: 12 }, (_, index) => {
    const sequence = index + 1;
    const tone = sequence % 3 === 0 ? "violet" : "primary";

    return {
      detail: `Stack row ${sequence.toString().padStart(2, "0")} keeps the scene available for differentiation while avoiding the cost of keeping a whole corridor of canvases live at once.`,
      id: `WIRE-${(7300 + sequence).toString()}`,
      legend: tone === "violet" ? "event lattice" : "signal lattice",
      title: `Trace corridor ${sequence.toString().padStart(2, "0")} / ${tone === "violet" ? "event band" : "primary band"}`,
      tone,
    } as const;
  });
}
