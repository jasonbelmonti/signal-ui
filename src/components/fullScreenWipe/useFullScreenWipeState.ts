import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { FullScreenWipeState } from "../FullScreenWipe.js";

export type FullScreenWipePhase = "opening" | "closing";

export function getFullScreenWipePhaseDurationMs(
  durationMs: number,
  _phase: FullScreenWipePhase,
) {
  return durationMs;
}

type UseFullScreenWipeStateOptions = {
  durationMs: number;
  state: FullScreenWipeState;
};

type FullScreenWipeVisualState = {
  phase?: FullScreenWipePhase;
  renderedState: FullScreenWipeState;
};

export function useFullScreenWipeState({
  durationMs,
  state,
}: UseFullScreenWipeStateOptions) {
  const reducedMotion = prefersReducedMotion();
  const [visualState, setVisualState] = useState<FullScreenWipeVisualState>({
    phase: undefined,
    renderedState: state,
  });
  const previousStateRef = useRef<FullScreenWipeState>(state);

  useIsomorphicLayoutEffect(() => {
    const previousState = previousStateRef.current;
    previousStateRef.current = state;

    if (reducedMotion || previousState === state) {
      setVisualState({
        phase: undefined,
        renderedState: state,
      });
      return undefined;
    }

    const nextPhase: FullScreenWipePhase = state === "open" ? "opening" : "closing";
    setVisualState({
      phase: nextPhase,
      renderedState: previousState,
    });

    const timeoutId = window.setTimeout(() => {
      setVisualState({
        phase: undefined,
        renderedState: state,
      });
    }, getFullScreenWipePhaseDurationMs(durationMs, nextPhase));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [durationMs, reducedMotion, state]);

  return {
    blocksInteraction:
      reducedMotion ? state === "closed" : state === "closed" || visualState.phase !== undefined,
    phase: visualState.phase,
    renderedState: visualState.renderedState,
    reducedMotion,
  };
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
