import { Button, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { FullScreenWipe } from "../components/FullScreenWipe.js";
import type { FullScreenWipeProps, FullScreenWipeState } from "../components/FullScreenWipe.js";
import { Panel } from "../components/Panel.js";
import { SignalBackdrop } from "../components/SignalBackdrop.js";
import type { SignalBackdropStyle } from "../components/SignalBackdrop.js";
import { SignalButton } from "../components/SignalButton.js";
import { SignalHeaderLockup } from "../components/SignalHeaderLockup.js";
import { SignalStatusTag } from "../components/SignalStatusTag.js";
import { signalPalette } from "../theme/signalTheme.js";

const meta = {
  title: "Lab/Full Screen Wipe",
  component: FullScreenWipe,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    accentColor: signalPalette.primary,
    coverColor: "rgb(5 6 10 / 0.98)",
    durationMs: 140,
    overlayLabel: "Screen wipe prototype",
    state: "open",
    variant: "flat-iris",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["flat-iris", "procedural-pixel"],
    },
    state: {
      control: "inline-radio",
      options: ["open", "closed"],
    },
    accentColor: {
      control: "color",
    },
    coverColor: {
      control: "color",
    },
    durationMs: {
      control: {
        type: "range",
        min: 320,
        max: 1600,
        step: 20,
      },
    },
  },
  render: (args) => <FullScreenWipeDemo {...args} />,
  tags: ["autodocs"],
} satisfies Meta<typeof FullScreenWipe>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VariantShowcase: Story = {
  render: () => <FullScreenWipeVariantShowcase />,
};

export const FlatColorIris: Story = {
  args: {
    overlayLabel: "Flat iris",
    state: "closed",
    variant: "flat-iris",
  },
};

export const ProceduralPixel: Story = {
  args: {
    accentColor: signalPalette.accentViolet,
    coverColor: "rgb(6 4 10 / 0.98)",
    overlayLabel: "Procedural pixel",
    state: "closed",
    variant: "procedural-pixel",
  },
};

function FullScreenWipeVariantShowcase() {
  return (
    <div style={showcasePageStyle}>
      <div style={showcaseHeaderStyle}>
        <Space size={[10, 10]} wrap>
          <SignalStatusTag tone="neutral">Variant showcase</SignalStatusTag>
          <SignalStatusTag tone="warning">flat iris</SignalStatusTag>
          <SignalStatusTag tone="info">procedural pixel</SignalStatusTag>
        </Space>
        <Typography.Paragraph style={showcaseCopyStyle}>
          Both wipe treatments are rendered here directly. The left study is the hard-edged
          diagonal shutter; the right study is the procedural pixel corruption pass.
        </Typography.Paragraph>
      </div>

      <div style={showcaseGridStyle}>
        <WipeVariantPreview
          accentColor={signalPalette.primary}
          coverColor="rgb(5 6 10 / 0.98)"
          label="Flat Color Iris"
          overlayLabel="Flat iris"
          tone="primary"
          variant="flat-iris"
        />
        <WipeVariantPreview
          accentColor={signalPalette.accentViolet}
          coverColor="rgb(6 4 10 / 0.98)"
          label="Procedural Pixel"
          overlayLabel="Procedural pixel"
          tone="violet"
          variant="procedural-pixel"
        />
      </div>
    </div>
  );
}

