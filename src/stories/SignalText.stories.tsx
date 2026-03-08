import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";

import { signalPalette } from "../theme/signalTheme.js";

type SignalStyle = CSSProperties &
  Record<`--signal-ui-fx-signal-${string}`, string | number>;

const signalTonePresets = {
  primary: {
    accent: signalPalette.primary,
    border: "rgba(192, 254, 4, 0.42)",
    glow: "rgba(192, 254, 4, 0.42)",
    rim: "rgba(192, 254, 4, 0.12)",
  },
  violet: {
    accent: signalPalette.accentViolet,
    border: "rgba(159, 77, 255, 0.42)",
    glow: "rgba(159, 77, 255, 0.38)",
    rim: "rgba(159, 77, 255, 0.16)",
  },
  warning: {
    accent: signalPalette.warning,
    border: "rgba(255, 155, 47, 0.44)",
    glow: "rgba(255, 155, 47, 0.34)",
    rim: "rgba(255, 155, 47, 0.14)",
  },
} as const;

type SignalTextTone = keyof typeof signalTonePresets;

interface SignalTextPlaygroundProps {
  text: string;
  tone: SignalTextTone;
  fontSize: number;
  letterSpacing: number;
  noiseSize: number;
  noiseOpacity: number;
  scanOpacity: number;
  flickerDepth: number;
  sweepSpeed: number;
  noiseSpeed: number;
  flickerSpeed: number;
}

function SignalTextPlayground({
  text,
  tone,
  fontSize,
  letterSpacing,
  noiseSize,
  noiseOpacity,
  scanOpacity,
  flickerDepth,
  sweepSpeed,
  noiseSpeed,
  flickerSpeed,
}: SignalTextPlaygroundProps) {
  const tonePreset = signalTonePresets[tone];
  const previewStyle = buildSignalTextStyle({
    accent: tonePreset.accent,
    flickerDepth,
    flickerSpeed,
    fontSize,
    glow: tonePreset.glow,
    letterSpacing,
    noiseOpacity,
    noiseSize,
    noiseSpeed,
    scanOpacity,
    sweepSpeed,
  });
  const inlinePreviewStyle = buildSignalTextStyle({
    accent: tonePreset.accent,
    flickerDepth,
    flickerSpeed,
    fontSize: 15,
    glow: tonePreset.glow,
    letterSpacing: 0.12,
    noiseOpacity,
    noiseSize,
    noiseSpeed,
    scanOpacity,
    sweepSpeed,
  });

  return (
    <Flex vertical gap={24} style={{ maxWidth: 980, margin: "0 auto" }}>
      <Card style={getPlaygroundCardStyle(tonePreset.border, tonePreset.rim)}>
        <Space direction="vertical" size={16}>
          <Typography.Text
            style={{ ...eyebrowStyle, color: tonePreset.accent }}
          >
            Live Playground
          </Typography.Text>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Tune the shared signal-text variables in-place
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            Controls drive the same class and CSS custom properties used by the
            showcase samples, so this is a faster way to judge intensity,
            cadence, and readability than repeatedly editing stylesheet
            constants and hoping the browser forgives you.
          </Typography.Paragraph>
          <span className="signal-ui-signal-text" style={previewStyle}>
            {text}
          </span>
          <Typography.Paragraph style={copyStyle}>
            Inline preview:{" "}
            <Typography.Text
              className="signal-ui-signal-text"
              style={inlinePreviewStyle}
            >
              SIGNAL FEED LOCKED
            </Typography.Text>
          </Typography.Paragraph>
        </Space>
      </Card>
    </Flex>
  );
}

