import { Col, Row, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { Panel } from "../components/Panel.js";
import { signalPalette } from "../theme/signalTheme.js";

type SignalReadoutStyle = CSSProperties &
  Record<`--signal-ui-fx-signal-${string}`, string | number>;

const meta = {
  title: "Components/Panel",
  component: Panel,
  args: {
    title: "Signal Panel",
    cutCornerPreset: "tactical",
  },
  argTypes: {
    cutCornerPreset: {
      control: "inline-radio",
      options: ["tactical", "architectural"],
    },
    cutCorner: {
      control: "inline-radio",
      options: ["accent", "notch"],
    },
    cutCornerPlacement: {
      control: "select",
      options: ["top-left", "top-right", "bottom-left", "bottom-right"],
    },
    cutCornerSize: {
      control: {
        type: "range",
        min: 16,
        max: 40,
        step: 2,
      },
    },
    cutCornerColor: {
      control: "color",
    },
    frame: {
      control: "inline-radio",
      options: ["reticle"],
    },
    frameColor: {
      control: "color",
    },
    frameSize: {
      control: {
        type: "range",
        min: 18,
        max: 44,
        step: 2,
      },
    },
  },
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ maxWidth: 540 }}>
      <Panel {...args}>
        <Space direction="vertical" size={10}>
          <Typography.Text style={eyebrowStyle}>Optional Panel Treatment</Typography.Text>
          <Typography.Paragraph style={{ margin: 0 }}>
            Presets give the system a shared diagonal vocabulary, while the raw cut-corner props
            still let you override placement, size, and color when a panel needs special handling.
          </Typography.Paragraph>
        </Space>
      </Panel>
    </div>
  ),
} satisfies Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PresetPairs: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Panel title="Tactical Preset" cutCornerPreset="tactical" style={{ height: "100%" }}>
          <Typography.Paragraph style={{ margin: 0 }}>
            Accent triangle at the top-right for operator tags, telemetry modules, and more active
            surfaces.
          </Typography.Paragraph>
        </Panel>
      </Col>
      <Col xs={24} md={12}>
        <Panel
          title="Architectural Preset"
          cutCornerPreset="architectural"
          cutCornerColor={signalPalette.accentViolet}
          style={{ height: "100%" }}
        >
          <Typography.Paragraph style={{ margin: 0 }}>
            Notched lower corner for quieter structure, with an optional accent tint when the panel
            belongs to a special lane.
          </Typography.Paragraph>
        </Panel>
      </Col>
    </Row>
  ),
};

export const CornerRhythm: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      {cornerPanels.map((panel) => (
        <Col xs={24} md={12} key={`${panel.cutCorner}-${panel.cutCornerPlacement}`}>
          <Panel
            title={panel.title}
            cutCornerPreset={panel.cutCornerPreset}
            cutCorner={panel.cutCorner}
            cutCornerPlacement={panel.cutCornerPlacement}
            cutCornerColor={panel.cutCornerColor}
            style={{ height: "100%" }}
          >
            <Typography.Paragraph style={{ margin: 0 }}>
              {panel.copy}
            </Typography.Paragraph>
          </Panel>
        </Col>
      ))}
    </Row>
  ),
};

