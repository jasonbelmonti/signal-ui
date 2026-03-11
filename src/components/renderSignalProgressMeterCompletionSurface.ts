import { drawPixel, rgba } from "./signalButton/color.js";
import { hash } from "./signalButton/noise.js";
import { blendChannels, clamp, toneAccentChannels, type RgbChannels } from "./signalButton/utils.js";

type SignalProgressMeterCompletionSurfaceTone = "primary" | "violet";

type RenderSignalProgressMeterCompletionSurfaceOptions = {
  cols: number;
  ctx: CanvasRenderingContext2D;
  progress: number;
  rows: number;
  tone: SignalProgressMeterCompletionSurfaceTone;
};

export function renderSignalProgressMeterCompletionSurface({
  cols,
  ctx,
  progress,
  rows,
  tone,
}: RenderSignalProgressMeterCompletionSurfaceOptions) {
  const accent = toneAccentChannels[tone];
  const highlight = blendChannels(accent, [255, 255, 255], 0.42);
  const clampedProgress = clamp(progress, 0, 1);
  const wakeProgress = easeOutCubic(clamp(clampedProgress / 0.72, 0, 1));
  const settleProgress = easeOutCubic(clamp((clampedProgress - 0.34) / 0.66, 0, 1));
  const wakeRadius = wakeProgress * 1.52;
  const baseFillAlpha = 0.06 + settleProgress * 0.28;

  ctx.clearRect(0, 0, cols, rows);
  ctx.fillStyle = rgba(accent, 0.94, 0.03 + settleProgress * 0.08, baseFillAlpha);
  ctx.fillRect(0, 0, cols, rows);

  for (let y = 0; y < rows; y += 1) {
    const rowEnergy = getRowEnergy(y, rows);

    for (let x = 0; x < cols; x += 1) {
      const radial = getRadialDistance(x, y, cols, rows);
      const wakeSeed = hash((x + 1) * 4.6, (y + 1) * 7.2, 17);
      const grain = hash((x + 3) * 2.2, (y + 5) * 3.8, 61);
      const wakeThreshold = radial + wakeSeed * 0.16 - 0.08;
      const wakeMask = clamp((wakeRadius - wakeThreshold) / 0.22, 0, 1);
      const edgeGlow = clamp(1 - Math.abs(wakeRadius - radial) / 0.18, 0, 1) * (1 - settleProgress);
      const pixelEnergy = Math.max(wakeMask, settleProgress);

      if (pixelEnergy <= 0.02) {
        continue;
      }

      const highlightMix = clamp(edgeGlow * 0.68 + wakeMask * 0.14 * (1 - settleProgress), 0, 0.74);
      const pixelAccent = blendChannels(accent, highlight, highlightMix);
      const alpha =
        0.12 +
        rowEnergy * 0.08 +
        wakeMask * 0.42 +
        settleProgress * 0.32 +
        grain * 0.06;
      const lift =
        0.03 +
        rowEnergy * 0.04 +
        wakeMask * 0.06 +
        edgeGlow * 0.22 +
        settleProgress * 0.04;
      const saturation = 0.92 + wakeMask * 0.06 + edgeGlow * 0.12 + grain * 0.04;

      drawPixel(ctx, x, y, pixelAccent, saturation, lift, clamp(alpha, 0.16, 0.92));
    }
  }

  drawCompletionBloom(ctx, cols, rows, accent, highlight, wakeRadius, settleProgress);
}

function drawCompletionBloom(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  accent: RgbChannels,
  highlight: RgbChannels,
  wakeRadius: number,
  settleProgress: number,
) {
  const centerX = Math.floor(cols / 2);
  const bloomRadius = Math.max(2, Math.round((wakeRadius / 1.52) * cols * 0.24));
  const bloomEnergy = (1 - settleProgress) * 0.18;

  if (bloomEnergy <= 0.01) {
    return;
  }

  for (let offset = -bloomRadius; offset <= bloomRadius; offset += 1) {
    const column = centerX + offset;
    const proximity = 1 - Math.abs(offset) / (bloomRadius + 1);

    if (column < 0 || column >= cols || proximity <= 0) {
      continue;
    }

    ctx.fillStyle = rgba(
      blendChannels(accent, highlight, proximity * 0.56),
      1,
      0.06 + proximity * 0.1,
      bloomEnergy * proximity,
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

function easeOutCubic(value: number) {
  return 1 - (1 - clamp(value, 0, 1)) ** 3;
}

function getRadialDistance(column: number, row: number, columnCount: number, rowCount: number) {
  const centerX = (columnCount - 1) / 2;
  const centerY = (rowCount - 1) / 2;
  const halfWidth = Math.max(centerX, 1);
  const halfHeight = Math.max(centerY, 1);
  const dx = (column - centerX) / halfWidth;
  const dy = (row - centerY) / halfHeight;

  return Math.sqrt(dx * dx + dy * dy);
}
