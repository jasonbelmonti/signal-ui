import { Button, Col, Flex, Row, Space, Typography } from "antd";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { Panel } from "../../components/Panel.js";
import type { PanelProps } from "../../components/Panel.js";
import { SignalBackdrop } from "../../components/SignalBackdrop.js";
import type { SignalBackdropStyle } from "../../components/SignalBackdrop.js";
import { signalPalette } from "../../theme/signalTheme.js";

type SignalReadoutStyle = CSSProperties &
  Record<`--signal-ui-fx-signal-${string}`, string | number>;
type PanelRevealStyle = CSSProperties &
  Partial<Record<`--signal-ui-panel-reveal-${string}`, string | number>>;

type RevealState = NonNullable<PanelProps["revealState"]>;

export interface PanelMaterialExperimentsSceneProps {
  controls?: boolean;
  initialRevealState?: RevealState;
}

export function PanelMaterialExperimentsScene({
  controls = true,
  initialRevealState = "open",
}: PanelMaterialExperimentsSceneProps) {
  const [revealState, setRevealState] = useState<RevealState>(initialRevealState);
  const [isAutoCycling, setIsAutoCycling] = useState(false);

  useEffect(() => {
    setRevealState(initialRevealState);
    setIsAutoCycling(false);
  }, [initialRevealState]);

  useEffect(() => {
    if (!isAutoCycling) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRevealState((current) => getNextRevealState(current));
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [isAutoCycling]);

  return (
    <div style={prototypeViewportStyle}>
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
        style={prototypeBackdropStyle}
        tone="primary"
      />
      <div aria-hidden="true" style={prototypeScrimStyle} />

      {prototypeGhostPanels.map((panel) => (
        <div key={panel.title} style={{ ...prototypeGhostPanelStyle, ...panel.position }}>
          <Typography.Text style={prototypeGhostEyebrowStyle}>{panel.eyebrow}</Typography.Text>
          <div className="signal-ui-signal-text" style={prototypeGhostTitleStyle}>
            {panel.title}
          </div>
          <Typography.Paragraph style={prototypeGhostCopyStyle}>
            {panel.copy}
          </Typography.Paragraph>
        </div>
      ))}

      <div aria-hidden="true" style={prototypeTelemetryGridStyle}>
        {prototypeTelemetryReadouts.map((readout) => (
          <div key={readout.label} style={prototypeTelemetryCardStyle}>
            <Typography.Text style={prototypeTelemetryLabelStyle}>{readout.label}</Typography.Text>
            <div className="signal-ui-signal-text" style={prototypeTelemetryValueStyle}>
              {readout.value}
            </div>
          </div>
        ))}
      </div>

      <div style={prototypeContentStyle}>
        <Flex align="center" gap={12} justify="space-between" wrap="wrap" style={{ marginBottom: 18 }}>
          <div>
            <Typography.Text style={eyebrowStyle}>
              {controls ? "Cyber Glass / Dynamic Blur" : "Cyber Glass / Closed State"}
            </Typography.Text>
            <Typography.Title level={3} className="signal-ui-text-display" style={prototypeTitleStyle}>
              {controls ? "Cyber Glass Panel Prototype" : "Cyber Glass Panel Closed State"}
            </Typography.Title>
          </div>

          {controls ? (
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
          ) : (
            <Typography.Text style={eyebrowStyle}>Pinned to `closed` for visual regression.</Typography.Text>
          )}
        </Flex>

        <div style={prototypePanelWrapStyle}>
          <Panel
            cutCorner="notch"
            cutCornerColor={signalPalette.primary}
            cutCornerPlacement="bottom-left"
            reveal="holographic"
            revealColor={signalPalette.primary}
            revealIntro="point"
            revealOutro="point"
            revealState={revealState}
            style={prototypePanelStyle}
            surface="glass"
            surfaceBlur={14}
            title="Cryostatic Console"
          >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div>
                <Typography.Text style={eyebrowStyle}>
                  Center-Out Pixel Materialization
                </Typography.Text>
                <div className="signal-ui-signal-text" style={prototypeReadoutStyle}>
                  lattice node 03
                </div>
              </div>

              <Typography.Paragraph style={{ margin: 0 }}>
                The panel now builds cell-by-cell from the center grid, then settles into a thicker
                frosted sheet with visible depth. The background stays live underneath so the blur
                reads like material density instead of decorative haze.
              </Typography.Paragraph>

              <Row gutter={[12, 12]}>
                {prototypeMetrics.map((metric) => (
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

export function PanelModalScene() {
  const [revealState, setRevealState] = useState<"open" | "closed" | "hidden">("open");

  return (
    <div style={modalViewportStyle}>
      <SignalBackdrop
        animated
        density="medium"
        height="100%"
        telemetry={{
          activity: 0.42,
          alert: 0.12,
          focus: 0.56,
        }}
        style={modalBackdropStyle}
        tone="primary"
      />

      <div aria-hidden="true" style={modalBackdropScrimStyle} />

      <div style={modalUnderlyingContentStyle}>
        <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
          <div>
            <Typography.Text style={eyebrowStyle}>Ops Queue / Background Shell</Typography.Text>
            <Typography.Title level={2} className="signal-ui-text-display" style={modalPageTitleStyle}>
              Modal In Context
            </Typography.Title>
          </div>

          <Space wrap>
            <Button
              onClick={() => {
                setRevealState("open");
              }}
              type={revealState === "open" ? "primary" : "default"}
            >
              Open Modal
            </Button>
            <Button
              onClick={() => {
                setRevealState("closed");
              }}
              type={revealState === "closed" ? "primary" : "default"}
            >
              Collapse
            </Button>
            <Button
              onClick={() => {
                setRevealState("hidden");
              }}
              type={revealState === "hidden" ? "primary" : "default"}
            >
              Hide
            </Button>
          </Space>
        </Flex>

        <Row gutter={[18, 18]}>
          {modalBackgroundPanels.map((panel) => (
            <Col key={panel.title} lg={8} md={12} xs={24}>
              <Panel
                cutCornerPreset={panel.cutCornerPreset}
                frame={panel.frame}
                frameColor={panel.frameColor}
                style={modalBackgroundPanelStyle}
                title={panel.title}
              >
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <Typography.Text style={eyebrowStyle}>{panel.eyebrow}</Typography.Text>
                  <Typography.Paragraph style={{ margin: 0 }}>{panel.copy}</Typography.Paragraph>
                </Space>
              </Panel>
            </Col>
          ))}
        </Row>
      </div>

      <div aria-hidden={revealState === "hidden"} style={modalOverlayShellStyle}>
        <div
          style={{
            ...modalPanelWrapStyle,
            pointerEvents: revealState === "hidden" ? "none" : "auto",
          }}
        >
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
            style={modalPanelStyle}
            title="Transmit Authorization"
          >
            <Space direction="vertical" size={18} style={{ width: "100%" }}>
              <div>
                <Typography.Text style={eyebrowStyle}>Priority Modal / Overlay Layer</Typography.Text>
                <div className="signal-ui-signal-text" style={reticleReadoutStyle}>
                  uplink handshake
                </div>
              </div>

              <Typography.Paragraph style={{ margin: 0 }}>
                This is the intended modal use case: background content stays live under the scrim,
                the panel emerges from nothing, and the exit burns back down to a line instead of
                vanishing like a normal dialog box with stage fright.
              </Typography.Paragraph>

              <Row gutter={[12, 12]}>
                {modalMetrics.map((metric) => (
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

              <Flex gap={12} justify="flex-end" wrap>
                <Button
                  ghost
                  onClick={() => {
                    setRevealState("hidden");
                  }}
                >
                  Abort
                </Button>
                <Button
                  onClick={() => {
                    setRevealState("hidden");
                  }}
                  type="primary"
                >
                  Authorize Link
                </Button>
              </Flex>
            </Space>
          </Panel>
        </div>
      </div>
    </div>
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

const eyebrowStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: signalPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const reticleReadoutStyle: SignalReadoutStyle = {
  "--signal-ui-fx-signal-accent": signalPalette.primary,
  "--signal-ui-fx-signal-glow": "rgb(var(--signal-ui-primary-rgb) / 0.4)",
  fontSize: 24,
  letterSpacing: "0.16em",
  lineHeight: 0.98,
};

const prototypeReadoutStyle: SignalReadoutStyle = {
  "--signal-ui-fx-signal-accent": signalPalette.primary,
  "--signal-ui-fx-signal-glow": "rgb(var(--signal-ui-primary-rgb) / 0.32)",
  fontSize: 24,
  letterSpacing: "0.18em",
  lineHeight: 0.98,
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

const prototypeViewportStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden",
  padding: "28px clamp(18px, 4vw, 44px)",
  background:
    "radial-gradient(circle at top, rgb(var(--signal-ui-primary-rgb) / 0.1), transparent 32%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 24%), #040505",
};

const prototypeBackdropStyle: SignalBackdropStyle = {
  position: "absolute",
  inset: 0,
};

const prototypeScrimStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "linear-gradient(180deg, rgba(3, 4, 6, 0.08), rgba(3, 4, 6, 0.28)), radial-gradient(circle at center, rgba(6, 8, 10, 0), rgba(4, 6, 8, 0.28) 70%, rgba(4, 6, 8, 0.54) 100%)",
};

const prototypeContentStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  minHeight: "calc(100vh - 56px)",
};

const prototypeTitleStyle: CSSProperties = {
  margin: 0,
};

const prototypePanelWrapStyle: CSSProperties = {
  width: "min(680px, 100%)",
  marginInline: "auto",
  marginBlock: "auto",
};

const prototypePanelStyle: CSSProperties = {
  minHeight: 320,
};

const prototypeGhostPanelStyle: CSSProperties = {
  position: "absolute",
  zIndex: 0,
  width: 220,
  padding: "14px 16px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 52%), rgba(7, 11, 15, 0.44)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 24px rgba(192, 254, 4, 0.1)",
};

const prototypeGhostEyebrowStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: "rgba(245, 245, 240, 0.7)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const prototypeGhostTitleStyle: SignalReadoutStyle = {
  "--signal-ui-fx-signal-accent": signalPalette.primary,
  "--signal-ui-fx-signal-glow": "rgb(var(--signal-ui-primary-rgb) / 0.24)",
  fontSize: 17,
  letterSpacing: "0.14em",
  lineHeight: 1,
};

const prototypeGhostCopyStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(245, 245, 240, 0.72)",
  fontSize: 12,
};

const prototypeTelemetryGridStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  zIndex: 0,
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(110px, 1fr))",
  gap: 16,
  width: "min(620px, calc(100vw - 120px))",
  padding: "28px 30px",
  border: "1px solid rgba(192, 254, 4, 0.18)",
  background:
    "radial-gradient(circle at center, rgba(192, 254, 4, 0.14), transparent 58%), radial-gradient(circle at center, rgba(255, 255, 255, 0.08), transparent 24%), repeating-linear-gradient(90deg, transparent 0, transparent 14px, rgba(255, 255, 255, 0.05) 14px, rgba(255, 255, 255, 0.05) 15px, transparent 15px, transparent 30px), repeating-linear-gradient(180deg, transparent 0, transparent 14px, rgba(255, 255, 255, 0.04) 14px, rgba(255, 255, 255, 0.04) 15px, transparent 15px, transparent 30px), rgba(4, 8, 10, 0.34)",
  boxShadow:
    "inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 40px rgba(192, 254, 4, 0.14)",
  transform: "translate(-50%, -6%) rotate(-1.4deg)",
};

const prototypeTelemetryCardStyle: CSSProperties = {
  padding: "10px 12px",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  background: "rgba(5, 9, 11, 0.22)",
};

const prototypeTelemetryLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: "rgba(245, 245, 240, 0.7)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const prototypeTelemetryValueStyle: SignalReadoutStyle = {
  "--signal-ui-fx-signal-accent": signalPalette.primary,
  "--signal-ui-fx-signal-glow": "rgb(var(--signal-ui-primary-rgb) / 0.18)",
  fontSize: 18,
  letterSpacing: "0.14em",
  lineHeight: 1,
};

const modalViewportStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden",
  background:
    "radial-gradient(circle at top, rgb(var(--signal-ui-primary-rgb) / 0.1), transparent 30%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 24%), #040505",
};

const modalBackdropStyle: SignalBackdropStyle = {
  position: "absolute",
  inset: 0,
};

const modalBackdropScrimStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "linear-gradient(180deg, rgba(2, 2, 2, 0.18), rgba(2, 2, 2, 0.68)), radial-gradient(circle at center, rgba(4, 4, 4, 0.08), rgba(4, 4, 4, 0.4) 62%, rgba(4, 4, 4, 0.72) 100%)",
};

const modalUnderlyingContentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 24,
  minHeight: "100vh",
  padding: "32px clamp(20px, 4vw, 56px) 44px",
};

const modalPageTitleStyle: CSSProperties = {
  margin: 0,
};

const modalBackgroundPanelStyle: CSSProperties = {
  minHeight: 220,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 54%), rgba(8, 8, 8, 0.7)",
  borderColor: "rgba(192, 254, 4, 0.16)",
  backdropFilter: "blur(10px)",
};

