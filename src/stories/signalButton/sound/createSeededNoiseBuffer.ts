export function createSeededNoiseBuffer(
  context: BaseAudioContext,
  durationSeconds = 1.75,
  seed = 0x51_77_0b,
) {
  const frameCount = Math.max(1, Math.floor(context.sampleRate * durationSeconds));
  const buffer = context.createBuffer(2, frameCount, context.sampleRate);

  for (let channelIndex = 0; channelIndex < buffer.numberOfChannels; channelIndex += 1) {
    const channelData = buffer.getChannelData(channelIndex);
    const random = createSeededRandom(seed + channelIndex * 997);
    let smoothedValue = 0;

    for (let sampleIndex = 0; sampleIndex < frameCount; sampleIndex += 1) {
      const whiteNoise = random() * 2 - 1;
      smoothedValue = smoothedValue * 0.84 + whiteNoise * 0.16;
      channelData[sampleIndex] = smoothedValue * 0.92;
    }
  }

  return buffer;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 4_294_967_295;
  };
}
