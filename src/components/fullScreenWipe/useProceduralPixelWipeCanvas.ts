import { useEffect, useEffectEvent, useRef } from "react";
import type { RefObject } from "react";

import type { FullScreenWipeState } from "../FullScreenWipe.js";
import { clamp, type RgbChannels } from "../signalButton/utils.js";
import { renderProceduralPixelWipeBuffer } from "./renderProceduralPixelWipeBuffer.js";
import type { FullScreenWipePhase } from "./useFullScreenWipeState.js";

type UseProceduralPixelWipeCanvasOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  durationMs: number;
  phase?: FullScreenWipePhase;
  reducedMotion: boolean;
  state: FullScreenWipeState;
};

export function useProceduralPixelWipeCanvas({
  canvasRef,
  durationMs,
  phase,
  reducedMotion,
  state,
}: UseProceduralPixelWipeCanvasOptions) {
  const phaseStartTimeRef = useRef<number | null>(null);
  const activePhaseRef = useRef<FullScreenWipePhase | undefined>(phase);

  const drawFrame = useEffectEvent((timeMs: number) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const { cols, rows } = getCanvasGrid(rect.width, rect.height);
    const ctx = getCanvasContext(canvas, cols, rows);

    if (!ctx) {
      return;
    }

    ctx.imageSmoothingEnabled = false;

    const accent = resolveChannels(getComputedStyle(canvas).color, [192, 254, 4]);
    const cover = resolveCoverChannels(canvas);

    if (!phase) {
      phaseStartTimeRef.current = null;
      activePhaseRef.current = undefined;

      if (state === "open") {
        ctx.clearRect(0, 0, cols, rows);
        return;
      }

      renderProceduralPixelWipeBuffer({
        accent,
        cols,
        cover,
        ctx,
        phase: "closed",
        progress: 1,
        rows,
        timeMs: reducedMotion ? 0 : timeMs,
      });

      return;
    }

    if (activePhaseRef.current !== phase || phaseStartTimeRef.current === null) {
      activePhaseRef.current = phase;
      phaseStartTimeRef.current = timeMs;
    }

    const phaseStartTime = phaseStartTimeRef.current ?? timeMs;
    const progress = clamp((timeMs - phaseStartTime) / durationMs, 0, 1);

    renderProceduralPixelWipeBuffer({
      accent,
      cols,
      cover,
      ctx,
      phase,
      progress,
      rows,
      timeMs,
    });
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || typeof window === "undefined") {
      return undefined;
    }

    let animationFrameId = 0;
    let resizeObserver: ResizeObserver | undefined;
    let disposed = false;
    const shouldAnimate = phase !== undefined || (state === "closed" && !reducedMotion);

    const renderLoop = (timeMs: number) => {
      if (disposed) {
        return;
      }

      drawFrame(timeMs);

      if (shouldAnimate) {
        animationFrameId = window.requestAnimationFrame(renderLoop);
      }
    };

    const restart = () => {
      window.cancelAnimationFrame(animationFrameId);
      phaseStartTimeRef.current = null;
      activePhaseRef.current = phase;
      drawFrame(performance.now());

      if (shouldAnimate) {
        animationFrameId = window.requestAnimationFrame(renderLoop);
      }
    };

    restart();

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        restart();
      });
      resizeObserver.observe(canvas);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
    };
  }, [canvasRef, drawFrame, durationMs, phase, reducedMotion, state]);
}

function getCanvasGrid(width: number, height: number) {
  const cellSize = clamp(Math.round(Math.min(width / 40, height / 22)), 10, 18);

  return {
    cols: Math.max(24, Math.ceil(width / cellSize)),
    rows: Math.max(14, Math.ceil(height / cellSize)),
  };
}

function getCanvasContext(canvas: HTMLCanvasElement, cols: number, rows: number) {
  if (canvas.width !== cols || canvas.height !== rows) {
    canvas.width = cols;
    canvas.height = rows;
  }

  return canvas.getContext("2d");
}

function resolveChannels(value: string, fallback: RgbChannels) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return fallback;
  }

  const hexMatch = normalizedValue.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (hexMatch?.[1]) {
    return parseHexChannels(hexMatch[1]);
  }

  const channelMatches = value.match(/\d+(\.\d+)?/g);

  if (!channelMatches || channelMatches.length < 3) {
    return fallback;
  }

  return channelMatches.slice(0, 3).map((channel) => clamp(Math.round(Number(channel)), 0, 255)) as RgbChannels;
}

function resolveCoverChannels(canvas: HTMLCanvasElement) {
  const computedStyle = getComputedStyle(canvas);
  const coverValue = computedStyle.getPropertyValue("--signal-ui-full-screen-wipe-cover");

  return resolveChannels(coverValue, [4, 5, 8]);
}

function parseHexChannels(value: string): RgbChannels {
  const expandedValue =
    value.length === 3
      ? value
          .split("")
          .map((channel) => `${channel}${channel}`)
          .join("")
      : value;

  return [
    Number.parseInt(expandedValue.slice(0, 2), 16),
    Number.parseInt(expandedValue.slice(2, 4), 16),
    Number.parseInt(expandedValue.slice(4, 6), 16),
  ];
}
