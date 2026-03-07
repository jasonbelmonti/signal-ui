import { Handle } from "@xyflow/react";
import type { Node, NodeProps } from "@xyflow/react";

import type { GraphCanvasTone } from "./graphCanvasTheme";
import { resolveGraphCanvasTone } from "./graphCanvasTheme";

export const GRAPH_CANVAS_NODE_TYPE = "graph-canvas-node";

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

function joinClassNames(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function getBadgeClassName(tone: GraphCanvasBadge["tone"]) {
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

function getToneClassName(tone: GraphCanvasNodeData["tone"]) {
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

export function GraphCanvasNode({
  data,
  selected,
  sourcePosition,
  targetPosition,
}: NodeProps<GraphCanvasNodeRendererDefinition>) {
  const title = data?.title ?? data?.label ?? "Untitled Node";

  return (
    <div
      className={joinClassNames(
        "marathon-graph-node",
        getToneClassName(data?.tone),
        selected && "marathon-graph-node--selected",
      )}
    >
      {targetPosition ? (
        <Handle
          className="marathon-graph-node__handle marathon-graph-node__handle--target"
          isConnectable={false}
          position={targetPosition}
          type="target"
        />
      ) : null}

      <div className="marathon-graph-node__frame">
        {data?.eyebrow ? <div className="marathon-graph-node__eyebrow">{data.eyebrow}</div> : null}
        <div className="marathon-graph-node__title">{title}</div>
        {data?.detail ? <div className="marathon-graph-node__detail">{data.detail}</div> : null}
        {data?.badges?.length ? (
          <div className="marathon-graph-node__badges">
            {data.badges.map((badge) => (
              <span
                className={joinClassNames(
                  "marathon-graph-node__badge",
                  getBadgeClassName(badge.tone),
                )}
                key={`${badge.label}-${badge.tone ?? "primary"}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {sourcePosition ? (
        <Handle
          className="marathon-graph-node__handle marathon-graph-node__handle--source"
          isConnectable={false}
          position={sourcePosition}
          type="source"
        />
      ) : null}
    </div>
  );
}
