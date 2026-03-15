import { drawPixel } from "../signalButton/color.js";
import { hash } from "../signalButton/noise.js";
import { clamp, type RgbChannels } from "../signalButton/utils.js";
import type { FullScreenWipePhase } from "./useFullScreenWipeState.js";

type RenderProceduralPixelWipeBufferOptions = {
  accent: RgbChannels;
  cols: number;
  cover: RgbChannels;
  ctx: CanvasRenderingContext2D;
  phase: FullScreenWipePhase | "closed";
  progress: number;
  rows: number;
  timeMs: number;
};

export function renderProceduralPixelWipeBuffer({
  accent,
  cols,
  cover,
  ctx,
  phase,
  progress,
  rows,
  timeMs,
}: RenderProceduralPixelWipeBufferOptions) {
  const easedProgress =
    phase === "opening"
      ? 1 - easeOutQuint(progress)
      : phase === "closing"
        ? easeInOutCubic(progress)
        : 1;
  const timePhase = timeMs * 0.001;
  const diagonalSpan = Math.max(cols + rows - 2, 1);
  const frontierWidth = 0.14;
  const travelOvershoot = 0.26;
  const frontierPosition = lerp(-travelOvershoot, 1 + travelOvershoot, easedProgress);

  ctx.clearRect(0, 0, cols, rows);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const diagonal = (x + y) / diagonalSpan;
      const stableNoise = hash(x * 9 + 11, y * 13 + 7, 23);
      const pulseWave =
        0.5 +
        0.5 *
          Math.sin(
            timePhase * 4.8 + x * 0.58 - y * 0.3 + stableNoise * Math.PI * 2,
          );
      const driftWave =
        0.5 + 0.5 * Math.sin(timePhase * 2.7 - diagonal * 10.4 + stableNoise * Math.PI * 1.5);
      const diagonalNoise =
        (stableNoise - 0.5) * 0.22 + (pulseWave - 0.5) * 0.08 + (driftWave - 0.5) * 0.06;
      const threshold = diagonal + diagonalNoise;
      const coverage = clamp(
        (frontierPosition - threshold + frontierWidth) / (frontierWidth * 2),
        0,
        1,
      );

      if (coverage <= 0.02) {
        continue;
      }

      const frontier = clamp(1 - Math.abs(frontierPosition - threshold) / frontierWidth, 0, 1);
      const alpha = 0.12 + coverage * 0.86;
      const coverLift = 0.02 + frontier * 0.08 + pulseWave * 0.04;
      const coverSaturation = 0.08 + driftWave * 0.16;

      ctx.fillStyle = rgba(
        cover,
        coverSaturation,
        coverLift,
        clamp(alpha + (phase === "closed" ? 0.04 : 0), 0, 1),
      );
      ctx.fillRect(x, y, 1, 1);

      const accentThreshold = 0.46 - frontier * 0.12;
      const accentNoise = hash(x * 7 + 17, y * 5 + 29, 41);

      if (frontier > 0.12) {
        drawPixel(
          ctx,
          x,
          y,
          accent,
          0.88 + frontier * 0.12,
          0.08 + frontier * 0.18 + pulseWave * 0.08,
          0.06 + frontier * 0.34 + pulseWave * 0.06,
        );
      } else if (coverage > 0.82 && accentNoise > accentThreshold) {
        drawPixel(
          ctx,
          x,
          y,
          accent,
          0.62 + pulseWave * 0.18,
          0.03 + driftWave * 0.08,
          0.03 + accentNoise * 0.08,
        );
      }
    }
  }
}

function rgba(
  channels: RgbChannels,
  saturation: number,
  lift: number,
  alpha: number,
) {
  const red = liftChannel(channels[0], saturation, lift);
  const green = liftChannel(channels[1], saturation, lift);
  const blue = liftChannel(channels[2], saturation, lift);

  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1)})`;
}

function liftChannel(channel: number, saturation: number, lift: number) {
  const scaled = channel * saturation;
  return Math.round(clamp(scaled + (255 - scaled) * lift, 0, 255));
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutQuint(value: number) {
  return 1 - Math.pow(1 - value, 5);
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}
