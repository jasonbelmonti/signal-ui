import { Button, Space, Typography } from "antd";
import type { BubbleListProps, ConversationsProps, PromptsProps, SenderProps } from "@ant-design/x";
import { PaperClipOutlined, SendOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

import type { SignalChatAttachment, SignalChatMessage } from "./types.js";

type BubbleRoleConfig = NonNullable<BubbleListProps["role"]>;

export const signalChatConversationClassNames = {
  root: "signal-ui-chat__conversation-list",
  group: "signal-ui-chat__conversation-group",
  item: "signal-ui-chat__conversation-item",
  creation: "signal-ui-chat__conversation-creation",
} satisfies NonNullable<ConversationsProps["classNames"]>;

export const signalChatBubbleClassNames = {
  root: "signal-ui-chat__bubble-list",
  scroll: "signal-ui-chat__bubble-scroll",
  bubble: "signal-ui-chat__bubble-shell",
  content: "signal-ui-chat__bubble-content",
  footer: "signal-ui-chat__bubble-footer",
  header: "signal-ui-chat__bubble-header",
  avatar: "signal-ui-chat__bubble-avatar",
  system: "signal-ui-chat__bubble-system",
} satisfies NonNullable<BubbleListProps["classNames"]>;

export const signalChatSenderClassNames = {
  root: "signal-ui-chat__sender",
  content: "signal-ui-chat__sender-content",
  input: "signal-ui-chat__sender-input",
  prefix: "signal-ui-chat__sender-prefix",
  suffix: "signal-ui-chat__sender-suffix",
  footer: "signal-ui-chat__sender-footer",
} satisfies NonNullable<SenderProps["classNames"]>;

export const signalChatPromptsClassNames = {
  root: "signal-ui-chat__prompts",
  list: "signal-ui-chat__prompts-list",
  item: "signal-ui-chat__prompt-card",
  itemContent: "signal-ui-chat__prompt-card-content",
  title: "signal-ui-chat__prompt-card-title",
} satisfies NonNullable<PromptsProps["classNames"]>;

export function createSignalChatRoleConfig(): BubbleRoleConfig {
  return {
    assistant: {
      placement: "start",
      variant: "borderless",
      avatar: renderSignalChatRoleMarker({
        label: "AI",
        detail: "copilot",
        tone: "assistant",
      }),
    },
    user: {
      placement: "end",
      variant: "filled",
      avatar: renderSignalChatRoleMarker({
        label: "OP",
        detail: "human",
        tone: "user",
      }),
    },
    system: {
      placement: "start",
      variant: "borderless",
      avatar: renderSignalChatRoleMarker({
        label: "SYS",
        detail: "bus",
        tone: "system",
      }),
    },
  };
}

function renderSignalChatRoleMarker({
  detail,
  label,
  tone,
}: {
  detail: string;
  label: string;
  tone: "assistant" | "user" | "system";
}) {
  return (
    <div
      className={`signal-ui-chat__role-marker signal-ui-chat__role-marker--${tone}`}
      aria-hidden="true"
    >
      <span className="signal-ui-chat__role-label">{label}</span>
      <span className="signal-ui-chat__role-detail">{detail}</span>
    </div>
  );
}

export function renderSignalChatConversationLabel(conversation: {
  preview?: ReactNode;
  status?: ReactNode;
  title: ReactNode;
  unreadCount?: number;
}) {
  return (
    <div className="signal-ui-chat__conversation-copy">
      <div className="signal-ui-chat__conversation-row">
        <Typography.Text className="signal-ui-chat__conversation-title">
          {conversation.title}
        </Typography.Text>
        {conversation.unreadCount ? (
          <span className="signal-ui-chat__conversation-unread">
            {conversation.unreadCount}
          </span>
        ) : null}
      </div>
      {conversation.preview || conversation.status ? (
        <div className="signal-ui-chat__conversation-row signal-ui-chat__conversation-row--meta">
          {conversation.preview ? (
            <Typography.Text className="signal-ui-chat__conversation-preview">
              {conversation.preview}
            </Typography.Text>
          ) : null}
          {conversation.status ? (
            <span className="signal-ui-chat__conversation-status">{conversation.status}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function toSignalChatBubbleItem(message: SignalChatMessage) {
  return {
    key: message.key,
    role: message.role,
    content: message.content,
    header:
      message.author || message.timestamp ? (
        <Space size={8}>
          {message.author ? (
            <Typography.Text className="signal-ui-chat__message-author">
              {message.author}
            </Typography.Text>
          ) : null}
          {message.timestamp ? (
            <Typography.Text className="signal-ui-chat__message-timestamp">
              {message.timestamp}
            </Typography.Text>
          ) : null}
        </Space>
      ) : undefined,
    loading: message.loading,
    status: message.status,
    typing: message.typing
      ? {
          effect: "typing" as const,
          step: 4,
          interval: 24,
        }
      : false,
  };
}

export function renderSignalChatSenderPrefix({
  attachments,
  disabled,
  onAttachClick,
}: {
  attachments: SignalChatAttachment[];
  disabled?: boolean;
  onAttachClick?: () => void;
}) {
  return (
    <Space size={8}>
      <Button
        className="signal-ui-chat__attach-button"
        disabled={disabled}
        icon={<PaperClipOutlined />}
        onClick={onAttachClick}
        type="text"
      />
      {attachments.length ? (
        <span className="signal-ui-chat__attachment-count">{attachments.length} attached</span>
      ) : null}
    </Space>
  );
}

export function renderSignalChatSenderSuffix({
  disabled,
  canSubmit,
  loading,
}: {
  disabled?: boolean;
  canSubmit: boolean;
  loading?: boolean;
}) {
  return (
    <Button
      className="signal-ui-chat__send-button"
      disabled={disabled || !canSubmit}
      htmlType="submit"
      icon={loading ? <ThunderboltOutlined /> : <SendOutlined />}
      loading={loading}
      type="primary"
    >
      Send
    </Button>
  );
}
