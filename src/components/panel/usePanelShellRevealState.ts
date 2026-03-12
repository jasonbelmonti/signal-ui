import { useEffect, useRef, useState } from "react";

import type {
  PanelReveal,
  PanelRevealIntro,
  PanelRevealOutro,
  PanelRevealState,
} from "../Panel.js";

const PANEL_HOLOGRAPHIC_REVEAL_DURATION_MS = 520;
const PANEL_POINT_REVEAL_BEAM_DURATION_MS = 220;

type ResolvedPanelRevealState = PanelRevealState;

export type PanelShellRevealPhase = "intro-point" | "outro-point";

type UsePanelShellRevealStateOptions = {
  reveal?: PanelReveal;
  revealIntro?: PanelRevealIntro;
  revealOutro?: PanelRevealOutro;
  revealState: PanelRevealState;
};

export function usePanelShellRevealState({
  reveal,
  revealIntro,
  revealOutro,
  revealState,
}: UsePanelShellRevealStateOptions) {
  const reducedMotion = prefersReducedMotion();
  const shouldRenderPointRevealOnOpen =
    reveal === "holographic" && revealIntro === "point" && revealState === "open" && !reducedMotion;
  const [renderedRevealState, setRenderedRevealState] = useState<ResolvedPanelRevealState>(
    shouldRenderPointRevealOnOpen ? "hidden" : revealState,
  );
  const [revealPhase, setRevealPhase] = useState<PanelShellRevealPhase | undefined>(
    shouldRenderPointRevealOnOpen ? "intro-point" : undefined,
  );
  const renderedRevealStateRef = useRef<ResolvedPanelRevealState>(renderedRevealState);

  useEffect(() => {
    renderedRevealStateRef.current = renderedRevealState;
  }, [renderedRevealState]);

  useEffect(() => {
    if (reveal !== "holographic") {
      return undefined;
    }

    const setResolvedRevealState = (nextState: ResolvedPanelRevealState) => {
      renderedRevealStateRef.current = nextState;
      setRenderedRevealState(nextState);
    };
    const timeoutIds: number[] = [];
    const animationFrameIds: number[] = [];
    const schedule = (callback: () => void, delayMs: number) => {
      timeoutIds.push(window.setTimeout(callback, delayMs));
    };
    const scheduleFrame = (callback: () => void) => {
      animationFrameIds.push(window.requestAnimationFrame(callback));
    };
    const currentRenderedRevealState = renderedRevealStateRef.current;

    if (reducedMotion) {
      setRevealPhase(undefined);
      setResolvedRevealState(revealState);
      return () => {
        timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
        animationFrameIds.forEach((animationFrameId) => window.cancelAnimationFrame(animationFrameId));
      };
    }

    if (revealState === "open" && revealIntro === "point" && currentRenderedRevealState === "hidden") {
      setRevealPhase("intro-point");
      schedule(() => {
        setRevealPhase(undefined);
        setResolvedRevealState("closed");
        scheduleFrame(() => {
          setResolvedRevealState("open");
        });
      }, PANEL_POINT_REVEAL_BEAM_DURATION_MS);
    } else if (
      revealState === "hidden" &&
      revealOutro === "point" &&
      currentRenderedRevealState !== "hidden"
    ) {
      setRevealPhase("outro-point");

      if (currentRenderedRevealState === "open") {
        setResolvedRevealState("closed");
        schedule(() => {
          setResolvedRevealState("hidden");
        }, PANEL_HOLOGRAPHIC_REVEAL_DURATION_MS);
        schedule(() => {
          setRevealPhase(undefined);
        }, PANEL_HOLOGRAPHIC_REVEAL_DURATION_MS + PANEL_POINT_REVEAL_BEAM_DURATION_MS);
      } else {
        setResolvedRevealState("hidden");
        schedule(() => {
          setRevealPhase(undefined);
        }, PANEL_POINT_REVEAL_BEAM_DURATION_MS);
      }
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
    revealPhase,
    renderedRevealState,
  };
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
