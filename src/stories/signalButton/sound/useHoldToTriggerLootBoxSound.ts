import { useEffect, useEffectEvent, useRef, useState } from "react";

import type { HoldToTriggerFrame } from "../holdToTriggerState.js";

import {
  createLootBoxHoldSoundController,
  type LootBoxHoldSoundController,
} from "./createLootBoxHoldSoundController.js";

export function useHoldToTriggerLootBoxSound() {
  const isSupported = typeof window !== "undefined" && "AudioContext" in window;
  const [enabled, setEnabled] = useState(isSupported);
  const [hasArmedAudio, setHasArmedAudio] = useState(false);
  const controllerRef = useRef<LootBoxHoldSoundController | null>(null);
  const ensureController = useEffectEvent(() => {
    if (!isSupported) {
      return null;
    }

    if (controllerRef.current) {
      return controllerRef.current;
    }

    controllerRef.current = createLootBoxHoldSoundController();
    return controllerRef.current;
  });

  const handleHoldStart = useEffectEvent((frame: HoldToTriggerFrame) => {
    if (!enabled) {
      return;
    }

    const controller = ensureController();

    if (!controller) {
      return;
    }

    setHasArmedAudio(true);
    void controller.resume();
    controller.startHolding(frame.charge);
  });

  const handleHoldStop = useEffectEvent((frame: HoldToTriggerFrame) => {
    if (!enabled) {
      return;
    }

    controllerRef.current?.stopHolding(frame.charge);
  });

  const handleFrame = useEffectEvent((nextFrame: HoldToTriggerFrame, previousFrame: HoldToTriggerFrame) => {
    if (!enabled) {
      return;
    }

    controllerRef.current?.syncFrame(nextFrame, previousFrame);
  });

  const handleReset = useEffectEvent(() => {
    controllerRef.current?.reset();
  });

  useEffect(() => {
    if (enabled) {
      return;
    }

    controllerRef.current?.reset();
  }, [enabled]);

  useEffect(() => {
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  const toggleEnabled = () => {
    setEnabled((currentEnabled) => !currentEnabled);
  };

  const status = !isSupported
    ? "Audio unavailable in this browser."
    : !enabled
      ? "Sound muted."
      : hasArmedAudio
        ? "Sound armed. Hold to hear the build and drop."
        : "Sound arms on first hold.";

  return {
    enabled,
    handleFrame,
    handleHoldStart,
    handleHoldStop,
    handleReset,
    isSupported,
    status,
    toggleEnabled,
  };
}
