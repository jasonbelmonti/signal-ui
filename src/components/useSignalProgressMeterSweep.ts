import { useEffect, useEffectEvent, useRef } from "react";
import type { RefObject } from "react";

type UseSignalProgressMeterSweepOptions = {
  enabled: boolean;
  meterRef: RefObject<HTMLElement | null>;
  progress: number;
};

const FULL_SPAN_SWEEP_MS = 980;
const SWEEP_ENTRY_WIDTH = 0.18;
const SWEEP_EXIT_WIDTH = 0.08;
const SWEEP_DISTANCE_SCALE = 1 + SWEEP_ENTRY_WIDTH + SWEEP_EXIT_WIDTH;
const MIN_PROGRESS_SPAN = 28;
const FULL_SPAN_SPEED = (100 * SWEEP_DISTANCE_SCALE) / FULL_SPAN_SWEEP_MS;
const OPACITY_PEAK = 0.98;

export function useSignalProgressMeterSweep({
  enabled,
  meterRef,
  progress,
}: UseSignalProgressMeterSweepOptions) {
  const distanceRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const renderFrame = useEffectEvent((timeMs: number) => {
    const meter = meterRef.current;

    if (!meter) {
      return;
    }

    const sweepSpan = Math.max(Math.min(progress, 100), MIN_PROGRESS_SPAN);
    const sweepDistance = sweepSpan * SWEEP_DISTANCE_SCALE;
    const previousTime = lastTimeRef.current ?? timeMs;
    const deltaMs = Math.min(48, Math.max(0, timeMs - previousTime));

    lastTimeRef.current = timeMs;
    distanceRef.current += deltaMs * FULL_SPAN_SPEED;

    while (distanceRef.current > sweepDistance) {
      distanceRef.current -= sweepDistance;
    }

    const rawPhase = sweepDistance <= 0 ? 0 : distanceRef.current / sweepDistance;
    const phase = mapSweepPhase(rawPhase);

    meter.style.setProperty("--signal-ui-progress-meter-sweep-phase", phase.toFixed(5));
    meter.style.setProperty(
      "--signal-ui-progress-meter-sweep-opacity",
      formatSweepOpacity(rawPhase),
    );
  });

  useEffect(() => {
    const meter = meterRef.current;

    if (!meter || typeof window === "undefined") {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let animationFrameId = 0;

    const setSweepState = (phase: number, opacity: number) => {
      meter.style.setProperty("--signal-ui-progress-meter-sweep-phase", phase.toFixed(5));
      meter.style.setProperty("--signal-ui-progress-meter-sweep-opacity", opacity.toFixed(5));
    };

    const stopSweep = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      lastTimeRef.current = null;
    };

    const renderLoop = (timeMs: number) => {
      renderFrame(timeMs);
      animationFrameId = window.requestAnimationFrame(renderLoop);
    };

    const restart = () => {
      stopSweep();

      if (!enabled) {
        distanceRef.current = 0;
        setSweepState(0, 0);
        return;
      }

      if (motionQuery.matches) {
        setSweepState(1, 0.24);
        return;
      }

      lastTimeRef.current = null;
      renderFrame(performance.now());
      animationFrameId = window.requestAnimationFrame(renderLoop);
    };

    restart();
    motionQuery.addEventListener("change", restart);

    return () => {
      stopSweep();
      motionQuery.removeEventListener("change", restart);
    };
  }, [enabled, meterRef, renderFrame]);
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function formatSweepOpacity(phase: number) {
  if (phase <= 0.08) {
    return ((phase / 0.08) * OPACITY_PEAK).toFixed(5);
  }

  if (phase >= 0.82) {
    return Math.max(0, (1 - easeOutCubic((phase - 0.82) / 0.18)) * OPACITY_PEAK).toFixed(5);
  }

  return OPACITY_PEAK.toFixed(5);
}

function mapSweepPhase(phase: number) {
  if (phase <= 0.82) {
    return (phase / 0.82) * 0.9;
  }

  return 0.9 + easeOutCubic((phase - 0.82) / 0.18) * 0.1;
}
