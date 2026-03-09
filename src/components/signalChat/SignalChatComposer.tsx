import { Attachments, Prompts, Sender } from "@ant-design/x";
import { Space, Typography } from "antd";

import {
  renderSignalChatSenderPrefix,
  renderSignalChatSenderSuffix,
  signalChatPromptsClassNames,
  signalChatSenderClassNames,
} from "./signalChatTheme.js";
import type { SignalChatAttachment, SignalChatPrompt } from "./types.js";

export interface SignalChatComposerProps {
  attachments?: SignalChatAttachment[];
  composerPlaceholder?: string;
  composerValue: string;
  disabled?: boolean;
  footerNote?: string;
  loading?: boolean;
  onAttachClick?: () => void;
  onComposerChange?: (value: string) => void;
  onPromptSelect?: (key: string) => void;
  onSubmit?: (value: string) => void;
  prompts?: SignalChatPrompt[];
}

export function SignalChatComposer({
  attachments = [],
  composerPlaceholder = "Draft a reply, operator note, or runbook action...",
  composerValue,
  disabled,
  footerNote = "Enter sends. Shift+Enter for line breaks. Attachments and model controls hook in here.",
  loading,
  onAttachClick,
  onComposerChange,
  onPromptSelect,
  onSubmit,
  prompts = [],
}: SignalChatComposerProps) {
  const canSubmit = composerValue.trim().length > 0;

  return (
    <div className="signal-ui-chat__composer">
      {prompts.length ? (
        <Prompts
          classNames={signalChatPromptsClassNames}
          items={prompts}
          onItemClick={({ data }) => onPromptSelect?.(data.key)}
          title="Fast starts"
          wrap
        />
      ) : null}

      {attachments.length ? (
        <Attachments
          className="signal-ui-chat__attachments"
          items={attachments}
          overflow="scrollX"
        />
      ) : null}

      <Sender
        autoSize={{ minRows: 2, maxRows: 6 }}
        classNames={signalChatSenderClassNames}
        disabled={disabled}
        footer={(oriNode, info) => {
          const { ClearButton } = info.components;

          return (
            <div className="signal-ui-chat__sender-meta">
              <Typography.Text className="signal-ui-chat__footer-note">
                {footerNote}
              </Typography.Text>
              <Space size={8}>
                <ClearButton />
              </Space>
            </div>
          );
        }}
        loading={loading}
        onChange={(value) => onComposerChange?.(value)}
        onSubmit={(value) => onSubmit?.(value)}
        placeholder={composerPlaceholder}
        prefix={renderSignalChatSenderPrefix({
          attachments,
          disabled,
          onAttachClick,
        })}
        submitType="enter"
        suffix={renderSignalChatSenderSuffix({
          disabled,
          canSubmit,
          loading,
        })}
        value={composerValue}
      />
    </div>
  );
}
