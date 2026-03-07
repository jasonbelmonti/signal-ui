import { Button, Card, Col, Flex, Input, Row, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Panel } from "../components/Panel";
import { marathonDosPalette } from "../theme/marathonDosTheme";

const meta = {
  title: "Foundations/Signal Deck",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  render: () => (
    <Flex vertical gap={24} style={{ maxWidth: 1280, margin: "0 auto" }}>
      <Card
        style={{
          borderColor: marathonDosPalette.primary,
          background:
            "linear-gradient(135deg, rgba(192, 254, 4, 0.1), transparent 35%), #0b0b0b",
        }}
      >
        <Space direction="vertical" size={10}>
          <Typography.Text style={eyebrowStyle}>Channel 06 / Foundation Scan</Typography.Text>
          <Typography.Title level={1} className="marathon-text-display" style={{ margin: 0 }}>
            Marathon DOS Theme Deck
          </Typography.Title>
          <Typography.Paragraph style={{ margin: 0, maxWidth: 760 }}>
            A modernized terminal skin for Ant Design: phosphor-lime signals, hard-edge panels,
            mono-forward UI, and a cleaner sci-fi silhouette than straight DOS nostalgia.
          </Typography.Paragraph>
        </Space>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={11}>
          <Card title="Palette Signals" extra="Locked Tokens">
            <Space direction="vertical" size={14} style={{ width: "100%" }}>
              {paletteEntries.map(([label, value]) => (
                <div key={label} style={swatchRowStyle}>
                  <div style={{ ...swatchStyle, background: value }} />
                  <div>
                    <Typography.Text style={eyebrowStyle}>{label}</Typography.Text>
                    <Typography.Paragraph style={{ margin: 0 }}>{value}</Typography.Paragraph>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={13}>
          <Card title="Typography and Controls" extra="Live Components">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Typography.Text style={eyebrowStyle}>Display</Typography.Text>
                <Typography.Title
                  level={2}
                  className="marathon-text-display-secondary"
                  style={{ marginBottom: 8 }}
                >
                  Deep Signal Operator
                </Typography.Title>
                <Typography.Paragraph style={{ margin: 0 }}>
                  Oxanium stays on the primary headline tier, while Doto slots in as a secondary
                  display accent where a little extra weirdness actually helps.
                </Typography.Paragraph>
              </div>

              <div>
                <Typography.Text style={eyebrowStyle}>Headline Pairing</Typography.Text>
                <Space direction="vertical" size={4}>
                  <Typography.Text className="marathon-text-display" style={fontSampleStyle}>
                    Oxanium stays on the top-line headline
                  </Typography.Text>
                  <Typography.Text
                    className="marathon-text-display-secondary"
                    style={fontSampleStyle}
                  >
                    Doto handles the secondary headline
                  </Typography.Text>
                </Space>
              </div>

              <Space wrap size={[12, 12]}>
                <Button type="primary">Transmit</Button>
                <Button>Queue</Button>
                <Button danger>Abort</Button>
                <Button type="text">Ghost Ping</Button>
              </Space>

              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Input placeholder="Operator handle" />
                <Input placeholder="Mission seed" status="warning" defaultValue="LH-1972" />
                <Input placeholder="Critical alert" status="error" defaultValue="Hull breach" />
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={14}>
          <Card title="Surface Hierarchy" extra="Panels">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Panel
                  size="small"
                  title="Primary Surface"
                  cutCornerPreset="tactical"
                  style={innerCardStyle}
                >
                  <Typography.Paragraph style={{ margin: 0 }}>
                    Primary interaction surface using the tactical preset for a phosphor corner tag
                    and a little extra diagonal velocity.
                  </Typography.Paragraph>
                </Panel>
              </Col>
              <Col xs={24} md={12}>
                <Panel
                  size="small"
                  title="Elevated Surface"
                  cutCornerPreset="architectural"
                  cutCornerColor={marathonDosPalette.accentViolet}
                  style={{
                    ...innerCardStyle,
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 55%), #121212",
                  }}
                >
                  <Typography.Paragraph style={{ margin: 0 }}>
                    Elevated panels stay dark, but the architectural preset gives them a cleaner 45
                    degree silhouette.
                  </Typography.Paragraph>
                </Panel>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card title="Focus and Selection" extra="States">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Typography.Paragraph style={{ margin: 0 }}>
                Tab into the inputs and buttons to inspect the lime outline treatment. Select text
                in this paragraph to confirm the inverted phosphor selection state.
              </Typography.Paragraph>
              <Input placeholder="Focus probe" autoFocus />
              <Button block type="primary">
                Confirm focus ring
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title="Secondary Accent Trial"
        extra="Violet Against Lime"
        style={{
          borderColor: "rgba(159, 77, 255, 0.42)",
          background:
            "linear-gradient(135deg, rgba(159, 77, 255, 0.18), transparent 34%), linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 52%), #0a0a0a",
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Space direction="vertical" size={10}>
              <Typography.Text style={{ ...eyebrowStyle, color: marathonDosPalette.accentViolet }}>
                Display Accent
              </Typography.Text>
              <Typography.Title
                level={2}
                className="marathon-text-display-secondary"
                style={{ margin: 0, color: marathonDosPalette.accentViolet }}
              >
                Violet can cut through the phosphor stack
              </Typography.Title>
              <Typography.Paragraph style={{ margin: 0, maxWidth: 720 }}>
                The experiment works best when violet behaves like a transmission/event accent
                rather than a new default interaction color. Lime still owns focus, CTA energy, and
                the general UI pulse.
              </Typography.Paragraph>
            </Space>
          </Col>
          <Col xs={24} lg={10}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <div style={contrastChipRowStyle}>
                <div style={{ ...contrastChipStyle, background: marathonDosPalette.primary }}>
                  Lime Primary
                </div>
                <div
                  style={{
                    ...contrastChipStyle,
                    background: marathonDosPalette.accentViolet,
                    color: marathonDosPalette.text,
                  }}
                >
                  Violet Accent
                </div>
              </div>
              <Typography.Paragraph style={{ margin: 0, color: "rgba(245, 245, 240, 0.82)" }}>
                This pairing is visually loud enough to be useful, but probably too competitive for
                shared button and focus semantics.
              </Typography.Paragraph>
            </Space>
          </Col>
        </Row>
      </Card>
    </Flex>
  ),
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ThemeFoundations: Story = {};

const paletteEntries = Object.entries({
  Primary: marathonDosPalette.primary,
  "Accent Violet": marathonDosPalette.accentViolet,
  Error: marathonDosPalette.error,
  Warning: marathonDosPalette.warning,
  Text: marathonDosPalette.text,
  Muted: marathonDosPalette.muted,
  Surface: marathonDosPalette.surface,
  Panel: marathonDosPalette.panel,
});

const eyebrowStyle = {
  display: "block",
  marginBottom: 6,
  color: marathonDosPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
};

const swatchRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const swatchStyle = {
  width: 48,
  height: 48,
  border: `1px solid ${marathonDosPalette.grid}`,
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
};

const innerCardStyle = {
  height: "100%",
  background: "#0b0b0b",
};

const fontSampleStyle = {
  display: "block",
  fontSize: 18,
  lineHeight: 1.2,
};

const contrastChipRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 10,
};

const contrastChipStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 140,
  minHeight: 42,
  padding: "0 14px",
  border: `1px solid ${marathonDosPalette.grid}`,
  color: marathonDosPalette.black,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
};
