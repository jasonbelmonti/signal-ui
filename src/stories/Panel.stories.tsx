import { Button, Col, Flex, Row, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { Panel } from "../components/Panel.js";
import type { PanelProps } from "../components/Panel.js";
import { SignalBackdrop } from "../components/SignalBackdrop.js";
import type { SignalBackdropStyle } from "../components/SignalBackdrop.js";
import { signalPalette } from "../theme/signalTheme.js";

type SignalReadoutStyle = CSSProperties &
  Record<`--signal-ui-fx-signal-${string}`, string | number>;

type RevealState = NonNullable<PanelProps["revealState"]>;

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

function HolographicRevealDemo() {
  const [revealState, setRevealState] = useState<RevealState>("open");
  const [isAutoCycling, setIsAutoCycling] = useState(false);

  useEffect(() => {
    if (!isAutoCycling) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRevealState((current) => getNextRevealState(current));
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, [isAutoCycling]);

  return (
    <div style={holographicStageStyle}>
      <SignalBackdrop
        animated
        density="high"
        focusPoint={{ radius: 0.32, strength: 0.78, x: 0.62, y: 0.34 }}
        height="100%"
        telemetry={{
          activity: 0.62,
          alert: 0.18,
          focus: 0.74,
        }}
        style={holographicBackdropStyle}
        tone="primary"
      />
      <div aria-hidden="true" style={holographicStageScrimStyle} />

      {holographicGhostPanels.map((panel) => (
        <div key={panel.title} style={{ ...holographicGhostPanelStyle, ...panel.position }}>
          <Typography.Text style={holographicGhostEyebrowStyle}>{panel.eyebrow}</Typography.Text>
          <div className="signal-ui-signal-text" style={holographicGhostTitleStyle}>
            {panel.title}
          </div>
          <Typography.Paragraph style={holographicGhostCopyStyle}>
            {panel.copy}
          </Typography.Paragraph>
        </div>
      ))}

      <div style={holographicContentStyle}>
        <Flex align="center" gap={12} justify="space-between" wrap="wrap" style={{ marginBottom: 18 }}>
          <div>
            <Typography.Text style={eyebrowStyle}>Holographic Reveal / Glass Surface</Typography.Text>
            <Typography.Title
              level={4}
              className="signal-ui-text-display"
              style={holographicTitleStyle}
            >
              Holographic Reveal Surface
            </Typography.Title>
          </div>

          <Space wrap>
            <Button
              onClick={() => {
                setIsAutoCycling(false);
                setRevealState("open");
              }}
              type={revealState === "open" ? "primary" : "default"}
            >
              Open
            </Button>
            <Button
              onClick={() => {
                setIsAutoCycling(false);
                setRevealState("closed");
              }}
              type={revealState === "closed" ? "primary" : "default"}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsAutoCycling(false);
                setRevealState("hidden");
              }}
              type={revealState === "hidden" ? "primary" : "default"}
            >
              Hide
            </Button>
            <Button onClick={() => setIsAutoCycling((current) => !current)}>
              {isAutoCycling ? "Stop Loop" : "Auto Cycle"}
            </Button>
          </Space>
        </Flex>

        <div style={holographicPanelWrapStyle}>
          <Panel
            cutCorner="notch"
            cutCornerColor={signalPalette.primary}
            cutCornerPlacement="bottom-left"
            frame="reticle"
            frameColor={signalPalette.primary}
            frameSize={30}
            reveal="holographic"
            revealColor={signalPalette.primary}
            revealIntro="point"
            revealOutro="point"
            revealState={revealState}
            surface="glass"
            surfaceBlur={12}
            style={holographicPanelStyle}
            title="Docking Aperture"
          >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div>
                <Typography.Text style={eyebrowStyle}>Pixel Materialization</Typography.Text>
                <div className="signal-ui-signal-text" style={reticleReadoutStyle}>
                  dock gate 02
                </div>
              </div>

              <Typography.Paragraph style={{ margin: 0 }}>
                This reference scene isolates the supported reveal shell, glass surface, and pixel
                veil on a single panel so the effect can be judged without the larger recipe and
                lab compositions around it.
              </Typography.Paragraph>

              <Row gutter={[12, 12]}>
                {holographicMetrics.map((metric) => (
                  <Col key={metric.label} sm={8} xs={24}>
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
        </div>
      </div>
    </div>
  );
}

function ReticleFrameDemo(args: PanelProps) {
  const [revealState, setRevealState] = useState<"open" | "closed" | "hidden">("open");
  const [isAutoCycling, setIsAutoCycling] = useState(false);

  useEffect(() => {
    if (!isAutoCycling) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRevealState((current) => getNextRevealState(current));
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, [isAutoCycling]);

  return (
    <Space direction="vertical" size={18} style={{ width: "100%" }}>
      <Flex align="center" gap={12} justify="space-between" wrap="wrap">
        <div>
          <Typography.Text style={eyebrowStyle}>Reticle Frame / Reveal Harness</Typography.Text>
          <Typography.Title level={4} className="signal-ui-text-display" style={{ margin: 0 }}>
            Reticle Frame States
          </Typography.Title>
        </div>

        <Space wrap>
          <Button
            onClick={() => {
              setIsAutoCycling(false);
              setRevealState("open");
            }}
            type={revealState === "open" ? "primary" : "default"}
          >
            Open
          </Button>
          <Button
            onClick={() => {
              setIsAutoCycling(false);
              setRevealState("closed");
            }}
            type={revealState === "closed" ? "primary" : "default"}
          >
            Collapse
          </Button>
          <Button
            onClick={() => {
              setIsAutoCycling(false);
              setRevealState("hidden");
            }}
            type={revealState === "hidden" ? "primary" : "default"}
          >
            Hide
          </Button>
          <Button onClick={() => setIsAutoCycling((current) => !current)}>
            {isAutoCycling ? "Stop Loop" : "Auto Cycle"}
          </Button>
        </Space>
      </Flex>

      <Panel
        {...args}
        cutCornerPreset={args.cutCornerPreset ?? "tactical"}
        frame="reticle"
        frameColor={args.frameColor ?? signalPalette.primary}
        frameSize={args.frameSize ?? 28}
        reveal="holographic"
        revealColor={args.frameColor ?? signalPalette.primary}
        revealIntro="point"
        revealOutro="point"
        revealState={revealState}
        style={{
          minHeight: 280,
          ...(args.style ?? {}),
        }}
      >
        <Space direction="vertical" size={14} style={{ width: "100%" }}>
          <div>
            <Typography.Text style={eyebrowStyle}>Signal Lock</Typography.Text>
            <div className="signal-ui-signal-text" style={reticleReadoutStyle}>
              active target relay
            </div>
          </div>

          <Typography.Paragraph style={{ margin: 0 }}>
            Use this story to inspect the reticle shell across open, collapsed, and hidden states
            without layering in the larger modal or material experiments.
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
    </Space>
  );
}

function getNextRevealState(current: "open" | "closed" | "hidden") {
  if (current === "open") {
    return "closed";
  }

  if (current === "closed") {
    return "hidden";
  }

  return "open";
}

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

const holographicStageStyle: CSSProperties = {
  position: "relative",
  maxWidth: 860,
  minHeight: 560,
  overflow: "hidden",
  padding: 24,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  background:
    "radial-gradient(circle at top, rgb(var(--signal-ui-primary-rgb) / 0.12), transparent 44%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 48%), #070808",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 18px 40px rgba(0, 0, 0, 0.28)",
};

const holographicBackdropStyle: SignalBackdropStyle = {
  position: "absolute",
  inset: 0,
};

const holographicStageScrimStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "linear-gradient(180deg, rgba(3, 4, 6, 0.14), rgba(3, 4, 6, 0.42)), radial-gradient(circle at center, rgba(6, 8, 10, 0), rgba(4, 6, 8, 0.44) 70%, rgba(4, 6, 8, 0.72) 100%)",
};

const holographicContentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "100%",
};

const holographicTitleStyle: CSSProperties = {
  margin: 0,
};

const holographicPanelWrapStyle: CSSProperties = {
  width: "min(640px, 100%)",
  marginInline: "auto",
  marginTop: "auto",
  marginBottom: "auto",
};

const holographicPanelStyle: CSSProperties = {
  minHeight: 320,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 44%), rgba(7, 7, 7, 0.9)",
  backdropFilter: "blur(12px)",
};

const holographicGhostPanelStyle: CSSProperties = {
  position: "absolute",
  zIndex: 0,
  width: 220,
  padding: "14px 16px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 52%), rgba(7, 11, 15, 0.38)",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 24px rgba(192, 254, 4, 0.08)",
};

const holographicGhostEyebrowStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: "rgba(245, 245, 240, 0.7)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const holographicGhostTitleStyle: SignalReadoutStyle = {
  "--signal-ui-fx-signal-accent": signalPalette.primary,
  "--signal-ui-fx-signal-glow": "rgb(var(--signal-ui-primary-rgb) / 0.24)",
  fontSize: 17,
  letterSpacing: "0.14em",
  lineHeight: 1,
};

const holographicGhostCopyStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(245, 245, 240, 0.72)",
  fontSize: 12,
};

const reticleMetrics = [
  { label: "Vector", value: "A17" },
  { label: "Drift", value: "0.4°" },
  { label: "Sweep", value: "SYNC" },
];

const holographicMetrics = [
  { label: "Blur", value: "22PX" },
  { label: "Bloom", value: "SYNC" },
  { label: "Pixel Rail", value: "LOCK" },
];

const holographicGhostPanels = [
  {
    title: "nav mesh",
    eyebrow: "Background telemetry",
    copy: "Live pathing and contour geometry stay visible behind the glass so the blur has real signal to chew on.",
    position: {
      left: 20,
      top: 132,
      transform: "rotate(-4deg)",
    } satisfies CSSProperties,
  },
  {
    title: "sync lattice",
    eyebrow: "Procedural lane",
    copy: "Those ghost panels are intentionally left underneath the stage so the surface reads as a material, not just another painted texture.",
    position: {
      right: 24,
      bottom: 74,
      transform: "rotate(4deg)",
    } satisfies CSSProperties,
  },
];
