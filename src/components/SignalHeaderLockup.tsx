import { Typography } from "antd";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { joinClassNames } from "../utils/joinClassNames.js";

export type SignalHeaderLockupTone = "primary" | "violet";
export type SignalHeaderLockupTitleLevel = 1 | 2 | 3 | 4 | 5;
export type SignalHeaderLockupTitleFont = "display" | "display-secondary";

export interface SignalHeaderLockupProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "title"> {
  accentLabel?: ReactNode;
  accentTone?: SignalHeaderLockupTone;
  aside?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  titleFont?: SignalHeaderLockupTitleFont;
  titleLevel?: SignalHeaderLockupTitleLevel;
}

export function SignalHeaderLockup({
  accentLabel,
  accentTone = "primary",
  aside,
  children,
  className,
  description,
  eyebrow,
  title,
  titleFont = "display",
  titleLevel = 2,
  ...props
}: SignalHeaderLockupProps) {
  return (
    <div className={joinClassNames("signal-ui-header-lockup", className)} {...props}>
      <div className="signal-ui-header-lockup__main">
        {accentLabel || eyebrow ? (
          <div className="signal-ui-header-lockup__topline">
            {accentLabel ? (
              <span
                className={joinClassNames(
                  "signal-ui-accent-field",
                  accentTone === "violet" && "signal-ui-accent-field--secondary",
                )}
              >
                {accentLabel}
              </span>
            ) : null}
            {eyebrow ? (
              <Typography.Text className="signal-ui-header-lockup__eyebrow">
                {eyebrow}
              </Typography.Text>
            ) : null}
          </div>
        ) : null}

        <div className="signal-ui-heading-lockup">
          <span
            aria-hidden="true"
            className={joinClassNames(
              "signal-ui-accent-bar",
              accentTone === "violet" && "signal-ui-accent-bar--secondary",
            )}
          />
          <div className="signal-ui-heading-lockup__body">
            <Typography.Title
              className={
                titleFont === "display-secondary"
                  ? "signal-ui-text-display-secondary"
                  : "signal-ui-text-display"
              }
              level={titleLevel}
              style={{ margin: 0 }}
            >
              {title}
            </Typography.Title>

            {description ? (
              <Typography.Paragraph className="signal-ui-header-lockup__description">
                {description}
              </Typography.Paragraph>
            ) : null}

            {children ? <div className="signal-ui-header-lockup__detail">{children}</div> : null}
          </div>
        </div>
      </div>

      {aside ? <div className="signal-ui-header-lockup__aside">{aside}</div> : null}
    </div>
  );
}
