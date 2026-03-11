import { Canvas } from "@react-three/fiber";

import { joinClassNames } from "../utils/joinClassNames.js";
import { SignalBackdropContourScene } from "./signalBackdrop/SignalBackdropContourScene.js";
import type { SignalBackdropProps, SignalBackdropStyle } from "./signalBackdrop/types.js";
import { useBackdropRenderState } from "./signalBackdrop/useBackdropRenderState.js";

export type {
  SignalBackdropDensity,
  SignalBackdropFocusPoint,
  SignalBackdropProps,
  SignalBackdropStyle,
  SignalBackdropTelemetry,
  SignalBackdropTone,
  SignalBackdropVariant,
} from "./signalBackdrop/types.js";

export function SignalBackdrop({
  animated = true,
  className,
  density = "medium",
  focusPoint,
  height,
  label,
  seed = "signal-backdrop",
  style,
  telemetry,
  tone = "primary",
  usage = "decorative",
  variant = "contour",
  ...props
}: SignalBackdropProps) {
  const accessibilityProps =
    usage === "graphic"
      ? {
          "aria-label": label,
          role: "img" as const,
        }
      : {
          "aria-hidden": true,
        };
  const rootStyle: SignalBackdropStyle = {
    ...(height !== undefined
      ? {
          "--signal-ui-signal-backdrop-height":
            typeof height === "number" ? `${height}px` : height,
        }
      : {}),
    ...style,
  };
  const { canvasDpr, renderAnimated, viewportRef } = useBackdropRenderState(animated);

  return (
    <div
      className={joinClassNames(
        "signal-ui-signal-backdrop",
        `signal-ui-signal-backdrop--${variant}`,
        `signal-ui-signal-backdrop--${tone}`,
        `signal-ui-signal-backdrop--${density}`,
        className,
      )}
      style={rootStyle}
      {...accessibilityProps}
      {...props}
    >
      <div
        ref={viewportRef}
        aria-hidden="true"
        className="signal-ui-signal-backdrop__viewport"
      >
        <Canvas
          camera={{ fov: 34, position: [0, 5.8, 9.4] }}
          dpr={canvasDpr}
          frameloop={renderAnimated ? "always" : "demand"}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
          style={{ width: "100%", height: "100%" }}
        >
          <SignalBackdropContourScene
            animated={renderAnimated}
            density={density}
            focusPoint={focusPoint}
            seed={seed}
            telemetry={telemetry}
            tone={tone}
          />
        </Canvas>
      </div>
    </div>
  );
}
