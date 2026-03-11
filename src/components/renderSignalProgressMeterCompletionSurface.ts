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
  const frame = Math.floor(timeMs / 220);
  const ambientBreath = 0.5 + Math.sin(timeMs / 2100) * 0.5;
  const scanBreath = 0.5 + Math.sin(timeMs / 3100 + 0.8) * 0.5;

  ctx.clearRect(0, 0, cols, rows);

  for (let y = 0; y < rows; y += 1) {
    const rowEnergy = getRowEnergy(y, rows);
    const rowWave = 0.5 + Math.sin(timeMs / 2700 + y * 0.7) * 0.5;

    for (let x = 0; x < cols; x += 1) {
      const stableNoise = hash((x + 1) * 1.7, (y + 1) * 3.1, 17);
      const flickerNoise = hash(x + frame * 0.32, y + 11, 63);
      const weaveNoise = hash((x + 5) * 2.4, (y + 3) * 4.7, frame + 19);
      const lattice = hash((x + 1) * 5.1, (y + 1) * 7.7, frame + 41);
      const columnWave = 0.5 + Math.sin(timeMs / 2400 + x * 0.2 + y * 0.05) * 0.5;
      const centerGlow = getColumnGlow(x, cols, 0.42, 0.3 + ambientBreath * 0.05);
      const edgeGlow = getColumnGlow(x, cols, 0.78, 0.18 + scanBreath * 0.03);
      const columnEnergy = centerGlow * 0.88 + edgeGlow * 0.6 + columnWave * 0.22;
      const threshold = clamp(0.58 - rowEnergy * 0.06 - columnEnergy * 0.22, 0.2, 0.78);

      if (stableNoise <= threshold && lattice < 0.84) {
        continue;
      }

      const shimmerLift = (flickerNoise > 0.92 ? 0.08 : 0) + rowWave * 0.04;
      const highlightMix = clamp(columnEnergy * 0.52 + (lattice > 0.9 ? 0.28 : 0), 0, 0.86);
      const pixelAccent = blendChannels(accent, highlight, highlightMix);
      const alpha =
        0.16 +
        rowEnergy * 0.1 +
        stableNoise * 0.2 +
        flickerNoise * 0.05 +
        columnEnergy * 0.18;
      const lift =
        0.03 +
        rowEnergy * 0.05 +
        columnEnergy * 0.14 +
        shimmerLift +
        (weaveNoise > 0.82 ? 0.05 : 0);
      const saturation = 0.88 + stableNoise * 0.1 + weaveNoise * 0.12 + columnEnergy * 0.14;

      drawPixel(ctx, x, y, pixelAccent, saturation, lift, clamp(alpha, 0.16, 0.92));
    }
  }

  drawCompletionBloom(ctx, cols, rows, accent, highlight, ambientBreath, scanBreath);
}

function drawCompletionBloom(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  accent: RgbChannels,
  highlight: RgbChannels,
  ambientBreath: number,
  scanBreath: number,
) {
  const bloomCenters = [
    { center: Math.floor(cols * 0.42), energy: 0.12 + ambientBreath * 0.06, spread: 5 },
    { center: Math.floor(cols * 0.78), energy: 0.08 + scanBreath * 0.04, spread: 3 },
  ] as const;

  for (const bloom of bloomCenters) {
    for (let offset = -bloom.spread; offset <= bloom.spread; offset += 1) {
      const column = bloom.center + offset;
      const proximity = 1 - Math.abs(offset) / (bloom.spread + 1);

      if (column < 0 || column >= cols || proximity <= 0) {
        continue;
      }

      ctx.fillStyle = rgba(
        blendChannels(accent, highlight, proximity * 0.42),
        0.98,
        0.04 + proximity * 0.08,
        bloom.energy * proximity,
      );
      ctx.fillRect(column, 0, 1, rows);
    }
  }
}

function getRowEnergy(row: number, rowCount: number) {
  if (rowCount <= 1) {
    return 1;
  }

  const normalized = row / (rowCount - 1);
  return 1 - Math.abs(normalized * 2 - 1) * 0.44;
}

function getColumnGlow(column: number, columnCount: number, center: number, radius: number) {
  if (columnCount <= 1) {
    return 1;
  }

  const normalized = column / (columnCount - 1);
  return clamp(1 - Math.abs(normalized - center) / radius, 0, 1);
}
