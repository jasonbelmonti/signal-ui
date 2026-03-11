import { Canvas, useFrame } from "@react-three/fiber";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { useMemo, useRef } from "react";
import { AdditiveBlending, Color, MathUtils, Quaternion, Vector3 } from "three";
import type { Group, Mesh, MeshBasicMaterial } from "three";

import { darkenHexColor, mixHexColors } from "../theme/colorUtils.js";
import { useSignalRuntimePalette } from "../theme/useSignalRuntimePalette.js";

export type SignalWireframeTone = "primary" | "violet";

type SignalWireframeStyle = CSSProperties &
  Record<`--signal-ui-signal-wireframe-${string}`, string | number>;

type SignalWireframeBaseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "aria-hidden" | "aria-label" | "children" | "role" | "style"
> & {
  animated?: boolean;
  detail?: string;
  height?: number;
  showLegend?: boolean;
  style?: SignalWireframeStyle;
  title?: string;
  tone?: SignalWireframeTone;
};

type SignalWireframeDecorativeProps = SignalWireframeBaseProps & {
  label?: never;
  usage?: "decorative";
};

type SignalWireframeGraphicProps = SignalWireframeBaseProps & {
  label: string;
  usage: "graphic";
};

export type SignalWireframeProps =
  | SignalWireframeDecorativeProps
  | SignalWireframeGraphicProps;

type GridCoordinate = readonly [column: number, row: number, depth: number];

type LatticeData = {
  baseEdgePositions: Float32Array;
  nodes: Vector3[];
  surfaceNodeIndexes: Set<number>;
  tracePaths: Vector3[][];
};

type PathData = {
  segments: PathSegment[];
  totalLength: number;
};

type PathSegment = {
  end: Vector3;
  length: number;
  start: Vector3;
};

type TrailPiece = {
  end: Vector3;
  length: number;
  start: Vector3;
};

type TraceBeamProps = {
  animated: boolean;
  color: string;
  offset: number;
  path: Vector3[];
  speed: number;
  tailColor: string;
};

const signalTraceCoordinates: GridCoordinate[][] = [
  [
    [0, 0, 0],
    [1, 0, 0],
    [2, 0, 0],
    [3, 0, 0],
    [3, 1, 0],
    [2, 1, 0],
    [1, 1, 0],
    [1, 1, 1],
    [1, 2, 1],
    [2, 2, 1],
    [3, 2, 1],
    [3, 2, 2],
  ],
  [
    [0, 2, 2],
    [1, 2, 2],
    [1, 1, 2],
    [2, 1, 2],
    [2, 1, 1],
    [3, 1, 1],
    [3, 0, 1],
    [3, 0, 0],
  ],
  [
    [0, 0, 2],
    [0, 1, 2],
    [0, 2, 2],
    [1, 2, 2],
    [1, 2, 1],
    [2, 2, 1],
    [2, 1, 1],
    [2, 1, 0],
    [3, 1, 0],
    [3, 2, 0],
  ],
];

const latticeData = createLatticeData();
const toneClassName: Record<SignalWireframeTone, string | undefined> = {
  primary: undefined,
  violet: "signal-ui-signal-wireframe--violet",
};
const upAxis = new Vector3(0, 1, 0);

export function SignalWireframe({
  animated = true,
  className,
  detail = "orthogonal beam lattice",
  height = 420,
  label,
  showLegend = true,
  style,
  title = "wire trace field",
  tone = "primary",
  usage = "decorative",
  ...props
}: SignalWireframeProps) {
  const rootClassName = ["signal-ui-signal-wireframe", toneClassName[tone], className]
    .filter(Boolean)
    .join(" ");
  const rootStyle: SignalWireframeStyle = {
    "--signal-ui-signal-wireframe-height": `${height}px`,
    ...style,
  };
  const accessibilityProps =
    usage === "graphic"
      ? {
          "aria-label": label,
          role: "img" as const,
        }
      : {
          "aria-hidden": true,
        };

  return (
    <div className={rootClassName} style={rootStyle} {...accessibilityProps} {...props}>
      <div aria-hidden="true" className="signal-ui-signal-wireframe__viewport">
        <Canvas
          camera={{ fov: 34, position: [0, 0.4, 10.25] }}
          dpr={[1, 2]}
          frameloop={animated ? "always" : "demand"}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          style={{ width: "100%", height: "100%" }}
        >
          <SignalWireframeScene animated={animated} tone={tone} />
        </Canvas>
      </div>

      {showLegend ? (
        <div className="signal-ui-signal-wireframe__legend">
          <span className="signal-ui-signal-wireframe__label">{title}</span>
          <span className="signal-ui-signal-wireframe__detail">
            {detail}
            <span aria-hidden="true" className="signal-ui-signal-wireframe__cursor" />
          </span>
        </div>
      ) : null}
    </div>
  );
}

