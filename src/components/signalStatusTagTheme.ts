export type SignalStatusTagContext = "provider" | "status" | "lane";
export type SignalStatusTagTone =
  | "neutral"
  | "primary"
  | "violet"
  | "info"
  | "success"
  | "warning"
  | "danger";

const providerToneByValue: Record<string, SignalStatusTagTone> = {
  claude: "info",
  codex: "violet",
  system: "neutral",
};

const statusToneByValue: Record<string, SignalStatusTagTone> = {
  awaiting_user: "success",
  cancelled: "warning",
  completed: "primary",
  discovering: "info",
  failed: "danger",
  idle: "neutral",
  running_tool: "warning",
  thinking: "violet",
};

const laneToneByValue: Record<string, SignalStatusTagTone> = {
  danger: "danger",
  default: "neutral",
  error: "danger",
  info: "info",
  neutral: "neutral",
  primary: "primary",
  success: "success",
  violet: "violet",
  warning: "warning",
};

export function resolveSignalStatusTagTone(
  context?: SignalStatusTagContext,
  value?: string | null,
): SignalStatusTagTone {
  const normalizedValue = normalizeSignalStatusTagValue(value);

  if (!context || !normalizedValue) {
    return "neutral";
  }

  switch (context) {
    case "provider":
      return providerToneByValue[normalizedValue] ?? "neutral";
    case "status":
      return statusToneByValue[normalizedValue] ?? "neutral";
    case "lane":
      return laneToneByValue[normalizedValue] ?? "neutral";
    default:
      return "neutral";
  }
}

export function formatSignalStatusTagLabel(value?: string | null) {
  if (!value) {
    return "unknown";
  }

  return value.replaceAll(/[_-]+/g, " ").trim() || "unknown";
}

function normalizeSignalStatusTagValue(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.trim().toLowerCase().replaceAll(/[\s-]+/g, "_");
}
