import { useEffect, useRef, useState } from "react";

import type { SignalProgressPanelTone } from "../../components/SignalProgressPanel.js";

type AudioContextConstructor = {
  new (): AudioContext;
};

export function useSignalCompletionChime() {
  const contextRef = useRef<AudioContext | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [audioSupported, setAudioSupported] = useState(true);

  useEffect(() => {
    return () => {
      const context = contextRef.current;

      contextRef.current = null;

      if (context && context.state !== "closed") {
        void context.close();
      }
    };
  }, []);

  const armAudio = async () => {
    const context = await getAudioContext(contextRef, setAudioReady, setAudioSupported);

    return context?.state === "running";
  };

  const playCompletion = async (tone: SignalProgressPanelTone = "primary") => {
    const context = await getArmedAudioContext(contextRef, setAudioReady);

    if (!context || context.state !== "running") {
      return false;
    }

    scheduleCompletionChime(context, tone);

    return true;
  };

  return {
    armAudio,
    audioLabel: !audioSupported
      ? "browser audio unavailable"
      : audioReady
        ? "completion chime armed"
        : "click replay to arm completion chime",
    audioReady,
    playCompletion,
  };
}

async function getAudioContext(
  contextRef: { current: AudioContext | null },
  setAudioReady: (value: boolean) => void,
  setAudioSupported: (value: boolean) => void,
) {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextCtor = resolveAudioContextConstructor(window);

  if (!AudioContextCtor) {
    setAudioSupported(false);
    setAudioReady(false);
    return null;
  }

  if (!contextRef.current) {
    contextRef.current = new AudioContextCtor();
  }

  if (contextRef.current.state !== "running") {
    try {
      await contextRef.current.resume();
    } catch {
      setAudioReady(false);
      return contextRef.current;
    }
  }

  setAudioReady(contextRef.current.state === "running");

  return contextRef.current;
}

async function getArmedAudioContext(
  contextRef: { current: AudioContext | null },
  setAudioReady: (value: boolean) => void,
) {
  const context = contextRef.current;

  if (!context) {
    setAudioReady(false);
    return null;
  }

  if (context.state !== "running") {
    try {
      await context.resume();
    } catch {
      setAudioReady(false);
      return context;
    }
  }

  setAudioReady(context.state === "running");

  return context;
}

function resolveAudioContextConstructor(target: Window): AudioContextConstructor | null {
  return (
    (globalThis as typeof globalThis & { AudioContext?: AudioContextConstructor }).AudioContext ??
    (target as Window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext ??
    null
  );
}

function scheduleCompletionChime(context: AudioContext, tone: SignalProgressPanelTone) {
  const now = context.currentTime + 0.02;
  const notes = tone === "violet" ? ([587.33, 783.99, 1046.5] as const) : ([523.25, 698.46, 987.77] as const);
  const offsets = [0, 0.08, 0.19] as const;
  const durations = [0.22, 0.22, 0.34] as const;
  const peaks = [0.048, 0.052, 0.072] as const;

  for (const [index, note] of notes.entries()) {
    const noteStart = now + offsets[index]!;
    const noteEnd = noteStart + durations[index]!;
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    const carrier = context.createOscillator();
    const shimmer = context.createOscillator();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(index === notes.length - 1 ? 3600 : 3000, noteStart);
    filter.Q.setValueAtTime(0.8, noteStart);

    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(peaks[index]!, noteStart + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

    carrier.type = "triangle";
    carrier.frequency.setValueAtTime(note, noteStart);

    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(note * 2, noteStart);
    shimmer.detune.setValueAtTime(index === notes.length - 1 ? 6 : 3, noteStart);

    carrier.connect(filter);
    shimmer.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    carrier.start(noteStart);
    shimmer.start(noteStart);
    carrier.stop(noteEnd);
    shimmer.stop(noteEnd);
  }
}
