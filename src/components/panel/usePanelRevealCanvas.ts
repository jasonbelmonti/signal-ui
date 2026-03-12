import { useEffect, useEffectEvent, useRef } from "react";
import type { RefObject } from "react";

import type { PanelRevealState } from "../Panel.js";
import { clamp, type RgbChannels } from "../signalButton/utils.js";
import { renderPanelRevealBuffer } from "./renderPanelRevealBuffer.js";
import {
  PANEL_REVEAL_DECAY_DURATION_MS,
  PANEL_REVEAL_INTRO_DURATION_MS,
  PANEL_REVEAL_SETTLE_DURATION_MS,
  PANEL_REVEAL_OUTRO_DURATION_MS,
  type PanelRevealPhase,
} from "./usePanelRevealState.js";

type UsePanelRevealCanvasOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  revealPhase?: PanelRevealPhase;
  revealState: PanelRevealState;
};

export function usePanelRevealCanvas({
  canvasRef,
  revealPhase,
  revealState,
}: UsePanelRevealCanvasOptions) {
  const phaseStartTimeRef = useRef<number | null>(null);
  const activePhaseRef = useRef<PanelRevealPhase | undefined>(revealPhase);

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

    const accent = resolveCanvasAccent(canvas);

    if (!revealPhase) {
      phaseStartTimeRef.current = null;
      activePhaseRef.current = undefined;

      if (revealState === "closed") {
        renderPanelRevealBuffer({
          accent,
          cols,
          ctx,
          phase: "intro",
          progress: 1,
          rows,
          timeMs,
        });
      } else {
        ctx.clearRect(0, 0, cols, rows);
      }

      return;
    }

    if (activePhaseRef.current !== revealPhase || phaseStartTimeRef.current === null) {
      activePhaseRef.current = revealPhase;
      phaseStartTimeRef.current = timeMs;
    }

    const durationMs = getRevealPhaseDuration(revealPhase);
    const phaseStartTime = phaseStartTimeRef.current ?? timeMs;
    const progress = clamp((timeMs - phaseStartTime) / durationMs, 0, 1);

    renderPanelRevealBuffer({
      accent,
      cols,
      ctx,
      phase: revealPhase,
      progress,
      rows,
      timeMs,
    });
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || typeof window === "undefined") {
      return;
    }

    let animationFrameId = 0;
    let resizeObserver: ResizeObserver | undefined;

    const drawStatic = () => {
      drawFrame(performance.now());
    };

    const renderLoop = (timeMs: number) => {
      drawFrame(timeMs);

      if (!revealPhase) {
        return;
      }

      const phaseStartTime = phaseStartTimeRef.current ?? timeMs;
      const durationMs = getRevealPhaseDuration(revealPhase);

      if (timeMs - phaseStartTime < durationMs) {
        animationFrameId = window.requestAnimationFrame(renderLoop);
      } else {
        drawFrame(phaseStartTime + durationMs);
      }
    };

    const restart = () => {
      window.cancelAnimationFrame(animationFrameId);
      phaseStartTimeRef.current = null;
      activePhaseRef.current = revealPhase;
      drawStatic();

      if (revealPhase) {
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
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
    };
  }, [canvasRef, drawFrame, revealPhase, revealState]);
}

function getCanvasGrid(width: number, height: number) {
  const cellSize = clamp(Math.round(Math.min(width / 28, height / 16)), 10, 18);

  return {
    cols: Math.max(12, Math.ceil(width / cellSize)),
    rows: Math.max(8, Math.ceil(height / cellSize)),
  };
}

function getCanvasContext(canvas: HTMLCanvasElement, cols: number, rows: number) {
  if (canvas.width !== cols || canvas.height !== rows) {
    canvas.width = cols;
    canvas.height = rows;
  }

  return canvas.getContext("2d");
}

function getRevealPhaseDuration(phase: PanelRevealPhase) {
  if (phase === "intro") {
    return PANEL_REVEAL_INTRO_DURATION_MS;
  }

  if (phase === "settle") {
    return PANEL_REVEAL_SETTLE_DURATION_MS;
  }

  if (phase === "decay") {
    return PANEL_REVEAL_DECAY_DURATION_MS;
  }

  return PANEL_REVEAL_OUTRO_DURATION_MS;
}

function resolveCanvasAccent(canvas: HTMLCanvasElement): RgbChannels {
  const color = getComputedStyle(canvas).color;
  const channelMatches = color.match(/\d+(\.\d+)?/g);

  if (!channelMatches || channelMatches.length < 3) {
    return [192, 254, 4];
  }

  return channelMatches.slice(0, 3).map((channel) => clamp(Math.round(Number(channel)), 0, 255)) as RgbChannels;
}
