import { Button, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useState } from "react";

import { Panel } from "../components/Panel.js";
import {
  SignalBackdrop,
  type SignalBackdropFocusPoint,
  type SignalBackdropProps,
  type SignalBackdropStyle,
} from "../components/SignalBackdrop.js";
import { SignalButton } from "../components/SignalButton.js";
import { SignalHeaderLockup } from "../components/SignalHeaderLockup.js";
import { SignalStatusTag } from "../components/SignalStatusTag.js";
import { signalPalette } from "../theme/signalTheme.js";

const meta = {
  title: "Components/SignalBackdrop",
  component: SignalBackdrop,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    animated: true,
    density: "medium",
    telemetry: {
      activity: 0.38,
      alert: 0.08,
      focus: 0.48,
    },
    tone: "primary",
    variant: "contour",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["low", "medium", "high"],
    },
    tone: {
      control: "select",
      options: ["primary", "violet"],
    },
    variant: {
      control: "select",
      options: ["contour"],
    },
  },
  tags: ["autodocs"],
  render: (args) => <SignalBackdropPreview {...args} />,
} satisfies Meta<typeof SignalBackdrop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VioletTone: Story = {
  args: {
    density: "high",
    telemetry: {
      activity: 0.62,
      alert: 0.34,
      focus: 0.58,
    },
    tone: "violet",
  },
};

export const FullBleedSurface: Story = {
  args: {
    density: "high",
    telemetry: {
      activity: 0.56,
      alert: 0.18,
      focus: 0.5,
    },
  },
  render: (args) => (
    <div style={fieldStudyViewportStyle}>
      <SignalBackdrop {...args} height="100vh" />
    </div>
  ),
};

function SignalBackdropPreview(args: SignalBackdropProps) {
  const [focusPoint, setFocusPoint] = useState<SignalBackdropFocusPoint | undefined>();

  return (
    <div
      onPointerLeave={() => {
        setFocusPoint(undefined);
      }}
      onPointerMove={(event) => {
        setFocusPoint(createFocusPoint(event));
      }}
      style={viewportStyle}
    >
      <SignalBackdrop
        {...args}
        className="signal-ui-signal-backdrop-story__surface"
        focusPoint={focusPoint}
        height="100%"
        style={backdropStyle}
      />

      <div aria-hidden="true" style={storyScrimStyle} />

      <div style={contentStyle}>
        <div style={topRailStyle}>
          <Space size={[10, 10]} wrap>
            <SignalStatusTag tone="success">BACKGROUND ACTIVE</SignalStatusTag>
            <SignalStatusTag tone="neutral">PTR PRESSURE WELL</SignalStatusTag>
            <SignalStatusTag tone={args.tone === "violet" ? "info" : "warning"}>
              RECEDING FULLSCREEN TEXTURE
            </SignalStatusTag>
          </Space>
          <Typography.Text style={pointerHintStyle}>
            move pointer to steer the field
          </Typography.Text>
        </div>

        <div style={heroWrapStyle}>
          <SignalHeaderLockup
            accentLabel="Three.js environmental layer"
            accentTone={args.tone === "violet" ? "violet" : "primary"}
            description="Contour Lattice Field keeps the orthogonal, bare-shell language from the diagnostics radar but stretches it into a quieter atmospheric surface. Motion lives in the terrain, sparse telemetry points, and slow sweep lines instead of a hero object demanding attention."
            eyebrow="Signal Backdrop"
            title="Fullscreen motion texture with a nervous system"
            titleFont={args.tone === "violet" ? "display-secondary" : "display"}
            titleLevel={1}
          >
            <Space wrap size={[12, 12]}>
              <SignalButton tone={args.tone === "violet" ? "violet" : "primary"}>
                Engage backdrop
              </SignalButton>
              <Button ghost>Disable motion</Button>
            </Space>
          </SignalHeaderLockup>
        </div>

        <Flex gap={20} wrap align="stretch">
          <Panel
            cutCornerPreset="tactical"
            style={{ ...panelStyle, flex: "1 1 320px", minHeight: 220 }}
            title="Field telemetry"
          >
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Typography.Text style={eyebrowStyle}>Input mapping</Typography.Text>
              <MetricRow
                label="activity"
                tone={args.tone}
                value={formatTelemetryValue(args.telemetry?.activity, "cadence")}
              />
              <MetricRow
                label="focus"
                tone={args.tone}
                value={formatTelemetryValue(args.telemetry?.focus, "pressure")}
              />
              <MetricRow
                label="alert"
                tone={args.tone}
                value={formatTelemetryValue(args.telemetry?.alert, "contamination")}
              />
              <Typography.Paragraph style={copyStyle}>
                Higher activity increases contour agitation and point drift. Alert adds brief amber
                contamination while focus deepens the local pressure well without turning the whole
                screen into a siren.
              </Typography.Paragraph>
            </Space>
          </Panel>

          <Panel
            cutCornerPreset="architectural"
            style={{ ...panelStyle, flex: "1 1 320px", minHeight: 220 }}
            title="Backdrop constraints"
          >
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Typography.Text style={eyebrowStyle}>Guardrails</Typography.Text>
              <Typography.Paragraph style={copyStyle}>
                The center stays calmer than the edges, line luminance is capped, and the canvas is
                `pointer-events: none` so the real UI still owns interaction. The backdrop should
                feel alive, not needy.
              </Typography.Paragraph>
              <Typography.Paragraph style={copyStyle}>
                This is the environment layer, not the protagonist. If it starts auditioning for a
                laser show, it is fired.
              </Typography.Paragraph>
            </Space>
          </Panel>

          <Panel
            cutCornerPreset="tactical"
            style={{ ...panelStyle, flex: "1 1 260px", minHeight: 220 }}
            title="Component API"
          >
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Typography.Text style={eyebrowStyle}>Initial surface</Typography.Text>
              <Typography.Paragraph style={copyStyle}>
                `SignalBackdrop` ships with a seeded `contour` variant plus `tone`, `density`,
                `telemetry`, and `focusPoint` hooks so host apps can keep the composition stable
                while nudging it with live metrics and user motion.
              </Typography.Paragraph>
            </Space>
          </Panel>
        </Flex>
      </div>
    </div>
  );
}

