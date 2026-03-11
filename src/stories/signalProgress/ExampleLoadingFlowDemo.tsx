import {
  ReloadOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Space, Typography } from "antd";
import { startTransition, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

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
  const wasCompleteRef = useRef(false);
  const { armAudio, audioLabel, audioReady, playCompletion } = useSignalCompletionChime();

  useEffect(() => {
    completionPlayedRef.current = false;
    wasCompleteRef.current = false;
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
    const justCompleted = frame.isComplete && !wasCompleteRef.current;
    wasCompleteRef.current = frame.isComplete;

    if (!justCompleted || completionPlayedRef.current) {
      return;
    }

    completionPlayedRef.current = true;
    void playCompletion("primary");
  }, [frame.isComplete, playCompletion]);

  const replaySequence = () => {
    completionPlayedRef.current = false;
    wasCompleteRef.current = false;
    setFrame(getExampleLoadingFrame(0));
    void armAudio();
    setRunToken((currentToken) => currentToken + 1);
  };

  return (
    <Card title="Example Loading Flow" style={demoCardStyle}>
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        <Typography.Paragraph style={copyStyle}>
          Resettable end-to-end sequence for the splash loader: it advances through a staged uplink
          flow, resolves into an in-track completion state, and fires a short synth chime once the
          browser has audio permission.
        </Typography.Paragraph>

        <SignalProgressPanel
          description={frame.description}
          eyebrow={frame.eyebrow}
          meterCompleted={frame.isComplete}
          meterCompletionLabel={frame.completionLabel}
          meterVariant="splash"
          metrics={frame.metrics}
          progress={frame.progress}
          progressLabel={frame.progressLabel}
          status={frame.status}
          title={frame.title}
        />

        <Flex align="center" gap={12} wrap="wrap">
          <Button icon={<ReloadOutlined />} onClick={replaySequence} size="small">
            Replay Sequence
          </Button>
          <SignalStatusTag context="status" value={frame.isComplete ? "completed" : "running_tool"} />
          <SignalStatusTag tone={audioReady ? "info" : "neutral"}>
            <SoundOutlined /> {audioLabel}
          </SignalStatusTag>
        </Flex>
      </Space>
    </Card>
  );
}

const copyStyle: CSSProperties = {
  margin: 0,
  color: "rgba(255, 255, 255, 0.76)",
};

const demoCardStyle: CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
};
