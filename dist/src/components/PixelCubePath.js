import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { createPixelCubePathAnimationProfile, getPixelCubePathAnimationSeed, } from "./pixelCubePath/animation.js";
import { createPixelCubePathCubeCoordinates, } from "./pixelCubePath/geometry.js";
const baseCycleMs = 3240;
const cubeCoordinates = createPixelCubePathCubeCoordinates();
export function PixelCubePath({ className, label, size = 220, style, tone = "primary", usage = "decorative", ...props }) {
    const instanceId = useId();
    const cellSize = Math.max(18, Math.round(size * 0.19));
    const gapSize = Math.max(2, Math.round(cellSize * 0.08));
    const stepSize = cellSize + gapSize;
    const sceneWidth = Math.round(size * 1.34);
    const sceneHeight = Math.round(size * 1.18);
    const perspective = Math.round(size * 6.4);
    const animationProfile = createPixelCubePathAnimationProfile({
        count: cubeCoordinates.length,
        cycleMs: baseCycleMs,
        seed: getPixelCubePathAnimationSeed(instanceId),
    });
    const rootStyle = {
        "--marathon-cube-path-cell-size": `${cellSize}px`,
        "--marathon-cube-path-count": cubeCoordinates.length,
        "--marathon-cube-path-cycle": `${animationProfile.cycleMs}ms`,
        "--marathon-cube-path-gap": `${gapSize}px`,
        "--marathon-cube-path-perspective": `${perspective}px`,
        "--marathon-cube-path-scene-height": `${sceneHeight}px`,
        "--marathon-cube-path-scene-width": `${sceneWidth}px`,
        "--marathon-cube-path-scene-z": `${Math.round(stepSize * -1.45)}px`,
        "--marathon-cube-path-size": `${size}px`,
        "--marathon-cube-path-step": `${stepSize}px`,
        ...style,
    };
    const rootClassName = ["marathon-pixel-cube-path", toneClassName[tone], className]
        .filter(Boolean)
        .join(" ");
    const accessibilityProps = usage === "loader"
        ? {
            "aria-label": label,
            "aria-live": "polite",
            role: "status",
        }
        : {
            "aria-hidden": true,
        };
    return (_jsx("div", { className: rootClassName, style: rootStyle, ...accessibilityProps, ...props, children: _jsx("div", { "aria-hidden": "true", className: "marathon-pixel-cube-path__viewport", children: _jsx("div", { className: "marathon-pixel-cube-path__scene", children: cubeCoordinates.map((cube) => (_jsxs("span", { className: "marathon-pixel-cube-path__cube", "data-surface": cube.surface ? "true" : "false", style: getCubeStyle(cube, animationProfile.delaysMs), children: [_jsx("span", { className: "marathon-pixel-cube-path__face marathon-pixel-cube-path__face--front" }), _jsx("span", { className: "marathon-pixel-cube-path__face marathon-pixel-cube-path__face--right" }), _jsx("span", { className: "marathon-pixel-cube-path__face marathon-pixel-cube-path__face--top" })] }, cube.index))) }) }) }));
}
const toneClassName = {
    primary: undefined,
    violet: "marathon-pixel-cube-path--violet",
};
function getCubeStyle(cube, delaysMs) {
    const center = 1;
    const x = cube.column - center;
    const y = cube.row - center;
    const z = cube.depth - center;
    const delayMs = delaysMs[cube.pathIndex] ?? 0;
    return {
        "--marathon-cube-path-cube-x": `calc(${x} * var(--marathon-cube-path-step))`,
        "--marathon-cube-path-cube-y": `calc(${y} * var(--marathon-cube-path-step))`,
        "--marathon-cube-path-cube-z": `calc(${z} * var(--marathon-cube-path-step))`,
        "--marathon-cube-path-delay": `${delayMs * -1}ms`,
    };
}
