import { GiftOutlined, RadarChartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { startTransition, useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { SignalButton } from "../components/SignalButton";
import { marathonDosPalette } from "../theme/marathonDosTheme";

const meta = {
  title: "Components/SignalButton",
  component: SignalButton,
  args: {
    block: true,
    children: "Launch Cycle",
    edgeWidth: 24,
    fillPercent: 68,
    size: "large",
    sparkBurst: 0,
    tone: "primary",
    wakePercent: 0,
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["primary", "violet"],
    },
    fillPercent: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    edgeWidth: {
      control: {
        type: "range",
        min: 14,
        max: 40,
        step: 1,
      },
    },
    wakePercent: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    sparkBurst: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
  },
  tags: ["autodocs"],
  render: (args) => (
    <Flex gap={24} wrap="wrap" align="stretch" style={{ maxWidth: 1120, margin: "0 auto" }}>
      <Card title="Control Surface" style={cardStyle}>
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <Typography.Paragraph style={copyStyle}>
            Tweak the args from Controls to tune the raw fill, wake-up, and pulse layers against
            the same procedural button surface.
          </Typography.Paragraph>
          <div style={{ maxWidth: 420 }}>
            <SignalButton {...args} icon={<ThunderboltOutlined />}>
              {args.children}
            </SignalButton>
          </div>
        </Space>
      </Card>

      <Card
        title="Loot Box Sequence"
        style={{
          ...cardStyle,
          borderColor: "rgba(192, 254, 4, 0.46)",
          background:
            "linear-gradient(135deg, rgba(192, 254, 4, 0.14), transparent 38%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 52%), rgba(10, 10, 10, 0.96)",
        }}
      >
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <Typography.Paragraph style={copyStyle}>
            Fills like a cache meter, wakes every pixel into a solid prize state, then throws fast
            concentric pulse rings across the surface once the button is fully charged.
          </Typography.Paragraph>
          <LootBoxSignalButton />
        </Space>
      </Card>
    </Flex>
  ),
} satisfies Meta<typeof SignalButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CreepingLoop: Story = {
  render: () => (
    <Flex vertical gap={24} style={{ maxWidth: 1120, margin: "0 auto" }}>
      <Card
        style={{
          borderColor: "rgba(192, 254, 4, 0.4)",
          background:
            "linear-gradient(135deg, rgba(192, 254, 4, 0.14), transparent 38%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 52%), #090909",
        }}
      >
        <Space direction="vertical" size={12}>
          <Typography.Text style={eyebrowStyle}>Reactive CTA / Creeping Fill</Typography.Text>
          <Typography.Title level={2} className="marathon-text-display" style={{ margin: 0 }}>
            A bright fill with a twitchy pixel front edge
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            The button stays usable as a normal control, but the procedural fill and live blend
            text make it read like a charge meter instead of a flat Ant button with a glow filter
            pasted on top.
          </Typography.Paragraph>
        </Space>
      </Card>

      <Flex gap={24} wrap="wrap" align="stretch">
        <Card title="Looping Transmission" style={cardStyle}>
          <Space direction="vertical" size={18} style={{ width: "100%" }}>
            <Typography.Paragraph style={copyStyle}>
              This version loops the fill so the leading edge can be judged in motion rather than
              by the ancient art of squinting at static CSS.
            </Typography.Paragraph>
            <LoopingSignalButton />
          </Space>
        </Card>

        <Card
          title="Violet Event Channel"
          style={{
            ...cardStyle,
            borderColor: "rgba(159, 77, 255, 0.42)",
            background:
              "linear-gradient(135deg, rgba(159, 77, 255, 0.14), transparent 38%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 52%), #090909",
          }}
        >
          <Space direction="vertical" size={18} style={{ width: "100%" }}>
            <Typography.Paragraph style={copyStyle}>
              Same structure, but with violet acting as a transmission/event lane instead of a new
              default interaction color.
            </Typography.Paragraph>
            <SignalButton
              block
              edgeWidth={26}
              fillPercent={58}
              icon={<RadarChartOutlined />}
              size="large"
              tone="violet"
            >
              Signal Window
            </SignalButton>
          </Space>
        </Card>
      </Flex>
    </Flex>
  ),
};

function LoopingSignalButton() {
  const [fillPercent, setFillPercent] = useState(18);

  useEffect(() => {
    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const cycleMs = 2800;
      const phase = ((Date.now() - startedAt) % cycleMs) / cycleMs;
      const mirroredPhase = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
      const easedFill = 14 + mirroredPhase * 76;

      setFillPercent(Math.round(easedFill / 2) * 2);
    }, 90);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <SignalButton
      block
      edgeWidth={28}
      fillPercent={fillPercent}
      icon={<ThunderboltOutlined />}
      size="large"
    >
      Prime Reactor
    </SignalButton>
  );
}

type LootBoxEffectState = {
  fillPercent: number;
  sparkBurst: number;
  wakePercent: number;
  label: string;
};

function LootBoxSignalButton() {
  const [effectState, setEffectState] = useState<LootBoxEffectState>(() => getLootBoxEffectState(0));

  useEffect(() => {
    const startedAt = performance.now();
    const intervalId = window.setInterval(() => {
      const elapsedMs = (performance.now() - startedAt) % 6800;
      const nextState = getLootBoxEffectState(elapsedMs);

      startTransition(() => {
        setEffectState(nextState);
      });
    }, 70);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <SignalButton
      block
      edgeWidth={30}
      fillPercent={effectState.fillPercent}
      icon={<GiftOutlined />}
      size="large"
      sparkBurst={effectState.sparkBurst}
      wakePercent={effectState.wakePercent}
    >
      {effectState.label}
    </SignalButton>
  );
}

function getLootBoxEffectState(elapsedMs: number): LootBoxEffectState {
  if (elapsedMs < 2600) {
    const progress = easeOutCubic(elapsedMs / 2600);

    return {
      fillPercent: roundPercent(12 + progress * 88),
      wakePercent: 0,
      sparkBurst: 0,
      label: "Prime Cache",
    };
  }

  if (elapsedMs < 4000) {
    const progress = easeOutCubic((elapsedMs - 2600) / 1400);

    return {
      fillPercent: 100,
      wakePercent: roundPercent(progress * 100),
      sparkBurst: 0,
      label: "Wake Relic",
    };
  }

  if (elapsedMs < 5800) {
    const progress = clamp01((elapsedMs - 4000) / 1400);
    const stagedProgress =
      progress < 0.78
        ? easeOutCubic(progress / 0.78) * 0.72
        : 0.72 + easeOutCubic((progress - 0.78) / 0.22) * 0.28;

    return {
      fillPercent: 100,
      wakePercent: 100,
      sparkBurst: roundPercent(stagedProgress * 100),
      label: "Crack Loot",
    };
  }

  return {
    fillPercent: 100,
    wakePercent: 100,
    sparkBurst: 0,
    label: "Reward Dispensed",
  };
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - clamp01(value), 3);
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function roundPercent(value: number) {
  return Math.round(value / 2) * 2;
}

const eyebrowStyle: CSSProperties = {
  display: "block",
  color: marathonDosPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  marginBottom: 2,
  textTransform: "uppercase",
};

const copyStyle: CSSProperties = {
  margin: 0,
  color: "rgba(245, 245, 240, 0.84)",
  maxWidth: 680,
};

const cardStyle: CSSProperties = {
  flex: "1 1 360px",
  minHeight: 280,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 52%), rgba(12, 12, 12, 0.94)",
};