function FullScreenWipeDemo({
  accentColor,
  coverColor,
  durationMs = 140,
  overlayLabel,
  state = "open",
  variant = "flat-iris",
}: FullScreenWipeProps) {
  const [wipeState, setWipeState] = useState<FullScreenWipeState>(state);
  const [autoCycle, setAutoCycle] = useState(false);

  useEffect(() => {
    setWipeState(state);
  }, [state]);

  useEffect(() => {
    if (!autoCycle) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setWipeState((currentState) => (currentState === "open" ? "closed" : "open"));
    }, Math.max(durationMs + 900, 1800));

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoCycle, durationMs]);

  const titleTone = variant === "procedural-pixel" ? "display-secondary" : "display";
  const laneColor = accentColor ?? signalPalette.primary;
  const laneLabel = variant === "procedural-pixel" ? "Procedural Pixel" : "Flat Color Iris";

  return (
    <div style={demoShellStyle}>
      <FullScreenWipe
        accentColor={accentColor}
        coverColor={coverColor}
        durationMs={durationMs}
        overlayLabel={overlayLabel}
        state={wipeState}
        variant={variant}
      >
        <div style={viewportStyle}>
          <SignalBackdrop
            animated
            className="signal-ui-full-screen-wipe-story__backdrop"
            height="100%"
            style={backdropStyle}
            telemetry={{
              activity: variant === "procedural-pixel" ? 0.58 : 0.36,
              alert: variant === "procedural-pixel" ? 0.2 : 0.08,
              focus: 0.52,
            }}
            tone={variant === "procedural-pixel" ? "violet" : "primary"}
            variant="contour"
          />

          <div aria-hidden="true" style={storyGlowStyle(laneColor)} />

          <div style={contentStyle}>
            <Flex align="flex-start" justify="space-between" gap={16} wrap>
              <Space size={[10, 10]} wrap>
                <SignalStatusTag tone="neutral">{laneLabel}</SignalStatusTag>
                <SignalStatusTag tone={variant === "procedural-pixel" ? "info" : "warning"}>
                  {wipeState === "open" ? "content revealed" : "screen occluded"}
                </SignalStatusTag>
              </Space>

              <Panel
                cutCornerPreset="tactical"
                frame="reticle"
                frameColor={laneColor}
                style={controlPanelStyle}
                title="Motion readout"
              >
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  <Typography.Text style={eyebrowStyle}>Prototype behavior</Typography.Text>
                  <Typography.Paragraph style={copyStyle}>
                    The flat iris is the cleaner, more graphic shutter. The procedural pixel
                    variant behaves like a contaminated display buffer swallowing the view.
                  </Typography.Paragraph>
                </Space>
              </Panel>
            </Flex>

            <div style={heroStyle}>
              <SignalHeaderLockup
                accentLabel={`${laneLabel} transition`}
                accentTone={variant === "procedural-pixel" ? "violet" : "primary"}
                description="The same full-viewport shell can either split into hard diagonal shutters or resolve into a low-resolution pixel mask. This is prototype territory: the point is motion character, not API ceremony."
                eyebrow="Transition lab"
                title="Screen wipe studies with two very different kinds of attitude"
                titleFont={titleTone}
                titleLevel={1}
              >
                <Space wrap size={[12, 12]}>
                  <SignalButton
                    onClick={() => {
                      setWipeState((currentState) => (currentState === "open" ? "closed" : "open"));
                    }}
                    tone={variant === "procedural-pixel" ? "violet" : "primary"}
                  >
                    Toggle wipe
                  </SignalButton>
                  <Button ghost>Stage launch</Button>
                </Space>
              </SignalHeaderLockup>
            </div>

            <Flex align="stretch" gap={18} wrap>
              <Panel
                cutCornerPreset="tactical"
                frame="reticle"
                frameColor={laneColor}
                style={metricPanelStyle}
                title="Intent"
              >
                <Space direction="vertical" size={10}>
                  <Typography.Text style={eyebrowStyle}>Visual role</Typography.Text>
                  <Typography.Paragraph style={copyStyle}>
                    Full-screen wipe motions should read like system intent, not just decorative
                    loading. One feels like armored shutters; the other feels like a display fault
                    gaining control of the frame.
                  </Typography.Paragraph>
                </Space>
              </Panel>

              <Panel
                cutCornerPreset="architectural"
                frame="reticle"
                frameColor={laneColor}
                style={metricPanelStyle}
                title="Tuning targets"
              >
                <Space direction="vertical" size={10}>
                  <Typography.Text style={eyebrowStyle}>Next pass</Typography.Text>
                  <Typography.Paragraph style={copyStyle}>
                    If this direction holds, the next pass is timing polish, tone presets, and a
                    cleaner public API. If it does not, we learned that before shipping a dramatic
                    rectangle with confidence.
                  </Typography.Paragraph>
                </Space>
              </Panel>
            </Flex>
          </div>
        </div>
      </FullScreenWipe>

      <Panel
        cutCornerPreset="tactical"
        frame="reticle"
        frameColor={laneColor}
        style={externalControlDockStyle}
        title="Motion rail"
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Typography.Text style={eyebrowStyle}>Always-on controls</Typography.Text>
          <Space wrap size={[10, 10]}>
            <SignalButton
              onClick={() => {
                setWipeState("open");
              }}
              tone={variant === "procedural-pixel" ? "violet" : "primary"}
            >
              Open
            </SignalButton>
            <Button
              onClick={() => {
                setWipeState("closed");
              }}
              type={wipeState === "closed" ? "primary" : "default"}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setAutoCycle((currentValue) => !currentValue);
              }}
            >
              {autoCycle ? "Stop cycle" : "Auto cycle"}
            </Button>
          </Space>
          <Typography.Paragraph style={copyStyle}>
            This dock sits above the wipe so the story cannot trap itself like a smart lock with a
            brick for a keypad.
          </Typography.Paragraph>
        </Space>
      </Panel>
    </div>
  );
}

