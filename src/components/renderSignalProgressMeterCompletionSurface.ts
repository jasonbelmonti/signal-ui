import { drawPixel, rgba } from "./signalButton/color.js";
import { hash } from "./signalButton/noise.js";
import { blendChannels, clamp, toneAccentChannels, type RgbChannels } from "./signalButton/utils.js";

type SignalProgressMeterCompletionSurfaceTone = "primary" | "violet";

type RenderSignalProgressMeterCompletionSurfaceOptions = {
  cols: number;
  ctx: CanvasRenderingContext2D;
  rows: number;
  timeMs: number;
  tone: SignalProgressMeterCompletionSurfaceTone;
};

export function renderSignalProgressMeterCompletionSurface({
  cols,
  ctx,
  rows,
  timeMs,
  tone,
}: RenderSignalProgressMeterCompletionSurfaceOptions) {
  const accent = toneAccentChannels[tone];
  const highlight = blendChannels(accent, [255, 255, 255], 0.42);
  const frame = Math.floor(timeMs / 82);
  const shimmerFront = ((timeMs * 0.021) % (cols + 12)) - 6;

  ctx.clearRect(0, 0, cols, rows);

  for (let y = 0; y < rows; y += 1) {
    const rowEnergy = getRowEnergy(y, rows);

    for (let x = 0; x < cols; x += 1) {
      const stableNoise = hash((x + 1) * 1.7, (y + 1) * 3.1, 17);
      const flickerNoise = hash(x + frame * 0.9, y + 11, 63);
      const weaveNoise = hash((x + 5) * 2.4, (y + 3) * 4.7, frame + 19);
      const sweepGlow = clamp(1 - Math.abs(x - shimmerFront) / 7, 0, 1);
      const lattice = hash((x + 1) * 5.1, (y + 1) * 7.7, frame + 41);
      const threshold = clamp(0.66 - rowEnergy * 0.12 - sweepGlow * 0.24, 0.28, 0.82);

      if (stableNoise <= threshold && sweepGlow < 0.28 && lattice < 0.84) {
        continue;
      }

      const highlightMix = clamp(sweepGlow * 0.72 + (lattice > 0.9 ? 0.24 : 0), 0, 1);
      const pixelAccent = blendChannels(accent, highlight, highlightMix);
      const alpha =
        0.1 +
        rowEnergy * 0.08 +
        stableNoise * 0.16 +
        flickerNoise * 0.08 +
        sweepGlow * 0.22;
      const lift =
        0.02 +
        rowEnergy * 0.04 +
        sweepGlow * 0.18 +
        (weaveNoise > 0.82 ? 0.05 : 0);
      const saturation = 0.82 + stableNoise * 0.1 + weaveNoise * 0.12 + sweepGlow * 0.18;

      drawPixel(ctx, x, y, pixelAccent, saturation, lift, clamp(alpha, 0.08, 0.84));
    }
  }

  drawCompletionBloom(ctx, cols, rows, accent, highlight, shimmerFront);
}

function drawCompletionBloom(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  accent: RgbChannels,
  highlight: RgbChannels,
  shimmerFront: number,
) {
  const bloomCell = Math.floor(clamp(shimmerFront, -2, cols + 2));

  for (let offset = -3; offset <= 2; offset += 1) {
    const column = bloomCell + offset;
    const proximity = 1 - Math.abs(offset) / 4;

    if (column < 0 || column >= cols || proximity <= 0) {
      continue;
    }

    ctx.fillStyle = rgba(
      blendChannels(accent, highlight, proximity * 0.6),
      1,
      0.08 + proximity * 0.18,
      0.05 + proximity * 0.09,
    );
    ctx.fillRect(column, 0, 1, rows);
  }
}

function getRowEnergy(row: number, rowCount: number) {
  if (rowCount <= 1) {
    return 1;
  }

  const normalized = row / (rowCount - 1);
  return 1 - Math.abs(normalized * 2 - 1) * 0.44;
}
