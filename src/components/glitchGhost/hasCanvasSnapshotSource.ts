type GhostSnapshotQueryRoot = Pick<ParentNode, "querySelector">;

export function hasCanvasSnapshotSource(root: GhostSnapshotQueryRoot) {
  return root.querySelector("canvas") !== null;
}
