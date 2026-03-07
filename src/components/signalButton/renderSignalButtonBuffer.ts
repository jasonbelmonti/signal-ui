import type { SignalButtonTone } from "./types.js";
import { drawPixel, rgba } from "./color.js";
import { hash } from "./noise.js";
import { blendChannels, clamp, type RgbChannels, toneAccentChannels } from "./utils.js";

type SignalButtonBufferOptions = {
  ctx: CanvasRenderingContext2D;
  cols: number;
  cooldownPercent: number;
  disabled?: boolean;
  edgeWidthPx: number;
  fillPercent: number;
  pulseBurst: number;
  rewardChannels: RgbChannels;
  rows: number;
  tone: SignalButtonTone;
  timeMs: number;
  wakePercent: number;
};

export function renderSignalButtonBuffer({
  ctx,
  cols,
  cooldownPercent,
  disabled = false,
  edgeWidthPx,
  fillPercent,
  pulseBurst,
  rewardChannels,
  rows,
  tone,
  timeMs,
  wakePercent,
}: SignalButtonBufferOptions) {
  const frame = Math.floor(timeMs / 70);
  const front = clamp((fillPercent / 100) * cols, 0, cols);
  const edgeCells = Math.max(2, Math.round(edgeWidthPx / 6));
  const gradientCells = edgeCells + 3;
  const burstLevel = clamp(pulseBurst / 100, 0, 1);
  const cooldownLevel = clamp(cooldownPercent / 100, 0, 1);
  const wakeLevel = clamp(wakePercent / 100, 0, 1);
  const baseAccent = toneAccentChannels[tone];
  const surfaceAccent = blendChannels(baseAccent, rewardChannels, cooldownLevel);

  ctx.clearRect(0, 0, cols, rows);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const distance = front - x;

      if (distance <= -edgeCells - 1) {
        continue;
      }

      const stableNoise = hash(x, y, frame);
      const pulseNoise = hash(x + 13, y + 17, frame + 9);
      const signalNoise = hash((x + 1) * 3, (y + 1) * 5, frame + 21);
      const wakeSeed = hash((x + 5) * 7, (y + 3) * 11, 97);
      const bodyBlend = clamp((gradientCells - Math.abs(distance - 0.5)) / gradientCells, 0, 1);
      const edgeGlow = bodyBlend * bodyBlend;
      const outcomeBlend = getPulseOutcomeBlend(x, y, cols, rows, burstLevel, cooldownLevel);
      const pixelAccent =
        outcomeBlend > 0 ? blendChannels(baseAccent, rewardChannels, outcomeBlend) : surfaceAccent;

      if (distance > 0.25) {
        const fillDepth = clamp(distance / Math.max(front, 1), 0, 1);
        const wakeProgress = getWakeProgress(wakeLevel, wakeSeed);
        const dropoutBase = fillDepth > 0.18 ? 0.035 : 0.08;
        const dropoutThreshold = clamp(
          dropoutBase - edgeGlow * 0.045 - wakeProgress * 0.06,
          0.005,
          0.14,
        );

        if (wakeProgress >= 0.995) {
          drawPixel(ctx, x, y, pixelAccent, 1, 0.02, disabled ? 0.34 : 1);
          continue;
        }

        if (stableNoise > dropoutThreshold || wakeProgress > 0.42) {
          const alpha =
            (disabled ? 0.2 : 0.38) +
            pulseNoise * 0.14 +
            fillDepth * 0.08 +
            edgeGlow * 0.18 +
            wakeProgress * 0.36;
          const lift =
            0.02 +
            edgeGlow * 0.16 +
            wakeProgress * 0.03 +
            ((x + y + frame) % 4 === 0 ? 0.06 : 0);
          const saturation = 0.82 + signalNoise * 0.14 + edgeGlow * 0.2 + wakeProgress * 0.2;

          drawPixel(ctx, x, y, pixelAccent, saturation, lift, alpha);
        }

        continue;
      }

      if (distance > -edgeCells) {
        const edgeProximity = 1 - clamp(Math.abs(distance) / edgeCells, 0, 1);
        const activeThreshold = 0.14 + edgeProximity * 0.16;
        const ghostThreshold = 0.08 + edgeProximity * 0.12;

        if (signalNoise > activeThreshold) {
          const alpha = (disabled ? 0.28 : 0.5) + edgeProximity * 0.2 + pulseNoise * 0.12;
          const lift =
            0.08 + edgeProximity * 0.22 + bodyBlend * 0.08 + (stableNoise > 0.82 ? 0.14 : 0);
          const saturation = 0.9 + edgeProximity * 0.18 + bodyBlend * 0.08;

          drawPixel(ctx, x, y, pixelAccent, saturation, lift, alpha);
          continue;
        }

        if (distance > -1.25 && signalNoise > ghostThreshold) {
          const alpha = disabled ? 0.08 : 0.12 + edgeProximity * 0.18;
          drawPixel(
            ctx,
            x,
            y,
            pixelAccent,
            0.72 + bodyBlend * 0.12,
            0.04 + edgeProximity * 0.06,
            alpha,
          );
        }
      }
    }
  }

  drawFrontierBloom(ctx, front, rows, edgeCells, surfaceAccent, disabled);

  if (burstLevel > 0.01) {
    drawPulseRings(ctx, cols, rows, baseAccent, rewardChannels, burstLevel, disabled);
  }
}

