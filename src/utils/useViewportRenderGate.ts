import { useEffect, useRef, useState } from "react";

type ViewportRenderGateOptions = {
  disabled?: boolean;
  rootMargin?: string;
  threshold?: number;
};

function canUseIntersectionObserver() {
  return typeof window !== "undefined" && typeof IntersectionObserver !== "undefined";
}

export function useViewportRenderGate<ElementType extends HTMLElement>({
  disabled = false,
  rootMargin = "0px",
  threshold = 0,
}: ViewportRenderGateOptions = {}) {
  const targetRef = useRef<ElementType | null>(null);
  const [hasResolvedViewport, setHasResolvedViewport] = useState(false);
  const [isInViewport, setIsInViewport] = useState(
    () => disabled || !canUseIntersectionObserver(),
  );

  useEffect(() => {
    if (disabled) {
      setIsInViewport(true);
      setHasResolvedViewport(true);
      return;
    }

    const target = targetRef.current;

    if (!target) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      setHasResolvedViewport(true);
      return;
    }

    setHasResolvedViewport(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry?.isIntersecting ?? false);
        setHasResolvedViewport(true);
      },
      {
        root: null,
        rootMargin,
        threshold,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [disabled, rootMargin, threshold]);

  return {
    hasResolvedViewport,
    isInViewport,
    targetRef,
  };
}