export const ReticleFrame: Story = {
  args: {
    title: "Target Vector",
    frame: "reticle",
    frameColor: signalPalette.primary,
    frameSize: 28,
    cutCornerPreset: "tactical",
  },
  render: (args) => (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={14}>
        <Panel {...args}>
          <Space direction="vertical" size={14} style={{ width: "100%" }}>
            <div>
              <Typography.Text style={eyebrowStyle}>Signal Lock</Typography.Text>
              <div className="signal-ui-signal-text" style={reticleReadoutStyle}>
                active target relay
              </div>
            </div>

            <Typography.Paragraph style={{ margin: 0 }}>
              The reticle frame uses the same sweep, scanline, and phosphor-noise language as
              SignalText, but applies it to the panel surface so a key module feels actively
              acquired instead of merely highlighted.
            </Typography.Paragraph>

            <Row gutter={[12, 12]}>
              {reticleMetrics.map((metric) => (
                <Col xs={24} sm={8} key={metric.label}>
                  <div style={metricBlockStyle}>
                    <Typography.Text style={metricLabelStyle}>{metric.label}</Typography.Text>
                    <div className="signal-ui-signal-text" style={metricValueStyle}>
                      {metric.value}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Space>
        </Panel>
      </Col>

      <Col xs={24} lg={10}>
        <Panel
          title="Secondary Lock"
          frame="reticle"
          frameColor={signalPalette.accentViolet}
          frameSize={24}
          cutCorner="notch"
          cutCornerPlacement="bottom-left"
          cutCornerColor={signalPalette.accentViolet}
          style={{ height: "100%" }}
        >
          <Space direction="vertical" size={12}>
            <Typography.Text style={{ ...eyebrowStyle, color: signalPalette.accentViolet }}>
              Alternate Channel
            </Typography.Text>
            <div className="signal-ui-signal-text" style={violetReticleReadoutStyle}>
              cross-lane sync
            </div>
            <Typography.Paragraph style={{ margin: 0 }}>
              The reticle brackets still read cleanly when combined with the quieter architectural
              notch, so the frame can carry more presence without turning every panel into a
              warning state.
            </Typography.Paragraph>
          </Space>
        </Panel>
      </Col>
    </Row>
  ),
};

const eyebrowStyle = {
  display: "block",
  marginBottom: 6,
  color: signalPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
};

const cornerPanels = [
  {
    title: "Top-Right Accent",
    cutCornerPreset: "tactical" as const,
    cutCorner: "accent" as const,
    cutCornerPlacement: "top-right" as const,
    cutCornerColor: signalPalette.primary,
    copy: "Reads like a tactical tag bolted onto the panel frame.",
  },
  {
    title: "Top-Left Accent",
    cutCornerPreset: "tactical" as const,
    cutCorner: "accent" as const,
    cutCornerPlacement: "top-left" as const,
    cutCornerColor: signalPalette.warning,
    copy: "Good when a stack needs a directional lean without changing the whole shape.",
  },
  {
    title: "Bottom-Right Notch",
    cutCornerPreset: "architectural" as const,
    cutCorner: "notch" as const,
    cutCornerPlacement: "bottom-right" as const,
    cutCornerColor: signalPalette.primary,
    copy: "Feels more architectural than decorative and keeps the panel quieter.",
  },
  {
    title: "Bottom-Left Notch",
    cutCornerPreset: "architectural" as const,
    cutCorner: "notch" as const,
    cutCornerPlacement: "bottom-left" as const,
    cutCornerColor: signalPalette.accentViolet,
    copy: "Lets violet behave like a special-state accent instead of a default token.",
  },
];

const reticleReadoutStyle: SignalReadoutStyle = {
  "--signal-ui-fx-signal-accent": signalPalette.primary,
  "--signal-ui-fx-signal-glow": "rgb(var(--signal-ui-primary-rgb) / 0.4)",
  fontSize: 24,
  letterSpacing: "0.16em",
  lineHeight: 0.98,
};

const violetReticleReadoutStyle: SignalReadoutStyle = {
  ...reticleReadoutStyle,
  "--signal-ui-fx-signal-accent": signalPalette.accentViolet,
  "--signal-ui-fx-signal-glow": "rgba(159, 77, 255, 0.34)",
  fontSize: 20,
};

const metricBlockStyle: CSSProperties = {
  padding: "10px 12px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.02)",
};

const metricLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: "rgba(245, 245, 240, 0.72)",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const metricValueStyle: CSSProperties = {
  fontSize: 18,
  letterSpacing: "0.14em",
  lineHeight: 1,
};

const reticleMetrics = [
  { label: "Vector", value: "A17" },
  { label: "Drift", value: "0.4°" },
  { label: "Sweep", value: "SYNC" },
];