function drawFrontierBloom(
  ctx: CanvasRenderingContext2D,
  front: number,
  rows: number,
  edgeCells: number,
  accent: [number, number, number],
  disabled: boolean,
) {
  const clampedFront = clamp(front, 0, ctx.canvas.width);

  if (clampedFront <= 0) {
    return;
  }

  const spread = Math.max(2, edgeCells);
  const baseAlpha = disabled ? 0.05 : 0.12;
  const frontCell = Math.floor(clampedFront);

  for (let offset = -spread; offset <= 1; offset += 1) {
    const proximity = 1 - Math.abs(offset) / (spread + 1);

    if (proximity <= 0) {
      continue;
    }

    ctx.fillStyle = rgba(accent, 0.8 + proximity * 0.18, 0.05 + proximity * 0.12, baseAlpha * proximity);
    ctx.fillRect(frontCell + offset, 0, 1, rows);
  }
}

function getWakeProgress(wakeLevel: number, wakeSeed: number) {
  const start = wakeSeed * 0.82;
  return clamp((wakeLevel - start) / 0.18, 0, 1);
}

function getPulseOutcomeBlend(
  x: number,
  y: number,
  cols: number,
  rows: number,
  burstLevel: number,
  cooldownLevel: number,
) {
  if (burstLevel <= 0.01) {
    return cooldownLevel;
  }

  const radial = getPulseRadial(x, y, cols, rows);
  const pulseFront = easeOutCubic(burstLevel) * 3.08;
  const wakeBand = clamp((pulseFront - radial + 0.16) / 0.56, 0, 1);
  const pulseResolve = easeOutCubic(wakeBand) * (0.92 - cooldownLevel * 0.18);

  return Math.max(cooldownLevel, pulseResolve);
}

function drawPulseRings(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  accent: RgbChannels,
  rewardChannels: RgbChannels,
  burstLevel: number,
  disabled: boolean,
) {
  const centerX = cols / 2;
  const centerY = rows / 2;
  const baseAlpha = disabled ? 0.05 : 0.12 + burstLevel * 0.26;
  const darkAlpha = disabled ? 0.05 : 0.16 + burstLevel * 0.18;
  const ringDelays = [0, 0.11, 0.22, 0.33] as const;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const radial = getPulseRadial(x, y, cols, rows, centerX, centerY);
      const centerFade = clamp(radial / 0.68, 0, 1);

      let brightEnergy = 0;
      let darkEnergy = 0;

      for (const delay of ringDelays) {
        const localProgress = clamp((burstLevel - delay) / 0.62, 0, 1);

        if (localProgress <= 0) {
          continue;
        }

        const easedProgress = easeOutCubic(localProgress);
        const ringOpacity = Math.pow(localProgress, 0.9);
        const ringRadius = easedProgress * 3.08;
        const ringThickness = 0.14 + (1 - easedProgress) * 0.05;
        const crestDistance = Math.abs(radial - ringRadius);
        const crestMask = clamp(1 - crestDistance / ringThickness, 0, 1);

        brightEnergy += crestMask * crestMask * ringOpacity;

        const troughRadius = Math.max(ringRadius - ringThickness * 0.82, 0);
        const troughDistance = Math.abs(radial - troughRadius);
        const troughMask =
          clamp(1 - troughDistance / (ringThickness * 0.92), 0, 1) * (radial <= ringRadius ? 1 : 0);

        darkEnergy += troughMask * ringOpacity * 0.78;
      }

      brightEnergy *= centerFade;
      darkEnergy *= centerFade;

      if (darkEnergy > 0.04) {
        drawPixel(
          ctx,
          x,
          y,
          accent,
          0.42,
          -0.52,
          clamp(darkAlpha + darkEnergy * 0.24, 0, 0.66),
        );
      }

      if (brightEnergy > 0.04) {
        const ringAccent = blendChannels(accent, rewardChannels, clamp(0.58 + brightEnergy * 0.34, 0, 1));

        drawPixel(
          ctx,
          x,
          y,
          ringAccent,
          1.02,
          0.22 + brightEnergy * 0.32,
          clamp(baseAlpha + brightEnergy * 0.22, 0, 1),
        );
      }
    }
  }
}

function getPulseRadial(
  x: number,
  y: number,
  cols: number,
  rows: number,
  centerX = cols / 2,
  centerY = rows / 2,
) {
  const offsetX = (x + 0.5 - centerX) / Math.max(cols * 0.18, 1);
  const offsetY = (y + 0.5 - centerY) / Math.max(rows * 0.52, 1);

  return Math.sqrt(offsetX * offsetX + offsetY * offsetY);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - clamp(value, 0, 1), 3);
}
