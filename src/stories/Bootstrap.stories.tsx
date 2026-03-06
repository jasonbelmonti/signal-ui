import { Button, Card, Input, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

const meta = {
  title: "Setup/Bootstrap",
  component: Button,
  args: {
    children: "Agent UI connected",
    type: "primary",
  },
  tags: ["autodocs"],
  render: (args) => (
    <Card style={{ maxWidth: 480 }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Storybook + Ant Design bootstrap
        </Typography.Title>
        <Typography.Paragraph style={{ margin: 0 }}>
          This story is the smoke test for the initial React and Storybook setup.
        </Typography.Paragraph>
        <Input placeholder="Operator handle" />
        <Button {...args} />
      </Space>
    </Card>
  ),
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WorkspaceSmokeTest: Story = {};
