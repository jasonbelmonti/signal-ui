import { GiftOutlined, RadarChartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { startTransition, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { SignalButton } from "../components/SignalButton.js";
import { marathonDosPalette } from "../theme/marathonDosTheme.js";

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
          <Typography.Title level={2} className="marathon-text-display" style={{ margin: 0 }}>
            Hold to arm, release to cancel
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            Press and hold to fill the button. Releasing early drains it back down. Holding through
            the threshold triggers the pulse, fires the simulated action, and clamps the button in
            the completed state.
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
  cooldownPercent: number;
  fillPercent: number;
  pulseBurst: number;
  wakePercent: number;
  label: string;
};

type HoldToTriggerPhase = "idle" | "holding" | "draining" | "resolving" | "completed";

type HoldToTriggerVisualState = {
  cooldownPercent: number;
  fillPercent: number;
  label: string;
  phase: HoldToTriggerPhase;
  pulseBurst: number;
  status: string;
  triggerCount: number;
  wakePercent: number;
};

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
  const [visualState, setVisualState] = useState<HoldToTriggerVisualState>(() =>
    buildHoldToTriggerVisualState("idle", 0, 0, 0),
  );
  const phaseRef = useRef<HoldToTriggerPhase>("idle");
  const chargeRef = useRef(0);
  const resolveRef = useRef(0);
  const triggerCountRef = useRef(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const nextFrame = advanceHoldToTriggerFrame(
        phaseRef.current,
        chargeRef.current,
        resolveRef.current,
        triggerCountRef.current,
      );

      phaseRef.current = nextFrame.phase;
      chargeRef.current = nextFrame.charge;
      resolveRef.current = nextFrame.resolve;
      triggerCountRef.current = nextFrame.triggerCount;

      startTransition(() => {
        setVisualState((currentState) => {
          const nextState = buildHoldToTriggerVisualState(
            nextFrame.phase,
            nextFrame.charge,
            nextFrame.resolve,
            nextFrame.triggerCount,
          );

          if (isSameHoldToTriggerState(currentState, nextState)) {
            return currentState;
          }

          return nextState;
        });
      });
    }, HOLD_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const startHolding = () => {
    if (phaseRef.current === "completed" || phaseRef.current === "resolving") {
      return;
    }

    phaseRef.current = "holding";
  };

  const stopHolding = () => {
    if (phaseRef.current !== "holding") {
      return;
    }

    phaseRef.current = chargeRef.current > 0 ? "draining" : "idle";
  };

  const resetDemo = () => {
    phaseRef.current = "idle";
    chargeRef.current = 0;
    resolveRef.current = 0;
    triggerCountRef.current = 0;
    setVisualState(buildHoldToTriggerVisualState("idle", 0, 0, 0));
  };

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
        <Button size="small" onClick={resetDemo}>
          Reset Demo
        </Button>
      </Flex>
    </Space>
  );
}

