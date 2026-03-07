import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Handle } from "@xyflow/react";
import { resolveGraphCanvasTone } from "./graphCanvasTheme.js";
export const GRAPH_CANVAS_NODE_TYPE = "graph-canvas-node";
function joinClassNames(...classNames) {
    return classNames.filter(Boolean).join(" ");
}
function getBadgeClassName(tone) {
    switch (tone) {
        case "error":
            return "marathon-graph-node__badge--error";
        case "neutral":
            return "marathon-graph-node__badge--neutral";
        case "violet":
            return "marathon-graph-node__badge--violet";
        case "warning":
            return "marathon-graph-node__badge--warning";
        default:
            return undefined;
    }
}
function getToneClassName(tone) {
    switch (resolveGraphCanvasTone(tone)) {
        case "error":
            return "marathon-graph-node--error";
        case "neutral":
            return "marathon-graph-node--neutral";
        case "violet":
            return "marathon-graph-node--violet";
        case "warning":
            return "marathon-graph-node--warning";
        default:
            return undefined;
    }
}
export function GraphCanvasNode({ data, selected, sourcePosition, targetPosition, }) {
    const title = data?.title ?? data?.label ?? "Untitled Node";
    return (_jsxs("div", { className: joinClassNames("marathon-graph-node", getToneClassName(data?.tone), selected && "marathon-graph-node--selected"), children: [targetPosition ? (_jsx(Handle, { className: "marathon-graph-node__handle marathon-graph-node__handle--target", isConnectable: false, position: targetPosition, type: "target" })) : null, _jsxs("div", { className: "marathon-graph-node__frame", children: [data?.eyebrow ? _jsx("div", { className: "marathon-graph-node__eyebrow", children: data.eyebrow }) : null, _jsx("div", { className: "marathon-graph-node__title", children: title }), data?.detail ? _jsx("div", { className: "marathon-graph-node__detail", children: data.detail }) : null, data?.badges?.length ? (_jsx("div", { className: "marathon-graph-node__badges", children: data.badges.map((badge) => (_jsx("span", { className: joinClassNames("marathon-graph-node__badge", getBadgeClassName(badge.tone)), children: badge.label }, `${badge.label}-${badge.tone ?? "primary"}`))) })) : null] }), sourcePosition ? (_jsx(Handle, { className: "marathon-graph-node__handle marathon-graph-node__handle--source", isConnectable: false, position: sourcePosition, type: "source" })) : null] }));
}
