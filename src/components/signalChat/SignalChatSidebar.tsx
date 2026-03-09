import { Conversations } from "@ant-design/x";
import { Button, Space, Typography } from "antd";
import { MessageOutlined, PlusOutlined } from "@ant-design/icons";

import { SignalStatusTag } from "../SignalStatusTag.js";
import {
  renderSignalChatConversationLabel,
  signalChatConversationClassNames,
} from "./signalChatTheme.js";
import type { SignalChatConversation } from "./types.js";

export interface SignalChatSidebarProps {
  activeConversationKey?: string;
  conversations: SignalChatConversation[];
  onConversationChange?: (key: string) => void;
  statusLabel?: string;
  subtitle?: string;
  title: string;
}

export function SignalChatSidebar({
  activeConversationKey,
  conversations,
  onConversationChange,
  statusLabel,
  subtitle,
  title,
}: SignalChatSidebarProps) {
  return (
    <aside className="signal-ui-chat__sidebar">
      <div className="signal-ui-chat__sidebar-header">
        <div>
          <Typography.Text className="signal-ui-chat__eyebrow">
            Mission chat
          </Typography.Text>
          <Typography.Title className="signal-ui-text-display-secondary" level={3}>
            {title}
          </Typography.Title>
          {subtitle ? (
            <Typography.Paragraph className="signal-ui-chat__sidebar-subtitle">
              {subtitle}
            </Typography.Paragraph>
          ) : null}
        </div>

        <Space size={8}>
          {statusLabel ? <SignalStatusTag tone="primary">{statusLabel}</SignalStatusTag> : null}
          <Button icon={<PlusOutlined />} type="default">
            New thread
          </Button>
        </Space>
      </div>

      <div className="signal-ui-chat__sidebar-toolbar">
        <Space size={8}>
          <MessageOutlined />
          <Typography.Text className="signal-ui-chat__sidebar-count">
            {conversations.length} active channels
          </Typography.Text>
        </Space>
      </div>

      <Conversations
        activeKey={activeConversationKey}
        classNames={signalChatConversationClassNames}
        groupable={{
          label: (group) => (
            <Typography.Text className="signal-ui-chat__group-label">
              {group}
            </Typography.Text>
          ),
        }}
        items={conversations.map((conversation) => ({
          key: conversation.key,
          icon: conversation.icon,
          group: conversation.group,
          disabled: conversation.disabled,
          label: renderSignalChatConversationLabel(conversation),
        }))}
        onActiveChange={(key) => onConversationChange?.(String(key))}
      />
    </aside>
  );
}
