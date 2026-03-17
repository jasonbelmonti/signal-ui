import { Button, Col, Flex, Row, Space, Typography } from "antd";
import { useState } from "react";
import type { CSSProperties } from "react";

import { Panel } from "../../components/Panel.js";
import { SignalBackdrop } from "../../components/SignalBackdrop.js";
import type { SignalBackdropStyle } from "../../components/SignalBackdrop.js";
import { signalPalette } from "../../theme/signalTheme.js";
import {
  type PanelRevealStyle,
  eyebrowStyle,
  metricBlockStyle,
  metricLabelStyle,
  metricValueStyle,
  reticleReadoutStyle,
} from "./panelStoryShared.js";

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
