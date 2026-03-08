import type { CSSProperties, HTMLAttributes } from "react";

import { signalPalette } from "../theme/signalTheme.js";
import { useViewportRenderGate } from "../utils/useViewportRenderGate.js";

type HashCubeMode = "core" | "ghost" | "solid" | "wire";
type HashCubeColorChannel = "primary" | "text" | "violet" | "warning";
type HashCubeRenderMode = "viewport" | "always";

type HashCubeStyle = CSSProperties & Record<`--signal-ui-hash-cube-${string}`, string | number>;

export type HashCubeTone = "primary" | "violet";

export type HashCubeProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "style"> & {
  detail?: string;
  hash: string;
  label?: string;
  renderMode?: HashCubeRenderMode;
  showLegend?: boolean;
  size?: number;
  style?: HashCubeStyle;
  tone?: HashCubeTone;
};

type VoxelCoordinate = {
  center: boolean;
  column: number;
  depth: number;
  index: number;
  pathIndex: number;
  row: number;
  surface: boolean;
  x: number;
  y: number;
  z: number;
};

type HashCubeVoxel = VoxelCoordinate & {
  channel: HashCubeColorChannel;
  glow: number;
  lift: number;
  mode: HashCubeMode;
  opacity: number;
  scale: number;
};

type ChannelPalette = {
  base: string;
  highlight: string;
};

type ChannelStyle = {
  front: string;
  side: string;
  top: string;
  wire: string;
};

type HashCubeModeCounts = Record<HashCubeMode, number>;

const voxelCoordinates = createVoxelCoordinates();

const toneClassName: Record<HashCubeTone, string | undefined> = {
  primary: undefined,
  violet: "signal-ui-hash-cube--violet",
};

const toneChannels: Record<HashCubeTone, HashCubeColorChannel[]> = {
  primary: ["primary", "warning", "violet", "text"],
  violet: ["violet", "primary", "warning", "text"],
};

const channelPalettes: Record<HashCubeColorChannel, ChannelPalette> = {
  primary: {
    base: signalPalette.primary,
    highlight: signalPalette.fieldPrimary,
  },
  text: {
    base: signalPalette.text,
    highlight: "#ffffff",
  },
  violet: {
    base: signalPalette.accentViolet,
    highlight: "#ddc3ff",
  },
  warning: {
    base: signalPalette.warning,
    highlight: "#ffd9ad",
  },
};

const channelStyles: Record<HashCubeColorChannel, ChannelStyle> = {
  primary: createChannelStyle(
    channelPalettes.primary.base,
    channelPalettes.primary.highlight,
    0.92,
    0.68,
    0.92,
    0.84,
  ),
  text: createChannelStyle(
    channelPalettes.text.base,
    channelPalettes.text.highlight,
    0.46,
    0.3,
    0.82,
    0.72,
  ),
  violet: createChannelStyle(
    channelPalettes.violet.base,
    channelPalettes.violet.highlight,
    0.9,
    0.64,
    0.9,
    0.82,
  ),
  warning: createChannelStyle(
    channelPalettes.warning.base,
    channelPalettes.warning.highlight,
    0.92,
    0.68,
    0.9,
    0.8,
  ),
};

