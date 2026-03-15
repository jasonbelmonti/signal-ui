import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Position } from "@xyflow/react";
import type { CSSProperties } from "react";

import { GraphCanvas } from "../components/GraphCanvas.js";
import type { GraphCanvasProps } from "../components/GraphCanvas.js";
import { signalPalette } from "../theme/signalTheme.js";
import { GRAPH_CANVAS_EDGE_TYPE } from "../components/GraphCanvasEdge.js";
import type { GraphCanvasEdgeDefinition } from "../components/GraphCanvasEdge.js";
import { GRAPH_CANVAS_NODE_TYPE } from "../components/GraphCanvasNode.js";
import type { GraphCanvasNodeDefinition } from "../components/GraphCanvasNode.js";

type GraphCanvasStoryArgs = GraphCanvasProps<GraphCanvasNodeDefinition, GraphCanvasEdgeDefinition>;

function withGraphCanvasNodeType(nodes: GraphCanvasNodeDefinition[]) {
  return nodes.map((node): GraphCanvasNodeDefinition => ({ ...node, type: GRAPH_CANVAS_NODE_TYPE }));
}

function withGraphCanvasEdgeType(edges: GraphCanvasEdgeDefinition[]) {
  return edges.map((edge): GraphCanvasEdgeDefinition => ({ ...edge, type: GRAPH_CANVAS_EDGE_TYPE }));
}

const foundationNodes = withGraphCanvasNodeType([
  {
    data: {
      badges: [{ label: "Spec" }],
      eyebrow: "Signal Intake",
      title: "Ingest Spec",
    },
    id: "spec",
    position: { x: 80, y: 86 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Queued" }],
      detail: "normalize inputs / assign lane",
      eyebrow: "Planner",
      title: "Plan Execution",
    },
    id: "plan",
    position: { x: 340, y: 60 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "3 Agents", tone: "warning" }],
      detail: "fan out to active workers",
      eyebrow: "Dispatch",
      title: "Dispatch Agents",
      tone: "warning",
    },
    id: "dispatch",
    position: { x: 650, y: 58 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Merge", tone: "violet" }],
      detail: "partials / scoring / retries",
      eyebrow: "Aggregator",
      title: "Collect Results",
      tone: "violet",
    },
    id: "collect",
    position: { x: 650, y: 238 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Selected" }],
      detail: "publish concise operator update",
      eyebrow: "Output",
      title: "Summarize Outcome",
    },
    id: "summary",
    position: { x: 1010, y: 146 },
    selected: true,
    targetPosition: Position.Left,
  },
]);

const foundationEdges = withGraphCanvasEdgeType([
  {
    data: { label: "parse", tone: "neutral" },
    id: "spec-plan",
    source: "spec",
    target: "plan",
  },
  {
    data: { label: "route", tone: "warning" },
    id: "plan-dispatch",
    source: "plan",
    target: "dispatch",
  },
  {
    data: { label: "fan-in", tone: "violet" },
    id: "dispatch-collect",
    source: "dispatch",
    target: "collect",
  },
  {
    data: { label: "primary", tone: "primary" },
    id: "plan-summary",
    source: "plan",
    target: "summary",
  },
  {
    data: { label: "selected", tone: "primary" },
    id: "collect-summary",
    selected: true,
    source: "collect",
    target: "summary",
  },
]);

const denseNodes = withGraphCanvasNodeType([
  {
    data: { eyebrow: "Ingress", title: "Prompt Intake" },
    id: "ingress",
    position: { x: 40, y: 120 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Cache", tone: "neutral" }],
      eyebrow: "Prep",
      title: "Context Sweep",
      tone: "neutral",
    },
    id: "context",
    position: { x: 260, y: 20 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Risk", tone: "warning" }],
      eyebrow: "Prep",
      title: "Constraint Check",
      tone: "warning",
    },
    id: "constraints",
    position: { x: 260, y: 220 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Lane A" }],
      detail: "UI / shell pass",
      eyebrow: "Worker",
      title: "Style Surface",
    },
    id: "style",
    position: { x: 520, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Lane B", tone: "violet" }],
      detail: "renderer defaults",
      eyebrow: "Worker",
      title: "Wire Graph Primitives",
      tone: "violet",
    },
    id: "renderers",
    position: { x: 520, y: 120 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Lane C", tone: "warning" }],
      detail: "dense scenario validation",
      eyebrow: "Worker",
      title: "Stress Story",
      tone: "warning",
    },
    id: "stress",
    position: { x: 520, y: 240 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Gate", tone: "error" }],
      detail: "contrast / legibility / focus",
      eyebrow: "Verify",
      title: "Review States",
      tone: "error",
    },
    id: "review",
    position: { x: 820, y: 120 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Static" }],
      eyebrow: "Output",
      title: "Capture Build",
    },
    id: "capture",
    position: { x: 1080, y: 40 },
    targetPosition: Position.Left,
  },
  {
    data: {
      badges: [{ label: "Selected" }],
      detail: "ship preview artifact",
      eyebrow: "Output",
      title: "Open Pull Request",
    },
    id: "pr",
    position: { x: 1080, y: 200 },
    selected: true,
    targetPosition: Position.Left,
  },
]);

