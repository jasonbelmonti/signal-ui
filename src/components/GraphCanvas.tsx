import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import type {
  BackgroundProps,
  ControlProps,
  Edge,
  MiniMapProps,
  Node,
  ReactFlowProps,
} from "@xyflow/react";
import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";

import { GRAPH_CANVAS_EDGE_TYPE, GraphCanvasEdge } from "./GraphCanvasEdge.js";
import { GRAPH_CANVAS_NODE_TYPE, GraphCanvasNode } from "./GraphCanvasNode.js";
import {
  graphCanvasToneAccentColor,
  graphCanvasToneStrokeColor,
  resolveGraphCanvasTone,
} from "./graphCanvasTheme.js";

type ReservedReactFlowProps =
  | "children"
  | "className"
  | "colorMode"
  | "edgeTypes"
  | "edges"
  | "fitView"
  | "fitViewOptions"
  | "nodeTypes"
  | "nodes"
  | "onEdgeClick"
  | "onEdgesChange"
  | "onNodeClick"
  | "onNodesChange"
  | "onSelectionChange"
  | "style";

type GraphCanvasBaseProps<NodeType extends Node, EdgeType extends Edge> = ReactFlowProps<
  NodeType,
  EdgeType
>;

export type GraphCanvasReactFlowProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> =
  Partial<Omit<GraphCanvasBaseProps<NodeType, EdgeType>, ReservedReactFlowProps>>;

export interface GraphCanvasProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  backgroundProps?: Partial<BackgroundProps>;
  children?: ReactNode;
  className?: string;
  colorMode?: GraphCanvasBaseProps<NodeType, EdgeType>["colorMode"];
  controlProps?: Partial<ControlProps>;
  edgeTypes?: GraphCanvasBaseProps<NodeType, EdgeType>["edgeTypes"];
  edges: EdgeType[];
  emptyState?: ReactNode;
  fitView?: boolean;
  fitViewOptions?: GraphCanvasBaseProps<NodeType, EdgeType>["fitViewOptions"];
  loading?: boolean;
  loadingState?: ReactNode;
  miniMapProps?: Partial<MiniMapProps<NodeType>>;
  nodeTypes?: GraphCanvasBaseProps<NodeType, EdgeType>["nodeTypes"];
  nodes: NodeType[];
  onEdgeClick?: GraphCanvasBaseProps<NodeType, EdgeType>["onEdgeClick"];
  onEdgesChange?: GraphCanvasBaseProps<NodeType, EdgeType>["onEdgesChange"];
  onNodeClick?: GraphCanvasBaseProps<NodeType, EdgeType>["onNodeClick"];
  onNodesChange?: GraphCanvasBaseProps<NodeType, EdgeType>["onNodesChange"];
  onSelectionChange?: GraphCanvasBaseProps<NodeType, EdgeType>["onSelectionChange"];
  reactFlowProps?: GraphCanvasReactFlowProps<NodeType, EdgeType>;
  showBackground?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  style?: CSSProperties;
}

const defaultBackgroundProps: BackgroundProps = {
  bgColor: "var(--signal-ui-black)",
  color: "rgb(var(--signal-ui-text-rgb) / 0.15)",
  gap: 24,
  lineWidth: 1,
  variant: BackgroundVariant.Lines,
};

const defaultControlProps: ControlProps = {
  position: "top-right",
  showInteractive: false,
};

