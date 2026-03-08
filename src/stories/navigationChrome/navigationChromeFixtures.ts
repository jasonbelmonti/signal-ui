import {
  AlertOutlined,
  AppstoreOutlined,
  BellOutlined,
  BuildOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  MessageOutlined,
  RadarChartOutlined,
  SearchOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

import type { SignalButtonTone } from "../../components/SignalButton.js";
import type {
  SignalStatusTagContext,
  SignalStatusTagTone,
} from "../../components/SignalStatusTag.js";

type NavigationIcon = ComponentType<{ className?: string }>;

export type NavigationChromeScenario =
  | "top-navigation"
  | "workspace-shell"
  | "mission-control";

export type NavigationChromeShellTone = "primary" | "violet" | "warning";

export interface NavigationChromeSection {
  badge?: string;
  icon: NavigationIcon;
  isActive?: boolean;
  label: string;
  tone?: SignalStatusTagTone;
}

export interface NavigationChromeContextChip {
  label: string;
  tone: SignalStatusTagTone;
}

export interface NavigationChromeUtilityStat {
  label: string;
  tone: SignalStatusTagTone;
  value: string;
}

export interface NavigationChromeHeroAction {
  icon?: NavigationIcon;
  kind: "default" | "primary" | "signal";
  label: string;
  tone?: SignalButtonTone;
}

export interface NavigationChromeHeroTag {
  context?: SignalStatusTagContext;
  label?: string;
  tone?: SignalStatusTagTone;
  value?: string;
}

export interface NavigationChromeMetric {
  label: string;
  note: string;
  tone: SignalStatusTagTone;
  value: string;
}

export interface NavigationChromeListItem {
  detail: string;
  label: string;
  meta: string;
  tone: SignalStatusTagTone;
}

export interface NavigationChromePanel {
  description?: string;
  eyebrow: string;
  items: NavigationChromeListItem[];
  title: string;
  tone: SignalStatusTagTone;
}

export interface NavigationChromeSceneDefinition {
  brandCode: string;
  brandName: string;
  chromeTone: NavigationChromeShellTone;
  contextChips: NavigationChromeContextChip[];
  contextTrail: string[];
  hero: {
    accentLabel: string;
    actions: NavigationChromeHeroAction[];
    description: string;
    eyebrow: string;
    tags: NavigationChromeHeroTag[];
    title: string;
  };
  metrics: NavigationChromeMetric[];
  operatorLabel: string;
  panels: NavigationChromePanel[];
  railPanels: NavigationChromePanel[];
  searchPlaceholder: string;
  sections: NavigationChromeSection[];
  utilityStats: NavigationChromeUtilityStat[];
}

export const navigationChromeScenes: Record<
  NavigationChromeScenario,
  NavigationChromeSceneDefinition
> = {
  "top-navigation": {
    brandCode: "SG-UI",
    brandName: "Signal Theme Deck",
    chromeTone: "primary",
    contextChips: [
      { label: "Fullscreen shell", tone: "primary" },
      { label: "Header-first specimen", tone: "violet" },
      { label: "Storybook-bound", tone: "neutral" },
    ],
    contextTrail: ["Storybook", "Patterns", "Navigation Chrome"],
    hero: {
      accentLabel: "Channel 06",
      actions: [
        { icon: ThunderboltOutlined, kind: "signal", label: "Dispatch Preview" },
        { icon: BuildOutlined, kind: "primary", label: "Tune Header Tokens" },
        { icon: SearchOutlined, kind: "default", label: "Open Route Audit" },
      ],
      description:
        "This layout keeps route selection, search, and operator state in the same strip without letting the header turn into airport signage. It should feel active, not bureaucratic.",
      eyebrow: "Top Navigation",
      tags: [
        { context: "provider", value: "codex" },
        { context: "status", value: "thinking" },
        { context: "lane", value: "primary" },
      ],
      title:
        "Header chrome can carry routing, search, and live status without flattening the theme",
    },
    metrics: [
      {
        label: "Primary routes",
        note: "overview, patterns, threads, automations, telemetry",
        tone: "primary",
        value: "05",
      },
      {
        label: "Search reach",
        note: "stories, panels, and saved paths available from one field",
        tone: "violet",
        value: "92%",
      },
      {
        label: "Utility density",
        note: "enough controls to feel useful, not enough to need a map",
        tone: "neutral",
        value: "Lean",
      },
    ],
    operatorLabel: "Operator / Belmonti",
    panels: [
      {
        description:
          "Keep the left-to-right rhythm obvious: broad route groups first, narrow utilities last.",
        eyebrow: "Header Regions",
        items: [
          {
            detail: "primary destination, always visible",
            label: "Route lane",
            meta: "centered",
            tone: "primary",
          },
          {
            detail: "global search with a single neutral field",
            label: "Command search",
            meta: "persistent",
            tone: "violet",
          },
          {
            detail: "notifications, settings, and operator presence",
            label: "Utility cluster",
            meta: "compact",
            tone: "neutral",
          },
        ],
        title: "Top bar anatomy",
        tone: "primary",
      },
      {
        description:
          "The route highlight should feel bolted onto the shell, not like a tab component that wandered in from a dashboard kit.",
        eyebrow: "Active Route",
        items: [
          {
            detail: "lime border, slight lift, icon still monochrome",
            label: "Selected state",
            meta: "deliberate",
            tone: "primary",
          },
          {
            detail: "secondary routes stay visible without competing",
            label: "Idle state",
            meta: "restrained",
            tone: "neutral",
          },
          {
            detail: "badges stay rare and only call real counts",
            label: "Route counts",
            meta: "sparse",
            tone: "violet",
          },
        ],
        title: "Selection rhythm",
        tone: "violet",
      },
      {
        description:
          "Status tags and utility stats should read like console metadata, not marketing chips.",
        eyebrow: "Metadata",
        items: [
          {
            detail: "sync quality in the live header cluster",
            label: "Telemetry stat",
            meta: "99.4%",
            tone: "primary",
          },
          {
            detail: "theme drift or contrast risk stays visible",
            label: "Health stat",
            meta: "low drift",
            tone: "violet",
          },
          {
            detail: "operator label anchors the right edge",
            label: "Presence",
            meta: "single owner",
            tone: "neutral",
          },
        ],
        title: "Utility language",
        tone: "neutral",
      },
    ],
    railPanels: [],
    searchPlaceholder: "Search routes, stories, and saved layouts",
    sections: [
      { icon: AppstoreOutlined, isActive: true, label: "Overview" },
      { badge: "4", icon: DeploymentUnitOutlined, label: "Patterns", tone: "primary" },
      { icon: MessageOutlined, label: "Threads" },
      { icon: ClockCircleOutlined, label: "Automations" },
      { icon: RadarChartOutlined, label: "Telemetry" },
    ],
    utilityStats: [
      { label: "Sync", tone: "primary", value: "99.4%" },
      { label: "Drift", tone: "violet", value: "Low" },
    ],
  },
  "workspace-shell": {
    brandCode: "OPS-3",
    brandName: "Agent Workspace",
    chromeTone: "violet",
    contextChips: [
      { label: "Two-column shell", tone: "violet" },
      { label: "Pinned utility rail", tone: "primary" },
      { label: "Review-ready", tone: "success" },
    ],
    contextTrail: ["Workspaces", "Agent UI", "Navigation Shell"],
    hero: {
      accentLabel: "Workspace",
      actions: [
        { icon: ThunderboltOutlined, kind: "signal", label: "Resume Session", tone: "violet" },
        { icon: BuildOutlined, kind: "primary", label: "Pin Surface" },
        { icon: SearchOutlined, kind: "default", label: "Inspect Routes" },
      ],
      description:
        "This is the fuller shell treatment: top routes, a left utility rail for stable anchors, and a content lane where the page header still feels connected to the navigation chrome above it.",
      eyebrow: "Workspace Chrome",
      tags: [
        { context: "provider", value: "codex" },
        { context: "status", value: "awaiting_user" },
        { context: "lane", value: "violet" },
      ],
      title: "Workspace navigation keeps structure, status, and actions on the same frequency",
    },
    metrics: [
      {
        label: "Active sessions",
        note: "operator-owned conversations currently surfaced in the shell",
        tone: "violet",
        value: "12",
      },
      {
        label: "Pinned modules",
        note: "left-rail anchors for queues, lanes, and route health",
        tone: "primary",
        value: "03",
      },
      {
        label: "Review coverage",
        note: "core stories and panels accessible from primary routes",
        tone: "success",
        value: "88%",
      },
      {
        label: "Action latency",
        note: "time from route change to useful first control",
        tone: "neutral",
        value: "Fast",
      },
    ],
    operatorLabel: "Operator / Console Lead",
    panels: [
      {
        description:
          "Main routes stay broad; page-local paths belong in the content lane or rail, not squeezed into the header.",
        eyebrow: "Route Model",
        items: [
          {
            detail: "stable destinations with recognizable silhouettes",
            label: "Primary nav",
            meta: "top bar",
            tone: "primary",
          },
          {
            detail: "persistent queues and lane health",
            label: "Support rail",
            meta: "left edge",
            tone: "violet",
          },
          {
            detail: "page-specific modules and action panels",
            label: "Content chrome",
            meta: "main lane",
            tone: "neutral",
          },
        ],
        title: "Shell split",
        tone: "violet",
      },
      {
        description:
          "The header lockup gives the page a proper front door after the top bar has already done its routing job.",
        eyebrow: "Page Handshake",
        items: [
          {
            detail: "accent label ties the page to its parent lane",
            label: "Lockup label",
            meta: "workspace",
            tone: "violet",
          },
          {
            detail: "hero actions sit below the title without crowding route controls",
            label: "Action shelf",
            meta: "separate row",
            tone: "primary",
          },
          {
            detail: "aside tags keep live status visible during handoff",
            label: "Status cluster",
            meta: "always on",
            tone: "success",
          },
        ],
        title: "Header integration",
        tone: "primary",
      },
      {
        description:
          "Dense panels are fine as long as the shell still makes it obvious what is global, contextual, and urgent.",
        eyebrow: "Content Lanes",
        items: [
          {
            detail: "recent route touches and panel usage",
            label: "Handoff feed",
            meta: "activity",
            tone: "neutral",
          },
          {
            detail: "top-level metrics with terse notes",
            label: "Metric row",
            meta: "scan first",
            tone: "primary",
          },
          {
            detail: "room for more dramatic modules later if needed",
            label: "Expansion space",
            meta: "planned",
            tone: "violet",
          },
        ],
        title: "Main lane behavior",
        tone: "neutral",
      },
    ],
    railPanels: [
      {
        description: "The rail is for the things you should never need to hunt for.",
        eyebrow: "Pinned Lanes",
        items: [
          {
            detail: "navigation stories under active refinement",
            label: "Theme lane",
            meta: "04 open",
            tone: "violet",
          },
          {
            detail: "surface primitives currently in review",
            label: "Components lane",
            meta: "07 open",
            tone: "primary",
          },
          {
            detail: "docs, empty states, and markdown reference pages",
            label: "Documentation lane",
            meta: "02 open",
            tone: "success",
          },
        ],
        title: "Route groups",
        tone: "violet",
      },
      {
        description: "Queue data stays compact so the rail earns its width.",
        eyebrow: "Operator Queue",
        items: [
          {
            detail: "pending request for shell motion pass",
            label: "Visual polish",
            meta: "queued",
            tone: "primary",
          },
          {
            detail: "graph chrome needs a second pass on minimap states",
            label: "Graph review",
            meta: "blocked",
            tone: "warning",
          },
          {
            detail: "button edge treatment ready for capture",
            label: "Signal button",
            meta: "ready",
            tone: "success",
          },
        ],
        title: "Queue",
        tone: "primary",
      },
      {
        description: "Even the quiet shell needs a little pulse.",
        eyebrow: "Telemetry",
        items: [
          {
            detail: "storybook build still within tolerance",
            label: "Capture health",
            meta: "stable",
            tone: "success",
          },
          {
            detail: "focused route now uses the violet accent lane",
            label: "Theme drift",
            meta: "watched",
            tone: "violet",
          },
          {
            detail: "top nav remains under the target height",
            label: "Density budget",
            meta: "good",
            tone: "neutral",
          },
        ],
        title: "Live checks",
        tone: "neutral",
      },
    ],
    searchPlaceholder: "Search routes, operators, and pinned modules",
    sections: [
      { icon: AppstoreOutlined, label: "Overview" },
      { icon: DeploymentUnitOutlined, isActive: true, label: "Workspaces", tone: "violet" },
      { badge: "12", icon: MessageOutlined, label: "Threads", tone: "primary" },
      { icon: DatabaseOutlined, label: "Memory" },
      { icon: SettingOutlined, label: "Controls" },
    ],
    utilityStats: [
      { label: "Queue", tone: "primary", value: "04" },
      { label: "Reviews", tone: "violet", value: "12" },
      { label: "Build", tone: "success", value: "Green" },
    ],
  },
  "mission-control": {
    brandCode: "OPS-9",
    brandName: "Incident Deck",
    chromeTone: "warning",
    contextChips: [
      { label: "High-signal warnings", tone: "warning" },
      { label: "Escalation rail", tone: "danger" },
      { label: "Fast recovery actions", tone: "primary" },
    ],
    contextTrail: ["Operations", "Mission Control", "Escalation"],
    hero: {
      accentLabel: "Ops Deck",
      actions: [
        { icon: AlertOutlined, kind: "signal", label: "Open Incident Lane" },
        { icon: ThunderboltOutlined, kind: "primary", label: "Run Recovery Sweep" },
        { icon: SearchOutlined, kind: "default", label: "Trace Signal Drop" },
      ],
      description:
        "This variant pushes the chrome into an alert posture without repainting the whole theme red. Warnings stay concentrated in the parts that need decisions; structure stays readable everywhere else.",
      eyebrow: "Mission Control",
      tags: [
        { context: "provider", value: "system" },
        { context: "status", value: "running_tool" },
        { label: "at risk", tone: "danger" },
      ],
      title: "Navigation chrome should escalate cleanly when the workspace gets loud",
    },
    metrics: [
      {
        label: "At-risk sessions",
        note: "threads requiring intervention before normal handoff",
        tone: "danger",
        value: "03",
      },
      {
        label: "Blocked routes",
        note: "destinations still visible but clearly degraded",
        tone: "warning",
        value: "02",
      },
      {
        label: "Recovery plays",
        note: "shell-level actions available without route switching",
        tone: "primary",
        value: "06",
      },
      {
        label: "Telemetry lag",
        note: "enough to notice, not enough to panic and start inventing ghosts",
        tone: "neutral",
        value: "18s",
      },
    ],
    operatorLabel: "Operator / Incident Lead",
    panels: [
      {
        description:
          "Warning chrome is more believable when it is localized to routes, rails, and action surfaces that have actual consequences.",
        eyebrow: "Escalation Rules",
        items: [
          {
            detail: "warn but do not hide blocked destinations",
            label: "Route degradation",
            meta: "visible",
            tone: "warning",
          },
          {
            detail: "reserve danger for items that need intervention",
            label: "True alerts",
            meta: "rare",
            tone: "danger",
          },
          {
            detail: "keep neutral surfaces readable for triage",
            label: "Structural chrome",
            meta: "calm",
            tone: "neutral",
          },
        ],
        title: "Alert discipline",
        tone: "warning",
      },
      {
        description:
          "The top bar still routes the app. The hero just opens the current incident lane and exposes recovery controls.",
        eyebrow: "Recovery Strip",
        items: [
          {
            detail: "search narrows down failing routes and owners",
            label: "Trace field",
            meta: "persistent",
            tone: "primary",
          },
          {
            detail: "hero actions stay immediately below the title",
            label: "Recovery actions",
            meta: "fast",
            tone: "warning",
          },
          {
            detail: "live tags communicate system source and urgency",
            label: "Status cluster",
            meta: "critical",
            tone: "danger",
          },
        ],
        title: "Control posture",
        tone: "primary",
      },
      {
        description:
          "A mission-control shell should still look intentional, not like the app spilled ketchup on itself.",
        eyebrow: "Visual Guardrails",
        items: [
          {
            detail: "phosphor lime remains the anchor accent for navigation",
            label: "Primary hierarchy",
            meta: "preserved",
            tone: "primary",
          },
          {
            detail: "warning and danger stay in small, sharp doses",
            label: "Incident accents",
            meta: "focused",
            tone: "danger",
          },
          {
            detail: "panel silhouettes do the structure work, not color alone",
            label: "Shape language",
            meta: "consistent",
            tone: "neutral",
          },
        ],
        title: "Theme discipline",
        tone: "neutral",
      },
    ],
    railPanels: [
      {
        description: "The rail turns into a triage board when the shell gets noisy.",
        eyebrow: "Escalation Queue",
        items: [
          {
            detail: "route contrast regression on small screens",
            label: "Mobile nav",
            meta: "urgent",
            tone: "danger",
          },
          {
            detail: "workspace rail needs tighter warning grouping",
            label: "Rail clarity",
            meta: "warning",
            tone: "warning",
          },
          {
            detail: "story capture still pending for shell pass",
            label: "Visual capture",
            meta: "queued",
            tone: "primary",
          },
        ],
        title: "Triage board",
        tone: "danger",
      },
      {
        description: "Recovery plays live one step away from the incident hero.",
        eyebrow: "Playbooks",
        items: [
          {
            detail: "trim route density and widen utility cluster gaps",
            label: "Stabilize header",
            meta: "play 01",
            tone: "primary",
          },
          {
            detail: "promote the failing lane into the rail",
            label: "Surface risk",
            meta: "play 02",
            tone: "warning",
          },
          {
            detail: "capture current chrome before any deeper refactor",
            label: "Freeze frame",
            meta: "play 03",
            tone: "neutral",
          },
        ],
        title: "Recovery plays",
        tone: "warning",
      },
    ],
    searchPlaceholder: "Trace routes, failing captures, and route owners",
    sections: [
      { icon: AppstoreOutlined, label: "Overview" },
      { badge: "3", icon: BellOutlined, isActive: true, label: "Incidents", tone: "warning" },
      { icon: DeploymentUnitOutlined, label: "Systems" },
      { icon: MessageOutlined, label: "Threads" },
      { icon: UserOutlined, label: "Operators" },
    ],
    utilityStats: [
      { label: "Risk", tone: "danger", value: "High" },
      { label: "Lag", tone: "warning", value: "18s" },
      { label: "Ready", tone: "primary", value: "06" },
    ],
  },
};
