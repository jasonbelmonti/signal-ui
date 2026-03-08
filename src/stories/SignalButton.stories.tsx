import { GiftOutlined, RadarChartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { startTransition, useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { SignalButton } from "../components/SignalButton.js";
import {
  getLootBoxEffectState,
  type LootBoxEffectState,
} from "./signalButton/lootBoxEffect.js";
import { useHoldToTriggerController } from "./signalButton/useHoldToTriggerController.js";
import { useHoldToTriggerLootBoxSound } from "./signalButton/sound/useHoldToTriggerLootBoxSound.js";
import { signalPalette } from "../theme/signalTheme.js";

const meta = {
  title: "Components/SignalButton",
  component: SignalButton,
  args: {
    block: true,
    children: "Launch Cycle",
    cooldownPercent: 0,
    edgeWidth: 24,
    fillPercent: 68,
    pulseBurst: 0,
    rewardColor: "#58e6ff",
    size: "large",
    tone: "primary",
    wakePercent: 0,
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["primary", "violet"],
    },
    cooldownPercent: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    rewardColor: {
      control: "text",
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
    pulseBurst: {
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
            Tweak the args from Controls to tune the raw fill, wake-up, pulse, and cooldown layers
            against the same procedural button surface. `rewardColor` accepts hex, `rgb(...)`, or
            plain `r g b`.
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
            concentric pulse rings across the surface once the button is fully charged before it
            settles into a calmer confirmation color that the pulse leaves behind.
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

export const HoldToTrigger: Story = {
  render: () => (
    <Flex vertical gap={24} style={{ maxWidth: 820, margin: "0 auto" }}>
      <Card
        style={{
          borderColor: "rgba(84, 236, 255, 0.42)",
          background:
            "linear-gradient(135deg, rgba(84, 236, 255, 0.12), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 52%), rgba(10, 10, 10, 0.96)",
        }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Typography.Text style={{ ...eyebrowStyle, color: "#54ecff" }}>
            Intended Interaction
          </Typography.Text>
          <Typography.Title level={2} className="signal-ui-text-display" style={{ margin: 0 }}>
            Hold to arm, release to cancel
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            Press and hold to fill the button. Releasing early drains it back down. Holding through
            the threshold triggers the pulse, fires the simulated action, and clamps the button in
            the completed state. With sound armed, the charge climbs through a glitchy synth build
            and drops into a cinematic hit when it fires.
          </Typography.Paragraph>
          <HoldToTriggerSignalButton />
        </Space>
      </Card>
    </Flex>
  ),
};

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
          <Typography.Title level={2} className="signal-ui-text-display" style={{ margin: 0 }}>
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

function LootBoxSignalButton() {
  const [effectState, setEffectState] = useState<LootBoxEffectState>(() => getLootBoxEffectState(0));

  useEffect(() => {
    const startedAt = performance.now();
    const intervalId = window.setInterval(() => {
      const elapsedMs = (performance.now() - startedAt) % 2400;
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
      cooldownPercent={effectState.cooldownPercent}
      edgeWidth={30}
      fillPercent={effectState.fillPercent}
      icon={<GiftOutlined />}
      pulseBurst={effectState.pulseBurst}
      rewardColor="#54ecff"
      size="large"
      wakePercent={effectState.wakePercent}
    >
      {effectState.label}
    </SignalButton>
  );
}

function HoldToTriggerSignalButton() {
  const sound = useHoldToTriggerLootBoxSound();
  const { reset, startHolding, stopHolding, visualState } = useHoldToTriggerController({
    onFrame: sound.handleFrame,
    onHoldStart: sound.handleHoldStart,
    onHoldStop: sound.handleHoldStop,
    onReset: sound.handleReset,
  });

  const releaseHold = (event?: { currentTarget: EventTarget & HTMLElement; pointerId?: number }) => {
    if (event && typeof event.pointerId === "number" && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    stopHolding();
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div style={{ maxWidth: 420 }}>
        <SignalButton
          block
          onBlur={() => {
            stopHolding();
          }}
          cooldownPercent={visualState.cooldownPercent}
          edgeWidth={30}
          fillPercent={visualState.fillPercent}
          icon={<GiftOutlined />}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.repeat) {
              return;
            }

            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              startHolding();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              stopHolding();
            }
          }}
          onPointerCancel={(event) => {
            releaseHold(event);
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            startHolding();
          }}
          onPointerUp={(event) => {
            releaseHold(event);
          }}
          pulseBurst={visualState.pulseBurst}
          rewardColor="#54ecff"
          size="large"
          wakePercent={visualState.wakePercent}
        >
          {visualState.label}
        </SignalButton>
      </div>

      <Flex align="center" gap={12} wrap="wrap">
        <Typography.Text style={copyStyle}>{visualState.status}</Typography.Text>
        <Typography.Text style={{ ...copyStyle, color: "rgba(84, 236, 255, 0.88)" }}>
          Triggered: {visualState.triggerCount}
        </Typography.Text>
        <Typography.Text style={copyStyle}>{sound.status}</Typography.Text>
        <Button size="small" disabled={!sound.isSupported} onClick={sound.toggleEnabled}>
          {sound.enabled ? "Mute Sound" : "Enable Sound"}
        </Button>
        <Button size="small" onClick={reset}>
          Reset Demo
        </Button>
      </Flex>
    </Space>
  );
}

const eyebrowStyle: CSSProperties = {
  display: "block",
  color: signalPalette.primary,
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
