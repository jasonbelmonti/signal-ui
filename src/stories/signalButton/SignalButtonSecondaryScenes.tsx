import { GiftOutlined, RadarChartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Space, Typography } from "antd";
import { startTransition, useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { SignalButton } from "../../components/SignalButton.js";
import { signalPalette } from "../../theme/signalTheme.js";
import {
  getLootBoxEffectState,
  type LootBoxEffectState,
} from "./lootBoxEffect.js";
import { useHoldToTriggerController } from "./useHoldToTriggerController.js";
import { useHoldToTriggerLootBoxSound } from "./sound/useHoldToTriggerLootBoxSound.js";

export function SignalButtonHoldToTriggerScene() {
  return (
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
  );
}

export function SignalButtonEffectsScene() {
  return (
    <Flex vertical gap={24} style={{ maxWidth: 1120, margin: "0 auto" }}>
      <Card
        style={{
          borderColor: "rgba(192, 254, 4, 0.4)",
          background:
            "linear-gradient(135deg, rgba(192, 254, 4, 0.14), transparent 38%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 52%), #090909",
        }}
      >
        <Space direction="vertical" size={12}>
          <Typography.Text style={eyebrowStyle}>Signal Button / Effects Lab</Typography.Text>
          <Typography.Title level={2} className="signal-ui-text-display" style={{ margin: 0 }}>
            Motion studies and reward feedback outside the core reference story
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            These studies keep the more theatrical fill, pulse, and reward treatments visible
            without making them look like the default component reference surface.
          </Typography.Paragraph>
        </Space>
      </Card>

      <Flex align="stretch" gap={24} wrap="wrap">
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
              Fills like a cache meter, wakes every pixel into a solid prize state, then throws
              fast concentric pulse rings across the surface before settling into a calmer
              confirmation color.
            </Typography.Paragraph>
            <LootBoxSignalButton />
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
              Same structure, but with violet acting as a transmission or event lane instead of a
              new default interaction color.
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
  );
}

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
    if (
      event &&
      typeof event.pointerId === "number" &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
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
        <Button disabled={!sound.isSupported} onClick={sound.toggleEnabled} size="small">
          {sound.enabled ? "Mute Sound" : "Enable Sound"}
        </Button>
        <Button onClick={reset} size="small">
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
  flex: "1 1 320px",
  minHeight: 280,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 52%), rgba(12, 12, 12, 0.94)",
};
