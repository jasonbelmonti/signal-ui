import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow, ReactFlowProvider, } from "@xyflow/react";
import { useMemo } from "react";
import { GRAPH_CANVAS_EDGE_TYPE, GraphCanvasEdge } from "./GraphCanvasEdge.js";
import { GRAPH_CANVAS_NODE_TYPE, GraphCanvasNode } from "./GraphCanvasNode.js";
import { graphCanvasToneAccentColor, graphCanvasToneStrokeColor, resolveGraphCanvasTone, } from "./graphCanvasTheme.js";
const defaultBackgroundProps = {
    bgColor: "#090909",
    color: "rgba(245, 245, 240, 0.15)",
    gap: 24,
    lineWidth: 1,
    variant: BackgroundVariant.Lines,
};
const defaultControlProps = {
    position: "top-right",
    showInteractive: false,
};
const defaultRootStyle = {
    height: 520,
    minHeight: 320,
    position: "relative",
    width: "100%",
};
function joinClassNames(...classNames) {
    return classNames.filter(Boolean).join(" ");
}
function renderOverlay(content, stateLabel) {
    return (_jsx("div", { "aria-live": "polite", className: "marathon-graph-canvas__overlay", children: _jsx("div", { "aria-label": stateLabel, className: "marathon-graph-canvas__overlay-card", role: "status", children: content }) }));
}
function getNodeTone(node) {
    if (typeof node.data !== "object" || node.data === null) {
        return "primary";
    }
    return resolveGraphCanvasTone(node.data.tone);
}
export function GraphCanvas({ backgroundProps, children, className, colorMode = "dark", controlProps, edgeTypes, edges, emptyState, fitView = true, fitViewOptions, loading = false, loadingState, miniMapProps, nodeTypes, nodes, onEdgeClick, onEdgesChange, onNodeClick, onNodesChange, onSelectionChange, reactFlowProps, showBackground = true, showControls = false, showMiniMap = false, style, }) {
    const backgroundConfig = {
        ...defaultBackgroundProps,
        ...backgroundProps,
        className: joinClassNames("marathon-graph-canvas__background", backgroundProps?.className),
        patternClassName: joinClassNames("marathon-graph-canvas__background-pattern", backgroundProps?.patternClassName),
    };
    const controlsConfig = {
        ...defaultControlProps,
        ...controlProps,
        className: joinClassNames("marathon-graph-canvas__controls", controlProps?.className),
    };
    const rootStyle = { ...defaultRootStyle, ...style };
    const resolvedNodeTypes = useMemo(() => ({
        [GRAPH_CANVAS_NODE_TYPE]: GraphCanvasNode,
        ...(nodeTypes ?? {}),
    }), [nodeTypes]);
    const resolvedEdgeTypes = useMemo(() => ({
        [GRAPH_CANVAS_EDGE_TYPE]: GraphCanvasEdge,
        ...(edgeTypes ?? {}),
    }), [edgeTypes]);
    const resolvedMiniMapProps = {
        bgColor: "#060606",
        className: "marathon-graph-canvas__minimap",
        maskColor: "rgba(5, 5, 5, 0.72)",
        maskStrokeColor: "rgba(192, 254, 4, 0.38)",
        maskStrokeWidth: 1,
        nodeBorderRadius: 2,
        nodeColor: (node) => node.selected
            ? graphCanvasToneAccentColor.primary
            : graphCanvasToneAccentColor[getNodeTone(node)],
        nodeStrokeColor: (node) => node.selected
            ? "rgba(249, 255, 239, 0.92)"
            : graphCanvasToneStrokeColor[getNodeTone(node)],
        nodeStrokeWidth: 1,
        ...miniMapProps,
    };
    const overlay = loading && loadingState !== null
        ? renderOverlay(loadingState ?? "Loading Graph", "Graph loading")
        : !loading && nodes.length === 0 && emptyState !== null
            ? renderOverlay(emptyState ?? "No Graph Data", "Empty graph")
            : null;
    return (_jsxs("div", { className: joinClassNames("marathon-graph-canvas", className), style: rootStyle, children: [_jsx(ReactFlowProvider, { children: _jsxs(ReactFlow, { className: "marathon-graph-canvas__surface", colorMode: colorMode, edgeTypes: resolvedEdgeTypes, edges: edges, elementsSelectable: true, fitView: fitView, fitViewOptions: fitViewOptions, maxZoom: 1.6, minZoom: 0.25, nodeTypes: resolvedNodeTypes, nodes: nodes, nodesConnectable: false, nodesDraggable: false, onEdgeClick: onEdgeClick, onEdgesChange: onEdgesChange, onNodeClick: onNodeClick, onNodesChange: onNodesChange, onSelectionChange: onSelectionChange, panOnDrag: true, zoomOnDoubleClick: false, ...reactFlowProps, children: [showBackground ? _jsx(Background, { ...backgroundConfig }) : null, showControls ? _jsx(Controls, { ...controlsConfig }) : null, showMiniMap ? _jsx(MiniMap, { ...resolvedMiniMapProps }) : null, children] }) }), overlay] }));
}
