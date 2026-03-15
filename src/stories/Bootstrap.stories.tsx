import { Card, Col, Row, Space, Steps, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

const meta = {
  title: "Overview/Getting Started",
  component: Card,
  args: {
    title: "Signal UI",
  },
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <Card
      title={args.title}
      extra="Signal UI Catalog"
      style={{ maxWidth: 1280, margin: "0 auto" }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Welcome to the Signal UI Storybook
        </Typography.Title>
        <Typography.Paragraph style={{ maxWidth: 840 }}>
          This catalog is the primary public entry for reusable Signal UI components and patterns.
          Use it to inspect production-safe components first, then apply the recipes and labs
          selectively for your product.
        </Typography.Paragraph>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card size="small" title="Quick start">
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Typography.Text>
                  1) Install the package from npm or build locally.
                </Typography.Text>
                <Typography.Text>2) Import shared styles once in your app.</Typography.Text>
                <Typography.Text>
                  3) Wrap your tree with <code>AntdThemeProvider</code>.
                </Typography.Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card size="small" title="Browse by section">
              <Steps
                direction="vertical"
                items={[
                  { title: "Foundations", description: "Design tokens and visual baseline." },
                  {
                    title: "Components",
                    description: "Reference components, states, and interaction patterns.",
                  },
                  {
                    title: "Recipes",
                    description: "Reusable usage patterns for real product flows.",
                  },
                  { title: "Lab", description: "Experimental and edge-case surfaces." },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GettingStarted: Story = {};
