import { clamp01, easeOutCubic, roundPercent } from "./math.js";

export type HoldToTriggerPhase = "idle" | "holding" | "draining" | "resolving" | "completed";

export type HoldToTriggerFrame = {
  charge: number;
  phase: HoldToTriggerPhase;
  resolve: number;
  triggerCount: number;
};

export type HoldToTriggerVisualState = {
  cooldownPercent: number;
  fillPercent: number;
  label: string;
  phase: HoldToTriggerPhase;
  pulseBurst: number;
  status: string;
  triggerCount: number;
  wakePercent: number;
};

export const HOLD_TICK_MS = 40;
export const HOLD_TO_TRIGGER_MS = 1380;
export const DRAIN_MS = 520;
export const RESOLVE_MS = 640;

export function createHoldToTriggerFrame(): HoldToTriggerFrame {
  return {
    charge: 0,
    phase: "idle",
    resolve: 0,
    triggerCount: 0,
  };
}

export function advanceHoldToTriggerFrame(frame: HoldToTriggerFrame): HoldToTriggerFrame {
  let nextPhase = frame.phase;
  let nextCharge = frame.charge;
  let nextResolve = frame.resolve;
  let nextTriggerCount = frame.triggerCount;

  if (frame.phase === "holding") {
    nextCharge = clamp01(frame.charge + HOLD_TICK_MS / HOLD_TO_TRIGGER_MS);

    if (nextCharge >= 1) {
      nextCharge = 1;
      nextResolve = 0;
      nextPhase = "resolving";
      nextTriggerCount += 1;
    }
  } else if (frame.phase === "draining") {
    nextCharge = clamp01(frame.charge - HOLD_TICK_MS / DRAIN_MS);

    if (nextCharge <= 0) {
      nextCharge = 0;
      nextResolve = 0;
      nextPhase = "idle";
    }
  } else if (frame.phase === "resolving") {
    nextResolve = clamp01(frame.resolve + HOLD_TICK_MS / RESOLVE_MS);

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

export function buildHoldToTriggerVisualState(
  frame: HoldToTriggerFrame,
): HoldToTriggerVisualState {
  const fillPercent = roundPercent(frame.charge * 100);
  const wakePercent = roundPercent(clamp01((frame.charge - 0.34) / 0.66) * 100);
  const burstProgress = frame.phase === "resolving" ? easeOutCubic(frame.resolve) : 0;
  const cooldownPercent =
    frame.phase === "completed"
      ? 100
      : frame.phase === "resolving"
        ? roundPercent(easeOutCubic(clamp01((frame.resolve - 0.24) / 0.76)) * 100)
        : 0;

  if (frame.phase === "completed") {
    return {
      cooldownPercent: 100,
      fillPercent: 100,
      label: "Reward Dispensed",
      phase: frame.phase,
      pulseBurst: 0,
      status: "Action fired. The button is clamped in its completed confirmation state.",
      triggerCount: frame.triggerCount,
      wakePercent: 100,
    };
  }

  if (frame.phase === "resolving") {
    return {
      cooldownPercent,
      fillPercent: 100,
      label: "Trigger Claim",
      phase: frame.phase,
      pulseBurst: roundPercent(burstProgress * 100),
      status: "Burst triggered. In real use, your action would fire here.",
      triggerCount: frame.triggerCount,
      wakePercent: 100,
    };
  }

  if (frame.phase === "draining") {
    return {
      cooldownPercent: 0,
      fillPercent,
      label: fillPercent > 18 ? "Charge Lost" : "Hold To Claim",
      phase: frame.phase,
      pulseBurst: 0,
      status: "Released early. The button is draining back to idle.",
      triggerCount: frame.triggerCount,
      wakePercent,
    };
  }

  if (frame.phase === "holding") {
    return {
      cooldownPercent: 0,
      fillPercent,
      label: fillPercent >= 90 ? "Keep Holding" : "Hold To Prime",
      phase: frame.phase,
      pulseBurst: 0,
      status:
        fillPercent >= 90
          ? "Keep holding to cross the trigger threshold."
          : "Release before the threshold and the charge will unwind.",
      triggerCount: frame.triggerCount,
      wakePercent,
    };
  }

  return {
    cooldownPercent: 0,
    fillPercent: 0,
    label: "Hold To Claim",
    phase: frame.phase,
    pulseBurst: 0,
    status: "Press and hold to arm the action. Release early to cancel.",
    triggerCount: frame.triggerCount,
    wakePercent: 0,
  };
}

export function isSameHoldToTriggerFrame(
  currentFrame: HoldToTriggerFrame,
  nextFrame: HoldToTriggerFrame,
) {
  return (
    currentFrame.charge === nextFrame.charge &&
    currentFrame.phase === nextFrame.phase &&
    currentFrame.resolve === nextFrame.resolve &&
    currentFrame.triggerCount === nextFrame.triggerCount
  );
}

export function isSameHoldToTriggerVisualState(
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
