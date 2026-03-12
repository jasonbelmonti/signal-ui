import { drawPixel } from "../signalButton/color.js";
import { hash } from "../signalButton/noise.js";
import { clamp, type RgbChannels } from "../signalButton/utils.js";

export type PanelRevealRenderPhase = "intro" | "settle" | "decay" | "outro";

type RenderPanelRevealBufferOptions = {
  accent: RgbChannels;
  cols: number;
  ctx: CanvasRenderingContext2D;
  phase: PanelRevealRenderPhase;
  progress: number;
  rows: number;
  timeMs: number;
};

export function renderPanelRevealBuffer({
  accent,
  cols,
  ctx,
  phase,
  progress,
  rows,
  timeMs,
}: RenderPanelRevealBufferOptions) {
  const introFrontProgress = easeOutQuad(progress) * 1.14;
  const centerX = (cols - 1) / 2;
  const centerY = (rows - 1) / 2;
  const maxRadial = Math.max(1, Math.hypot(centerX * 1.08, centerY * 1.22));
  const easedProgress =
    phase === "outro"
      ? easeInCubic(progress)
      : phase === "settle"
        ? easeOutQuad(progress)
        : phase === "decay"
          ? easeInOutQuad(progress)
          : easeOutCubic(progress);
  const timePhase = timeMs * 0.001;
  const isTailPhase = phase === "settle" || phase === "decay";
  const tailFade = phase === "decay" ? Math.pow(1 - easedProgress, 1.4) : 1;

  ctx.clearRect(0, 0, cols, rows);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const dx = x - centerX;
      const dy = y - centerY;
      const radial = Math.hypot(dx * 1.08, dy * 1.22) / maxRadial;
      const centerWeight = 1 - radial;
      const axisWeight = 1 - Math.min(Math.abs(dx), Math.abs(dy)) / Math.max(centerX, centerY, 1);
      const stableNoise = hash(x * 7 + 13, y * 11 + 17, 37);
      const shimmerWave =
        0.5 +
        0.5 *
          Math.sin(
            timePhase * 4.1 + x * 0.58 + y * 0.36 + stableNoise * Math.PI * 2,
          );
      const driftWave =
        0.5 +
        0.5 * Math.sin(timePhase * 2.3 - radial * 10.5 + stableNoise * Math.PI * 1.6);
      const diagonalBias = Math.sin((dx - dy) * 0.62 + timePhase * 1.4) * 0.024;
      const irregularity =
        (stableNoise - 0.5) * 0.12 + (driftWave - 0.5) * 0.05 + diagonalBias;

      if (isTailPhase) {
        const residual =
          phase === "decay"
            ? clamp(0.24 + centerWeight * 0.12 + axisWeight * 0.08 + (driftWave - 0.5) * 0.12, 0, 1)
            : clamp(0.18 + (1 - easedProgress) * 0.8 + centerWeight * 0.12 + axisWeight * 0.08, 0, 1);
        const shimmer = clamp(0.24 + shimmerWave * 0.34 + driftWave * 0.16, 0, 1);
        const maskBase =
          phase === "decay"
            ? residual * 0.56 + shimmer * 0.24 - stableNoise * 0.12
            : residual * 0.76 + shimmer * 0.24 - stableNoise * 0.12;
        const mask = clamp(maskBase, 0, 1) * tailFade;

        if (mask <= 0.02) {
          continue;
        }

        const alpha =
          phase === "decay"
            ? (0.012 + mask * 0.08 + shimmer * 0.03) * (0.4 + tailFade * 0.6)
            : 0.02 + mask * 0.12 + shimmer * 0.05;
        const saturation =
          phase === "decay"
            ? 0.72 + centerWeight * 0.1 + shimmer * 0.06
            : 0.74 + centerWeight * 0.12 + shimmer * 0.08;
        const lift =
          phase === "decay"
            ? (0.016 + centerWeight * 0.05 + shimmer * 0.05) * (0.45 + tailFade * 0.55)
            : 0.02 + centerWeight * 0.06 + shimmer * 0.08;

        drawPixel(ctx, x, y, accent, saturation, lift, alpha);

        if (shimmer > (phase === "decay" ? 0.62 : 0.56)) {
          drawPixel(
            ctx,
            x,
            y,
            accent,
            phase === "decay" ? 0.84 + shimmer * 0.08 : 0.9 + shimmer * 0.08,
            phase === "decay" ? 0.05 + shimmer * 0.05 : 0.08 + shimmer * 0.08,
            alpha * (phase === "decay" ? 0.1 + shimmer * 0.14 : 0.18 + shimmer * 0.22),
          );
        }

        continue;
      }

      const distortedRadial = clamp(
        radial + irregularity * (phase === "intro" ? 0.52 : 0.38),
        0,
        phase === "intro" ? 1.16 : 1.1,
      );
      const frontAnchor = phase === "intro" ? introFrontProgress : 1 - easedProgress;
      const introFillProgress = Math.min(introFrontProgress, 1.02);
      const frontier = clamp(
        1 - Math.abs(frontAnchor - distortedRadial) / (0.13 + shimmerWave * 0.025),
        0,
        1,
      );
      const localProgress =
        phase === "intro"
          ? clamp((introFillProgress - distortedRadial * 0.82) / (0.24 + centerWeight * 0.12), 0, 1)
          : 1 - clamp((easedProgress - (1 - distortedRadial) * 0.78) / (0.18 + radial * 0.16), 0, 1);

      if (localProgress <= 0.02) {
        continue;
      }

      const emergenceThreshold =
        0.1 + stableNoise * 0.1 - frontier * 0.06 + Math.max(irregularity, 0) * 0.04;

      if (localProgress < emergenceThreshold) {
        continue;
      }

      const alpha =
        0.05 +
        localProgress * (0.22 + centerWeight * 0.18) +
        frontier * 0.16 +
        shimmerWave * 0.04 +
        (axisWeight > 0.72 ? 0.02 : 0);
      const saturation = 0.72 + centerWeight * 0.16 + frontier * 0.12 + shimmerWave * 0.04;
      const lift =
        0.02 +
        centerWeight * 0.1 +
        frontier * 0.12 +
        shimmerWave * 0.04 +
        (radial < 0.16 ? 0.06 : 0);

      drawPixel(ctx, x, y, accent, saturation, lift, alpha);

      if (frontier > 0.34 || radial < 0.1) {
        drawPixel(
          ctx,
          x,
          y,
          accent,
          0.9 + frontier * 0.08,
          0.08 + frontier * 0.12 + (radial < 0.12 ? 0.04 : 0),
          alpha * (0.18 + frontier * 0.2),
        );
      }
    }
  }

  drawCorePulse(ctx, accent, cols, rows, phase, easedProgress);
}

function drawCorePulse(
  ctx: CanvasRenderingContext2D,
  accent: RgbChannels,
  cols: number,
  rows: number,
  phase: PanelRevealRenderPhase,
  progress: number,
) {
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);
  const pulseStrength =
    phase === "intro"
      ? Math.pow(Math.sin(progress * Math.PI), 0.88) || 0
      : phase === "settle"
        ? (1 - progress) * 0.18
      : phase === "decay"
        ? Math.pow(1 - progress, 1.35) * 0.08
      : Math.pow(Math.sin((1 - progress) * Math.PI), 0.74) || 0;

  if (pulseStrength <= 0.04) {
    return;
  }

  const radius = phase === "intro" ? 1 : phase === "settle" || phase === "decay" ? 1 : 0;

  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      if (x < 0 || y < 0 || x >= cols || y >= rows) {
        continue;
      }

      drawPixel(
        ctx,
        x,
        y,
        accent,
        1.02,
        0.2 + pulseStrength * 0.22,
        0.16 + pulseStrength * 0.46,
      );
    }
  }
}

function easeInCubic(value: number) {
  return value * value * value;
}

function easeOutQuad(value: number) {
  return 1 - (1 - value) * (1 - value);
}

function easeInOutQuad(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}
