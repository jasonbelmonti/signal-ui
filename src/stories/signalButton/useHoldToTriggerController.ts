import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";

import {
  HOLD_TICK_MS,
  advanceHoldToTriggerFrame,
  buildHoldToTriggerVisualState,
  createHoldToTriggerFrame,
  isSameHoldToTriggerFrame,
  isSameHoldToTriggerVisualState,
  type HoldToTriggerFrame,
  type HoldToTriggerVisualState,
} from "./holdToTriggerState.js";

type UseHoldToTriggerControllerOptions = {
  onFrame?: (nextFrame: HoldToTriggerFrame, previousFrame: HoldToTriggerFrame) => void;
  onHoldStart?: (frame: HoldToTriggerFrame) => void;
  onHoldStop?: (frame: HoldToTriggerFrame) => void;
  onReset?: (frame: HoldToTriggerFrame) => void;
};

export function useHoldToTriggerController({
  onFrame,
  onHoldStart,
  onHoldStop,
  onReset,
}: UseHoldToTriggerControllerOptions = {}) {
  const frameRef = useRef<HoldToTriggerFrame>(createHoldToTriggerFrame());
  const [visualState, setVisualState] = useState<HoldToTriggerVisualState>(() =>
    buildHoldToTriggerVisualState(frameRef.current),
  );
  const emitFrame = useEffectEvent((nextFrame: HoldToTriggerFrame, previousFrame: HoldToTriggerFrame) => {
    onFrame?.(nextFrame, previousFrame);
  });
  const emitHoldStart = useEffectEvent((frame: HoldToTriggerFrame) => {
    onHoldStart?.(frame);
  });
  const emitHoldStop = useEffectEvent((frame: HoldToTriggerFrame) => {
    onHoldStop?.(frame);
  });
  const emitReset = useEffectEvent((frame: HoldToTriggerFrame) => {
    onReset?.(frame);
  });

  function syncVisualState(frame: HoldToTriggerFrame, isTransition = false) {
    const updateVisualState = (currentState: HoldToTriggerVisualState) => {
      const nextState = buildHoldToTriggerVisualState(frame);
      return isSameHoldToTriggerVisualState(currentState, nextState) ? currentState : nextState;
    };

    if (isTransition) {
      startTransition(() => {
        setVisualState(updateVisualState);
      });
      return;
    }

    setVisualState(updateVisualState);
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const previousFrame = frameRef.current;
      const nextFrame = advanceHoldToTriggerFrame(previousFrame);

      if (isSameHoldToTriggerFrame(previousFrame, nextFrame)) {
        return;
      }

      frameRef.current = nextFrame;
      emitFrame(nextFrame, previousFrame);
      syncVisualState(nextFrame, true);
    }, HOLD_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const startHolding = () => {
    const currentFrame = frameRef.current;

    if (currentFrame.phase === "completed" || currentFrame.phase === "resolving") {
      return;
    }

    if (currentFrame.phase === "holding") {
      return;
    }

    const nextFrame: HoldToTriggerFrame = {
      ...currentFrame,
      phase: "holding",
    };

    frameRef.current = nextFrame;
    emitHoldStart(nextFrame);
    syncVisualState(nextFrame);
  };

  const stopHolding = () => {
    const currentFrame = frameRef.current;

    if (currentFrame.phase !== "holding") {
      return;
    }

    const nextFrame: HoldToTriggerFrame = {
      ...currentFrame,
      phase: currentFrame.charge > 0 ? "draining" : "idle",
    };

    frameRef.current = nextFrame;
    emitHoldStop(nextFrame);
    syncVisualState(nextFrame);
  };

  const reset = () => {
    const nextFrame = createHoldToTriggerFrame();

    frameRef.current = nextFrame;
    emitReset(nextFrame);
    syncVisualState(nextFrame);
  };

  return {
    reset,
    startHolding,
    stopHolding,
    visualState,
  };
}
