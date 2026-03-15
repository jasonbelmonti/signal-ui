import { Card, Col, Row, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SignalStatusTag } from "../components/SignalStatusTag.js";

const meta = {
  title: "Components/SignalStatusTag",
  component: SignalStatusTag,
  args: {
    value: "awaiting_user",
  },
  tags: ["autodocs"],
  render: () => (
    <Row gutter={[24, 24]}>
      {tagGroups.map((group) => (
        <Col key={group.title} xs={24} md={8}>
          <Card title={group.title}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Typography.Paragraph style={{ margin: 0 }}>
                {group.description}
              </Typography.Paragraph>
              <Space wrap size={[10, 10]}>
                {group.entries.map((entry) => (
                  <SignalStatusTag
                    key={`${group.title}-${entry.value}`}
                    context={group.context}
                    value={entry.value}
                  >
                    {entry.label}
                  </SignalStatusTag>
                ))}
              </Space>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  ),
} satisfies Meta<typeof SignalStatusTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const tagGroups = [
  {
    title: "Provider Tags",
    context: "provider" as const,
    description:
      "These are the console-friendly provider presets, so consumers stop rewriting badge tone switches every time Claude and Codex need to sit next to each other.",
    entries: [
      { label: "Claude", value: "claude" },
      { label: "Codex", value: "codex" },
      { label: "System", value: "system" },
    ],
  },
  {
    title: "Status Tags",
    context: "status" as const,
    description:
      "Known status values map to stable semantic tones, with unknown values falling back to neutral instead of inventing new chromatic religions.",
    entries: [
      { label: "Thinking", value: "thinking" },
      { label: "Running tool", value: "running_tool" },
      { label: "Awaiting user", value: "awaiting_user" },
      { label: "Failed", value: "failed" },
    ],
  },
  {
    title: "Lane Tags",
    context: "lane" as const,
    description:
      "Lane tones keep generic semantic labeling available for special channels without pretending every tag has to be a provider or status.",
    entries: [
      { label: "Primary lane", value: "primary" },
      { label: "Violet lane", value: "violet" },
      { label: "Warning lane", value: "warning" },
      { label: "Danger lane", value: "danger" },
    ],
  },
];
