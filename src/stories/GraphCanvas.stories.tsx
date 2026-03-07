import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Position } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import type { CSSProperties } from "react";

import { GraphCanvas } from "../components/GraphCanvas";
import type { GraphCanvasProps } from "../components/GraphCanvas";
import { marathonDosPalette } from "../theme/marathonDosTheme";

type FoundationNode = Node<{ label: string }>;
type FoundationEdge = Edge;
type FoundationStoryArgs = GraphCanvasProps<FoundationNode, FoundationEdge>;

const nodeStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 55%), rgba(14, 14, 14, 0.98)",
  border: "1px solid rgba(245, 245, 240, 0.22)",
  borderRadius: 2,
  boxShadow: "0 0 0 1px rgba(192, 254, 4, 0.08)",
  color: marathonDosPalette.text,
  fontFamily: "var(--marathon-font-ui)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.12em",
  minWidth: 168,
  padding: "14px 18px",
  textTransform: "uppercase",
};

const summaryNodeStyle: CSSProperties = {
  ...nodeStyle,
  border: "1px solid rgba(192, 254, 4, 0.4)",
  boxShadow: "0 0 0 1px rgba(192, 254, 4, 0.18)",
};

const edgeStyle: CSSProperties = {
  stroke: "rgba(192, 254, 4, 0.6)",
  strokeWidth: 1.4,
};

const foundationNodes: FoundationNode[] = [
  {
    data: { label: "Ingest Spec" },
    id: "spec",
    position: { x: 80, y: 80 },
    sourcePosition: Position.Right,
    style: nodeStyle,
    targetPosition: Position.Left,
  },
  {
    data: { label: "Plan Execution" },
    id: "plan",
    position: { x: 320, y: 60 },
    sourcePosition: Position.Right,
    style: nodeStyle,
    targetPosition: Position.Left,
  },
  {
    data: { label: "Dispatch Agents" },
    id: "dispatch",
    position: { x: 580, y: 60 },
    sourcePosition: Position.Right,
    style: nodeStyle,
    targetPosition: Position.Left,
  },
  {
    data: { label: "Collect Results" },
    id: "collect",
    position: { x: 580, y: 220 },
    sourcePosition: Position.Right,
    style: nodeStyle,
    targetPosition: Position.Left,
  },
  {
    data: { label: "Summarize Outcome" },
    id: "summary",
    position: { x: 840, y: 140 },
    style: summaryNodeStyle,
    targetPosition: Position.Left,
  },
];

const foundationEdges: FoundationEdge[] = [
  { id: "spec-plan", source: "spec", style: edgeStyle, target: "plan", type: "smoothstep" },
  {
    id: "plan-dispatch",
    source: "plan",
    style: edgeStyle,
    target: "dispatch",
    type: "smoothstep",
  },
  {
    id: "dispatch-collect",
    source: "dispatch",
    style: edgeStyle,
    target: "collect",
    type: "smoothstep",
  },
  {
    id: "plan-summary",
    source: "plan",
    style: edgeStyle,
    target: "summary",
    type: "smoothstep",
  },
  {
    id: "collect-summary",
    source: "collect",
    style: edgeStyle,
    target: "summary",
    type: "smoothstep",
  },
];

const meta = {
  title: "Graphs/GraphCanvas",
  component: GraphCanvas,
  args: {
    edges: foundationEdges,
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
  render: (args) => (
    <Flex vertical gap={24} style={{ margin: "0 auto", maxWidth: 1280 }}>
      <Card style={heroCardStyle}>
        <Space direction="vertical" size={10}>
          <Typography.Text style={eyebrowStyle}>React Flow Foundation</Typography.Text>
          <Typography.Title level={1} className="marathon-text-display" style={titleStyle}>
            Reusable graph canvas first.
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            The package now owns a controlled graph surface with read-only defaults: pan, zoom,
            select, and fit-view. The workflow-specific node chrome comes later, but the base
            canvas is already wired for controls, minimap, and background primitives.
          </Typography.Paragraph>
        </Space>
      </Card>

      <Card title="Foundation" extra="Read-Only Defaults" style={canvasCardStyle}>
        <GraphCanvas<FoundationNode, FoundationEdge> {...args} />
      </Card>
    </Flex>
  ),
} satisfies Meta<FoundationStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Foundation: Story = {};

const eyebrowStyle: CSSProperties = {
  color: marathonDosPalette.primary,
  display: "block",
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 620,
};

const copyStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.82)",
  margin: 0,
  maxWidth: 760,
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
