import type { ReactNode } from "react";

export interface SignalChatLayoutProps {
  composer: ReactNode;
  header: ReactNode;
  sidebar: ReactNode;
  transcript: ReactNode;
}

export function SignalChatLayout({
  composer,
  header,
  sidebar,
  transcript,
}: SignalChatLayoutProps) {
  return (
    <div className="signal-ui-chat__layout">
      {sidebar}
      <section className="signal-ui-chat__main">
        {header}
        <div className="signal-ui-chat__transcript">{transcript}</div>
        {composer}
      </section>
    </div>
  );
}
