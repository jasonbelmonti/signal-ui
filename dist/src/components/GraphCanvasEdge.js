import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BaseEdge, getSmoothStepPath } from "@xyflow/react";
import { useId } from "react";
import { graphCanvasToneAccentColor, graphCanvasToneGlowColor, graphCanvasToneStrokeColor, resolveGraphCanvasTone, } from "./graphCanvasTheme.js";
export const GRAPH_CANVAS_EDGE_TYPE = "graph-canvas-edge";
function encodeMarkerIdPart(value) {
    return encodeURIComponent(value).replace(/%/g, "_");
}
export function GraphCanvasEdge({ data, id, interactionWidth, label, markerEnd, selected, sourcePosition, sourceX, sourceY, style, targetPosition, targetX, targetY, }) {
    const edgeInstanceId = useId();
    const tone = resolveGraphCanvasTone(data?.tone);
    const markerId = `marathon-graph-edge-arrow-${encodeMarkerIdPart(edgeInstanceId)}-${encodeMarkerIdPart(id)}`;
    const markerColor = selected ? graphCanvasToneAccentColor.primary : graphCanvasToneAccentColor[tone];
    const [path, labelX, labelY] = getSmoothStepPath({
        sourcePosition,
        sourceX,
        sourceY,
        targetPosition,
        targetX,
        targetY,
    });
    const edgeStyle = {
        ...(style ?? {}),
        "--marathon-graph-edge-glow": graphCanvasToneGlowColor[tone],
        "--marathon-graph-edge-stroke": graphCanvasToneStrokeColor[tone],
    };
    const edgeLabel = data?.label ?? label;
    return (_jsxs(_Fragment, { children: [_jsx("defs", { children: _jsx("marker", { id: markerId, markerHeight: "8", markerUnits: "strokeWidth", markerWidth: "8", orient: "auto-start-reverse", refX: "7.4", refY: "4", viewBox: "0 0 8 8", children: _jsx("path", { d: "M 0 0 L 8 4 L 0 8 z", fill: markerColor, opacity: selected ? 1 : 0.92 }) }) }), _jsx(BaseEdge, { className: "marathon-graph-edge__path", interactionWidth: interactionWidth ?? 24, label: edgeLabel, labelBgBorderRadius: 0, labelBgPadding: [10, 5], labelBgStyle: {
                    fill: "rgba(8, 8, 8, 0.96)",
                    stroke: selected ? "rgba(192, 254, 4, 0.5)" : "rgba(245, 245, 240, 0.12)",
                    strokeWidth: 1,
                }, labelShowBg: Boolean(edgeLabel), labelStyle: {
                    fill: selected ? "#f9ffef" : "rgba(245, 245, 240, 0.74)",
                    fontFamily: "var(--marathon-font-ui)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                }, labelX: labelX, labelY: labelY, markerEnd: markerEnd ?? `url(#${markerId})`, path: path, style: edgeStyle })] }));
}
