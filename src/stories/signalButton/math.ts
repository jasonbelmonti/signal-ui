export function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

export function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - clamp01(value), 3);
}

export function roundPercent(value: number) {
  return Math.round(value / 2) * 2;
}
