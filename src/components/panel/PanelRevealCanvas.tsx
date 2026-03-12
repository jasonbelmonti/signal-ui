import { useRef } from "react";

import type { PanelRevealState } from "../Panel.js";
import { usePanelRevealCanvas } from "./usePanelRevealCanvas.js";
import type { PanelRevealPhase } from "./usePanelRevealState.js";

type PanelRevealCanvasProps = {
  revealPhase?: PanelRevealPhase;
  revealState: PanelRevealState;
};

export function PanelRevealCanvas({ revealPhase, revealState }: PanelRevealCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  usePanelRevealCanvas({
    canvasRef,
    revealPhase,
    revealState,
  });

  return (
    <canvas
      aria-hidden="true"
      className="signal-ui-panel-shell__canvas"
      data-signal-ui-panel-pixel-phase={revealPhase}
      data-signal-ui-panel-pixel-state={revealState}
      ref={canvasRef}
    />
  );
}
