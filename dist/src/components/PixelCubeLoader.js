import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function PixelCubeLoader({ as, className, detail = "forming cube volume", gridSize = 3, label = "cli construct", size = 160, showLegend = true, style, tone = "primary", ...props }) {
    const gapSize = Math.max(4, Math.round(size * (gridSize === 2 ? 0.085 : 0.06)));
    const cellSize = Math.floor((size - gapSize * (gridSize - 1)) / gridSize);
    const stepSize = cellSize + gapSize;
    const depthOrigin = ((gridSize - 1) / 2) * stepSize;
    const voxels = createVoxelDescriptors(gridSize);
    const Root = as ?? (showLegend ? "div" : "span");
    const Wrapper = Root === "span" ? "span" : "div";
    const loaderClassName = [
        "marathon-pixel-cube-loader",
        toneClassName[tone],
        showLegend ? undefined : "marathon-pixel-cube-loader--mini",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const rootStyle = {
        "--marathon-loader-cell-size": `${cellSize}px`,
        "--marathon-loader-depth-origin": `${depthOrigin}px`,
        "--marathon-loader-gap": `${gapSize}px`,
        "--marathon-loader-grid": gridSize,
        "--marathon-loader-size": `${size}px`,
        "--marathon-loader-step": `${stepSize}px`,
        ...style,
    };
    return (_jsxs(Root, { "aria-label": `${label}: ${detail}`, "aria-live": "polite", className: loaderClassName, role: "status", style: rootStyle, ...props, children: [_jsx(Wrapper, { className: "marathon-pixel-cube-loader__stage", children: _jsx(Wrapper, { className: "marathon-pixel-cube-loader__viewport", children: _jsx(Wrapper, { className: "marathon-pixel-cube-loader__scene-anchor", children: _jsx(Wrapper, { className: "marathon-pixel-cube-loader__scene", children: _jsx(Wrapper, { className: "marathon-pixel-cube-loader__scene-spin", children: voxels.map((voxel) => (_jsxs("span", { "aria-hidden": "true", className: [
                                        "marathon-pixel-cube-loader__voxel",
                                        voxel.depth === 0
                                            ? "marathon-pixel-cube-loader__voxel--front"
                                            : "marathon-pixel-cube-loader__voxel--deep",
                                    ].join(" "), "data-tone": voxel.tone, style: getVoxelStyle(voxel), children: [_jsx("span", { className: "marathon-pixel-cube-loader__voxel-face marathon-pixel-cube-loader__voxel-face--front" }), _jsx("span", { className: "marathon-pixel-cube-loader__voxel-face marathon-pixel-cube-loader__voxel-face--left" }), _jsx("span", { className: "marathon-pixel-cube-loader__voxel-face marathon-pixel-cube-loader__voxel-face--top" })] }, voxel.index))) }) }) }) }) }), showLegend ? (_jsxs(Wrapper, { className: "marathon-pixel-cube-loader__legend", children: [_jsx("span", { className: "marathon-pixel-cube-loader__label", children: label }), _jsxs("span", { className: "marathon-pixel-cube-loader__detail", children: [detail, _jsx("span", { "aria-hidden": "true", className: "marathon-pixel-cube-loader__cursor" })] })] })) : null] }));
}
const toneClassName = {
    primary: undefined,
    violet: "marathon-pixel-cube-loader--violet",
};
function createVoxelDescriptors(gridSize) {
    const center = (gridSize - 1) / 2;
    return Array.from({ length: gridSize ** 3 }, (_, index) => {
        const column = index % gridSize;
        const row = Math.floor(index / gridSize) % gridSize;
        const depth = Math.floor(index / (gridSize * gridSize));
        const x = column - center;
        const y = row - center;
        const tone = row === 0 && column === 0
            ? "lit"
            : row === gridSize - 1 && column === gridSize - 1
                ? "shade"
                : "solid";
        return {
            column,
            depth,
            index,
            row,
            tone,
            x,
            y,
            z: center - depth,
        };
    });
}
function getVoxelStyle(voxel) {
    return {
        "--marathon-loader-x": voxel.x,
        "--marathon-loader-y": voxel.y,
        "--marathon-loader-z": voxel.z,
    };
}