function getLootBoxEffectState(elapsedMs: number): LootBoxEffectState {
  if (elapsedMs < 850) {
    const progress = easeOutCubic(elapsedMs / 850);

    return {
      cooldownPercent: 0,
      fillPercent: roundPercent(12 + progress * 88),
      wakePercent: 0,
      pulseBurst: 0,
      label: "Prime Cache",
    };
  }

  if (elapsedMs < 1450) {
    const progress = easeOutCubic((elapsedMs - 850) / 600);

    return {
      cooldownPercent: 0,
      fillPercent: 100,
      wakePercent: roundPercent(progress * 100),
      pulseBurst: 0,
      label: "Wake Relic",
    };
  }

  if (elapsedMs < 2100) {
    const progress = clamp01((elapsedMs - 1450) / 650);
    const stagedProgress =
      progress < 0.78
        ? easeOutCubic(progress / 0.78) * 0.72
        : 0.72 + easeOutCubic((progress - 0.78) / 0.22) * 0.28;
    const cooldownProgress = progress < 0.62 ? 0 : easeOutCubic((progress - 0.62) / 0.38);

    return {
      cooldownPercent: roundPercent(cooldownProgress * 62),
      fillPercent: 100,
      wakePercent: 100,
      pulseBurst: roundPercent(stagedProgress * 100),
      label: "Crack Loot",
    };
  }

  const progress = easeOutCubic((elapsedMs - 2100) / 300);

  return {
    cooldownPercent: roundPercent(progress * 100),
    fillPercent: 100,
    wakePercent: 100,
    pulseBurst: 0,
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

const HOLD_TICK_MS = 40;
const HOLD_TO_TRIGGER_MS = 1380;
const DRAIN_MS = 520;
const RESOLVE_MS = 640;

function advanceHoldToTriggerFrame(
  phase: HoldToTriggerPhase,
  charge: number,
  resolve: number,
  triggerCount: number,
) {
  let nextPhase = phase;
  let nextCharge = charge;
  let nextResolve = resolve;
  let nextTriggerCount = triggerCount;

  if (phase === "holding") {
    nextCharge = clamp01(charge + HOLD_TICK_MS / HOLD_TO_TRIGGER_MS);

    if (nextCharge >= 1) {
      nextCharge = 1;
      nextResolve = 0;
      nextPhase = "resolving";
      nextTriggerCount += 1;
    }
  } else if (phase === "draining") {
    nextCharge = clamp01(charge - HOLD_TICK_MS / DRAIN_MS);

    if (nextCharge <= 0) {
      nextCharge = 0;
      nextResolve = 0;
      nextPhase = "idle";
    }
  } else if (phase === "resolving") {
    nextResolve = clamp01(resolve + HOLD_TICK_MS / RESOLVE_MS);

    if (nextResolve >= 1) {
      nextResolve = 1;
      nextPhase = "completed";
    }
  }

  return {
    charge: nextCharge,
    phase: nextPhase,
    resolve: nextResolve,
    triggerCount: nextTriggerCount,
  };
}

function buildHoldToTriggerVisualState(
  phase: HoldToTriggerPhase,
  charge: number,
  resolve: number,
  triggerCount: number,
): HoldToTriggerVisualState {
  const fillPercent = roundPercent(charge * 100);
  const wakePercent = roundPercent(clamp01((charge - 0.34) / 0.66) * 100);
  const burstProgress = phase === "resolving" ? easeOutCubic(resolve) : 0;
  const cooldownPercent =
    phase === "completed"
      ? 100
      : phase === "resolving"
        ? roundPercent(easeOutCubic(clamp01((resolve - 0.24) / 0.76)) * 100)
        : 0;

  if (phase === "completed") {
    return {
      cooldownPercent: 100,
      fillPercent: 100,
      label: "Reward Dispensed",
      phase,
      pulseBurst: 0,
      status: "Action fired. The button is clamped in its completed confirmation state.",
      triggerCount,
      wakePercent: 100,
    };
  }

  if (phase === "resolving") {
    return {
      cooldownPercent,
      fillPercent: 100,
      label: "Trigger Claim",
      phase,
      pulseBurst: roundPercent(burstProgress * 100),
      status: "Burst triggered. In real use, your action would fire here.",
      triggerCount,
      wakePercent: 100,
    };
  }

  if (phase === "draining") {
    return {
      cooldownPercent: 0,
      fillPercent,
      label: fillPercent > 18 ? "Charge Lost" : "Hold To Claim",
      phase,
      pulseBurst: 0,
      status: "Released early. The button is draining back to idle.",
      triggerCount,
      wakePercent,
    };
  }

  if (phase === "holding") {
    return {
      cooldownPercent: 0,
      fillPercent,
      label: fillPercent >= 90 ? "Keep Holding" : "Hold To Prime",
      phase,
      pulseBurst: 0,
      status:
        fillPercent >= 90
          ? "Keep holding to cross the trigger threshold."
          : "Release before the threshold and the charge will unwind.",
      triggerCount,
      wakePercent,
    };
  }

  return {
    cooldownPercent: 0,
    fillPercent: 0,
    label: "Hold To Claim",
    phase,
    pulseBurst: 0,
    status: "Press and hold to arm the action. Release early to cancel.",
    triggerCount,
    wakePercent: 0,
  };
}

function isSameHoldToTriggerState(
  currentState: HoldToTriggerVisualState,
  nextState: HoldToTriggerVisualState,
) {
  return (
    currentState.cooldownPercent === nextState.cooldownPercent &&
    currentState.fillPercent === nextState.fillPercent &&
    currentState.label === nextState.label &&
    currentState.phase === nextState.phase &&
    currentState.pulseBurst === nextState.pulseBurst &&
    currentState.status === nextState.status &&
    currentState.triggerCount === nextState.triggerCount &&
    currentState.wakePercent === nextState.wakePercent
  );
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
