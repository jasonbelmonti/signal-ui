import { Col, Row } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SignalProgressPanel } from "../components/SignalProgressPanel.js";
import { ExampleLoadingFlowDemo } from "./signalProgress/ExampleLoadingFlowDemo.js";

const meta = {
  title: "Components/SignalProgressPanel",
  component: SignalProgressPanel,
  args: {
    eyebrow: "Live Operation",
    meterCompleted: false,
    meterCompletionLabel: "seal verified",
    title: "Synchronizing uplink shard",
    description:
      "Compact status panel for long-running work where you want the operation summary and a legible progress read at the same time.",
    progress: 64,
    progressLabel: "transfer progress",
    status: "streaming",
    tone: "primary",
    meterVariant: "flat",
    metrics: [
      { label: "Stage", value: "04/07" },
      { label: "Rate", value: "18 MB/S" },
      { label: "ETA", value: "00:42" },
    ],
  },
  argTypes: {
    progress: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    tone: {
      control: "inline-radio",
      options: ["primary", "violet"],
    },
    meterVariant: {
      control: "inline-radio",
      options: ["flat", "splash"],
    },
    meterCompleted: {
      control: "boolean",
    },
    meterCompletionLabel: {
      control: "text",
    },
    segmentCount: {
      control: {
        type: "range",
        min: 8,
        max: 32,
        step: 2,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SignalProgressPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DualOperations: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={13}>
        <SignalProgressPanel
          description="Reticle-framed progress surface for active ingest or deployment work where a plain percentage readout feels too generic."
          eyebrow="Active Relay"
          meterVariant="splash"
          metrics={[
            { label: "Stage", value: "04/07" },
            { label: "Rate", value: "18 MB/S" },
            { label: "ETA", value: "00:42" },
          ]}
          progress={64}
          progressLabel="transfer progress"
          status="streaming"
          title="Synchronizing uplink shard"
        />
      </Col>

      <Col xs={24} lg={11}>
        <SignalProgressPanel
          cutCorner="notch"
          cutCornerColor="var(--signal-ui-accent-violet)"
          cutCornerPlacement="bottom-left"
          description="The violet lane can track quieter background work without losing the same compact pixel meter."
          eyebrow="Secondary Queue"
          metrics={[
            { label: "Batch", value: "12/16" },
            { label: "Depth", value: "218" },
            { label: "ETA", value: "02:14" },
          ]}
          progress={37}
          progressLabel="queue drain"
          status="routing"
          title="Redistributing task envelopes"
          tone="violet"
        />
      </Col>
    </Row>
  ),
};

export const ExampleLoading: Story = {
  render: () => <ExampleLoadingFlowDemo />,
};
