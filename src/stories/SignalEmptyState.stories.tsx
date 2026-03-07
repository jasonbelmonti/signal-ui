import { Button, Col, Row, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SignalEmptyState } from "../components/SignalEmptyState.js";

const meta = {
  title: "Components/SignalEmptyState",
  component: SignalEmptyState,
  args: {
    title: "Waiting for discovered sessions",
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  render: () => (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={12}>
          <SignalEmptyState
            actions={
              <Space wrap size={[12, 12]}>
                <Button type="primary">Refresh sessions</Button>
                <Button>Inspect adapters</Button>
              </Space>
            }
            description="Use this when the console is still loading enough structure that a generic spinner feels cheap and a full page of chrome would be premature."
            eyebrow="Loading Surface"
            label="Projection scan"
            title="Waiting for discovered sessions"
            tone="primary"
            visual="pixel-cube"
            visualDetail="forming operator queue"
            visualLabel="console intake"
          />
        </Col>

        <Col xs={24} xl={12}>
          <SignalEmptyState
            actions={<Button>Review lane filters</Button>}
            description="A quieter structural idle state for cases where the interface should acknowledge the absence of selection without pretending nothingness needs a rave."
            eyebrow="No Selection"
            label="Workspace"
            title="Choose a session to inspect"
            tone="violet"
            visual="wireframe"
            visualDetail="standby timeline lattice"
          >
            <Typography.Text style={{ color: "rgba(245, 245, 240, 0.72)" }}>
              Pair this with a selected-session panel or side rail without turning the entire
              application into a loading shrine.
            </Typography.Text>
          </SignalEmptyState>
        </Col>

        <Col xs={24}>
          <SignalEmptyState
            compact
            description="Compact mode keeps the same shell language for alerts and retry states where the full hero treatment would be overkill."
            eyebrow="Error Surface"
            framed={false}
            title="Timeline refresh failed"
            tone="error"
          >
            <Space wrap size={[12, 12]}>
              <Button danger>Retry fetch</Button>
              <Button type="text">Open logs</Button>
            </Space>
          </SignalEmptyState>
        </Col>
      </Row>
    </div>
  ),
} satisfies Meta<typeof SignalEmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BuiltInVisuals: Story = {};
