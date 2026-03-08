import { BellOutlined, SearchOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Space, Typography } from "antd";
import type { CSSProperties } from "react";

import { Panel } from "../../components/Panel.js";
import { SignalButton } from "../../components/SignalButton.js";
import { SignalHeaderLockup } from "../../components/SignalHeaderLockup.js";
import { SignalStatusTag } from "../../components/SignalStatusTag.js";
import type { SignalStatusTagTone } from "../../components/SignalStatusTag.js";
import { signalPalette } from "../../theme/signalTheme.js";
import { joinClassNames } from "../../utils/joinClassNames.js";
import {
  navigationChromeScenes,
  type NavigationChromeHeroAction,
  type NavigationChromeHeroTag,
  type NavigationChromeMetric,
  type NavigationChromePanel,
  type NavigationChromeScenario,
  type NavigationChromeSection,
  type NavigationChromeShellTone,
  type NavigationChromeUtilityStat,
} from "./navigationChromeFixtures.js";

export interface NavigationChromeSceneProps {
  scenario: NavigationChromeScenario;
}

type ChromePanelStyle = CSSProperties & {
  "--signal-ui-navigation-panel-accent"?: string;
  "--signal-ui-navigation-panel-glow"?: string;
};

export function NavigationChromeScene({ scenario }: NavigationChromeSceneProps) {
  const scene = navigationChromeScenes[scenario];
  const hasRail = scene.railPanels.length > 0;

  return (
    <div
      className={joinClassNames(
        "signal-ui-navigation-chrome",
        `signal-ui-navigation-chrome--${scene.chromeTone}`,
        !hasRail && "signal-ui-navigation-chrome--header-focus",
      )}
    >
      <div className="signal-ui-navigation-chrome__frame">
        <header className="signal-ui-navigation-chrome__topbar">
          <div className="signal-ui-navigation-chrome__brand">
            <span className="signal-ui-accent-field">{scene.brandCode}</span>
            <div className="signal-ui-navigation-chrome__brand-copy">
              <Typography.Text className="signal-ui-navigation-chrome__brand-eyebrow">
                Navigation chrome
              </Typography.Text>
              <Typography.Text className="signal-ui-text-display">
                {scene.brandName}
              </Typography.Text>
            </div>
          </div>

          <nav className="signal-ui-navigation-chrome__nav" aria-label="Primary">
            {scene.sections.map((section) => (
              <NavigationSectionButton key={section.label} section={section} />
            ))}
          </nav>

          <div className="signal-ui-navigation-chrome__utilities">
            <Input
              className="signal-ui-navigation-chrome__search"
              placeholder={scene.searchPlaceholder}
              prefix={<SearchOutlined />}
            />

            <div className="signal-ui-navigation-chrome__utility-stats">
              {scene.utilityStats.map((stat) => (
                <NavigationUtilityStat key={stat.label} stat={stat} />
              ))}
            </div>

            <button
              type="button"
              className="signal-ui-navigation-chrome__icon-button"
              aria-label="Notifications"
            >
              <BellOutlined />
            </button>
            <button
              type="button"
              className="signal-ui-navigation-chrome__icon-button"
              aria-label="Workspace settings"
            >
              <SettingOutlined />
            </button>

            <div className="signal-ui-navigation-chrome__operator">
              <UserOutlined />
              <span>{scene.operatorLabel}</span>
            </div>
          </div>
        </header>

        <div className="signal-ui-navigation-chrome__subbar">
          <div className="signal-ui-navigation-chrome__trail" aria-label="Context trail">
            {scene.contextTrail.map((segment) => (
              <span key={segment} className="signal-ui-navigation-chrome__trail-segment">
                {segment}
              </span>
            ))}
          </div>

          <div className="signal-ui-navigation-chrome__chips">
            {scene.contextChips.map((chip) => (
              <SignalStatusTag key={chip.label} tone={chip.tone}>
                {chip.label}
              </SignalStatusTag>
            ))}
          </div>
        </div>

        <div className="signal-ui-navigation-chrome__body">
          {hasRail ? (
            <aside className="signal-ui-navigation-chrome__rail" aria-label="Pinned workspace rails">
              {scene.railPanels.map((panel) => (
                <ChromeListPanel key={panel.title} panel={panel} compact />
              ))}
            </aside>
          ) : null}

          <main className="signal-ui-navigation-chrome__main">
            <section className="signal-ui-navigation-chrome__hero">
              <SignalHeaderLockup
                accentLabel={scene.hero.accentLabel}
                accentTone={toHeaderTone(scene.chromeTone)}
                aside={
                  <Space wrap size={[8, 8]}>
                    {scene.hero.tags.map((tag) => (
                      <NavigationHeroTag key={heroTagKey(tag)} tag={tag} />
                    ))}
                  </Space>
                }
                description={scene.hero.description}
                eyebrow={scene.hero.eyebrow}
                title={scene.hero.title}
                titleFont={scene.chromeTone === "violet" ? "display-secondary" : "display"}
                titleLevel={1}
              >
                <Space wrap size={[12, 12]}>
                  {scene.hero.actions.map((action) => (
                    <NavigationHeroAction
                      key={action.label}
                      action={action}
                      shellTone={scene.chromeTone}
                    />
                  ))}
                </Space>
              </SignalHeaderLockup>
            </section>

            <section className="signal-ui-navigation-chrome__metrics" aria-label="Shell metrics">
              {scene.metrics.map((metric) => (
                <ChromeMetricPanel key={metric.label} metric={metric} />
              ))}
            </section>

            <section className="signal-ui-navigation-chrome__panels" aria-label="Navigation chrome details">
              {scene.panels.map((panel) => (
                <ChromeListPanel key={panel.title} panel={panel} />
              ))}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavigationSectionButton({ section }: { section: NavigationChromeSection }) {
  const Icon = section.icon;

  return (
    <button
      type="button"
      className={joinClassNames(
        "signal-ui-navigation-chrome__nav-button",
        section.isActive && "signal-ui-navigation-chrome__nav-button--active",
        section.tone && `signal-ui-navigation-chrome__nav-button--${section.tone}`,
      )}
      aria-current={section.isActive ? "page" : undefined}
    >
      <span className="signal-ui-navigation-chrome__nav-button-label">
        <Icon className="signal-ui-navigation-chrome__nav-icon" />
        <span>{section.label}</span>
      </span>
      {section.badge ? (
        <SignalStatusTag tone={section.tone ?? "neutral"}>{section.badge}</SignalStatusTag>
      ) : null}
    </button>
  );
}

function NavigationUtilityStat({ stat }: { stat: NavigationChromeUtilityStat }) {
  return (
    <div
      className={joinClassNames(
        "signal-ui-navigation-chrome__utility-stat",
        `signal-ui-navigation-chrome__utility-stat--${stat.tone}`,
      )}
    >
      <Typography.Text className="signal-ui-navigation-chrome__utility-label">
        {stat.label}
      </Typography.Text>
      <Typography.Text className="signal-ui-navigation-chrome__utility-value">
        {stat.value}
      </Typography.Text>
    </div>
  );
}

function NavigationHeroTag({ tag }: { tag: NavigationChromeHeroTag }) {
  return (
    <SignalStatusTag context={tag.context} tone={tag.tone} value={tag.value}>
      {tag.label}
    </SignalStatusTag>
  );
}

function NavigationHeroAction({
  action,
  shellTone,
}: {
  action: NavigationChromeHeroAction;
  shellTone: NavigationChromeShellTone;
}) {
  const Icon = action.icon;

  if (action.kind === "signal") {
    return (
      <SignalButton
        icon={Icon ? <Icon /> : undefined}
        tone={action.tone ?? toSignalButtonTone(shellTone)}
      >
        {action.label}
      </SignalButton>
    );
  }

  return (
    <Button icon={Icon ? <Icon /> : undefined} type={action.kind === "primary" ? "primary" : "default"}>
      {action.label}
    </Button>
  );
}

function ChromeMetricPanel({ metric }: { metric: NavigationChromeMetric }) {
  return (
    <Panel
      className={joinClassNames(
        "signal-ui-navigation-chrome__panel",
        "signal-ui-navigation-chrome__metric-panel",
        metric.tone === "violet" && "signal-ui-panel-tab--secondary",
        `signal-ui-navigation-chrome__panel--${metric.tone}`,
      )}
      cutCornerPreset={metric.tone === "neutral" ? "architectural" : "tactical"}
      size="small"
      style={panelToneStyle(metric.tone)}
      title={metric.label}
    >
      <Typography.Text className="signal-ui-navigation-chrome__metric-value">
        {metric.value}
      </Typography.Text>
      <Typography.Paragraph className="signal-ui-navigation-chrome__metric-note">
        {metric.note}
      </Typography.Paragraph>
    </Panel>
  );
}

function ChromeListPanel({
  compact = false,
  panel,
}: {
  compact?: boolean;
  panel: NavigationChromePanel;
}) {
  return (
    <Panel
      className={joinClassNames(
        "signal-ui-navigation-chrome__panel",
        "signal-ui-panel-tab",
        compact && "signal-ui-navigation-chrome__panel--compact",
        panel.tone === "violet" && "signal-ui-panel-tab--secondary",
        `signal-ui-navigation-chrome__panel--${panel.tone}`,
      )}
      cutCornerPreset={panel.tone === "neutral" ? "architectural" : "tactical"}
      extra={<span className="signal-ui-navigation-chrome__panel-eyebrow">{panel.eyebrow}</span>}
      size="small"
      style={panelToneStyle(panel.tone)}
      title={panel.title}
    >
      {panel.description ? (
        <Typography.Paragraph className="signal-ui-navigation-chrome__panel-description">
          {panel.description}
        </Typography.Paragraph>
      ) : null}

      <div className="signal-ui-navigation-chrome__panel-list">
        {panel.items.map((item) => (
          <div key={`${panel.title}-${item.label}`} className="signal-ui-navigation-chrome__panel-row">
            <div className="signal-ui-navigation-chrome__panel-row-copy">
              <Typography.Text className="signal-ui-navigation-chrome__panel-row-title">
                {item.label}
              </Typography.Text>
              <Typography.Paragraph className="signal-ui-navigation-chrome__panel-row-detail">
                {item.detail}
              </Typography.Paragraph>
            </div>

            <div className="signal-ui-navigation-chrome__panel-row-meta">
              <SignalStatusTag tone={item.tone}>{item.meta}</SignalStatusTag>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function heroTagKey(tag: NavigationChromeHeroTag) {
  return tag.label ?? `${tag.context ?? "tag"}-${tag.value ?? tag.tone ?? "unknown"}`;
}

function panelToneStyle(tone: SignalStatusTagTone): ChromePanelStyle {
  const paletteByTone: Record<SignalStatusTagTone, ChromePanelStyle> = {
    danger: {
      "--signal-ui-navigation-panel-accent": signalPalette.error,
      "--signal-ui-navigation-panel-glow": "rgba(242, 71, 35, 0.14)",
    },
    info: {
      "--signal-ui-navigation-panel-accent": "#54ecff",
      "--signal-ui-navigation-panel-glow": "rgba(84, 236, 255, 0.12)",
    },
    neutral: {
      "--signal-ui-navigation-panel-accent": "rgba(245, 245, 240, 0.74)",
      "--signal-ui-navigation-panel-glow": "rgba(255, 255, 255, 0.06)",
    },
    primary: {
      "--signal-ui-navigation-panel-accent": signalPalette.primary,
      "--signal-ui-navigation-panel-glow": "rgba(192, 254, 4, 0.14)",
    },
    success: {
      "--signal-ui-navigation-panel-accent": "#34d399",
      "--signal-ui-navigation-panel-glow": "rgba(52, 211, 153, 0.12)",
    },
    violet: {
      "--signal-ui-navigation-panel-accent": signalPalette.accentViolet,
      "--signal-ui-navigation-panel-glow": "rgba(159, 77, 255, 0.14)",
    },
    warning: {
      "--signal-ui-navigation-panel-accent": signalPalette.warning,
      "--signal-ui-navigation-panel-glow": "rgba(255, 155, 47, 0.14)",
    },
  };

  return paletteByTone[tone];
}

function toHeaderTone(tone: NavigationChromeShellTone) {
  return tone === "violet" ? "violet" : "primary";
}

function toSignalButtonTone(tone: NavigationChromeShellTone) {
  return tone === "violet" ? "violet" : "primary";
}
