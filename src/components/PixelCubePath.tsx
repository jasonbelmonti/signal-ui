import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export type PixelCubePathTone = "primary" | "violet";

type PathStyle = CSSProperties & Record<`--marathon-cube-path-${string}`, string | number>;

type PixelCubePathBaseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "aria-hidden" | "aria-label" | "aria-live" | "children" | "role" | "style"
> & {
  size?: number;
  style?: PathStyle;
  tone?: PixelCubePathTone;
};

type PixelCubePathDecorativeProps = PixelCubePathBaseProps & {
  label?: never;
  usage?: "decorative";
};

type PixelCubePathLoaderProps = PixelCubePathBaseProps & {
  label: string;
  usage: "loader";
};

export type PixelCubePathProps = PixelCubePathDecorativeProps | PixelCubePathLoaderProps;

type CubeCoordinate = {
  column: number;
  depth: number;
  index: number;
  pathIndex: number;
  row: number;
  surface: boolean;
};

type CubeStyle = PathStyle;

const cubeCoordinates = createCubeCoordinates();

export function PixelCubePath({
  className,
  label,
  size = 220,
  style,
  tone = "primary",
  usage = "decorative",
  ...props
}: PixelCubePathProps) {
  const cellSize = Math.max(18, Math.round(size * 0.19));
  const gapSize = Math.max(2, Math.round(cellSize * 0.08));
  const stepSize = cellSize + gapSize;
  const sceneWidth = Math.round(size * 1.34);
  const sceneHeight = Math.round(size * 1.18);
  const perspective = Math.round(size * 6.4);
  const rootStyle: PathStyle = {
    "--marathon-cube-path-cell-size": `${cellSize}px`,
    "--marathon-cube-path-count": cubeCoordinates.length,
    "--marathon-cube-path-cycle": "3240ms",
    "--marathon-cube-path-gap": `${gapSize}px`,
    "--marathon-cube-path-perspective": `${perspective}px`,
    "--marathon-cube-path-scene-height": `${sceneHeight}px`,
    "--marathon-cube-path-scene-width": `${sceneWidth}px`,
    "--marathon-cube-path-scene-z": `${Math.round(stepSize * -1.45)}px`,
    "--marathon-cube-path-size": `${size}px`,
    "--marathon-cube-path-step": `${stepSize}px`,
    ...style,
  };
  const rootClassName = ["marathon-pixel-cube-path", toneClassName[tone], className]
    .filter(Boolean)
    .join(" ");
  const accessibilityProps =
    usage === "loader"
      ? {
          "aria-label": label,
          "aria-live": "polite" as const,
          role: "status" as const,
        }
      : {
          "aria-hidden": true,
        };

  return (
    <div className={rootClassName} style={rootStyle} {...accessibilityProps} {...props}>
      <div aria-hidden="true" className="marathon-pixel-cube-path__viewport">
        <div className="marathon-pixel-cube-path__scene">
          {cubeCoordinates.map((cube) => (
            <span
              className="marathon-pixel-cube-path__cube"
              data-surface={cube.surface ? "true" : "false"}
              key={cube.index}
              style={getCubeStyle(cube)}
            >
              <span className="marathon-pixel-cube-path__face marathon-pixel-cube-path__face--front" />
              <span className="marathon-pixel-cube-path__face marathon-pixel-cube-path__face--right" />
              <span className="marathon-pixel-cube-path__face marathon-pixel-cube-path__face--top" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const toneClassName: Record<PixelCubePathTone, string | undefined> = {
  primary: undefined,
  violet: "marathon-pixel-cube-path--violet",
};

function createCubeCoordinates(): CubeCoordinate[] {
  const pathKeys = createSnakePath();
  const pathIndexLookup = new Map(pathKeys.map((key, index) => [key, index]));
  let index = 0;

  return Array.from({ length: 27 }, () => null).map(() => {
    const column = index % 3;
    const row = Math.floor(index / 3) % 3;
    const depth = Math.floor(index / 9);
    const key = getCubeKey(column, row, depth);
    const cube: CubeCoordinate = {
      column,
      depth,
      index,
      pathIndex: pathIndexLookup.get(key) ?? 0,
      row,
      surface: column === 2 || row === 0 || depth === 2,
    };
    index += 1;

    return cube;
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
        path.push(getCubeKey(column, row, depth));
      });
    });
  }

  return path;
}

function getCubeKey(column: number, row: number, depth: number) {
  return `${column}:${row}:${depth}`;
}

function getCubeStyle(cube: CubeCoordinate): CubeStyle {
  const center = 1;
  const x = cube.column - center;
  const y = cube.row - center;
  const z = cube.depth - center;

  return {
    "--marathon-cube-path-cube-x": `calc(${x} * var(--marathon-cube-path-step))`,
    "--marathon-cube-path-cube-y": `calc(${y} * var(--marathon-cube-path-step))`,
    "--marathon-cube-path-cube-z": `calc(${z} * var(--marathon-cube-path-step))`,
    "--marathon-cube-path-phase": cube.pathIndex,
  };
}
