import { Card, Flex, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { SignalChat } from "../components/SignalChat.js";
import type { SignalChatPrompt, SignalChatProps } from "../components/SignalChat.js";
import { SignalStatusTag } from "../components/SignalStatusTag.js";
import {
  signalChatAttachments,
  signalChatConversations,
  signalChatMessages,
  signalChatPrompts,
} from "./chatUi/chatUiFixtures.js";
import { signalPalette } from "../theme/signalTheme.js";

const meta = {
  title: "Components/SignalChat",
  component: SignalChat,
  args: {
    activeConversationKey: signalChatConversations[0]?.key,
    attachments: signalChatAttachments,
    composerPlaceholder: "Ask Signal to summarize, route, or draft the next operator update.",
    composerValue: "Add next update time and assign api-gateway-07 ownership.",
    conversationSubtitle:
      "Grouped channels, unread counts, and room for backend-specific affordances.",
    conversations: signalChatConversations,
    emptyDescription:
      "Load a thread or seed a prompt to begin drafting with the shared chat shell.",
    emptyTitle: "No messages yet",
    footerNote:
      "Composable shell: plug in uploads, slash commands, agent routing, or your own transport layer.",
    headerAside: (
      <Space wrap size={[8, 8]}>
        <SignalStatusTag tone="warning" value="2">
          review gates
        </SignalStatusTag>
        <SignalStatusTag tone="primary" value="96.4%">
          success rate
        </SignalStatusTag>
      </Space>
    ),
    messages: signalChatMessages,
    prompts: signalChatPrompts,
    statusLabel: "pilot",
    title: "Signal Chat",
  },
  argTypes: {
    activeConversationKey: {
      control: false,
    },
    attachments: {
      control: false,
    },
    composerValue: {
      control: false,
    },
    conversations: {
      control: false,
    },
    headerAside: {
      control: false,
    },
    messages: {
      control: false,
    },
    onAttachClick: {
      control: false,
    },
    onComposerChange: {
      control: false,
    },
    onConversationChange: {
      control: false,
    },
    onPromptSelect: {
      control: false,
    },
    onSubmit: {
      control: false,
    },
    prompts: {
      control: false,
    },
    subtitle: {
      control: false,
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  render: (args) => <SignalChatReferenceStory {...args} />,
} satisfies Meta<typeof SignalChat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EmptyState: Story = {
  args: {
    activeConversationKey: signalChatConversations[0]?.key,
    attachments: [],
    composerValue: "",
    emptyDescription:
      "Seed the conversation from prompts or route in your own messages once a thread is selected.",
    emptyTitle: "Start a conversation",
    messages: [],
    prompts: [],
    statusLabel: "draft",
  },
};

function SignalChatReferenceStory({
  activeConversationKey,
  composerValue,
  conversations,
  prompts,
  ...args
}: SignalChatProps) {
  const [currentConversationKey, setCurrentConversationKey] = useState(
    activeConversationKey ?? conversations[0]?.key,
  );
  const [currentComposerValue, setCurrentComposerValue] = useState(composerValue);

  useEffect(() => {
    setCurrentComposerValue(composerValue);
  }, [composerValue]);

  useEffect(() => {
    setCurrentConversationKey((current) => {
      if (current && conversations.some((conversation) => conversation.key === current)) {
        return current;
      }

      return activeConversationKey ?? conversations[0]?.key;
    });
  }, [activeConversationKey, conversations]);

  return (
    <Flex vertical gap={24} style={{ margin: "0 auto", maxWidth: 1320 }}>
      <Card style={heroCardStyle}>
        <Space direction="vertical" size={10} style={{ maxWidth: 760 }}>
          <Typography.Text style={eyebrowStyle}>Conversation Shell</Typography.Text>
          <Typography.Title level={1} className="signal-ui-text-display" style={titleStyle}>
            Theme-native chat workflows with prompts, attachments, and transcript chrome.
          </Typography.Title>
          <Typography.Paragraph style={copyStyle}>
            SignalChat wraps the Ant Design X conversation primitives in the shared panel, lockup,
            sidebar, and transcript treatment so product teams can plug in their own transport,
            agent routing, or backend orchestration without rebuilding the surface.
          </Typography.Paragraph>
        </Space>
      </Card>

      <SignalChat
        {...args}
        activeConversationKey={currentConversationKey}
        composerValue={currentComposerValue}
        conversations={conversations}
        onAttachClick={() => {}}
        onComposerChange={setCurrentComposerValue}
        onConversationChange={setCurrentConversationKey}
        onPromptSelect={(key) => {
          setCurrentComposerValue(resolvePromptComposerValue(prompts, key));
        }}
        onSubmit={() => {
          setCurrentComposerValue("");
        }}
        prompts={prompts}
      />
    </Flex>
  );
}

function resolvePromptComposerValue(prompts: SignalChatPrompt[] | undefined, key: string) {
  const prompt = prompts?.find((candidate) => candidate.key === key);

  if (prompt && typeof prompt.label === "string") {
    return prompt.label;
  }

  return `Run prompt: ${key}`;
}

const eyebrowStyle: CSSProperties = {
  color: signalPalette.primary,
  display: "block",
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const titleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 720,
};

const copyStyle: CSSProperties = {
  color: "rgba(245, 245, 240, 0.82)",
  margin: 0,
};

const heroCardStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(192, 254, 4, 0.12), transparent 32%), linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 52%), #090909",
  borderColor: "rgba(192, 254, 4, 0.38)",
};
