import { Button, Card, ColorPicker, Flex, Input, InputNumber, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { useState } from "react";

import { Panel } from "../components/Panel.js";
import { AntdThemeProvider } from "../providers/AntdThemeProvider.js";
import {
  signalPalette,
  type HexColor,
  type SignalThemePreferences,
} from "../theme/signalTheme.js";

type RuntimeThemeState = {
  accent: HexColor;
  background: HexColor;
  borderRadius: number;
  panel: HexColor;
  primary: HexColor;
  text: HexColor;
};

const defaultThemeState: RuntimeThemeState = {
  accent: signalPalette.accentViolet,
  background: signalPalette.black,
  borderRadius: 2,
  panel: signalPalette.panel,
  primary: signalPalette.primary,
  text: signalPalette.text,
};

const meta = {
  title: "Foundations/Runtime Theme Customization",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  render: () => <RuntimeThemeCustomizationDemo />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function RuntimeThemeCustomizationDemo() {
  const [themeState, setThemeState] = useState(defaultThemeState);

  const themePreferences: SignalThemePreferences = {
    borderRadius: themeState.borderRadius,
    colors: {
      accent: themeState.accent,
      background: themeState.background,
      panel: themeState.panel,
      primary: themeState.primary,
      text: themeState.text,
    },
  };

  return (
    <div style={storyShellStyle}>
      <AntdThemeProvider themePreferences={themePreferences}>
        <Flex vertical gap={24} style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Card
            title="Operator Theme Overrides"
            extra={
              <Button onClick={() => setThemeState(defaultThemeState)} type="default">
                Reset
              </Button>
            }
          >
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Typography.Paragraph style={{ margin: 0, maxWidth: 720 }}>
                This is the constrained runtime surface: a few brand colors and radius, not every
                token in the galaxy. Fewer knobs means fewer crimes.
              </Typography.Paragraph>
              <Flex wrap gap={16}>
                <ThemeColorControl
                  label="Primary"
                  value={themeState.primary}
                  onChange={(primary) => setThemeState((current) => ({ ...current, primary }))}
                />
                <ThemeColorControl
                  label="Background"
                  value={themeState.background}
                  onChange={(background) => setThemeState((current) => ({ ...current, background }))}
                />
                <ThemeColorControl
                  label="Panel"
                  value={themeState.panel}
                  onChange={(panel) => setThemeState((current) => ({ ...current, panel }))}
                />
                <ThemeColorControl
                  label="Text"
                  value={themeState.text}
                  onChange={(text) => setThemeState((current) => ({ ...current, text }))}
                />
                <ThemeColorControl
                  label="Accent"
                  value={themeState.accent}
                  onChange={(accent) => setThemeState((current) => ({ ...current, accent }))}
                />
                <Space direction="vertical" size={6}>
                  <Typography.Text style={controlLabelStyle}>Radius</Typography.Text>
                  <InputNumber
                    min={0}
                    max={24}
                    value={themeState.borderRadius}
                    onChange={(borderRadius) =>
                      setThemeState((current) => ({
                        ...current,
                        borderRadius: borderRadius ?? defaultThemeState.borderRadius,
                      }))
                    }
                  />
                </Space>
              </Flex>
            </Space>
          </Card>

          <Flex wrap gap={24} align="stretch">
            <div style={previewColumnStyle}>
              <Card
                title="Live Preview"
                extra={<span className="signal-ui-accent-field">Nested Provider</span>}
              >
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                  <div className="signal-ui-heading-lockup">
                    <span className="signal-ui-accent-bar" aria-hidden="true" />
                    <div className="signal-ui-heading-lockup__body">
                      <Typography.Title level={2} className="signal-ui-text-display" style={{ margin: 0 }}>
                        Runtime theme switching
                      </Typography.Title>
                      <Typography.Paragraph style={{ margin: "8px 0 0" }}>
                        Buttons, inputs, cards, and custom package components all inherit from the
                        same generated Ant Design theme.
                      </Typography.Paragraph>
                    </div>
                  </div>

                  <Space wrap size={[12, 12]}>
                    <Button type="primary">Transmit</Button>
                    <Button>Queue</Button>
                    <Button danger>Abort</Button>
                    <Button type="text">Ghost Ping</Button>
                  </Space>

                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Input placeholder="Operator handle" defaultValue="orbit-echo" />
                    <Input placeholder="Mission seed" status="warning" defaultValue="LH-1972" />
                    <Input placeholder="Critical alert" status="error" defaultValue="Hull breach" />
                  </Space>

                  <Panel
                    title="Preview Panel"
                    cutCornerPreset="tactical"
                    cutCornerColor={themeState.accent}
                    className="signal-ui-panel-tab"
                  >
                    <Typography.Paragraph style={{ margin: 0 }}>
                      The panel, its header treatment, and the lime signal states all follow the
                      generated theme preferences in real time.
                    </Typography.Paragraph>
                  </Panel>
                </Space>
              </Card>
            </div>

            <div style={summaryColumnStyle}>
              <Card title="Current User Preferences" extra="Serializable">
                <pre style={tokenDumpStyle}>{JSON.stringify(themePreferences, null, 2)}</pre>
              </Card>
            </div>
          </Flex>
        </Flex>
      </AntdThemeProvider>
    </div>
  );
}

type ThemeColorControlProps = {
  label: string;
  onChange: (value: HexColor) => void;
  value: HexColor;
};

function ThemeColorControl({ label, onChange, value }: ThemeColorControlProps) {
  return (
    <Space direction="vertical" size={6}>
      <Typography.Text style={controlLabelStyle}>{label}</Typography.Text>
      <ColorPicker value={value} showText onChangeComplete={(color) => onChange(color.toHexString() as HexColor)} />
    </Space>
  );
}

const storyShellStyle = {
  padding: "32px 24px 48px",
};

const controlLabelStyle = {
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
};

const previewColumnStyle = {
  flex: "1 1 720px",
};

const summaryColumnStyle = {
  flex: "0 0 320px",
};

const tokenDumpStyle = {
  margin: 0,
  padding: 16,
  borderRadius: 8,
  overflow: "auto",
  background: "rgba(255, 255, 255, 0.04)",
};

export const Playground: Story = {};
