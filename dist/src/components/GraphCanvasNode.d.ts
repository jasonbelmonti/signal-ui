import type { Node, NodeProps } from "@xyflow/react";
import type { GraphCanvasTone } from "./graphCanvasTheme.js";
export declare const GRAPH_CANVAS_NODE_TYPE = "graph-canvas-node";
export interface GraphCanvasBadge {
    label: string;
    tone?: GraphCanvasTone;
}
export interface GraphCanvasNodeData extends Record<string, unknown> {
    badges?: GraphCanvasBadge[];
    detail?: string;
    eyebrow?: string;
    label?: string;
    title?: string;
    tone?: GraphCanvasTone;
}
export type GraphCanvasNodeDefinition = Node<GraphCanvasNodeData>;
type GraphCanvasNodeRendererDefinition = Node<GraphCanvasNodeData, typeof GRAPH_CANVAS_NODE_TYPE>;
export declare function GraphCanvasNode({ data, selected, sourcePosition, targetPosition, }: NodeProps<GraphCanvasNodeRendererDefinition>): import("react/jsx-runtime").JSX.Element;
export {};
