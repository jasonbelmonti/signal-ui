import type { UploadFile } from "antd";
import type { ReactNode } from "react";

export interface SignalChatConversation {
  key: string;
  title: ReactNode;
  preview?: ReactNode;
  icon?: ReactNode;
  group?: string;
  unreadCount?: number;
  status?: ReactNode;
  disabled?: boolean;
}

export type SignalChatMessageRole = "assistant" | "user" | "system";

export interface SignalChatMessage {
  key: string;
  role: SignalChatMessageRole;
  content: ReactNode;
  author?: ReactNode;
  timestamp?: ReactNode;
  status?: "local" | "loading" | "updating" | "success" | "error" | "abort";
  loading?: boolean;
  typing?: boolean;
}

export interface SignalChatPrompt {
  key: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SignalChatAttachment
  extends Pick<UploadFile, "uid" | "name" | "size" | "status" | "type" | "url"> {
  description?: ReactNode;
}
