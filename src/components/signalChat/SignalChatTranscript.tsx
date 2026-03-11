import { Bubble } from "@ant-design/x";

import { SignalEmptyState } from "../SignalEmptyState.js";
import {
  createSignalChatRoleConfig,
  signalChatBubbleClassNames,
  toSignalChatBubbleItem,
} from "./signalChatTheme.js";
import type { SignalChatMessage } from "./types.js";

export interface SignalChatTranscriptProps {
  emptyDescription?: string;
  emptyTitle?: string;
  messages: SignalChatMessage[];
}

export function SignalChatTranscript({
  emptyDescription = "Open a thread or kick off a new one from the left rail.",
  emptyTitle = "No messages yet",
  messages,
}: SignalChatTranscriptProps) {
  if (!messages.length) {
    return (
      <div className="signal-ui-chat__empty">
        <SignalEmptyState
          compact
          description={emptyDescription}
          label="standby"
          title={emptyTitle}
          visual="pixel-path"
          visualLabel="idle route"
        />
      </div>
    );
  }

  return (
    <Bubble.List
      autoScroll
      classNames={signalChatBubbleClassNames}
      items={messages.map(toSignalChatBubbleItem)}
      role={createSignalChatRoleConfig()}
    />
  );
}
