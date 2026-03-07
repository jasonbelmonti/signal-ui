import { clamp } from "./utils";

export function drawPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  accent: [number, number, number],
  saturation: number,
  lift: number,
  alpha: number,
) {
  ctx.fillStyle = rgba(accent, saturation, lift, alpha);
  ctx.fillRect(x, y, 1, 1);
}

export function rgba(
  accent: [number, number, number],
  saturation: number,
  lift: number,
  alpha: number,
) {
  const red = liftChannel(accent[0], saturation, lift);
  const green = liftChannel(accent[1], saturation, lift);
  const blue = liftChannel(accent[2], saturation, lift);

  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1)})`;
}

function liftChannel(channel: number, saturation: number, lift: number) {
  const scaled = channel * saturation;
  return Math.round(clamp(scaled + (255 - scaled) * lift, 0, 255));
}
