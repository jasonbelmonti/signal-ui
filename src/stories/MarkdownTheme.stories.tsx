import { Col, Flex, Row, Space, Typography } from "antd";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import rehypeHighlight from "rehype-highlight";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { MarkdownTheme } from "../components/MarkdownTheme.js";
import { Panel } from "../components/Panel.js";
import { marathonDosPalette } from "../theme/marathonDosTheme.js";

interface MarkdownThemeStoryProps {
  markdown: string;
}

const wrapperCode = `import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { MarkdownTheme, Panel } from "agent-ui";

<Panel title="Ops Runbook">
  <MarkdownTheme>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      {markdown}
    </ReactMarkdown>
  </MarkdownTheme>
</Panel>`;

const trustedHtmlCode = `import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const trustedHtmlSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      ["className", "marathon-markdown-callout"],
      ["data-callout"],
    ],
  },
};

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[
    rehypeRaw,
    [rehypeSanitize, trustedHtmlSchema],
    rehypeHighlight,
  ]}
>
  {trustedMarkdown}
</ReactMarkdown>`;

const defaultMarkdown = String.raw`
**Mission brief.** The markdown skin keeps plain semantic HTML, but gives docs, changelogs, and runbooks the same voice as the rest of the Marathon system.

# Field Guide: Markdown Surfaces

Use this wrapper around \`react-markdown\`, \`marked\`, or MDX when you want long-form content to feel native instead of generic. It styles structure, not your renderer pipeline.

> Documentation should read like it belongs on the same console as the controls, not like someone pasted GitHub into a viewport and hoped for the best.

## What ships with the theme

- Headings get the display stack, tighter tracking, and structural dividers.
- Lists, links, emphasis, and inline code match the lime-on-void interaction language.
- Preformatted blocks become framed panels with better contrast and horizontal scrolling.
- Tables get uppercase headers and alternating rows so dense reference data still scans cleanly.

## Deployment sample

\`\`\`bash
bun install
bun run build-storybook
rsync -av ./storybook-static/ /srv/agent-ui/docs/
transmission: 418 files synced
status: green-line stable
\`\`\`

## TypeScript sample

\`\`\`typescript
const foo = "test";

type SignalState = "idle" | "live";

export function collectSignal(channel: string, state: SignalState) {
  return \`\${channel}:\${state}:\${foo}\`.toUpperCase();
}
\`\`\`

## Release checklist

1. Wrap rendered markdown in \`<MarkdownTheme />\`.
2. Leave the content pipeline alone; this theme styles HTML output rather than inventing a custom AST.
3. Add helper markup like \`data-callout="warning"\` only when you need richer docs.

## Routing matrix

| Surface | Primary content | Recommended wrapper |
| --- | --- | --- |
| Changelog | Ordered lists, code fences, release notes | \`<Panel><MarkdownTheme /></Panel>\` |
| Runbook | Callouts, shell snippets, tables | Architectural panel plus optional callout metadata |
| Inline docs | Headings, links, short prose | Markdown wrapper only |

## Inline language

Links like [Storybook docs](https://storybook.js.org/docs) stay clearly interactive, shortcuts such as \`Cmd\` + \`K\` are framed, and critical notes stay readable without turning the document into a neon puddle.

> Optional callouts and disclosure blocks are still supported as trusted HTML helpers, but they are demonstrated separately from this live markdown control so pasted Storybook args stay inert.
`;