const modalOverlayShellStyle: CSSProperties = {
  position: "absolute",
  inset: "0",
  zIndex: 3,
  display: "grid",
  placeItems: "center",
  padding: "32px clamp(18px, 4vw, 40px)",
  pointerEvents: "none",
};

const modalPanelWrapStyle: CSSProperties = {
  width: "min(720px, calc(100vw - 48px))",
  justifySelf: "center",
  alignSelf: "center",
};

const modalPanelStyle: PanelRevealStyle = {
  minHeight: 360,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 44%), rgba(7, 7, 7, 0.92)",
  backdropFilter: "blur(16px)",
  "--signal-ui-panel-reveal-duration": "585ms",
  "--signal-ui-panel-reveal-intro-duration": "248ms",
  "--signal-ui-panel-reveal-outro-duration": "248ms",
};

const modalMetrics = [
  { label: "Window", value: "ARMED" },
  { label: "Trace", value: "CLEAN" },
  { label: "Link", value: "92%" },
];

const modalBackgroundPanels = [
  {
    title: "Queue Health",
    eyebrow: "Background telemetry",
    copy: "Alerts, throughput, and transfer cadence keep moving under the scrim so the modal feels layered on top of a live system.",
    cutCornerPreset: "tactical" as const,
    frame: undefined,
    frameColor: undefined,
  },
  {
    title: "Route Watch",
    eyebrow: "Navigation drift",
    copy: "The underlay stays legible but secondary. That contrast is what makes the holographic panel read like an interruption, not just another card.",
    cutCornerPreset: "architectural" as const,
    frame: undefined,
    frameColor: undefined,
  },
  {
    title: "Signal Lock",
    eyebrow: "Secondary acquisition",
    copy: "A quieter reticle panel in the scene helps judge whether the modal treatment still feels meaningfully elevated above normal active surfaces.",
    cutCornerPreset: "tactical" as const,
    frame: "reticle" as const,
    frameColor: signalPalette.accentViolet,
  },
];

const prototypeMetrics = [
  { label: "Frost", value: "42PX" },
  { label: "Build", value: "CENTER-OUT" },
  { label: "Depth", value: "LAYERED" },
];

const prototypeTelemetryReadouts = [
  { label: "Trace", value: "ACTIVE" },
  { label: "Parallax", value: "0.8X" },
  { label: "Contour", value: "LIVE" },
];

const prototypeGhostPanels = [
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
    title: "depth field",
    eyebrow: "Procedural lane",
    copy: "The side panels stay softer and darker so the prototype reads like a thicker surface hovering above the scene.",
    position: {
      right: 28,
      bottom: 88,
      transform: "rotate(4deg)",
    } satisfies CSSProperties,
  },
];
