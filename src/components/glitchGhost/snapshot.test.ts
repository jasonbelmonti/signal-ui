import { describe, expect, test } from "bun:test";

import { syncGhostSnapshotLayers } from "./snapshot.js";

describe("syncGhostSnapshotLayers", () => {
  test("reclones each source node for every ghost layer", () => {
    const alphaNode = {} as Node;
    const betaNode = {} as Node;
    const sourceNodes = [alphaNode, betaNode];
    const nodeLabels = new Map<Node, string>([
      [alphaNode, "alpha"],
      [betaNode, "beta"],
    ]);
    const cloneCalls: Node[] = [];
    const targetReceipts: Node[][] = [];
    const targetElements = [
      {
        replaceChildren: (...nodes: Node[]) => {
          targetReceipts.push(nodes);
        },
      },
      {
        replaceChildren: (...nodes: Node[]) => {
          targetReceipts.push(nodes);
        },
      },
    ] as HTMLDivElement[];

    syncGhostSnapshotLayers(
      { childNodes: sourceNodes as unknown as NodeListOf<ChildNode> },
      targetElements,
      (sourceNode) => {
        cloneCalls.push(sourceNode);

        return {
          sourceNode,
          cloneId: `${nodeLabels.get(sourceNode) ?? "unknown"}-${cloneCalls.length}`,
        } as unknown as Node;
      },
    );

    expect(cloneCalls).toEqual([alphaNode, betaNode, alphaNode, betaNode]);
    expect(targetReceipts).toHaveLength(2);
    expect(targetReceipts[0]).toHaveLength(2);
    expect(targetReceipts[1]).toHaveLength(2);
    expect(targetReceipts[0]?.[0]).not.toBe(targetReceipts[1]?.[0]);
    expect(targetReceipts[0]?.[1]).not.toBe(targetReceipts[1]?.[1]);
  });
});
