import { useEffect, useRef, useState } from "react";

type BackdropDpr = [number, number];

const ACTIVE_DPR: BackdropDpr = [1, 1.2];
const STATIC_DPR: BackdropDpr = [1, 1];

type UseBackdropRenderStateResult = {
  canvasDpr: BackdropDpr;
  renderAnimated: boolean;
  viewportRef: React.RefObject<HTMLDivElement | null>;
};

export function useBackdropRenderState(animated: boolean): UseBackdropRenderStateResult {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(() => {
    if (typeof document === "undefined") {
      return true;
    }

    return document.visibilityState === "visible";
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => {
      setPrefersReducedMotion(motionQuery.matches);
    };

    handleMotionChange();

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", handleMotionChange);

      return () => {
        motionQuery.removeEventListener("change", handleMotionChange);
      };
    }

    motionQuery.addListener(handleMotionChange);

    return () => {
      motionQuery.removeListener(handleMotionChange);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry?.isIntersecting ?? true);
      },
      {
        threshold: 0.02,
      },
    );

    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, []);

  const renderAnimated = animated && isInView && isPageVisible && !prefersReducedMotion;

  return {
    canvasDpr: renderAnimated ? ACTIVE_DPR : STATIC_DPR,
    renderAnimated,
    viewportRef,
  };
}
