import { Button, Card, Space } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SignalHeaderLockup } from "../components/SignalHeaderLockup.js";
import { SignalStatusTag } from "../components/SignalStatusTag.js";

const meta = {
  title: "Components/SignalHeaderLockup",
  component: SignalHeaderLockup,
  args: {
    title: "Agent Console uplink",
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  render: () => (
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <Card
          style={{
            borderColor: "rgba(192, 254, 4, 0.36)",
            background:
              "linear-gradient(135deg, rgba(192, 254, 4, 0.12), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 56%), #090909",
          }}
        >
          <SignalHeaderLockup
            accentLabel="Channel 06"
            aside={
              <Space wrap size={[8, 8]}>
                <SignalStatusTag context="provider" value="claude" />
                <SignalStatusTag context="status" value="awaiting_user" />
              </Space>
            }
            description="A shared lockup for hero and section headers, with enough structure for console metadata on the right without forcing every consumer to hand-roll the same accent field and bar treatment."
            eyebrow="Hero Surface"
            title="Agent Console uplink"
            titleLevel={1}
          >
            <Space wrap size={[12, 12]}>
              <Button type="primary">Resume session</Button>
              <Button>Inspect queue</Button>
            </Space>
          </SignalHeaderLockup>
        </Card>

        <Card
          style={{
            borderColor: "rgba(159, 77, 255, 0.34)",
            background:
              "linear-gradient(135deg, rgba(159, 77, 255, 0.12), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 56%), #0a0a0a",
          }}
        >
          <SignalHeaderLockup
            accentLabel="Workspace"
            accentTone="violet"
            description="The same primitive can stay calmer for section-level structure while keeping the accent bar and label system intact."
            eyebrow="Embedded Section"
            title="Session timeline"
            titleFont="display-secondary"
            titleLevel={3}
          />
        </Card>
      </Space>
    </div>
  ),
} satisfies Meta<typeof SignalHeaderLockup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