function MarkdownThemeStory({ markdown }: MarkdownThemeStoryProps) {
  return (
    <Flex vertical gap={24} style={{ maxWidth: 1320, margin: "0 auto" }}>
      <Panel
        cutCornerPreset="tactical"
        style={{
          borderColor: "rgba(192, 254, 4, 0.34)",
          background:
            "linear-gradient(135deg, rgba(192, 254, 4, 0.11), transparent 34%), #0a0a0a",
        }}
      >
        <Space direction="vertical" size={10}>
          <div style={accentLabelRowStyle}>
            <span className="marathon-accent-field">Markdown</span>
            <Typography.Text style={{ ...eyebrowStyle, marginBottom: 0 }}>
              Paste Into Controls
            </Typography.Text>
          </div>
          <div className="marathon-heading-lockup">
            <span className="marathon-accent-bar" aria-hidden="true" />
            <div className="marathon-heading-lockup__body">
              <Typography.Title level={1} className="marathon-text-display" style={{ margin: 0 }}>
                Marathon Markdown Theme
              </Typography.Title>
              <Typography.Paragraph style={heroCopyStyle}>
                This story renders a raw markdown string through <code>react-markdown</code>, so
                you can paste your own document into the <code>markdown</code> control and inspect
                the result without hand-editing JSX.
              </Typography.Paragraph>
            </div>
          </div>
        </Space>
      </Panel>

      <Row gutter={[24, 24]} align="top">
        <Col xs={24} xl={16}>
          <Panel
            title="Rendered Document"
            extra="Story Args + GFM + HLJS"
            cutCornerPreset="architectural"
          >
            <MarkdownTheme>
              <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </MarkdownTheme>
          </Panel>
        </Col>

        <Col xs={24} xl={8}>
          <Flex vertical gap={24}>
            <Panel
              title="Try Your Own Markdown"
              cutCorner="accent"
              cutCornerPlacement="top-left"
              style={sidePanelStyle}
            >
              <MarkdownTheme>
                <h3>Story workflow</h3>
                <ol>
                  <li>Open the Controls panel in Storybook.</li>
                  <li>Paste your markdown into the <code>markdown</code> arg.</li>
                  <li>Watch the main document panel rerender instantly.</li>
                </ol>

                <h3>Supported syntax</h3>
                <ul>
                  <li>Standard markdown headings, lists, links, emphasis, and code fences</li>
                  <li>GFM tables, task lists, and strikethrough via <code>remark-gfm</code></li>
                  <li>Syntax-highlighted fenced blocks via <code>rehype-highlight</code></li>
                  <li>Trusted HTML helpers are shown below, but disabled in the live control</li>
                </ul>

                <h3>Consumer rule</h3>
                <p>
                  The package exports only the wrapper and CSS skin. Consumers still choose their
                  own markdown renderer, highlight plugin, and trust policy.
                </p>
                <p>
                  If you enable raw HTML for trusted markdown, pair it with sanitization instead
                  of feeding Storybook or user-provided args straight into <code>rehype-raw</code>.
                </p>
              </MarkdownTheme>
            </Panel>

            <Panel
              title="Consumer Usage"
              extra="Highlighted Default"
              className="marathon-panel-tab"
              style={usagePanelStyle}
            >
              <MarkdownTheme>
                <pre>
                  <code>{wrapperCode}</code>
                </pre>
              </MarkdownTheme>
            </Panel>

            <Panel
              title="Trusted HTML Add-Ons"
              extra="Optional"
              className="marathon-panel-tab marathon-panel-tab--secondary"
              style={trustedHtmlPanelStyle}
            >
              <MarkdownTheme>
                <div className="marathon-markdown-callout" data-callout="warning">
                  <p>
                    <strong>Trusted HTML only.</strong>
                    {" "}
                    This helper surface is rendered from fixed JSX, not the user-editable markdown
                    control.
                  </p>
                </div>
                <details open>
                  <summary>Sanitization note</summary>
                  <p>
                    Use raw HTML only for trusted or sanitized content. The live story keeps it off
                    so pasted controls stay inert.
                  </p>
                </details>
                <p>
                  If a CMS or docs pipeline emits helper HTML, pass it through a sanitization
                  schema that explicitly allows the classes and attributes you want to keep.
                </p>
                <pre>
                  <code>{trustedHtmlCode}</code>
                </pre>
              </MarkdownTheme>
            </Panel>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
}

const meta = {
  title: "Patterns/Markdown Theme",
  component: MarkdownThemeStory,
  args: {
    markdown: defaultMarkdown,
  },
  argTypes: {
    markdown: {
      control: "text",
      description: "Raw markdown rendered through react-markdown with GFM and syntax highlighting.",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MarkdownThemeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultMarkdownTheme: Story = {};

const accentLabelRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const eyebrowStyle: CSSProperties = {
  display: "block",
  color: marathonDosPalette.primary,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const heroCopyStyle: CSSProperties = {
  margin: "10px 0 0",
  maxWidth: 760,
  color: "rgba(245, 245, 240, 0.86)",
};

const sidePanelStyle: CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 55%), rgba(11, 11, 11, 0.96)",
};

const usagePanelStyle: CSSProperties = {
  borderColor: "rgba(192, 254, 4, 0.28)",
  background:
    "linear-gradient(135deg, rgba(192, 254, 4, 0.12), transparent 34%), rgba(11, 11, 11, 0.96)",
};

const trustedHtmlPanelStyle: CSSProperties = {
  borderColor: "rgba(159, 77, 255, 0.34)",
  background:
    "linear-gradient(135deg, rgba(159, 77, 255, 0.16), transparent 34%), rgba(11, 11, 11, 0.96)",
};
