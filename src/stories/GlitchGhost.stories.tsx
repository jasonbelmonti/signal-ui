import { Button, Col, Flex, Row, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { GlitchGhost } from "../components/GlitchGhost.js";
import type { GlitchGhostProps } from "../components/GlitchGhost.js";
import { Panel } from "../components/Panel.js";
import { SignalBackdrop } from "../components/SignalBackdrop.js";
import type { SignalBackdropStyle } from "../components/SignalBackdrop.js";
import { signalPalette } from "../theme/signalTheme.js";

const meta = {
  title: "Components/GlitchGhost",
  component: GlitchGhost,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    animated: true,
    blendMode: "screen",
    blur: 0.85,
    children: null,
    depth: 18,
    ghostColor: signalPalette.primary,
    ghostCount: 3,
    ghostOpacity: 0.42,
    mask: "signal",
    offsetX: 12,
    offsetY: 7,
    perspective: 580,
    tiltX: 7,
    tiltY: -8,
  },
  argTypes: {
    children: {
      control: false,
    },
    ghost: {
      control: false,
    },
    blendMode: {
      control: "inline-radio",
      options: ["screen", "plus-lighter", "exclusion"],
    },
    ghostCount: {
      control: "inline-radio",
      options: [1, 2, 3],
    },
    mask: {
      control: "inline-radio",
      options: ["signal", "lattice"],
    },
    ghostColor: {
      control: "color",
    },
    blur: {
      control: {
        type: "range",
        min: 0,
        max: 4,
        step: 0.1,
      },
    },
    depth: {
      control: {
        type: "range",
        min: 0,
        max: 42,
        step: 1,
      },
    },
    ghostOpacity: {
      control: {
        type: "range",
        min: 0.1,
        max: 1,
        step: 0.02,
      },
    },
    offsetX: {
      control: {
        type: "range",
        min: -24,
        max: 32,
        step: 1,
      },
    },
    offsetY: {
      control: {
        type: "range",
        min: -24,
        max: 32,
        step: 1,
      },
    },
    perspective: {
      control: {
        type: "range",
        min: 240,
        max: 960,
        step: 10,
      },
    },
    tiltX: {
      control: {
        type: "range",
        min: -18,
        max: 18,
        step: 1,
      },
    },
    tiltY: {
      control: {
        type: "range",
        min: -18,
        max: 18,
        step: 1,
      },
    },
  },
  tags: ["autodocs"],
  render: (args) => <GlitchGhostPanelDemo {...args} />,
} satisfies Meta<typeof GlitchGhost>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DockingPanel: Story = {};

export const SignalTextEcho: Story = {
  args: {
    blendMode: "plus-lighter",
    blur: 1.1,
    depth: 12,
    ghostColor: signalPalette.accentViolet,
    ghostOpacity: 0.56,
    mask: "lattice",
    offsetX: 8,
    offsetY: 4,
    perspective: 460,
    tiltX: 4,
    tiltY: -5,
  },
  render: (args) => <InlineSignalGhostDemo {...args} />,
};