function MetricRow({ label, tone, value }: { label: string; tone: SignalBackdropProps["tone"]; value: string }) {
  return (
    <div style={metricRowStyle}>
      <Typography.Text style={metricLabelStyle}>{label}</Typography.Text>
      <Typography.Text
        style={{
          ...metricValueStyle,
          color: tone === "violet" ? signalPalette.accentViolet : signalPalette.primary,
        }}
      >
        {value}
      </Typography.Text>
    </div>
  );
}

function createFocusPoint(event: ReactPointerEvent<HTMLDivElement>): SignalBackdropFocusPoint {
  const bounds = event.currentTarget.getBoundingClientRect();

  return {
    radius: 0.18,
    strength: 0.92,
    x: (event.clientX - bounds.left) / bounds.width,
    y: (event.clientY - bounds.top) / bounds.height,
  };
}

function formatTelemetryValue(value: number | undefined, suffix: string) {
  const resolvedValue = value ?? 0;

  return `${Math.round(resolvedValue * 100)}% ${suffix}`;
}

const viewportStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden",
  background:
    "radial-gradient(circle at top, rgba(192, 254, 4, 0.06), transparent 28%), #020202",
};

const fieldStudyViewportStyle: CSSProperties = {
  ...viewportStyle,
  height: "100vh",
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(192, 254, 4, 0.08), transparent 28%), linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 24%), #020202",
};

const backdropStyle: SignalBackdropStyle = {
  position: "absolute",
  inset: 0,
};

const storyScrimStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(circle at center, rgba(3, 3, 3, 0.38), transparent 42%), linear-gradient(180deg, rgba(2, 2, 2, 0.08), rgba(2, 2, 2, 0.56))",
};

const contentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 24,
  minHeight: "100vh",
  padding: "32px clamp(20px, 4vw, 56px) 40px",
};

const topRailStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  alignItems: "center",
  justifyContent: "space-between",
};

const heroWrapStyle: CSSProperties = {
  maxWidth: 920,
  paddingTop: 28,
};

const panelStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 52%), rgba(7, 7, 7, 0.78)",
  borderColor: "rgba(192, 254, 4, 0.18)",
  backdropFilter: "blur(10px)",
};

const eyebrowStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.66)",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const pointerHintStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.7)",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const copyStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.8)",
  margin: 0,
};

const metricRowStyle: CSSProperties = {
  display: "flex",
  gap: 16,
  alignItems: "baseline",
  justifyContent: "space-between",
  paddingBottom: 8,
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};

const metricLabelStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.6)",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const metricValueStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};
