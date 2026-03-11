import { Typography } from "antd";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { joinClassNames } from "../utils/joinClassNames.js";
import { PixelCubeLoader } from "./PixelCubeLoader.js";
import { PixelCubePath } from "./PixelCubePath.js";
import type { PixelCubePathTone } from "./PixelCubePath.js";
import { SignalWireframe } from "./SignalWireframe.js";

export type SignalEmptyStateTone = "default" | "primary" | "violet" | "warning" | "error";
export type SignalEmptyStateVisual = "none" | "pixel-cube" | "pixel-path" | "wireframe";

export interface SignalEmptyStateProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children" | "title"> {
  actions?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
  description?: ReactNode;
  eyebrow?: ReactNode;
  framed?: boolean;
  label?: ReactNode;
  title: ReactNode;
  tone?: SignalEmptyStateTone;
  visual?: ReactNode | SignalEmptyStateVisual;
  visualDetail?: string;
  visualLabel?: string;
  visualTone?: "primary" | "violet";
}

export function SignalEmptyState({
  actions,
  children,
  className,
  compact = false,
  description,
  eyebrow,
  framed = true,
  label,
  title,
  tone = "default",
  visual = "none",
  visualDetail,
  visualLabel,
  visualTone = tone === "violet" ? "violet" : "primary",
  ...props
}: SignalEmptyStateProps) {
  const visualNode = resolveSignalEmptyStateVisual({
    compact,
    tone,
    visual,
    visualDetail,
    visualLabel,
    visualTone,
  });
  const hasVisual = visualNode !== null && visualNode !== undefined && visualNode !== false;

  return (
    <section
      className={joinClassNames(
        "signal-ui-empty-state",
        framed && "signal-ui-empty-state--framed",
        compact && "signal-ui-empty-state--compact",
        hasVisual && "signal-ui-empty-state--with-visual",
        `signal-ui-empty-state--tone-${tone}`,
        className,
      )}
      {...props}
    >
      {hasVisual ? <div className="signal-ui-empty-state__visual">{visualNode}</div> : null}

      <div className="signal-ui-empty-state__content">
        {label || eyebrow ? (
          <div className="signal-ui-empty-state__topline">
            {label ? <span className="signal-ui-accent-field">{label}</span> : null}
            {eyebrow ? (
              <Typography.Text className="signal-ui-empty-state__eyebrow">
                {eyebrow}
              </Typography.Text>
            ) : null}
          </div>
        ) : null}

        <Typography.Title
          className="signal-ui-text-display"
          level={compact ? 4 : 3}
          style={{ margin: 0 }}
        >
          {title}
        </Typography.Title>

        {description ? (
          <Typography.Paragraph className="signal-ui-empty-state__description">
            {description}
          </Typography.Paragraph>
        ) : null}

        {children ? <div className="signal-ui-empty-state__detail">{children}</div> : null}
        {actions ? <div className="signal-ui-empty-state__actions">{actions}</div> : null}
      </div>
    </section>
  );
}

function resolveSignalEmptyStateVisual({
  compact,
  tone,
  visual,
  visualDetail,
  visualLabel,
  visualTone,
}: {
  compact: boolean;
  tone: SignalEmptyStateTone;
  visual: ReactNode | SignalEmptyStateVisual;
  visualDetail?: string;
  visualLabel?: string;
  visualTone: "primary" | "violet";
}) {
  if (visual === "none") {
    return null;
  }

  if (visual === "pixel-cube") {
    return (
      <PixelCubeLoader
        compact={compact}
        detail={visualDetail ?? "waiting for live session telemetry"}
        label={visualLabel ?? "projection scan"}
        showLegend={false}
        size={compact ? 112 : 168}
        tone={visualTone}
      />
    );
  }

  if (visual === "pixel-path") {
    const resolvedPixelPathTone: PixelCubePathTone =
      tone === "error" ? "error" : visualTone;

    if (visualLabel) {
      return (
        <PixelCubePath
          label={visualLabel}
          size={compact ? 136 : 208}
          tone={resolvedPixelPathTone}
          usage="loader"
        />
      );
    }

    return (
      <PixelCubePath
        size={compact ? 136 : 208}
        tone={resolvedPixelPathTone}
        usage="decorative"
      />
    );
  }

  if (visual === "wireframe") {
    return (
      <SignalWireframe
        animated={false}
        detail={visualDetail ?? "standby lattice"}
        height={compact ? 180 : 220}
        showLegend={false}
        tone={visualTone}
      />
    );
  }

  return visual;
}
