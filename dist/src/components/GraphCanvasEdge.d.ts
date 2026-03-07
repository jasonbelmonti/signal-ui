import type { Edge, EdgeProps } from "@xyflow/react";
import type { GraphCanvasTone } from "./graphCanvasTheme.js";
export declare const GRAPH_CANVAS_EDGE_TYPE = "graph-canvas-edge";
export interface GraphCanvasEdgeData extends Record<string, unknown> {
    label?: string;
    tone?: GraphCanvasTone;
}
export type GraphCanvasEdgeDefinition = Edge<GraphCanvasEdgeData>;
type GraphCanvasEdgeRendererDefinition = Edge<GraphCanvasEdgeData, typeof GRAPH_CANVAS_EDGE_TYPE>;
export declare function GraphCanvasEdge({ data, id, interactionWidth, label, markerEnd, selected, sourcePosition, sourceX, sourceY, style, targetPosition, targetX, targetY, }: EdgeProps<GraphCanvasEdgeRendererDefinition>): import("react/jsx-runtime").JSX.Element;
export {};
