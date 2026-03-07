import type { CSSProperties, HTMLAttributes } from "react";

type VoxelTone = "solid" | "lit" | "shade";

export type PixelCubeLoaderGridSize = 2 | 3;
export type PixelCubeLoaderTone = "primary" | "violet";
export type PixelCubeLoaderRootElement = "div" | "span";

type LoaderStyle = CSSProperties & Record<`--signal-ui-loader-${string}`, string | number>;

export type PixelCubeLoaderProps = Omit<HTMLAttributes<HTMLElement>, "children" | "style"> & {
  as?: PixelCubeLoaderRootElement;
  compact?: boolean;
  detail?: string;
  gridSize?: PixelCubeLoaderGridSize;
  label?: string;
  size?: number;
  showLegend?: boolean;
  style?: LoaderStyle;
  tone?: PixelCubeLoaderTone;
};

type VoxelDescriptor = {
  column: number;
  depth: number;
  index: number;
  row: number;
  tone: VoxelTone;
  x: number;
  y: number;
  z: number;
};

export function PixelCubeLoader({
  as,
  className,
  compact,
  detail = "forming cube volume",
  gridSize = 3,
  label = "cli construct",
  size = 160,
  showLegend = true,
  style,
  tone = "primary",
  ...props
}: PixelCubeLoaderProps) {
  const gapSize = Math.max(4, Math.round(size * (gridSize === 2 ? 0.085 : 0.06)));
  const cellSize = Math.floor((size - gapSize * (gridSize - 1)) / gridSize);
  const stepSize = cellSize + gapSize;
  const depthOrigin = ((gridSize - 1) / 2) * stepSize;
  const voxels = createVoxelDescriptors(gridSize);
  const resolvedCompact = compact ?? !showLegend;
  const Root = as ?? (resolvedCompact ? "span" : "div");
  const Wrapper = Root === "span" ? "span" : "div";
  const loaderClassName = [
    "signal-ui-pixel-cube-loader",
    toneClassName[tone],
    resolvedCompact ? "signal-ui-pixel-cube-loader--mini" : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const rootStyle: LoaderStyle = {
    "--signal-ui-loader-cell-size": `${cellSize}px`,
    "--signal-ui-loader-depth-origin": `${depthOrigin}px`,
    "--signal-ui-loader-gap": `${gapSize}px`,
    "--signal-ui-loader-grid": gridSize,
    "--signal-ui-loader-size": `${size}px`,
    "--signal-ui-loader-step": `${stepSize}px`,
    ...style,
  };

  return (
    <Root
      aria-label={`${label}: ${detail}`}
      aria-live="polite"
      className={loaderClassName}
      role="status"
      style={rootStyle}
      {...props}
    >
      <Wrapper className="signal-ui-pixel-cube-loader__stage">
        <Wrapper className="signal-ui-pixel-cube-loader__viewport">
          <Wrapper className="signal-ui-pixel-cube-loader__scene-anchor">
            <Wrapper className="signal-ui-pixel-cube-loader__scene">
              <Wrapper className="signal-ui-pixel-cube-loader__scene-spin">
                {voxels.map((voxel) => (
                  <span
                    aria-hidden="true"
                    className={[
                      "signal-ui-pixel-cube-loader__voxel",
                      voxel.depth === 0
                        ? "signal-ui-pixel-cube-loader__voxel--front"
                        : "signal-ui-pixel-cube-loader__voxel--deep",
                    ].join(" ")}
                    data-tone={voxel.tone}
                    key={voxel.index}
                    style={getVoxelStyle(voxel)}
                  >
                    <span className="signal-ui-pixel-cube-loader__voxel-face signal-ui-pixel-cube-loader__voxel-face--front" />
                    <span className="signal-ui-pixel-cube-loader__voxel-face signal-ui-pixel-cube-loader__voxel-face--left" />
                    <span className="signal-ui-pixel-cube-loader__voxel-face signal-ui-pixel-cube-loader__voxel-face--top" />
                  </span>
                ))}
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Wrapper>

      {showLegend ? (
        <Wrapper className="signal-ui-pixel-cube-loader__legend">
          <span className="signal-ui-pixel-cube-loader__label">{label}</span>
          <span className="signal-ui-pixel-cube-loader__detail">
            {detail}
            <span aria-hidden="true" className="signal-ui-pixel-cube-loader__cursor" />
          </span>
        </Wrapper>
      ) : null}
    </Root>
  );
}

const toneClassName: Record<PixelCubeLoaderTone, string | undefined> = {
  primary: undefined,
  violet: "signal-ui-pixel-cube-loader--violet",
};

function createVoxelDescriptors(gridSize: PixelCubeLoaderGridSize): VoxelDescriptor[] {
  const center = (gridSize - 1) / 2;

  return Array.from({ length: gridSize ** 3 }, (_, index) => {
    const column = index % gridSize;
    const row = Math.floor(index / gridSize) % gridSize;
    const depth = Math.floor(index / (gridSize * gridSize));
    const x = column - center;
    const y = row - center;
    const tone: VoxelTone =
      row === 0 && column === 0
        ? "lit"
        : row === gridSize - 1 && column === gridSize - 1
          ? "shade"
          : "solid";

    return {
      column,
      depth,
      index,
      row,
      tone,
      x,
      y,
      z: center - depth,
    };
  });
}

function getVoxelStyle(voxel: VoxelDescriptor): LoaderStyle {
  return {
    "--signal-ui-loader-x": voxel.x,
    "--signal-ui-loader-y": voxel.y,
    "--signal-ui-loader-z": voxel.z,
  };
}
