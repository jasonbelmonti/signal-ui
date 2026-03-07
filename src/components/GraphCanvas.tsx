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
  gap: 24,
  lineWidth: 1,
  variant: BackgroundVariant.Lines,
};

const defaultControlProps: ControlProps = {
  showInteractive: false,
};

const defaultRootStyle: CSSProperties = {
  height: 520,
  minHeight: 320,
  position: "relative",
  width: "100%",
};

const overlayStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  pointerEvents: "none",
  position: "absolute",
  zIndex: 2,
};

const overlayCardStyle: CSSProperties = {
  background: "rgba(10, 10, 10, 0.9)",
  border: "1px solid rgba(245, 245, 240, 0.12)",
  color: "rgba(245, 245, 240, 0.78)",
  fontFamily: "var(--marathon-font-ui)",
  fontSize: 12,
  letterSpacing: "0.12em",
  maxWidth: 280,
  padding: "14px 18px",
  textAlign: "center",
  textTransform: "uppercase",
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function renderOverlay(content: ReactNode, stateLabel: string) {
  return (
    <div aria-live="polite" style={overlayStyle}>
      <div aria-label={stateLabel} role="status" style={overlayCardStyle}>
        {content}
      </div>
    </div>
  );
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
  const backgroundConfig = { ...defaultBackgroundProps, ...backgroundProps };
  const controlsConfig = { ...defaultControlProps, ...controlProps };
  const rootStyle = { ...defaultRootStyle, ...style };
  const overlay =
    loading && loadingState !== null
      ? renderOverlay(loadingState ?? "Loading Graph", "Graph loading")
      : !loading && nodes.length === 0 && emptyState !== null
        ? renderOverlay(emptyState ?? "No Graph Data", "Empty graph")
        : null;

  return (
    <div className={joinClassNames("marathon-graph-canvas", className)} style={rootStyle}>
      <ReactFlowProvider>
        <ReactFlow<NodeType, EdgeType>
          className="marathon-graph-canvas__surface"
          colorMode={colorMode}
          edgeTypes={edgeTypes}
          edges={edges}
          elementsSelectable
          fitView={fitView}
          fitViewOptions={fitViewOptions}
          maxZoom={1.6}
          minZoom={0.25}
          nodeTypes={nodeTypes}
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
          {showMiniMap ? <MiniMap<NodeType> {...miniMapProps} /> : null}
          {children}
        </ReactFlow>
      </ReactFlowProvider>

      {overlay}
    </div>
  );
}