function SignalWireframeScene({
  animated,
  tone,
}: {
  animated: boolean;
  tone: SignalWireframeTone;
}) {
  const sceneRef = useRef<Group | null>(null);
  const runtimePalette = useSignalRuntimePalette();
  const toneColors = useMemo(() => {
    if (tone === "violet") {
      return {
        accent: runtimePalette.accentViolet,
        base: darkenHexColor(runtimePalette.accentViolet, 0.32),
        node: mixHexColors(runtimePalette.text, runtimePalette.accentViolet, 0.18),
        tail: darkenHexColor(runtimePalette.accentViolet, 0.18),
      };
    }

    return {
      accent: runtimePalette.primary,
      base: runtimePalette.primaryDeep,
      node: mixHexColors(runtimePalette.text, runtimePalette.primary, 0.16),
      tail: mixHexColors(runtimePalette.primary, runtimePalette.primaryDeep, 0.5),
    };
  }, [
    runtimePalette.accentViolet,
    runtimePalette.primary,
    runtimePalette.primaryDeep,
    runtimePalette.text,
    tone,
  ]);

  useFrame(({ clock }) => {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    const drift = animated ? clock.getElapsedTime() : 2.4;
    scene.rotation.x = -0.55 + Math.sin(drift * 0.25) * 0.04;
    scene.rotation.y = -0.76 + Math.cos(drift * 0.18) * 0.08 + drift * (animated ? 0.1 : 0);
    scene.rotation.z = -0.2 + Math.sin(drift * 0.16) * 0.025;
    scene.position.y = 0.22 + Math.sin(drift * 0.3) * 0.1;
  });

  return (
    <group>
      <group ref={sceneRef} position={[0, 0.15, 0]}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              args={[latticeData.baseEdgePositions, 3]}
              attach="attributes-position"
              count={latticeData.baseEdgePositions.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={toneColors.base} opacity={0.34} transparent />
        </lineSegments>

        {latticeData.nodes.map((node, index) => {
          const isSurface = latticeData.surfaceNodeIndexes.has(index);

          return (
            <mesh key={index} position={node}>
              <boxGeometry args={isSurface ? [0.16, 0.16, 0.16] : [0.12, 0.12, 0.12]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color={isSurface ? toneColors.node : toneColors.base}
                depthWrite={false}
                opacity={isSurface ? 0.9 : 0.45}
                toneMapped={false}
                transparent
              />
            </mesh>
          );
        })}

        <TraceBeam
          animated={animated}
          color={toneColors.accent}
          offset={0}
          path={latticeData.tracePaths[0]!}
          speed={1.08}
          tailColor={toneColors.tail}
        />
        <TraceBeam
          animated={animated}
          color={toneColors.node}
          offset={0.31}
          path={latticeData.tracePaths[1]!}
          speed={0.94}
          tailColor={toneColors.accent}
        />
        <TraceBeam
          animated={animated}
          color={toneColors.accent}
          offset={0.64}
          path={latticeData.tracePaths[2]!}
          speed={0.86}
          tailColor={toneColors.tail}
        />
      </group>
    </group>
  );
}

function TraceBeam({ animated, color, offset, path, speed, tailColor }: TraceBeamProps) {
  const coreHeadRef = useRef<Mesh | null>(null);
  const glowHeadRef = useRef<Mesh | null>(null);
  const segmentRefs = useRef<Array<Mesh | null>>([]);
  const pathData = useMemo(() => createPathData(path), [path]);
  const segmentQuaternion = useMemo(() => new Quaternion(), []);
  const segmentDirection = useMemo(() => new Vector3(), []);
  const segmentMidpoint = useMemo(() => new Vector3(), []);
  const headPosition = useMemo(() => new Vector3(), []);
  const beamColor = useMemo(() => new Color(color), [color]);
  const tailBeamColor = useMemo(() => new Color(tailColor), [tailColor]);

  useFrame(({ clock }) => {
    const coreHead = coreHeadRef.current;
    const glowHead = glowHeadRef.current;

    if (!coreHead || !glowHead) {
      return;
    }

    const drift = animated ? clock.getElapsedTime() : 1.95 + offset * 2.3;
    const activeDistance = (drift * speed * 4.2 + offset * pathData.totalLength) % pathData.totalLength;
    const trailStart = Math.max(0, activeDistance - 4.8);
    const pieces = extractTrailPieces(pathData, trailStart, activeDistance);

    segmentRefs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const piece = pieces[index];

      if (!piece || piece.length <= 0.001) {
        mesh.visible = false;
        return;
      }

      mesh.visible = true;
      segmentMidpoint.copy(piece.start).add(piece.end).multiplyScalar(0.5);
      segmentDirection.copy(piece.end).sub(piece.start);
      segmentQuaternion.setFromUnitVectors(upAxis, segmentDirection.normalize());
      mesh.position.copy(segmentMidpoint);
      mesh.quaternion.copy(segmentQuaternion);
      mesh.scale.set(1, piece.length, 1);

      const material = mesh.material as MeshBasicMaterial;
      const beamMix = index / Math.max(1, pieces.length - 1);
      material.color.copy(tailBeamColor).lerp(beamColor, 1 - beamMix * 0.75);
      material.opacity = MathUtils.lerp(0.16, 0.74, 1 - beamMix);
    });

    headPosition.copy(samplePointAlongPath(pathData, activeDistance));
    coreHead.position.copy(headPosition);
    glowHead.position.copy(headPosition);

    const pulse = animated
      ? 0.88 + Math.sin(clock.getElapsedTime() * 8.5 + offset * Math.PI * 2) * 0.12
      : 0.92;
    coreHead.scale.setScalar(pulse);
    glowHead.scale.setScalar(1.1 + pulse * 0.8);

    const coreMaterial = coreHead.material as MeshBasicMaterial;
    const glowMaterial = glowHead.material as MeshBasicMaterial;
    coreMaterial.opacity = 0.95;
    glowMaterial.opacity = animated
      ? 0.22 + Math.sin(clock.getElapsedTime() * 7.6 + offset) * 0.08
      : 0.2;
  });

  return (
    <group>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh: Mesh | null) => {
            segmentRefs.current[index] = mesh;
          }}
        >
          <cylinderGeometry args={[0.06, 0.06, 1, 10, 1, true]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={color}
            depthWrite={false}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}

      <mesh ref={glowHeadRef}>
        <sphereGeometry args={[0.28, 18, 18]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </mesh>

      <mesh ref={coreHeadRef}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

function createLatticeData(): LatticeData {
  const columns = 4;
  const rows = 3;
  const depth = 3;
  const xStep = 1.62;
  const yStep = 1.26;
  const zStep = 1.58;
  const xCenter = (columns - 1) / 2;
  const yCenter = (rows - 1) / 2;
  const zCenter = (depth - 1) / 2;
  const nodes: Vector3[] = [];
  const surfaceNodeIndexes = new Set<number>();
  const edgePositions: number[] = [];
  const nodeLookup = new Map<string, Vector3>();

  for (let z = 0; z < depth; z += 1) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const node = new Vector3(
          (x - xCenter) * xStep,
          (yCenter - y) * yStep,
          (zCenter - z) * zStep,
        );
        const index = nodes.push(node) - 1;

        if (
          x === 0 ||
          x === columns - 1 ||
          y === 0 ||
          y === rows - 1 ||
          z === 0 ||
          z === depth - 1
        ) {
          surfaceNodeIndexes.add(index);
        }

        nodeLookup.set(getNodeKey([x, y, z]), node);
      }
    }
  }

  const connectNodePair = (start: GridCoordinate, end: GridCoordinate) => {
    const startNode = nodeLookup.get(getNodeKey(start));
    const endNode = nodeLookup.get(getNodeKey(end));

    if (!startNode || !endNode) {
      return;
    }

    edgePositions.push(
      startNode.x,
      startNode.y,
      startNode.z,
      endNode.x,
      endNode.y,
      endNode.z,
    );
  };

  for (let z = 0; z < depth; z += 1) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        if (x < columns - 1) {
          connectNodePair([x, y, z], [x + 1, y, z]);
        }

        if (y < rows - 1) {
          connectNodePair([x, y, z], [x, y + 1, z]);
        }

        if (z < depth - 1) {
          connectNodePair([x, y, z], [x, y, z + 1]);
        }
      }
    }
  }

  const diagonalConnections: Array<readonly [GridCoordinate, GridCoordinate]> = [
    [[0, 0, 0], [1, 1, 0]],
    [[2, 0, 0], [3, 1, 0]],
    [[0, 1, 1], [1, 2, 1]],
    [[2, 1, 1], [3, 2, 1]],
    [[0, 0, 2], [1, 1, 2]],
    [[2, 0, 2], [3, 1, 2]],
  ];

  diagonalConnections.forEach(([start, end]) => {
    connectNodePair(start, end);
  });

  const tracePaths = signalTraceCoordinates.map((path) =>
    path
      .map((coordinate) => nodeLookup.get(getNodeKey(coordinate)))
      .filter((point): point is Vector3 => Boolean(point))
      .map((point) => point.clone()),
  );

  return {
    baseEdgePositions: new Float32Array(edgePositions),
    nodes,
    surfaceNodeIndexes,
    tracePaths,
  };
}

