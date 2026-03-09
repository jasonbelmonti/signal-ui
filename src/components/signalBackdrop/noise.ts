export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function createSeed(input: number | string | undefined) {
  if (typeof input === "number" && Number.isFinite(input)) {
    return input >>> 0;
  }

  const text = String(input ?? "signal-backdrop");
  let hash = 2166136261;

  for (const character of text) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createRandom(seed: number) {
  let state = seed >>> 0 || 1;

  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;

    return ((state >>> 0) + 0.5) / 4294967296;
  };
}

export function sampleFbm(x: number, y: number, seed: number, octaves = 4) {
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;
  let totalAmplitude = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    total += sampleValueNoise(x * frequency, y * frequency, seed + octave * 97) * amplitude;
    totalAmplitude += amplitude;
    amplitude *= 0.5;
    frequency *= 2.02;
  }

  return totalAmplitude === 0 ? 0 : total / totalAmplitude;
}

function sampleValueNoise(x: number, y: number, seed: number) {
  const baseX = Math.floor(x);
  const baseY = Math.floor(y);
  const fractX = x - baseX;
  const fractY = y - baseY;
  const smoothX = smoothstep(fractX);
  const smoothY = smoothstep(fractY);
  const topLeft = hash(baseX, baseY, seed);
  const topRight = hash(baseX + 1, baseY, seed);
  const bottomLeft = hash(baseX, baseY + 1, seed);
  const bottomRight = hash(baseX + 1, baseY + 1, seed);
  const top = lerp(topLeft, topRight, smoothX);
  const bottom = lerp(bottomLeft, bottomRight, smoothX);

  return lerp(top, bottom, smoothY) * 2 - 1;
}

function hash(x: number, y: number, seed: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;

  return value - Math.floor(value);
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}