function WipeVariantPreview({
  accentColor,
  coverColor,
  label,
  overlayLabel,
  tone,
  variant,
}: {
  accentColor: string;
  coverColor: string;
  label: string;
  overlayLabel: string;
  tone: "primary" | "violet";
  variant: NonNullable<FullScreenWipeProps["variant"]>;
}) {
  const [wipeState, setWipeState] = useState<FullScreenWipeState>("closed");
  const laneColor = accentColor;

  return (
    <Panel
      cutCornerPreset="tactical"
      frame="reticle"
      frameColor={laneColor}
      style={showcaseCardStyle}
      title={label}
    >
      <div style={showcasePreviewShellStyle}>
        <FullScreenWipe
          accentColor={accentColor}
          coverColor={coverColor}
          durationMs={940}
          overlayLabel={overlayLabel}
          state={wipeState}
          style={showcaseWipeStyle}
          variant={variant}
        >
          <div style={showcaseViewportStyle}>
            <SignalBackdrop
              animated
              height="100%"
              style={backdropStyle}
              telemetry={{
                activity: variant === "procedural-pixel" ? 0.58 : 0.34,
                alert: variant === "procedural-pixel" ? 0.22 : 0.06,
                focus: 0.48,
              }}
              tone={tone}
              variant="contour"
            />

            <div aria-hidden="true" style={storyGlowStyle(laneColor)} />

            <div style={showcaseInnerContentStyle}>
              <Space size={[8, 8]} wrap>
                <SignalStatusTag tone="neutral">{label}</SignalStatusTag>
                <SignalStatusTag tone={tone === "violet" ? "info" : "warning"}>
                  {wipeState === "open" ? "revealed" : "covered"}
                </SignalStatusTag>
              </Space>

              <div style={showcaseHeadlineStyle}>
                <Typography.Text style={eyebrowStyle}>Motion study</Typography.Text>
                <Typography.Title level={3} style={showcaseTitleStyle}>
                  {variant === "procedural-pixel"
                    ? "Pixelated corruption swallowing the viewport"
                    : "Diagonal shutters peeling off the frame"}
                </Typography.Title>
                <Typography.Paragraph style={showcaseBodyStyle}>
                  {variant === "procedural-pixel"
                    ? "This version leans into a dirty signal failure. The wipe edge is noisy, uneven, and lit like a failing display buffer."
                    : "This version is cleaner and more architectural. The panels behave like deliberate mechanical shutters instead of a rendered texture."}
                </Typography.Paragraph>
              </div>
            </div>
          </div>
        </FullScreenWipe>

        <Panel
          cutCornerPreset="architectural"
          frame="reticle"
          frameColor={laneColor}
          style={showcaseDockStyle}
          title="Controls"
        >
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Typography.Text style={eyebrowStyle}>Local preview</Typography.Text>
            <Space wrap size={[8, 8]}>
              <SignalButton
                onClick={() => {
                  setWipeState("open");
                }}
                tone={tone}
              >
                Open
              </SignalButton>
              <Button
                onClick={() => {
                  setWipeState("closed");
                }}
                type={wipeState === "closed" ? "primary" : "default"}
              >
                Close
              </Button>
            </Space>
          </Space>
        </Panel>
      </div>
    </Panel>
  );
}

const demoShellStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
};

const showcasePageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "clamp(1rem, 3vw, 2rem)",
  background:
    "radial-gradient(circle at top, rgba(192, 254, 4, 0.08), transparent 26%), #020202",
};

const showcaseHeaderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
  maxWidth: "52rem",
  marginBottom: "1.5rem",
};

const showcaseCopyStyle: CSSProperties = {
  margin: 0,
  maxWidth: "44rem",
};

const showcaseGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "1rem",
  alignItems: "stretch",
};

const showcaseCardStyle: CSSProperties = {
  height: "100%",
  background: "rgba(0, 0, 0, 0.46)",
};

const showcasePreviewShellStyle: CSSProperties = {
  position: "relative",
  minHeight: 560,
};

const showcaseWipeStyle: CSSProperties = {
  minHeight: 520,
};

const showcaseViewportStyle: CSSProperties = {
  position: "relative",
  minHeight: 520,
  overflow: "hidden",
  background:
    "radial-gradient(circle at top, rgba(192, 254, 4, 0.08), transparent 34%), #020202",
};

const showcaseInnerContentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: 520,
  padding: "1.2rem",
};

const showcaseHeadlineStyle: CSSProperties = {
  maxWidth: "24rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.7rem",
};

const showcaseTitleStyle: CSSProperties = {
  margin: 0,
  color: "var(--signal-ui-text)",
};

const showcaseBodyStyle: CSSProperties = {
  margin: 0,
  maxWidth: "34ch",
};

const showcaseDockStyle: CSSProperties = {
  position: "absolute",
  left: "1rem",
  right: "1rem",
  bottom: "1rem",
  zIndex: 4,
  background: "rgba(0, 0, 0, 0.72)",
  backdropFilter: "blur(12px)",
};

const viewportStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden",
  background:
    "radial-gradient(circle at top, rgba(192, 254, 4, 0.08), transparent 34%), #020202",
};

const backdropStyle: SignalBackdropStyle = {
  position: "absolute",
  inset: 0,
};

const contentStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  minHeight: "100vh",
  padding: "clamp(1.25rem, 3vw, 2.75rem)",
};

const heroStyle: CSSProperties = {
  maxWidth: "min(58rem, 100%)",
  paddingTop: "clamp(1rem, 4vw, 4rem)",
};

const controlPanelStyle: CSSProperties = {
  width: "min(28rem, 100%)",
  minWidth: "min(100%, 20rem)",
  background: "rgba(0, 0, 0, 0.54)",
};

const externalControlDockStyle: CSSProperties = {
  position: "absolute",
  top: "clamp(1rem, 2.2vw, 1.75rem)",
  right: "clamp(1rem, 2.2vw, 1.75rem)",
  zIndex: 4,
  width: "min(30rem, calc(100vw - 2rem))",
  background: "rgba(0, 0, 0, 0.74)",
  backdropFilter: "blur(12px)",
};

const metricPanelStyle: CSSProperties = {
  flex: "1 1 18rem",
  minHeight: 200,
  background: "rgba(0, 0, 0, 0.5)",
};

const eyebrowStyle: CSSProperties = {
  color: "var(--signal-ui-muted)",
  fontSize: "0.74rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const copyStyle: CSSProperties = {
  margin: 0,
  maxWidth: "42ch",
};

function storyGlowStyle(color: string): CSSProperties {
  return {
    position: "absolute",
    inset: "-10%",
    background: `radial-gradient(circle at top left, ${color}22, transparent 24%)`,
    filter: "blur(24px)",
    pointerEvents: "none",
  };
}