function createPathData(path: Vector3[]): PathData {
  const segments: PathSegment[] = [];

  for (let index = 1; index < path.length; index += 1) {
    const start = path[index - 1];
    const end = path[index];

    if (!start || !end) {
      continue;
    }

    segments.push({
      end,
      length: start.distanceTo(end),
      start,
    });
  }

  return {
    segments,
    totalLength: segments.reduce((total, segment) => total + segment.length, 0),
  };
}

function samplePointAlongPath(pathData: PathData, distance: number) {
  const clampedDistance = MathUtils.clamp(distance, 0, pathData.totalLength);
  let traversed = 0;

  for (const segment of pathData.segments) {
    const segmentEnd = traversed + segment.length;

    if (clampedDistance <= segmentEnd) {
      const progress = segment.length === 0 ? 0 : (clampedDistance - traversed) / segment.length;

      return segment.start.clone().lerp(segment.end, progress);
    }

    traversed = segmentEnd;
  }

  return pathData.segments[pathData.segments.length - 1]?.end.clone() ?? new Vector3();
}

function extractTrailPieces(pathData: PathData, startDistance: number, endDistance: number) {
  const trailPieces: TrailPiece[] = [];
  let traversed = 0;

  for (const segment of pathData.segments) {
    const segmentStart = traversed;
    const segmentEnd = traversed + segment.length;
    const overlapStart = Math.max(startDistance, segmentStart);
    const overlapEnd = Math.min(endDistance, segmentEnd);

    if (overlapEnd > overlapStart && segment.length > 0) {
      const startProgress = (overlapStart - segmentStart) / segment.length;
      const endProgress = (overlapEnd - segmentStart) / segment.length;
      const start = segment.start.clone().lerp(segment.end, startProgress);
      const end = segment.start.clone().lerp(segment.end, endProgress);

      trailPieces.push({
        end,
        length: start.distanceTo(end),
        start,
      });
    }

    traversed = segmentEnd;
  }

  return trailPieces.reverse();
}

function getNodeKey([column, row, depth]: GridCoordinate) {
  return `${column}:${row}:${depth}`;
}
