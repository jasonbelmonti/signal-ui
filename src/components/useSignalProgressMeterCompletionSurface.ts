import { useEffect, useEffectEvent, useRef } from "react";
import type { RefObject } from "react";

import { renderSignalProgressMeterCompletionSurface } from "./renderSignalProgressMeterCompletionSurface.js";

type SignalProgressMeterCompletionSurfaceTone = "primary" | "violet";

type UseSignalProgressMeterCompletionSurfaceOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  enabled: boolean;
  tone: SignalProgressMeterCompletionSurfaceTone;
};

const COMPLETION_SURFACE_REVEAL_MS = 1000;

export function useSignalProgressMeterCompletionSurface({
  canvasRef,
  enabled,
  tone,
}: UseSignalProgressMeterCompletionSurfaceOptions) {
  const completionProgressRef = useRef(0);

  const drawFrame = useEffectEvent((progress: number) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const pixelSize = clamp(Math.round(rect.height / 3.1), 4, 8);
    const cols = Math.max(1, Math.ceil(rect.width / pixelSize));
    const rows = Math.max(1, Math.ceil(rect.height / pixelSize));
    const ctx = getCanvasContext(canvas, cols, rows);

    if (!ctx) {
      return;
    }

    ctx.imageSmoothingEnabled = false;

    renderSignalProgressMeterCompletionSurface({
      cols,
      ctx,
      progress,
      rows,
      tone,
    });
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || typeof window === "undefined") {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let animationFrameId = 0;
    let resizeObserver: ResizeObserver | undefined;

    const clearCanvas = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;

      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const renderLoop = (startedAt: number) => (timeMs: number) => {
      const nextProgress = clamp((timeMs - startedAt) / COMPLETION_SURFACE_REVEAL_MS, 0, 1);

      completionProgressRef.current = nextProgress;
      drawFrame(nextProgress);

      if (nextProgress < 1) {
        animationFrameId = window.requestAnimationFrame(renderLoop(startedAt));
      }
    };

    const restart = () => {
      clearCanvas();
      completionProgressRef.current = 0;

      if (!enabled) {
        return;
      }

      if (motionQuery.matches) {
        completionProgressRef.current = 1;
        drawFrame(1);
        return;
      }

      drawFrame(0);
      const startedAt = performance.now();
      animationFrameId = window.requestAnimationFrame(renderLoop(startedAt));
    };

    restart();

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        drawFrame(enabled ? completionProgressRef.current : 0);
      });
      resizeObserver.observe(canvas);
    }

    motionQuery.addEventListener("change", restart);

    return () => {
      clearCanvas();
      motionQuery.removeEventListener("change", restart);
      resizeObserver?.disconnect();
    };
  }, [canvasRef, drawFrame, enabled, tone]);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getCanvasContext(canvas: HTMLCanvasElement, cols: number, rows: number) {
  if (canvas.width !== cols || canvas.height !== rows) {
    canvas.width = cols;
    canvas.height = rows;
  }

  return canvas.getContext("2d");
}
