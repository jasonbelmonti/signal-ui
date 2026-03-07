export type PixelCubePathCubeCoordinate = {
  column: number;
  depth: number;
  index: number;
  pathIndex: number;
  row: number;
  surface: boolean;
};

export function createPixelCubePathCubeCoordinates(): PixelCubePathCubeCoordinate[] {
  const pathKeys = createSnakePath();
  const pathIndexLookup = new Map(pathKeys.map((key, index) => [key, index]));

  return Array.from({ length: 27 }, (_, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3) % 3;
    const depth = Math.floor(index / 9);
    const key = getCubeKey(column, row, depth);

    return {
      column,
      depth,
      index,
      pathIndex: pathIndexLookup.get(key) ?? 0,
      row,
      surface: column === 2 || row === 0 || depth === 2,
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
        path.push(getCubeKey(column, row, depth));
      });
    });
  }

  return path;
}

function getCubeKey(column: number, row: number, depth: number) {
  return `${column}:${row}:${depth}`;
}
