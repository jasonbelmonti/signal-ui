import {
  CheckCircleFilled,
  RadarChartOutlined,
  ReloadOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { Card, Flex, Space, Typography } from "antd";
import { startTransition, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Panel } from "../../components/Panel.js";
import { SignalButton } from "../../components/SignalButton.js";
import { SignalProgressPanel } from "../../components/SignalProgressPanel.js";
import { SignalStatusTag } from "../../components/SignalStatusTag.js";
import {
  EXAMPLE_LOADING_TOTAL_MS,
  getExampleLoadingFrame,
  type ExampleLoadingFrame,
} from "./loadingFlowModel.js";
import { useSignalCompletionChime } from "./useSignalCompletionChime.js";

export function ExampleLoadingFlowDemo() {
  const [frame, setFrame] = useState<ExampleLoadingFrame>(() => getExampleLoadingFrame(0));
  const [runToken, setRunToken] = useState(0);
  const completionPlayedRef = useRef(false);
  const { armAudio, audioLabel, audioReady, playCompletion } = useSignalCompletionChime();

  useEffect(() => {
    completionPlayedRef.current = false;
    setFrame(getExampleLoadingFrame(0));

    const startedAt = performance.now();
    let animationFrameId = 0;

    const updateFrame = () => {
      const elapsedMs = Math.min(performance.now() - startedAt, EXAMPLE_LOADING_TOTAL_MS);
      const nextFrame = getExampleLoadingFrame(elapsedMs);

      startTransition(() => {
        setFrame(nextFrame);
      });

      if (elapsedMs < EXAMPLE_LOADING_TOTAL_MS) {
        animationFrameId = window.requestAnimationFrame(updateFrame);
      }
    };

    animationFrameId = window.requestAnimationFrame(updateFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [runToken]);

  useEffect(() => {
    if (!frame.isComplete || completionPlayedRef.current) {
      return;
    }

    completionPlayedRef.current = true;
    void playCompletion("primary");
  }, [frame.isComplete, playCompletion]);

  const replaySequence = () => {
    void armAudio();
    setRunToken((currentToken) => currentToken + 1);
  };

  return (
    <Card title="Example Loading Flow" style={demoCardStyle}>
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        <Typography.Paragraph style={copyStyle}>
          Resettable end-to-end sequence for the splash loader: it advances through a staged uplink
          flow, lands on a completion acknowledgement, and fires a short synth chime once the
          browser has audio permission.
        </Typography.Paragraph>

        <SignalProgressPanel
          description={frame.description}
          eyebrow={frame.eyebrow}
          meterVariant="splash"
          metrics={frame.metrics}
          progress={frame.progress}
          progressLabel={frame.progressLabel}
          status={frame.status}
          title={frame.title}
        />

        <Flex align="center" gap={12} wrap="wrap">
          <div style={{ maxWidth: 260 }}>
            <SignalButton
              edgeWidth={28}
              fillPercent={frame.isComplete ? 100 : 38}
              icon={<ReloadOutlined />}
              onClick={replaySequence}
              pulseBurst={frame.isComplete ? 34 : 0}
              size="middle"
              wakePercent={frame.isComplete ? 88 : 18}
            >
              Replay Sequence
            </SignalButton>
          </div>
          <SignalStatusTag context="status" value={frame.isComplete ? "completed" : "running_tool"} />
          <SignalStatusTag tone={audioReady ? "info" : "neutral"}>
            <SoundOutlined /> {audioLabel}
          </SignalStatusTag>
        </Flex>

        <Panel
          cutCornerPreset="tactical"
          style={getAcknowledgementPanelStyle(frame.isComplete)}
          title={
            <Flex align="center" gap={10} wrap="wrap">
              {frame.isComplete ? <CheckCircleFilled /> : <RadarChartOutlined />}
              <span>{frame.isComplete ? "Completion Acknowledged" : "Completion Listener"}</span>
              <SignalStatusTag tone={frame.isComplete ? "primary" : "neutral"}>
                {frame.acknowledgementLabel}
              </SignalStatusTag>
            </Flex>
          }
        >
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Typography.Text style={getAcknowledgementTitleStyle(frame.isComplete)}>
              {frame.isComplete
                ? "Relay accepted. Envelope sealed."
                : "Standing by for the final phosphor lock."}
            </Typography.Text>
            <Typography.Paragraph style={acknowledgementBodyStyle}>
              {frame.acknowledgementBody}
            </Typography.Paragraph>
          </Space>
        </Panel>
      </Space>
    </Card>
  );
}

function getAcknowledgementPanelStyle(isComplete: boolean): CSSProperties {
  return {
    borderColor: isComplete ? "rgba(192, 254, 4, 0.34)" : "rgba(255, 255, 255, 0.08)",
    background: isComplete
      ? "linear-gradient(135deg, rgba(192, 254, 4, 0.16), transparent 42%), linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 58%), rgba(8, 8, 8, 0.96)"
      : "linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 58%), rgba(8, 8, 8, 0.94)",
    boxShadow: isComplete
      ? "0 0 0 1px rgba(192, 254, 4, 0.12), 0 0 28px rgba(192, 254, 4, 0.08)"
      : "0 0 0 1px rgba(255, 255, 255, 0.04)",
    opacity: isComplete ? 1 : 0.88,
    transform: isComplete ? "translateY(0)" : "translateY(4px)",
    transition: "opacity 180ms ease, transform 180ms ease, box-shadow 220ms ease",
  };
}

function getAcknowledgementTitleStyle(isComplete: boolean): CSSProperties {
  return {
    color: isComplete ? "rgba(236, 255, 198, 0.98)" : "rgba(255, 255, 255, 0.86)",
    fontFamily: "var(--signal-ui-font-pixel)",
    fontSize: 18,
    letterSpacing: "0.12em",
    lineHeight: 1,
    textTransform: "uppercase",
  };
}

const acknowledgementBodyStyle: CSSProperties = {
  margin: 0,
  color: "rgba(255, 255, 255, 0.78)",
};

const copyStyle: CSSProperties = {
  margin: 0,
  color: "rgba(255, 255, 255, 0.76)",
};

const demoCardStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
};