function SignalTextShowcase() {
  return (
    <Flex vertical gap={24} style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Card
        style={{
          background:
            "linear-gradient(135deg, rgba(192, 254, 4, 0.08), transparent 28%), #090909",
          borderColor: "rgba(192, 254, 4, 0.38)",
        }}
      >
        <Space direction="vertical" size={12}>
          <Typography.Text style={eyebrowStyle}>
            Motion Texture / Signal Type
          </Typography.Text>
          <Typography.Title
            level={1}
            className="signal-ui-signal-text"
            style={heroStyle}
          >
            GRID UPLINK ONLINE
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            Procedural scan grain and restrained flicker live in the shared
            theme stylesheet, so this stays an opt-in text treatment rather than
            a bespoke one-off effect.
          </Typography.Paragraph>
        </Space>
      </Card>

      <Flex gap={24} wrap="wrap" align="stretch">
        <Card title="Inline Usage" style={cardStyle}>
          <Space direction="vertical" size={10}>
            <Typography.Text style={eyebrowStyle}>
              Default Signal
            </Typography.Text>
            <Typography.Paragraph style={copyStyle}>
              Mission status:{" "}
              <Typography.Text
                className="signal-ui-signal-text"
                style={inlineSignalStyle}
              >
                GREEN-LINE STABLE
              </Typography.Text>
            </Typography.Paragraph>
            <Typography.Paragraph style={copyStyle}>
              Reduced-motion mode keeps the same tone, but freezes the shimmer
              instead of blinking at the viewer like a tiny cursed microwave.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Scoped Override" style={cardStyle}>
          <Space direction="vertical" size={10}>
            <Typography.Text style={eyebrowStyle}>
              Local CSS Vars
            </Typography.Text>
            <Typography.Title
              level={2}
              className="signal-ui-signal-text"
              style={overrideStyle}
            >
              UPLINK FEED SYNCED
            </Typography.Title>
            <Typography.Paragraph style={copyStyle}>
              This example overrides only the local accent, glow, noise size,
              and flicker depth to prove the API can be customized per element
              without changing the base class.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card title="Violet Contrast Trial" style={violetCardStyle}>
          <Space direction="vertical" size={10}>
            <Typography.Text
              style={{ ...eyebrowStyle, color: signalPalette.accentViolet }}
            >
              Secondary Accent
            </Typography.Text>
            <Typography.Title
              level={2}
              className="signal-ui-signal-text"
              style={violetSignalStyle}
            >
              SLIPSTREAM WINDOW OPEN
            </Typography.Title>
            <Typography.Paragraph style={copyStyle}>
              This keeps lime as the interaction language and uses violet only
              as a display/event accent, which is the safest place to test
              whether it sharpens the system or muddies it.
            </Typography.Paragraph>
          </Space>
        </Card>
      </Flex>
    </Flex>
  );
}

const meta = {
  title: "Effects/Signal Text",
  component: SignalTextPlayground,
  args: {
    text: "GRID UPLINK ONLINE",
    tone: "primary",
    fontSize: 64,
    letterSpacing: 0.12,
    noiseSize: 72,
    noiseOpacity: 0.24,
    scanOpacity: 0.18,
    flickerDepth: 0.075,
    sweepSpeed: 1900,
    noiseSpeed: 240,
    flickerSpeed: 640,
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: Object.keys(signalTonePresets),
    },
    fontSize: {
      control: {
        type: "range",
        min: 18,
        max: 96,
        step: 1,
      },
    },
    letterSpacing: {
      control: {
        type: "range",
        min: 0.04,
        max: 0.3,
        step: 0.01,
      },
    },
    noiseSize: {
      control: {
        type: "range",
        min: 24,
        max: 160,
        step: 1,
      },
    },
    noiseOpacity: {
      control: {
        type: "range",
        min: 0,
        max: 0.4,
        step: 0.01,
      },
    },
    scanOpacity: {
      control: {
        type: "range",
        min: 0,
        max: 0.4,
        step: 0.01,
      },
    },
    flickerDepth: {
      control: {
        type: "range",
        min: 0,
        max: 0.2,
        step: 0.005,
      },
    },
    sweepSpeed: {
      control: {
        type: "range",
        min: 400,
        max: 4000,
        step: 50,
      },
    },
    noiseSpeed: {
      control: {
        type: "range",
        min: 80,
        max: 1000,
        step: 20,
      },
    },
    flickerSpeed: {
      control: {
        type: "range",
        min: 120,
        max: 1600,
        step: 20,
      },
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  render: () => <SignalTextShowcase />,
} satisfies Meta<typeof SignalTextPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <SignalTextPlayground {...args} />,
};

