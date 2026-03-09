import {
  ApiOutlined,
  AudioOutlined,
  BugOutlined,
  CloudServerOutlined,
  RadarChartOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import type {
  SignalChatAttachment,
  SignalChatConversation,
  SignalChatMessage,
  SignalChatPrompt,
} from "../../components/SignalChat.js";

export const signalChatConversations: SignalChatConversation[] = [
  {
    key: "hot-channel",
    title: "Incident triage",
    preview: "Payments retries are spiking in us-central. Agent summary is live.",
    group: "Live",
    icon: <RadarChartOutlined />,
    unreadCount: 3,
    status: "active",
  },
  {
    key: "release",
    title: "Release cockpit",
    preview: "QA signed off. Need final rollout note for desktop operators.",
    group: "Live",
    icon: <CloudServerOutlined />,
    status: "ready",
  },
  {
    key: "security",
    title: "Trust review",
    preview: "Summarize the token rotation changes before handoff.",
    group: "Queued",
    icon: <SafetyCertificateOutlined />,
    status: "queued",
  },
  {
    key: "bugs",
    title: "Regression sweep",
    preview: "Capture repro steps and probable owner for the keyboard focus leak.",
    group: "Queued",
    icon: <BugOutlined />,
  },
];

export const signalChatMessages: SignalChatMessage[] = [
  {
    key: "assistant-1",
    role: "assistant",
    author: "Signal copilot",
    timestamp: "09:10",
    content:
      "I pulled the last 30 minutes of telemetry. Retry volume is concentrated in us-central and correlates with a deployment on api-gateway-07.",
  },
  {
    key: "user-1",
    role: "user",
    author: "Jason Belmonti",
    timestamp: "09:11",
    content:
      "Draft the operator update. Keep it short, call out blast radius, and tell me if rollback is warranted.",
  },
  {
    key: "assistant-2",
    role: "assistant",
    author: "Signal copilot",
    timestamp: "09:11",
    content:
      "Draft: We are investigating elevated payment retries in us-central beginning at 09:02 CT. Current impact is limited to checkout latency; successful completion remains above 96%. Rollback is not yet warranted because errors are flattening after traffic shifted away from api-gateway-07.",
  },
  {
    key: "assistant-3",
    role: "assistant",
    author: "Signal copilot",
    timestamp: "streaming",
    content: "I can also append owner, mitigation, and next update timing.",
    typing: true,
    status: "loading",
  },
];

export const signalChatPrompts: SignalChatPrompt[] = [
  {
    key: "status-update",
    label: "Write status update",
    description: "Summarize impact, owner, and next checkpoint for operators.",
    icon: <ApiOutlined />,
  },
  {
    key: "root-cause",
    label: "Find probable cause",
    description: "Compare recent deploys, logs, and regressions for this thread.",
    icon: <BugOutlined />,
  },
  {
    key: "voice-handoff",
    label: "Prep voice handoff",
    description: "Condense the thread into a one-minute spoken brief.",
    icon: <AudioOutlined />,
  },
];

export const signalChatAttachments: SignalChatAttachment[] = [
  {
    uid: "timeline",
    name: "incident-timeline.md",
    status: "done",
    size: 7342,
    type: "text/markdown",
    description: "Operator timeline + mitigations",
  },
  {
    uid: "telemetry",
    name: "retry-spike.png",
    status: "done",
    size: 218430,
    type: "image/png",
    description: "Last 30 min telemetry snapshot",
  },
];
