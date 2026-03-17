import { Col, Row, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Panel } from "../components/Panel.js";
import { signalPalette } from "../theme/signalTheme.js";
import {
  HolographicRevealDemo,
  ReticleFrameDemo,
} from "./panel/PanelReferenceScenes.js";
import { eyebrowStyle } from "./panel/panelStoryShared.js";

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
    surface: {
      control: "inline-radio",
      options: ["glass"],
    },
    surfaceColor: {
      control: "color",
    },
    surfaceBlur: {
      control: {
        type: "range",
        min: 12,
        max: 48,
        step: 2,
      },
    },
    reveal: {
      control: "inline-radio",
      options: ["holographic"],
    },
    revealColor: {
      control: "color",
    },
    revealIntro: {
      control: "inline-radio",
      options: ["point"],
    },
    revealOutro: {
      control: "inline-radio",
      options: ["point"],
    },
    revealState: {
      control: "inline-radio",
      options: ["open", "closed", "hidden"],
    },
    cursorTilt: {
      control: "boolean",
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
            <Typography.Paragraph style={{ margin: 0 }}>{panel.copy}</Typography.Paragraph>
          </Panel>
        </Col>
      ))}
    </Row>
  ),
};

export const HolographicReveal: Story = {
  render: () => <HolographicRevealDemo />,
};

export const CursorTilt: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Panel
          title="Live Telemetry"
          cursorTilt
          cutCornerPreset="tactical"
          frame="reticle"
          frameColor={signalPalette.primary}
        >
          <Space direction="vertical" size={12}>
            <Typography.Text style={eyebrowStyle}>Opt-in Pointer Response</Typography.Text>
            <Typography.Paragraph style={{ margin: 0 }}>
              The panel tilts a few degrees toward the cursor, just enough to give the surface
              some depth without making it feel like a haunted trading card.
            </Typography.Paragraph>
          </Space>
        </Panel>
      </Col>

      <Col xs={24} lg={12}>
        <Panel
          title="Relay Envelope"
          cursorTilt
          cutCornerPreset="architectural"
          cutCornerColor={signalPalette.accentViolet}
          frame="reticle"
          frameColor={signalPalette.accentViolet}
          reveal="holographic"
          revealIntro="point"
          revealState="open"
        >
          <Space direction="vertical" size={12}>
            <Typography.Text style={{ ...eyebrowStyle, color: signalPalette.accentViolet }}>
              Compatible With Holographic Reveal
            </Typography.Text>
            <Typography.Paragraph style={{ margin: 0 }}>
              The tilt plane wraps the reveal shell, so the beam and edge traces move with the
              panel instead of peeling off like cheap sci-fi wallpaper.
            </Typography.Paragraph>
          </Space>
        </Panel>
      </Col>
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
  render: (args) => <ReticleFrameDemo {...args} />,
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
