import { useEffect, useEffectEvent } from "react";
import type { RefObject } from "react";

import { renderSignalProgressMeterCompletionSurface } from "./renderSignalProgressMeterCompletionSurface.js";

type SignalProgressMeterCompletionSurfaceTone = "primary" | "violet";

type UseSignalProgressMeterCompletionSurfaceOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  enabled: boolean;
  tone: SignalProgressMeterCompletionSurfaceTone;
};

export function useSignalProgressMeterCompletionSurface({
  canvasRef,
  enabled,
  tone,
}: UseSignalProgressMeterCompletionSurfaceOptions) {
  const drawFrame = useEffectEvent((timeMs: number) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const pixelSize = clamp(Math.round(rect.height / 4.25), 3, 6);
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
      rows,
      timeMs,
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

    const renderOnce = () => {
      drawFrame(performance.now());
    };

    const renderLoop = (timeMs: number) => {
      drawFrame(timeMs);

      if (!motionQuery.matches) {
        animationFrameId = window.requestAnimationFrame(renderLoop);
      }
    };

    const restart = () => {
      clearCanvas();

      if (!enabled) {
        return;
      }

      renderOnce();

      if (!motionQuery.matches) {
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