function GlitchGhostPanelDemo(props: GlitchGhostProps) {
  return (
    <div style={stageStyle}>
      <SignalBackdrop
        animated
        density="high"
        focusPoint={{ radius: 0.3, strength: 0.82, x: 0.62, y: 0.34 }}
        height="100%"
        style={stageBackdropStyle}
        telemetry={{
          activity: 0.66,
          alert: 0.22,
          focus: 0.78,
        }}
        tone="primary"
      />
      <div aria-hidden="true" style={stageScrimStyle} />

      <div style={stageContentStyle}>
        <Flex align="flex-start" gap={24} justify="space-between" wrap="wrap">
          <div>
            <Typography.Text style={eyebrowStyle}>Experiment / Layered Echo</Typography.Text>
            <Typography.Title className="signal-ui-text-display" level={2} style={titleStyle}>
              Glitch Ghost Wrapper
            </Typography.Title>
            <Typography.Paragraph style={ledeStyle}>
              Duplicate the wrapped surface into masked ghost passes, then pull those layers into a
              shallow 3D stack so the effect reads like displaced signal, not cheap blur.
            </Typography.Paragraph>
          </div>

          <Space wrap size={[8, 8]}>
            <Button type="primary">Materialize</Button>
            <Button ghost>Park Drift</Button>
          </Space>
        </Flex>

        <div style={ghostWrapStyle}>
          <GlitchGhost {...props}>
            <Panel
              cutCorner="notch"
              cutCornerColor={signalPalette.primary}
              cutCornerPlacement="bottom-left"
              frame="reticle"
              frameColor={signalPalette.primary}
              frameSize={30}
              style={panelStyle}
              title="Relay Aperture"
            >
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Typography.Text style={eyebrowStyle}>Depth Test / Duplicate Surface</Typography.Text>
                  <div className="signal-ui-signal-text" style={readoutStyle}>
                    relay vector 05
                  </div>
                </div>

                <Typography.Paragraph style={{ margin: 0 }}>
                  The live panel stays readable while the ghost passes shear into scanline slices
                  and pixel lattices. It feels more like a failed lock on a holographic pane than
                  a normal shadow effect.
                </Typography.Paragraph>

                <Row gutter={[12, 12]}>
                  {panelMetrics.map((metric) => (
                    <Col key={metric.label} sm={8} xs={24}>
                      <div style={metricStyle}>
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
          </GlitchGhost>
        </div>

        <Flex gap={16} wrap="wrap">
          <Panel cutCornerPreset="tactical" style={notePanelStyle} title="What This Is Good At">
            <Typography.Paragraph style={{ margin: 0 }}>
              Hero surfaces, modal reveals, large labels, and staged telemetry cards. The stronger
              the silhouette, the better the displaced duplicate reads.
            </Typography.Paragraph>
          </Panel>
          <Panel
            cutCorner="accent"
            cutCornerColor={signalPalette.accentViolet}
            cutCornerPlacement="top-right"
            style={notePanelStyle}
            title="What To Watch"
          >
            <Typography.Paragraph style={{ margin: 0 }}>
              Default mode snapshots the rendered surface instead of remounting it. Use the
              explicit ghost slot only when you need a custom alternate silhouette, and keep the
              wrapped surface mostly presentational.
            </Typography.Paragraph>
          </Panel>
        </Flex>
      </div>
    </div>
  );
}

function InlineSignalGhostDemo(props: GlitchGhostProps) {
  return (
    <div style={inlineStageStyle}>
      <SignalBackdrop
        animated
        density="medium"
        focusPoint={{ radius: 0.28, strength: 0.66, x: 0.5, y: 0.38 }}
        height="100%"
        style={stageBackdropStyle}
        telemetry={{
          activity: 0.44,
          alert: 0.16,
          focus: 0.58,
        }}
        tone="violet"
      />
      <div aria-hidden="true" style={inlineScrimStyle} />

      <div style={inlineStageContentStyle}>
        <Typography.Text style={eyebrowStyle}>Inline Echo / Signal Text</Typography.Text>
        <GlitchGhost {...props}>
          <div className="signal-ui-signal-text" style={inlineReadoutStyle}>
            handoff ghost
          </div>
        </GlitchGhost>
        <Typography.Paragraph style={inlineCopyStyle}>
          Smaller labels still hold up if the offset stays restrained. Push the blur too far and it
          starts looking like the UI forgot its glasses.
        </Typography.Paragraph>
      </div>
    </div>
  );
}

const panelMetrics = [
  { label: "Echo spread", value: "12px" },
  { label: "Depth", value: "18px" },
  { label: "Mask", value: "signal" },
];

const stageStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden",
  background:
    "radial-gradient(circle at top, rgb(var(--signal-ui-primary-rgb) / 0.12), transparent 32%), linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 26%), #050607",
};

const stageBackdropStyle: SignalBackdropStyle = {
  position: "absolute",
  inset: 0,
};

const stageScrimStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(4, 6, 8, 0.18), rgba(4, 6, 8, 0.44)), radial-gradient(circle at center, rgba(4, 6, 8, 0), rgba(4, 6, 8, 0.52) 74%, rgba(4, 6, 8, 0.78) 100%)",
  pointerEvents: "none",
};

const stageContentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 28,
  width: "min(1160px, calc(100% - 48px))",
  minHeight: "100vh",
  margin: "0 auto",
  padding: "40px 0 52px",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-block",
  marginBottom: 8,
  color: "rgba(245, 245, 240, 0.74)",
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  maxWidth: 720,
  margin: 0,
};

const ledeStyle: CSSProperties = {
  maxWidth: 620,
  margin: "14px 0 0",
  fontSize: 16,
  color: "rgba(245, 245, 240, 0.8)",
};

const ghostWrapStyle: CSSProperties = {
  width: "min(720px, 100%)",
  margin: "0 auto",
  padding: "18px 0 10px",
};

const panelStyle: CSSProperties = {
  minHeight: 340,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 44%), rgba(6, 7, 9, 0.9)",
  backdropFilter: "blur(12px)",
};

const readoutStyle: CSSProperties = {
  fontSize: 28,
  lineHeight: 1,
  letterSpacing: "0.16em",
};

const metricStyle: CSSProperties = {
  height: "100%",
  padding: "10px 12px",
  border: "1px solid rgba(245, 245, 240, 0.08)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 54%), rgba(8, 8, 8, 0.72)",
};

const metricLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: "rgba(245, 245, 240, 0.62)",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const metricValueStyle: CSSProperties = {
  fontSize: 16,
  lineHeight: 1,
};

const notePanelStyle: CSSProperties = {
  flex: "1 1 320px",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 52%), rgba(7, 9, 10, 0.82)",
};

const inlineStageStyle: CSSProperties = {
  ...stageStyle,
  display: "grid",
  placeItems: "center",
  padding: 24,
};

const inlineScrimStyle: CSSProperties = {
  ...stageScrimStyle,
  background:
    "linear-gradient(180deg, rgba(6, 4, 8, 0.18), rgba(6, 4, 8, 0.46)), radial-gradient(circle at center, rgba(6, 4, 8, 0), rgba(6, 4, 8, 0.6) 72%, rgba(6, 4, 8, 0.82) 100%)",
};

const inlineStageContentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "min(820px, 100%)",
  padding: "48px 24px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 46%), rgba(7, 7, 12, 0.72)",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 24px 60px rgba(0, 0, 0, 0.34)",
  textAlign: "center",
};

const inlineReadoutStyle: CSSProperties = {
  "--signal-ui-fx-signal-accent": signalPalette.accentViolet,
  "--signal-ui-fx-signal-glow": "rgb(var(--signal-ui-accent-violet-rgb) / 0.28)",
  fontSize: "clamp(36px, 8vw, 86px)",
  lineHeight: 0.92,
  letterSpacing: "0.18em",
} as CSSProperties;

const inlineCopyStyle: CSSProperties = {
  maxWidth: 520,
  margin: "18px 0 0",
  color: "rgba(245, 245, 240, 0.76)",
  fontSize: 15,
};
