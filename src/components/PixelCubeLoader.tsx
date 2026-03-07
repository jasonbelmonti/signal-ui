import type { CSSProperties, HTMLAttributes } from "react";

type VoxelTone = "solid" | "lit" | "shade";

export type PixelCubeLoaderGridSize = 2 | 3;
export type PixelCubeLoaderTone = "primary" | "violet";
export type PixelCubeLoaderRootElement = "div" | "span";

type LoaderStyle = CSSProperties & Record<`--marathon-loader-${string}`, string | number>;

export type PixelCubeLoaderProps = Omit<HTMLAttributes<HTMLElement>, "children" | "style"> & {
  as?: PixelCubeLoaderRootElement;
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
  const Root = showLegend ? "div" : (as ?? "span");
  const loaderClassName = [
    "marathon-pixel-cube-loader",
    toneClassName[tone],
    showLegend ? undefined : "marathon-pixel-cube-loader--mini",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const rootStyle: LoaderStyle = {
    "--marathon-loader-cell-size": `${cellSize}px`,
    "--marathon-loader-depth-origin": `${depthOrigin}px`,
    "--marathon-loader-gap": `${gapSize}px`,
    "--marathon-loader-grid": gridSize,
    "--marathon-loader-size": `${size}px`,
    "--marathon-loader-step": `${stepSize}px`,
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
      <div className="marathon-pixel-cube-loader__stage">
        <div className="marathon-pixel-cube-loader__viewport">
          <div className="marathon-pixel-cube-loader__scene-anchor">
            <div className="marathon-pixel-cube-loader__scene">
              <div className="marathon-pixel-cube-loader__scene-spin">
                {voxels.map((voxel) => (
                  <span
                    aria-hidden="true"
                    className={[
                      "marathon-pixel-cube-loader__voxel",
                      voxel.depth === 0
                        ? "marathon-pixel-cube-loader__voxel--front"
                        : "marathon-pixel-cube-loader__voxel--deep",
                    ].join(" ")}
                    data-tone={voxel.tone}
                    key={voxel.index}
                    style={getVoxelStyle(voxel)}
                  >
                    <span className="marathon-pixel-cube-loader__voxel-face marathon-pixel-cube-loader__voxel-face--front" />
                    <span className="marathon-pixel-cube-loader__voxel-face marathon-pixel-cube-loader__voxel-face--left" />
                    <span className="marathon-pixel-cube-loader__voxel-face marathon-pixel-cube-loader__voxel-face--top" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLegend ? (
        <div className="marathon-pixel-cube-loader__legend">
          <span className="marathon-pixel-cube-loader__label">{label}</span>
          <span className="marathon-pixel-cube-loader__detail">
            {detail}
            <span aria-hidden="true" className="marathon-pixel-cube-loader__cursor" />
          </span>
        </div>
      ) : null}
    </Root>
  );
}

const toneClassName: Record<PixelCubeLoaderTone, string | undefined> = {
  primary: undefined,
  violet: "marathon-pixel-cube-loader--violet",
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
    "--marathon-loader-x": voxel.x,
    "--marathon-loader-y": voxel.y,
    "--marathon-loader-z": voxel.z,
  };
}
