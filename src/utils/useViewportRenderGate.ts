import { useEffect, useRef, useState } from "react";

type ViewportRenderGateOptions = {
  disabled?: boolean;
  rootMargin?: string;
  threshold?: number;
};

export function useViewportRenderGate<ElementType extends HTMLElement>({
  disabled = false,
  rootMargin = "0px",
  threshold = 0,
}: ViewportRenderGateOptions = {}) {
  const targetRef = useRef<ElementType | null>(null);
  const [isInViewport, setIsInViewport] = useState(true);

  useEffect(() => {
    if (disabled) {
      setIsInViewport(true);
      return;
    }

    const target = targetRef.current;

    if (!target) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry?.isIntersecting ?? false);
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
    isInViewport,
    targetRef,
  };
}
