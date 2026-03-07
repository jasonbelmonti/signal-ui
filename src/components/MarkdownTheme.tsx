import type { ComponentPropsWithoutRef } from "react";

export interface MarkdownThemeProps extends ComponentPropsWithoutRef<"article"> {}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function MarkdownTheme({ className, ...articleProps }: MarkdownThemeProps) {
  return (
    <article
      {...articleProps}
      className={joinClassNames("marathon-markdown", className)}
    />
  );
}
