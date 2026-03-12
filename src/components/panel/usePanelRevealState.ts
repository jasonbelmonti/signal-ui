import { useEffect, useRef, useState } from "react";

import type {
  PanelReveal,
  PanelRevealIntro,
  PanelRevealOutro,
  PanelRevealState,
} from "../Panel.js";

export const PANEL_REVEAL_INTRO_DURATION_MS = 620;
export const PANEL_REVEAL_SETTLE_DURATION_MS = 1120;
export const PANEL_REVEAL_DECAY_DURATION_MS = 560;
export const PANEL_REVEAL_OUTRO_DURATION_MS = 420;

export type PanelRevealPhase = "intro" | "settle" | "decay" | "outro";

type UsePanelRevealStateOptions = {
  reveal?: PanelReveal;
  revealIntro?: PanelRevealIntro;
  revealOutro?: PanelRevealOutro;
  revealState: PanelRevealState;
};

export function usePanelRevealState({
  reveal,
  revealIntro,
  revealOutro,
  revealState,
}: UsePanelRevealStateOptions) {
  const reducedMotion = prefersReducedMotion();
  const shouldAnimateIntro =
    reveal === "holographic" && revealIntro === "point" && revealState === "open" && !reducedMotion;
  const [renderedRevealState, setRenderedRevealState] = useState<PanelRevealState>(
    shouldAnimateIntro ? "hidden" : revealState,
  );
  const [revealPhase, setRevealPhase] = useState<PanelRevealPhase | undefined>(
    shouldAnimateIntro ? "intro" : undefined,
  );
  const renderedRevealStateRef = useRef<PanelRevealState>(renderedRevealState);

  useEffect(() => {
    renderedRevealStateRef.current = renderedRevealState;
  }, [renderedRevealState]);

  useEffect(() => {
    if (reveal !== "holographic") {
      return undefined;
    }

    const timeoutIds: number[] = [];
    const animationFrameIds: number[] = [];
    const currentRenderedRevealState = renderedRevealStateRef.current;
    const schedule = (callback: () => void, delayMs: number) => {
      timeoutIds.push(window.setTimeout(callback, delayMs));
    };
    const scheduleFrame = (callback: () => void) => {
      animationFrameIds.push(window.requestAnimationFrame(callback));
    };
    const setResolvedRevealState = (nextState: PanelRevealState) => {
      renderedRevealStateRef.current = nextState;
      setRenderedRevealState(nextState);
    };

    if (reducedMotion) {
      setRevealPhase(undefined);
      setResolvedRevealState(revealState);

      return () => {
        timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
        animationFrameIds.forEach((animationFrameId) => window.cancelAnimationFrame(animationFrameId));
      };
    }

    if (revealState === "open" && revealIntro === "point" && currentRenderedRevealState === "hidden") {
      setRevealPhase("intro");
      scheduleFrame(() => {
        setResolvedRevealState("open");
      });
      schedule(() => {
        setRevealPhase("settle");
      }, PANEL_REVEAL_INTRO_DURATION_MS);
      schedule(() => {
        setRevealPhase("decay");
      }, PANEL_REVEAL_INTRO_DURATION_MS + PANEL_REVEAL_SETTLE_DURATION_MS);
      schedule(() => {
        setRevealPhase(undefined);
      }, PANEL_REVEAL_INTRO_DURATION_MS + PANEL_REVEAL_SETTLE_DURATION_MS + PANEL_REVEAL_DECAY_DURATION_MS);
    } else if (
      revealState === "hidden" &&
      revealOutro === "point" &&
      currentRenderedRevealState !== "hidden"
    ) {
      setRevealPhase("outro");
      setResolvedRevealState("closed");

      schedule(() => {
        setResolvedRevealState("hidden");
        setRevealPhase(undefined);
      }, PANEL_REVEAL_OUTRO_DURATION_MS);
    } else {
      setRevealPhase(undefined);
      setResolvedRevealState(revealState);
    }

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      animationFrameIds.forEach((animationFrameId) => window.cancelAnimationFrame(animationFrameId));
    };
  }, [reducedMotion, reveal, revealIntro, revealOutro, revealState]);

  return {
    renderedRevealState,
    revealPhase,
  };
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