const defaultRootStyle: CSSProperties = {
  height: 520,
  minHeight: 320,
  position: "relative",
  width: "100%",
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function renderOverlay(content: ReactNode, stateLabel: string) {
  return (
    <div aria-live="polite" className="signal-ui-graph-canvas__overlay">
      <div aria-label={stateLabel} className="signal-ui-graph-canvas__overlay-card" role="status">
        {content}
      </div>
    </div>
  );
}

function getNodeTone(node: Node) {
  if (typeof node.data !== "object" || node.data === null) {
    return "primary";
  }

  return resolveGraphCanvasTone((node.data as { tone?: unknown }).tone);
}

export function GraphCanvas<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  backgroundProps,
  children,
  className,
  colorMode = "dark",
  controlProps,
  edgeTypes,
  edges,
  emptyState,
  fitView = true,
  fitViewOptions,
  loading = false,
  loadingState,
  miniMapProps,
  nodeTypes,
  nodes,
  onEdgeClick,
  onEdgesChange,
  onNodeClick,
  onNodesChange,
  onSelectionChange,
  reactFlowProps,
  showBackground = true,
  showControls = false,
  showMiniMap = false,
  style,
}: GraphCanvasProps<NodeType, EdgeType>) {
  const backgroundConfig = {
    ...defaultBackgroundProps,
    ...backgroundProps,
    className: joinClassNames("signal-ui-graph-canvas__background", backgroundProps?.className),
    patternClassName: joinClassNames(
      "signal-ui-graph-canvas__background-pattern",
      backgroundProps?.patternClassName,
    ),
  };
  const controlsConfig = {
    ...defaultControlProps,
    ...controlProps,
    className: joinClassNames("signal-ui-graph-canvas__controls", controlProps?.className),
  };
  const rootStyle = { ...defaultRootStyle, ...style };
  const resolvedNodeTypes = useMemo(
    () => ({
      [GRAPH_CANVAS_NODE_TYPE]: GraphCanvasNode,
      ...(nodeTypes ?? {}),
    }),
    [nodeTypes],
  );
  const resolvedEdgeTypes = useMemo(
    () => ({
      [GRAPH_CANVAS_EDGE_TYPE]: GraphCanvasEdge,
      ...(edgeTypes ?? {}),
    }),
    [edgeTypes],
  );
  const resolvedMiniMapProps = {
    bgColor: "var(--signal-ui-void)",
    className: "signal-ui-graph-canvas__minimap",
    maskColor: "rgba(5, 5, 5, 0.72)",
    maskStrokeColor: "rgb(var(--signal-ui-primary-rgb) / 0.38)",
    maskStrokeWidth: 1,
    nodeBorderRadius: 2,
    nodeColor: (node: Node) =>
      node.selected
        ? graphCanvasToneAccentColor.primary
        : graphCanvasToneAccentColor[getNodeTone(node)],
    nodeStrokeColor: (node: Node) =>
      node.selected
        ? "rgb(var(--signal-ui-text-rgb) / 0.92)"
        : graphCanvasToneStrokeColor[getNodeTone(node)],
    nodeStrokeWidth: 1,
    ...miniMapProps,
  } satisfies Partial<MiniMapProps<NodeType>>;
  const overlay =
    loading && loadingState !== null
      ? renderOverlay(loadingState ?? "Loading Graph", "Graph loading")
      : !loading && nodes.length === 0 && emptyState !== null
        ? renderOverlay(emptyState ?? "No Graph Data", "Empty graph")
        : null;

  return (
    <div className={joinClassNames("signal-ui-graph-canvas", className)} style={rootStyle}>
      <ReactFlowProvider>
        <ReactFlow<NodeType, EdgeType>
          className="signal-ui-graph-canvas__surface"
          colorMode={colorMode}
          edgeTypes={resolvedEdgeTypes}
          edges={edges}
          elementsSelectable
          fitView={fitView}
          fitViewOptions={fitViewOptions}
          maxZoom={1.6}
          minZoom={0.25}
          nodeTypes={resolvedNodeTypes}
          nodes={nodes}
          nodesConnectable={false}
          nodesDraggable={false}
          onEdgeClick={onEdgeClick}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onSelectionChange={onSelectionChange}
          panOnDrag
          zoomOnDoubleClick={false}
          {...reactFlowProps}
        >
          {showBackground ? <Background {...backgroundConfig} /> : null}
          {showControls ? <Controls {...controlsConfig} /> : null}
          {showMiniMap ? <MiniMap<NodeType> {...resolvedMiniMapProps} /> : null}
          {children}
        </ReactFlow>
      </ReactFlowProvider>

      {overlay}
    </div>
  );
}