export const DefaultSignalText: Story = {};

function buildSignalTextStyle({
  accent,
  flickerDepth,
  flickerSpeed,
  fontSize,
  glow,
  letterSpacing,
  noiseOpacity,
  noiseSize,
  noiseSpeed,
  scanOpacity,
  sweepSpeed,
}: {
  accent: string;
  flickerDepth: number;
  flickerSpeed: number;
  fontSize: number;
  glow: string;
  letterSpacing: number;
  noiseOpacity: number;
  noiseSize: number;
  noiseSpeed: number;
  scanOpacity: number;
  sweepSpeed: number;
}): SignalStyle {
  return {
    "--signal-ui-fx-signal-accent": accent,
    "--signal-ui-fx-signal-flicker-depth": flickerDepth,
    "--signal-ui-fx-signal-flicker-speed": `${flickerSpeed}ms`,
    "--signal-ui-fx-signal-glow": glow,
    "--signal-ui-fx-signal-noise-opacity": noiseOpacity,
    "--signal-ui-fx-signal-noise-size": `${noiseSize}px`,
    "--signal-ui-fx-signal-noise-speed": `${noiseSpeed}ms`,
    "--signal-ui-fx-signal-scan-opacity": scanOpacity,
    "--signal-ui-fx-signal-sweep-speed": `${sweepSpeed}ms`,
    fontSize,
    letterSpacing: `${letterSpacing}em`,
    lineHeight: 1.04,
    margin: 0,
  };
}

function getPlaygroundCardStyle(
  borderColor: string,
  rimColor: string,
): CSSProperties {
  return {
    borderColor,
    background: `linear-gradient(135deg, ${rimColor}, transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 54%), rgba(9, 9, 9, 0.98)`,
  };
}

const eyebrowStyle: CSSProperties = {
  display: "block",
  color: signalPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  marginBottom: 2,
  textTransform: "uppercase",
};

const heroStyle: CSSProperties = {
  margin: 0,
  lineHeight: 1.02,
};

const copyStyle: CSSProperties = {
  margin: 0,
  color: "rgba(245, 245, 240, 0.86)",
  maxWidth: 680,
};

const cardStyle: CSSProperties = {
  flex: "1 1 320px",
  minHeight: 240,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 52%), rgba(12, 12, 12, 0.94)",
};

const violetCardStyle: CSSProperties = {
  ...cardStyle,
  background:
    "linear-gradient(135deg, rgba(159, 77, 255, 0.18), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 52%), rgba(12, 12, 12, 0.94)",
  borderColor: "rgba(159, 77, 255, 0.42)",
};

const inlineSignalStyle: SignalStyle = {
  display: "inline-block",
  fontSize: 15,
  letterSpacing: "0.12em",
};

const overrideStyle: SignalStyle = {
  "--signal-ui-fx-signal-accent": "#74f1ff",
  "--signal-ui-fx-signal-glow": "rgba(116, 241, 255, 0.34)",
  "--signal-ui-fx-signal-noise-size": "108px",
  "--signal-ui-fx-signal-flicker-depth": 0.04,
  margin: 0,
};

const violetSignalStyle: SignalStyle = {
  "--signal-ui-fx-signal-accent": signalPalette.accentViolet,
  "--signal-ui-fx-signal-glow": "rgba(159, 77, 255, 0.38)",
  "--signal-ui-fx-signal-noise-size": "92px",
  margin: 0,
};