export function HashCube({
  className,
  detail,
  hash,
  label = "hash cube",
  renderMode = "viewport",
  showLegend = true,
  size = 208,
  style,
  tone = "primary",
  ...props
}: HashCubeProps) {
  const sourceHash = hash.trim() || "0";
  const shouldViewportGate = renderMode === "viewport";
  const cellSize = Math.max(18, Math.round(size * 0.18));
  const gapSize = Math.max(2, Math.round(cellSize * 0.09));
  const stepSize = cellSize + gapSize;
  const sceneWidth = Math.round(size * 1.34);
  const sceneHeight = Math.round(size * 1.22);
  const perspective = Math.round(size * 6.4);
  const { isInViewport, targetRef } = useViewportRenderGate<HTMLDivElement>({
    disabled: !shouldViewportGate,
    rootMargin: "160px 0px",
    threshold: 0,
  });
  const shouldRenderScene = !shouldViewportGate || isInViewport;
  const voxels = shouldRenderScene ? createHashCubeVoxels(sourceHash, tone) : [];
  const counts =
    showLegend && detail === undefined
      ? shouldRenderScene
        ? countVoxelModes(voxels)
        : createHashCubeModeCounts(sourceHash)
      : null;
  const resolvedDetail = showLegend
    ? detail ??
      `${counts?.solid ?? 0} solid / ${counts?.wire ?? 0} wire / ${counts?.ghost ?? 0} ghost`
    : undefined;
  const rootClassName = [
    "signal-ui-hash-cube",
    shouldRenderScene ? undefined : "signal-ui-hash-cube--idle",
    toneClassName[tone],
    showLegend ? undefined : "signal-ui-hash-cube--mini",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const rootStyle: HashCubeStyle = {
    "--signal-ui-hash-cube-cell-size": `${cellSize}px`,
    "--signal-ui-hash-cube-gap": `${gapSize}px`,
    "--signal-ui-hash-cube-perspective": `${perspective}px`,
    "--signal-ui-hash-cube-scene-height": `${sceneHeight}px`,
    "--signal-ui-hash-cube-scene-width": `${sceneWidth}px`,
    "--signal-ui-hash-cube-size": `${size}px`,
    "--signal-ui-hash-cube-step": `${stepSize}px`,
    ...style,
  };

  return (
    <div
      aria-label={`${label}: ${sourceHash}`}
      className={rootClassName}
      role="img"
      style={rootStyle}
      {...props}
    >
      <div className="signal-ui-hash-cube__stage" ref={targetRef}>
        <div aria-hidden="true" className="signal-ui-hash-cube__viewport">
          {shouldRenderScene ? (
            <div className="signal-ui-hash-cube__scene">
              {voxels.map((voxel) => (
                <span
                  className="signal-ui-hash-cube__voxel"
                  data-mode={voxel.mode}
                  data-surface={voxel.surface ? "true" : "false"}
                  key={voxel.index}
                  style={getVoxelStyle(voxel)}
                >
                  <span className="signal-ui-hash-cube__face signal-ui-hash-cube__face--front" />
                  <span className="signal-ui-hash-cube__face signal-ui-hash-cube__face--right" />
                  <span className="signal-ui-hash-cube__face signal-ui-hash-cube__face--top" />
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {showLegend ? (
        <div className="signal-ui-hash-cube__legend">
          <div className="signal-ui-hash-cube__legend-row">
            <span className="signal-ui-hash-cube__label">{label}</span>
            <span className="signal-ui-hash-cube__signature">{formatHashSignature(sourceHash)}</span>
          </div>
          <span className="signal-ui-hash-cube__detail">{resolvedDetail}</span>
        </div>
      ) : null}
    </div>
  );
}

function createHashCubeVoxels(hash: string, tone: HashCubeTone): HashCubeVoxel[] {
  const normalizedHash = hash.trim().toLowerCase() || "0";
  const words = createWordStream(normalizedHash, 8);
  const baseSeed = createSeed(normalizedHash);
  const channelOrder = toneChannels[tone];

  return voxelCoordinates.map((coordinate) => {
    const modeState = mixVoxelState(words, coordinate, baseSeed ^ 0x9e3779b9, 0x85ebca6b);
    const channelState = mixVoxelState(words, coordinate, baseSeed ^ 0xc2b2ae35, 0x27d4eb2d);
    const detailState = xorshift32(
      modeState ^
        rotl32(channelState, 11) ^
        ((baseSeed + Math.imul(coordinate.index + 1, 0x9e3779b1)) >>> 0),
    );
    const mode = getHashCubeMode(coordinate, modeState);
    const channel = coordinate.center
      ? getChannelValue(channelOrder, 0)
      : getChannelValue(channelOrder, (channelState >>> 30) & 0x3);
    const opacity = coordinate.center
      ? 1
      : mode === "ghost"
        ? coordinate.surface
          ? 0.34
          : 0.22
        : mode === "wire"
          ? coordinate.surface
            ? 0.96
            : 0.82
          : coordinate.surface
            ? 1
            : 0.82;
    const scale = coordinate.center
      ? 1.08
      : mode === "ghost"
        ? 0.88
        : mode === "wire"
          ? 0.95
          : ((detailState >>> 3) & 0xf) >= 12
            ? 1.02
            : 1;
    const lift =
      coordinate.center ? 6 : mode === "wire" ? 2 : ((detailState >>> 7) & 0x3) === 0 ? 1 : 0;
    const glow = coordinate.center
      ? 0.34
      : mode === "solid"
        ? ((channelState >>> 12) & 0xf) >= 11
          ? 0.24
          : 0.16
        : mode === "wire"
          ? 0.12
          : 0.05;

    return {
      ...coordinate,
      channel,
      glow,
      lift,
      mode,
      opacity,
      scale,
    };
  });
}

function countVoxelModes(voxels: HashCubeVoxel[]): HashCubeModeCounts {
  return voxels.reduce(
    (counts, voxel) => {
      counts[voxel.mode] += 1;
      return counts;
    },
    createEmptyModeCounts(),
  );
}

function createHashCubeModeCounts(hash: string): HashCubeModeCounts {
  const normalizedHash = hash.trim().toLowerCase() || "0";
  const words = createWordStream(normalizedHash, 8);
  const baseSeed = createSeed(normalizedHash);

  return voxelCoordinates.reduce((counts, coordinate) => {
    const modeState = mixVoxelState(words, coordinate, baseSeed ^ 0x9e3779b9, 0x85ebca6b);
    counts[getHashCubeMode(coordinate, modeState)] += 1;
    return counts;
  }, createEmptyModeCounts());
}

function createEmptyModeCounts(): HashCubeModeCounts {
  return {
    core: 0,
    ghost: 0,
    solid: 0,
    wire: 0,
  };
}

function getHashCubeMode(coordinate: VoxelCoordinate, modeState: number): HashCubeMode {
  if (coordinate.center) {
    return "core";
  }

  const modeBucket = modeState & 0xf;

  if (modeBucket <= 2) {
    return "ghost";
  }

  if (modeBucket <= 6) {
    return "wire";
  }

  return "solid";
}

function formatHashSignature(hash: string) {
  if (hash.length <= 18) {
    return hash;
  }

  return `${hash.slice(0, 12)}...${hash.slice(-10)}`;
}

function getVoxelStyle(voxel: HashCubeVoxel): HashCubeStyle {
  const palette = channelPalettes[voxel.channel];
  const colors = channelStyles[voxel.channel];

  return {
    "--signal-ui-hash-cube-front": colors.front,
    "--signal-ui-hash-cube-glow": rgba(palette.base, voxel.glow),
    "--signal-ui-hash-cube-lift": `${voxel.lift}px`,
    "--signal-ui-hash-cube-opacity": voxel.opacity,
    "--signal-ui-hash-cube-scale": voxel.scale,
    "--signal-ui-hash-cube-side": colors.side,
    "--signal-ui-hash-cube-top": colors.top,
    "--signal-ui-hash-cube-wire": colors.wire,
    "--signal-ui-hash-cube-x": `calc(${voxel.x} * var(--signal-ui-hash-cube-step))`,
    "--signal-ui-hash-cube-y": `calc(${voxel.y} * var(--signal-ui-hash-cube-step))`,
    "--signal-ui-hash-cube-z": `calc(${voxel.z} * var(--signal-ui-hash-cube-step))`,
  };
}

function createNibbleStream(source: string, count: number) {
  const normalizedSource = source.toLowerCase();
  const values = Array.from(normalizedSource).flatMap((character) => {
    if (/^[0-9a-f]$/.test(character)) {
      return [Number.parseInt(character, 16)];
    }

    return [];
  });
  let state = createSeed(normalizedSource || "0");

  while (values.length < count) {
    state = xorshift32(state || 1);

    for (const character of state.toString(16).padStart(8, "0")) {
      values.push(Number.parseInt(character, 16));

      if (values.length >= count) {
        break;
      }
    }
  }

  return values;
}

function createWordStream(source: string, minWordCount: number) {
  const nibbleStream = createNibbleStream(source, Math.max(40, minWordCount * 8));
  const words: number[] = [];

  for (let nibbleIndex = 0; nibbleIndex < nibbleStream.length; nibbleIndex += 8) {
    let word = 0;

    for (let offset = 0; offset < 8; offset += 1) {
      const nibble = nibbleStream[nibbleIndex + offset];

      if (nibble === undefined) {
        break;
      }

      word = ((word << 4) | nibble) >>> 0;
    }

    words.push(word >>> 0);
  }

  let state = createSeed(source.toLowerCase() || "0");

  while (words.length < minWordCount) {
    state = xorshift32(state ^ words.length ^ 0x9e3779b9);
    words.push(state);
  }

  return words;
}

function mixVoxelState(words: number[], coordinate: VoxelCoordinate, seed: number, salt: number) {
  let state = avalanche32(
    seed ^
      Math.imul(coordinate.index + 1, 0x9e3779b1) ^
      Math.imul(coordinate.pathIndex + 1, 0x85ebca6b) ^
      ((coordinate.x + 2) << 20) ^
      ((coordinate.y + 2) << 14) ^
      ((coordinate.z + 2) << 8) ^
      (coordinate.surface ? 0x632be5ab : 0x85157af5) ^
      (coordinate.center ? 0xa24baed4 : 0x3c6ef372),
  );

  for (let wordIndex = 0; wordIndex < words.length; wordIndex += 1) {
    const word = words[wordIndex] ?? 0;
    const lane = rotl32(
      (word ^ Math.imul(wordIndex + 1, salt) ^ seed) >>> 0,
      ((coordinate.index + wordIndex * 7) % 31) + 1,
    );

    state ^= lane;
    state = avalanche32(
      (state + Math.imul(wordIndex + 1, 0x7f4a7c15) + (word ^ salt)) >>> 0,
    );
  }

  return avalanche32((state ^ seed ^ Math.imul(words.length, salt)) >>> 0);
}

function getChannelValue(channels: HashCubeColorChannel[], index: number) {
  return channels[index] ?? "primary";
}

function createSeed(source: string) {
  let hash = 2166136261;

  for (const character of source) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function xorshift32(value: number) {
  let nextValue = value >>> 0;

  nextValue ^= nextValue << 13;
  nextValue >>>= 0;
  nextValue ^= nextValue >>> 17;
  nextValue >>>= 0;
  nextValue ^= nextValue << 5;

  return nextValue >>> 0;
}

function rotl32(value: number, shift: number) {
  const normalizedShift = shift & 31;

  if (normalizedShift === 0) {
    return value >>> 0;
  }

  return ((value << normalizedShift) | (value >>> (32 - normalizedShift))) >>> 0;
}

function avalanche32(value: number) {
  let nextValue = value >>> 0;

  nextValue ^= nextValue >>> 16;
  nextValue = Math.imul(nextValue, 0x7feb352d) >>> 0;
  nextValue ^= nextValue >>> 15;
  nextValue = Math.imul(nextValue, 0x846ca68b) >>> 0;
  nextValue ^= nextValue >>> 16;

  return nextValue >>> 0;
}

function createVoxelCoordinates(): VoxelCoordinate[] {
  const center = 1;
  const pathKeys = createSnakePath();
  const pathIndexLookup = new Map(pathKeys.map((key, index) => [key, index]));

  return Array.from({ length: 27 }, (_, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3) % 3;
    const depth = Math.floor(index / 9);
    const key = getVoxelKey(column, row, depth);

    return {
      center: column === center && row === center && depth === center,
      column,
      depth,
      index,
      pathIndex: pathIndexLookup.get(key) ?? index,
      row,
      surface: column === 2 || row === 0 || depth === 2,
      x: column - center,
      y: row - center,
      z: depth - center,
    };
  });
}

function createSnakePath() {
  const path: string[] = [];

  for (let depth = 0; depth < 3; depth += 1) {
    const rows = depth % 2 === 0 ? [0, 1, 2] : [2, 1, 0];

    rows.forEach((row, rowIndex) => {
      const forward = (depth + rowIndex) % 2 === 0;
      const columns = forward ? [0, 1, 2] : [2, 1, 0];

      columns.forEach((column) => {
        path.push(getVoxelKey(column, row, depth));
      });
    });
  }

  return path;
}

function getVoxelKey(column: number, row: number, depth: number) {
  return `${column}:${row}:${depth}`;
}

function createChannelStyle(
  base: string,
  highlight: string,
  frontAlpha: number,
  sideAlpha: number,
  topAlpha: number,
  wireAlpha: number,
): ChannelStyle {
  return {
    front: rgba(base, frontAlpha),
    side: rgba(base, sideAlpha),
    top: rgba(highlight, topAlpha),
    wire: rgba(highlight, wireAlpha),
  };
}

function rgba(hex: string, alpha: number) {
  const [red, green, blue] = hexToRgb(hex);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function hexToRgb(hex: string) {
  const normalizedHex = hex.replace("#", "");
  const expandedHex =
    normalizedHex.length === 3
      ? normalizedHex
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalizedHex;
  const value = Number.parseInt(expandedHex, 16);

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const;
}
