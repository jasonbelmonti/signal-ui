import { useEffect, useEffectEvent, useRef } from "react";
import type { PointerEventHandler, RefObject } from "react";

type UsePanelCursorTiltOptions = {
  enabled?: boolean;
};

type UsePanelCursorTiltResult = {
  surfacePointerHandlers: {
    onPointerCancel?: PointerEventHandler<HTMLDivElement>;
    onPointerLeave?: PointerEventHandler<HTMLDivElement>;
    onPointerMove?: PointerEventHandler<HTMLDivElement>;
  };
  surfaceRef: RefObject<HTMLDivElement | null>;
};

type TiltState = {
  rotateX: number;
  rotateY: number;
};

const PANEL_CURSOR_TILT_MAX_ROTATION_X = 5;
const PANEL_CURSOR_TILT_MAX_ROTATION_Y = 7;
const DEFAULT_TILT_STATE: TiltState = {
  rotateX: 0,
  rotateY: 0,
};

export function usePanelCursorTilt({
  enabled,
}: UsePanelCursorTiltOptions): UsePanelCursorTiltResult {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const tiltStateRef = useRef<TiltState>(DEFAULT_TILT_STATE);

  const commitTilt = useEffectEvent(() => {
    animationFrameRef.current = 0;

    const shell = surfaceRef.current;

    if (!shell) {
      return;
    }

    shell.style.setProperty(
      "--signal-ui-panel-tilt-rotate-x",
      `${tiltStateRef.current.rotateX.toFixed(2)}deg`,
    );
    shell.style.setProperty(
      "--signal-ui-panel-tilt-rotate-y",
      `${tiltStateRef.current.rotateY.toFixed(2)}deg`,
    );
  });

  const scheduleTiltCommit = useEffectEvent(() => {
    if (typeof window === "undefined" || animationFrameRef.current) {
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(commitTilt);
  });

  const resetTilt = useEffectEvent(() => {
    tiltStateRef.current = DEFAULT_TILT_STATE;
    scheduleTiltCommit();
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!enabled) {
      reducedMotionRef.current = false;
      resetTilt();
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      reducedMotionRef.current = motionQuery.matches;

      if (motionQuery.matches) {
        resetTilt();
      }
    };

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);

    return () => {
      motionQuery.removeEventListener("change", syncMotionPreference);
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    };
  }, [enabled, resetTilt]);

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!enabled || reducedMotionRef.current || event.pointerType !== "mouse") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const normalizedX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const normalizedY = clamp((event.clientY - rect.top) / rect.height, 0, 1);

    tiltStateRef.current = {
      rotateX: (0.5 - normalizedY) * PANEL_CURSOR_TILT_MAX_ROTATION_X * 2,
      rotateY: (normalizedX - 0.5) * PANEL_CURSOR_TILT_MAX_ROTATION_Y * 2,
    };
    scheduleTiltCommit();
  };

  const handlePointerLeave = () => {
    if (!enabled) {
      return;
    }

    resetTilt();
  };

  return {
    surfacePointerHandlers: enabled
      ? {
          onPointerCancel: handlePointerLeave,
          onPointerLeave: handlePointerLeave,
          onPointerMove: handlePointerMove,
        }
      : {},
    surfaceRef,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
