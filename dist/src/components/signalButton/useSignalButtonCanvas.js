import { useEffect, useEffectEvent } from "react";
import { renderSignalButtonBuffer } from "./renderSignalButtonBuffer.js";
import { clamp, toPixelLength } from "./utils.js";
export function useSignalButtonCanvas({ canvasRef, cooldownPercent, disabled, edgeWidth, fillPercent, pulseBurst, rewardChannels, tone, wakePercent, }) {
    const drawFrame = useEffectEvent((timeMs) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const rect = canvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
            return;
        }
        const pixelDensity = pulseBurst > 0 ? 8 : 6;
        const pixelSize = clamp(Math.round(rect.height / pixelDensity), 3, 8);
        const cols = Math.max(1, Math.ceil(rect.width / pixelSize));
        const rows = Math.max(1, Math.ceil(rect.height / pixelSize));
        const ctx = getCanvasContext(canvas, cols, rows);
        if (!ctx) {
            return;
        }
        ctx.imageSmoothingEnabled = false;
        renderSignalButtonBuffer({
            ctx,
            cols,
            cooldownPercent,
            rows,
            disabled,
            edgeWidthPx: toPixelLength(edgeWidth, 24),
            fillPercent,
            pulseBurst,
            rewardChannels,
            timeMs,
            tone,
            wakePercent,
        });
    });
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || typeof window === "undefined") {
            return;
        }
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        let animationFrameId = 0;
        let resizeObserver;
        const renderOnce = () => {
            drawFrame(performance.now());
        };
        const renderLoop = (timeMs) => {
            drawFrame(timeMs);
            if (!motionQuery.matches) {
                animationFrameId = window.requestAnimationFrame(renderLoop);
            }
        };
        const restart = () => {
            window.cancelAnimationFrame(animationFrameId);
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
        const handleMotionChange = () => {
            restart();
        };
        motionQuery.addEventListener("change", handleMotionChange);
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            motionQuery.removeEventListener("change", handleMotionChange);
            resizeObserver?.disconnect();
        };
    }, [canvasRef, drawFrame]);
    useEffect(() => {
        drawFrame(performance.now());
    }, [
        cooldownPercent,
        disabled,
        drawFrame,
        edgeWidth,
        fillPercent,
        pulseBurst,
        rewardChannels,
        tone,
        wakePercent,
    ]);
}
function getCanvasContext(canvas, cols, rows) {
    if (canvas.width !== cols || canvas.height !== rows) {
        canvas.width = cols;
        canvas.height = rows;
    }
    return canvas.getContext("2d");
}
