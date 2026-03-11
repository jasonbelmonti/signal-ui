import { Typography } from "antd";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Panel } from "./Panel.js";
import { SignalHeaderLockup } from "./SignalHeaderLockup.js";
import { SignalStatusTag } from "./SignalStatusTag.js";
import { SignalChatComposer } from "./signalChat/SignalChatComposer.js";
import { SignalChatLayout } from "./signalChat/SignalChatLayout.js";
import { SignalChatSidebar } from "./signalChat/SignalChatSidebar.js";
import { SignalChatTranscript } from "./signalChat/SignalChatTranscript.js";
import type {
  SignalChatAttachment,
  SignalChatConversation,
  SignalChatMessage,
  SignalChatPrompt,
} from "./signalChat/types.js";
import { joinClassNames } from "../utils/joinClassNames.js";

export interface SignalChatProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children" | "title" | "onSubmit"> {
  activeConversationKey?: string;
  attachments?: SignalChatAttachment[];
  composerPlaceholder?: string;
  composerValue: string;
  conversationSubtitle?: string;
  conversations: SignalChatConversation[];
  disabled?: boolean;
  emptyDescription?: string;
  emptyTitle?: string;
  footerNote?: string;
  headerAside?: ReactNode;
  loading?: boolean;
  messages: SignalChatMessage[];
  onAttachClick?: () => void;
  onComposerChange?: (value: string) => void;
  onConversationChange?: (key: string) => void;
  onPromptSelect?: (key: string) => void;
  onSubmit?: (value: string) => void;
  prompts?: SignalChatPrompt[];
  statusLabel?: string;
  subtitle?: ReactNode;
  title: string;
}

export function SignalChat({
  activeConversationKey,
  attachments,
  className,
  composerPlaceholder,
  composerValue,
  conversationSubtitle,
  conversations,
  disabled,
  emptyDescription,
  emptyTitle,
  footerNote,
  headerAside,
  loading,
  messages,
  onAttachClick,
  onComposerChange,
  onConversationChange,
  onPromptSelect,
  onSubmit,
  prompts,
  statusLabel,
  subtitle,
  title,
  ...props
}: SignalChatProps) {
  const resolvedSubtitle =
    subtitle ??
    "Ant Design X transcript, prompts, sender, and attachments wrapped in the Signal visual system.";

  return (
    <Panel
      className={joinClassNames("signal-ui-chat", className)}
      cutCornerPreset="tactical"
      {...props}
    >
      <SignalChatLayout
        composer={
          <SignalChatComposer
            attachments={attachments}
            composerPlaceholder={composerPlaceholder}
            composerValue={composerValue}
            disabled={disabled}
            footerNote={footerNote}
            loading={loading}
            onAttachClick={onAttachClick}
            onComposerChange={onComposerChange}
            onPromptSelect={onPromptSelect}
            onSubmit={onSubmit}
            prompts={prompts}
          />
        }
        header={
          <div className="signal-ui-chat__header">
            <SignalHeaderLockup
              accentLabel="chat shell"
              aside={headerAside}
              description={resolvedSubtitle}
              eyebrow="Batteries included"
              title={title}
              titleLevel={2}
            >
              <div className="signal-ui-chat__header-meta">
                {statusLabel ? <SignalStatusTag tone="primary">{statusLabel}</SignalStatusTag> : null}
                <Typography.Text className="signal-ui-chat__header-note">
                  Theme-native wrapper with pluggable backend hooks
                </Typography.Text>
              </div>
            </SignalHeaderLockup>
          </div>
        }
        sidebar={
          <SignalChatSidebar
            activeConversationKey={activeConversationKey}
            conversations={conversations}
            onConversationChange={onConversationChange}
            statusLabel={statusLabel}
            subtitle={conversationSubtitle}
            title="Ops channels"
          />
        }
        transcript={
          <SignalChatTranscript
            emptyDescription={emptyDescription}
            emptyTitle={emptyTitle}
            messages={messages}
          />
        }
      />
    </Panel>
  );
}

export type {
  SignalChatAttachment,
  SignalChatConversation,
  SignalChatMessage,
  SignalChatMessageRole,
  SignalChatPrompt,
} from "./signalChat/types.js";