const denseEdges = withGraphCanvasEdgeType([
  { data: { label: "seed", tone: "neutral" }, id: "ingress-context", source: "ingress", target: "context" },
  {
    data: { label: "guard", tone: "warning" },
    id: "ingress-constraints",
    source: "ingress",
    target: "constraints",
  },
  { data: { label: "feed", tone: "primary" }, id: "context-style", source: "context", target: "style" },
  { data: { label: "feed", tone: "violet" }, id: "context-renderers", source: "context", target: "renderers" },
  {
    data: { label: "limit", tone: "warning" },
    id: "constraints-stress",
    source: "constraints",
    target: "stress",
  },
  {
    data: { label: "join", tone: "primary" },
    id: "style-review",
    source: "style",
    target: "review",
  },
  {
    data: { label: "join", tone: "violet" },
    id: "renderers-review",
    source: "renderers",
    target: "review",
  },
  {
    data: { label: "join", tone: "warning" },
    id: "stress-review",
    source: "stress",
    target: "review",
  },
  {
    data: { label: "artifact", tone: "neutral" },
    id: "review-capture",
    source: "review",
    target: "capture",
  },
  {
    data: { label: "selected", tone: "primary" },
    id: "review-pr",
    selected: true,
    source: "review",
    target: "pr",
  },
]);

const meta = {
  title: "Lab/GraphCanvas",
  id: "graphs-graph-canvas",
  component: GraphCanvas,
  args: {
    edges: foundationEdges,
    fitViewOptions: { padding: 0.18 },
    nodes: foundationNodes,
    showBackground: true,
    showControls: true,
    showMiniMap: true,
    style: { height: 560 },
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  render: (args) => renderShowcase({
    args,
    cardTitle: "Foundation",
    copy:
      "The graph canvas now owns its own chrome: hard-edge nodes, restrained lime edge routing, themed minimap, and operator controls that no longer look like they wandered in from a different product.",
    extra: "Read-Only Defaults",
    eyebrow: "React Flow Styling",
    title: "Make the graph look like it belongs here.",
  }),
} satisfies Meta<GraphCanvasStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Foundation: Story = {};

export const DenseSignals: Story = {
  args: {
    edges: denseEdges,
    fitViewOptions: { padding: 0.16 },
    nodes: denseNodes,
    style: { height: 620 },
  },
  render: (args) =>
    renderShowcase({
      args,
      cardTitle: "Dense Flow",
      copy:
        "The denser pass keeps lanes distinct with tone shifts and chip punctuation while preserving legibility against the grid. If this one reads, the sparse case is easy.",
      extra: "Density Check",
      eyebrow: "Stress View",
      title: "More nodes. Same visual language.",
    }),
};

export const LoadingOverlay: Story = {
  args: {
    edges: foundationEdges,
    loading: true,
    loadingState: "Syncing Graph",
    nodes: foundationNodes,
  },
  render: (args) =>
    renderShowcase({
      args,
      cardTitle: "Loading Overlay",
      copy:
        "The graph can keep its context visible while a themed status card sits over the canvas. This covers the loading branch without falling back to generic app chrome.",
      extra: "Verification",
      eyebrow: "Overlay State",
      title: "Loading should still look deliberate.",
    }),
};

export const EmptyOverlay: Story = {
  args: {
    edges: [],
    emptyState: "No Graph Data",
    nodes: [],
    showControls: false,
    showMiniMap: false,
    style: { height: 420 },
  },
  render: (args) =>
    renderShowcase({
      args,
      cardTitle: "Empty Overlay",
      copy:
        "An empty graph should still feel like part of the system. This verifies the fallback canvas state instead of letting it drift untested behind the happy path stories.",
      extra: "Verification",
      eyebrow: "Overlay State",
      title: "Empty should be a first-class state too.",
    }),
};

function renderShowcase({
  args,
  cardTitle,
  copy,
  extra,
  eyebrow,
  title,
}: {
  args: GraphCanvasStoryArgs;
  cardTitle: string;
  copy: string;
  extra: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <Flex vertical gap={24} style={{ margin: "0 auto", maxWidth: 1280 }}>
      <Card style={heroCardStyle}>
        <Space direction="vertical" size={10}>
          <Typography.Text style={eyebrowStyle}>{eyebrow}</Typography.Text>
          <Typography.Title level={1} className="signal-ui-text-display" style={titleStyle}>
            {title}
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>{copy}</Typography.Paragraph>
        </Space>
      </Card>

      <Card title={cardTitle} extra={extra} style={canvasCardStyle}>
        <GraphCanvas<GraphCanvasNodeDefinition, GraphCanvasEdgeDefinition> {...args} />
      </Card>
    </Flex>
  );
}

const eyebrowStyle: CSSProperties = {
  color: signalPalette.primary,
  display: "block",
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 680,
};

const copyStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.82)",
  margin: 0,
  maxWidth: 840,
};

const heroCardStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(192, 254, 4, 0.1), transparent 35%), linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 55%), #090909",
  borderColor: "rgba(192, 254, 4, 0.38)",
};

const canvasCardStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 55%), rgba(12, 12, 12, 0.96)",
};
