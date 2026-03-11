import { Space } from "antd";
import { useState } from "react";

import { SignalChat } from "../../components/SignalChat.js";
import { SignalStatusTag } from "../../components/SignalStatusTag.js";
import {
  signalChatAttachments,
  signalChatConversations,
  signalChatMessages,
  signalChatPrompts,
} from "./chatUiFixtures.js";

export function ChatUiScene() {
  const [activeConversationKey, setActiveConversationKey] = useState("hot-channel");
  const [composerValue, setComposerValue] = useState(
    "Add next update time and assign api-gateway-07 ownership.",
  );

  return (
    <SignalChat
      activeConversationKey={activeConversationKey}
      attachments={signalChatAttachments}
      composerValue={composerValue}
      conversationSubtitle="Grouped channels, unread counts, and room for backend-specific affordances."
      conversations={signalChatConversations}
      footerNote="Composable shell: plug in uploads, slash commands, agent routing, or your own transport layer."
      headerAside={
        <Space wrap size={[8, 8]}>
          <SignalStatusTag tone="warning" value="2">
            review gates
          </SignalStatusTag>
          <SignalStatusTag tone="primary" value="96.4%">
            success rate
          </SignalStatusTag>
        </Space>
      }
      messages={signalChatMessages}
      onComposerChange={setComposerValue}
      onConversationChange={setActiveConversationKey}
      onPromptSelect={(key) => setComposerValue(`Run prompt: ${key}`)}
      onSubmit={(value) => setComposerValue(value)}
      prompts={signalChatPrompts}
      statusLabel="pilot"
      title="Signal Chat"
    />
  );
}
