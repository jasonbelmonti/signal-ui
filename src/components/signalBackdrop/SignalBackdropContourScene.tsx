import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, Color, DynamicDrawUsage, MathUtils } from "three";
import type { BufferAttribute, Group, LineBasicMaterial, PointsMaterial } from "three";

import { signalPalette } from "../../theme/signalTheme.js";
import {
  createContourFieldLayout,
  NO_TELEMETRY_NEIGHBOR,
  TELEMETRY_NEIGHBOR_COUNT,
} from "./layout.js";
import { clamp01, sampleFbm } from "./noise.js";
import type {
  SignalBackdropDensity,
  SignalBackdropFocusPoint,
  SignalBackdropTelemetry,
  SignalBackdropTone,
} from "./types.js";

interface SignalBackdropContourSceneProps {
  animated: boolean;
  density: SignalBackdropDensity;
  focusPoint?: SignalBackdropFocusPoint;
  seed?: number | string;
  telemetry?: SignalBackdropTelemetry;
  tone: SignalBackdropTone;
}

type SceneToneColors = {
  alert: Color;
  line: Color;
  point: Color;
  pointAlert: Color;
  pointBright: Color;
  sweep: Color;
  sweepSecondary: Color;
};

type ContourSampleContext = {
  activity: number;
  alert: number;
  depth: number;
  focusPenalty: number;
  focusRadiusSq: number;
  focusWorldX: number;
  focusWorldZ: number;
  seed: number;
  time: number;
  width: number;
};

const FRAME_INTERVAL_SECONDS = 1 / 24;

export function SignalBackdropContourScene({
  animated,
  density,
  focusPoint,
  seed,
  telemetry,
  tone,
}: SignalBackdropContourSceneProps) {
  const fieldRef = useRef<Group | null>(null);
  const lineMaterialRef = useRef<LineBasicMaterial | null>(null);
  const pointMaterialRef = useRef<PointsMaterial | null>(null);
  const sweepMaterialRefs = useRef<Array<LineBasicMaterial | null>>([]);
  const lineAttributeRef = useRef<BufferAttribute | null>(null);
  const pointPositionAttributeRef = useRef<BufferAttribute | null>(null);
  const pointColorAttributeRef = useRef<BufferAttribute | null>(null);
  const sweepAttributeRefs = useRef<Array<BufferAttribute | null>>([]);
  const layout = useMemo(() => createContourFieldLayout(density, seed), [density, seed]);
  const surfaceHeights = useMemo(() => new Float32Array(layout.nodes.length), [layout.nodes.length]);
  const linePositions = useMemo(
    () => new Float32Array(layout.segmentIndices.length * 3),
    [layout.segmentIndices.length],
  );
  const pointPositions = useMemo(
    () => new Float32Array(layout.telemetryPoints.length * 3),
    [layout.telemetryPoints.length],
  );
  const pointColors = useMemo(
    () => new Float32Array(layout.telemetryPoints.length * 3),
    [layout.telemetryPoints.length],
  );
  const sweepPositions = useMemo(
    () =>
      layout.sweeps.map(() => {
        return new Float32Array((layout.columns - 1) * 6);
      }),
    [layout.columns, layout.sweeps],
  );
  const colors = useMemo(() => resolveToneColors(tone), [tone]);
  const pointColorScratch = useMemo(() => new Color(), []);
  const lineColorScratch = useMemo(() => new Color(), []);
  const sweepColorScratch = useMemo(() => new Color(), []);
  const lastFrameTimeRef = useRef(Number.NEGATIVE_INFINITY);

  useFrame(({ clock }) => {
    const field = fieldRef.current;
    const lineAttribute = lineAttributeRef.current;
    const pointPositionAttribute = pointPositionAttributeRef.current;
    const pointColorAttribute = pointColorAttributeRef.current;

    if (!field || !lineAttribute || !pointPositionAttribute || !pointColorAttribute) {
      return;
    }

    const elapsedTime = animated ? clock.getElapsedTime() : 3.2;

    if (animated && elapsedTime - lastFrameTimeRef.current < FRAME_INTERVAL_SECONDS) {
      return;
    }

    lastFrameTimeRef.current = elapsedTime;

    const activity = clamp01(telemetry?.activity ?? 0.34);
    const alert = clamp01(telemetry?.alert ?? 0.08);
    const focus = clamp01(telemetry?.focus ?? 0.42);
    const drift = elapsedTime;
    const motionScale = animated ? 0.5 : 0;
    const autoFocusX = 0.5 + Math.sin(drift * 0.065) * 0.14 * motionScale;
    const autoFocusY = 0.48 + Math.cos(drift * 0.058 + 0.7) * 0.11 * motionScale;
    const resolvedFocusX = clamp01(focusPoint?.x ?? autoFocusX);
    const resolvedFocusY = clamp01(focusPoint?.y ?? autoFocusY);
    const focusStrength = clamp01(focusPoint?.strength ?? 0.72);
    const focusRadius = MathUtils.lerp(2.6, 6.4, clamp01(focusPoint?.radius ?? 0.2));
    const focusWorldX = (resolvedFocusX - 0.5) * layout.width * 0.92;
    const focusWorldZ = (resolvedFocusY - 0.5) * layout.depth * 0.92;
    const flockPulse = sampleFlockPulse((drift * 0.03 + ((layout.seed >>> 3) & 1023) / 1024) % 1, 0.15);
    const flockPulseSecondary = sampleFlockPulse(
      (drift * 0.024 + 0.37 + ((layout.seed >>> 11) & 1023) / 1024) % 1,
      0.11,
    );
    const flockCenterX = Math.sin(drift * 0.12 + 0.6) * layout.width * 0.24;
    const flockCenterZ = Math.cos(drift * 0.1 - 0.4) * layout.depth * 0.18;
    const flockDirectionX = Math.cos(drift * 0.28 + 0.2);
    const flockDirectionZ = Math.sin(drift * 0.25 - 0.3);
    const flockCenterSecondaryX = Math.cos(drift * 0.08 + 1.7) * layout.width * 0.29;
    const flockCenterSecondaryZ = Math.sin(drift * 0.09 + 0.9) * layout.depth * 0.22;
    const focusRadiusSq = Math.max(1, focusRadius * focusRadius);
    const focusGlowRadiusSq = focusRadiusSq * 1.45;
    const contourSampleContext: ContourSampleContext = {
      activity,
      alert,
      depth: layout.depth,
      focusPenalty: focusStrength * (0.16 + focus * 0.26),
      focusRadiusSq,
      focusWorldX,
      focusWorldZ,
      seed: layout.seed,
      time: drift,
      width: layout.width,
    };

    for (let index = 0; index < layout.nodes.length; index += 1) {
      const node = layout.nodes[index];

      if (!node) {
        continue;
      }

      surfaceHeights[index] = sampleContourHeight(node.x, node.z, contourSampleContext);
    }

    let linePointer = 0;

    for (let segmentIndex = 0; segmentIndex < layout.segmentIndices.length; segmentIndex += 1) {
      const nodeIndex = layout.segmentIndices[segmentIndex] ?? 0;
      const node = layout.nodes[nodeIndex];

      if (!node) {
        continue;
      }

      linePositions[linePointer] = node.x;
      linePositions[linePointer + 1] = surfaceHeights[nodeIndex] ?? 0;
      linePositions[linePointer + 2] = node.z;
      linePointer += 3;
    }

    lineAttribute.needsUpdate = true;

    let telemetryPointer = 0;
    let telemetryColorPointer = 0;

    for (let pointIndex = 0; pointIndex < layout.telemetryPoints.length; pointIndex += 1) {
      const point = layout.telemetryPoints[pointIndex];

      if (!point) {
        continue;
      }

      const baseHeight = sampleContourHeight(point.x, point.z, contourSampleContext);
      const ambientLift =
        point.altitude +
        Math.sin(drift * (0.36 + point.drift) + point.phase) *
          (0.18 + activity * 0.24) *
          motionScale +
        sampleFbm(
          point.x * 0.16 + drift * 0.16,
          point.z * 0.14 - drift * 0.11,
          layout.seed ^ 0x85ebca6b,
          2,
        ) *
          0.34 *
          (0.55 + motionScale * 0.45);
      const driftX =
        Math.sin(drift * point.drift + point.phase) * (0.1 + point.spread * 0.08) * motionScale;
      const driftZ =
        Math.cos(drift * (point.drift + 0.07) + point.phase) *
        (0.08 + point.spread * 0.06) *
        motionScale;
      const focusOffsetX = point.x - focusWorldX;
      const focusOffsetZ = point.z - focusWorldZ;
      const focusDistanceSq = focusOffsetX * focusOffsetX + focusOffsetZ * focusOffsetZ;
      const focusGlow = Math.exp(-(focusDistanceSq / focusGlowRadiusSq));
      const flockOffsetFromCenterX = point.x - flockCenterX;
      const flockOffsetFromCenterZ = point.z - flockCenterZ;
      const flockDistanceSq =
        flockOffsetFromCenterX * flockOffsetFromCenterX +
        flockOffsetFromCenterZ * flockOffsetFromCenterZ;
      const flockSecondaryOffsetX = point.x - flockCenterSecondaryX;
      const flockSecondaryOffsetZ = point.z - flockCenterSecondaryZ;
      const flockDistanceSecondarySq =
        flockSecondaryOffsetX * flockSecondaryOffsetX +
        flockSecondaryOffsetZ * flockSecondaryOffsetZ;
      const flockInfluence =
        flockPulse *
          Math.exp(-(flockDistanceSq / Math.max(1, (4.8 + point.spread) ** 2))) *
          clamp01(point.flockBias * 1.18) +
        flockPulseSecondary *
          Math.exp(-(flockDistanceSecondarySq / Math.max(1, (4.2 + point.spread * 0.8) ** 2))) *
          clamp01((1 - point.flockBias) * 1.12);
      const schoolHeading =
        drift * (0.22 + point.drift * 0.34) +
        point.flockPhase +
        Math.sin(drift * 0.1 + point.phase) * 0.18;
      let cohesionOffsetX = 0;
      let cohesionOffsetZ = 0;
      let alignmentX = 0;
      let alignmentZ = 0;
      let separationX = 0;
      let separationZ = 0;
      let neighborCount = 0;

      for (let neighborOffset = 0; neighborOffset < TELEMETRY_NEIGHBOR_COUNT; neighborOffset += 1) {
        const neighborIndex =
          layout.telemetryNeighborIndices[pointIndex * TELEMETRY_NEIGHBOR_COUNT + neighborOffset] ??
          NO_TELEMETRY_NEIGHBOR;

        if (neighborIndex === NO_TELEMETRY_NEIGHBOR) {
          continue;
        }

        const neighbor = layout.telemetryPoints[neighborIndex];

        if (!neighbor) {
          continue;
        }

        cohesionOffsetX += neighbor.x - point.x;
        cohesionOffsetZ += neighbor.z - point.z;

        const neighborHeading =
          drift * (0.22 + neighbor.drift * 0.34) +
          neighbor.flockPhase +
          Math.sin(drift * 0.1 + neighbor.phase) * 0.18;

        alignmentX += Math.cos(neighborHeading);
        alignmentZ += Math.sin(neighborHeading);

        const separationOffsetX = point.x - neighbor.x;
        const separationOffsetZ = point.z - neighbor.z;
        const separationDistanceSq =
          separationOffsetX * separationOffsetX + separationOffsetZ * separationOffsetZ;
        const separationWeight = 1 / (1 + separationDistanceSq * 1.35);

        separationX += separationOffsetX * separationWeight;
        separationZ += separationOffsetZ * separationWeight;
        neighborCount += 1;
      }

      let alignmentDirectionX = Math.cos(schoolHeading);
      let alignmentDirectionZ = Math.sin(schoolHeading);
      let cohesionDirectionX = 0;
      let cohesionDirectionZ = 0;

      if (neighborCount > 0) {
        const inverseNeighborCount = 1 / neighborCount;
        cohesionOffsetX *= inverseNeighborCount;
        cohesionOffsetZ *= inverseNeighborCount;

        const cohesionLength = Math.hypot(cohesionOffsetX, cohesionOffsetZ);

        if (cohesionLength > 0.001) {
          cohesionDirectionX = cohesionOffsetX / cohesionLength;
          cohesionDirectionZ = cohesionOffsetZ / cohesionLength;
        }

        alignmentX *= inverseNeighborCount;
        alignmentZ *= inverseNeighborCount;

        const alignmentLength = Math.hypot(alignmentX, alignmentZ);

        if (alignmentLength > 0.001) {
          alignmentDirectionX = alignmentX / alignmentLength;
          alignmentDirectionZ = alignmentZ / alignmentLength;
        }
      }

      const schoolingStrength = motionScale * (0.03 + flockInfluence * 0.34);
      const selfCurrentX = Math.cos(schoolHeading) * schoolingStrength * (0.24 + point.spread * 0.07);
      const selfCurrentZ = Math.sin(schoolHeading) * schoolingStrength * (0.22 + point.spread * 0.06);
      const cohesionPullX =
        cohesionDirectionX * schoolingStrength * (0.22 + point.flockBias * 0.12);
      const cohesionPullZ =
        cohesionDirectionZ * schoolingStrength * (0.2 + point.flockBias * 0.12);
      const alignmentPullX = alignmentDirectionX * schoolingStrength * 0.28;
      const alignmentPullZ = alignmentDirectionZ * schoolingStrength * 0.24;
      const separationPullX = separationX * schoolingStrength * 0.16;
      const separationPullZ = separationZ * schoolingStrength * 0.16;
      const flockOffsetX =
        flockDirectionX * flockInfluence * (0.18 + point.spread * 0.12) * motionScale +
        selfCurrentX +
        alignmentPullX +
        cohesionPullX +
        separationPullX;
      const flockOffsetZ =
        flockDirectionZ * flockInfluence * (0.16 + point.spread * 0.1) * motionScale +
        selfCurrentZ +
        alignmentPullZ +
        cohesionPullZ +
        separationPullZ;
      const flockLift =
        flockInfluence * (0.22 + point.spread * 0.14) * motionScale + schoolingStrength * 0.28;
      const depthLift = Math.pow(1 - point.depthMix, 1.1) * 0.62;
      const brightnessMix = clamp01(
        focusGlow * 0.18 + flockInfluence * 0.36 + schoolingStrength * 0.9 + alert * point.alertBias,
      );

      pointPositions[telemetryPointer] = point.x + driftX + flockOffsetX;
      pointPositions[telemetryPointer + 1] = baseHeight + ambientLift + depthLift + flockLift;
      pointPositions[telemetryPointer + 2] = point.z + driftZ + flockOffsetZ;
      telemetryPointer += 3;

      pointColorScratch
        .copy(colors.point)
        .lerp(colors.pointBright, brightnessMix)
        .lerp(colors.pointAlert, alert * point.alertBias * 0.45);
      pointColors[telemetryColorPointer] = pointColorScratch.r;
      pointColors[telemetryColorPointer + 1] = pointColorScratch.g;
      pointColors[telemetryColorPointer + 2] = pointColorScratch.b;
      telemetryColorPointer += 3;
    }

    pointPositionAttribute.needsUpdate = true;
    pointColorAttribute.needsUpdate = true;

    layout.sweeps.forEach((sweep, index) => {
      const sweepAttribute = sweepAttributeRefs.current[index];

      if (!sweepAttribute) {
        return;
      }

      const sweepCycle = (drift * sweep.speed + sweep.offset) % 1;
      const sweepZ = (sweepCycle - 0.5) * layout.depth * 1.2;
      const positionArray = sweepPositions[index];

      if (!positionArray) {
        return;
      }

      let sweepPointer = 0;
      let previousX = layout.columnCoordinates[0] ?? 0;
      let previousZ = sweepZ + Math.sin(drift * 0.16 + sweep.offset * Math.PI) * 0.18 * motionScale;
      let previousY =
        sampleContourHeight(previousX, previousZ, contourSampleContext) +
        0.1 +
        index * 0.03;

      for (let column = 1; column < layout.columns; column += 1) {
        const x = layout.columnCoordinates[column] ?? 0;
        const z =
          sweepZ + Math.sin(drift * 0.16 + column * 0.42 + sweep.offset * Math.PI) * 0.18 * motionScale;
        const y = sampleContourHeight(x, z, contourSampleContext) + 0.1 + index * 0.03;

        positionArray[sweepPointer] = previousX;
        positionArray[sweepPointer + 1] = previousY;
        positionArray[sweepPointer + 2] = previousZ;
        positionArray[sweepPointer + 3] = x;
        positionArray[sweepPointer + 4] = y;
        positionArray[sweepPointer + 5] = z;
        sweepPointer += 6;
        previousX = x;
        previousY = y;
        previousZ = z;
      }

      sweepAttribute.needsUpdate = true;
    });

    field.rotation.x = -0.95 + Math.sin(drift * 0.045) * 0.02 * motionScale;
    field.rotation.z = 0.08 + Math.cos(drift * 0.038) * 0.015 * motionScale;
    field.position.y = -1.14 + Math.sin(drift * 0.05) * 0.08 * motionScale;
    field.position.z = 1.24 + Math.cos(drift * 0.04) * 0.12 * motionScale;

    if (lineMaterialRef.current) {
      lineMaterialRef.current.opacity = 0.24 + activity * 0.11 + alert * 0.06;
      lineColorScratch.copy(colors.line).lerp(colors.alert, alert * 0.18);
      lineMaterialRef.current.color.copy(lineColorScratch);
    }

    if (pointMaterialRef.current) {
      const flockGlow = flockPulse * 0.08 + flockPulseSecondary * 0.05;
      pointMaterialRef.current.opacity = 0.38 + activity * 0.1 + alert * 0.08 + flockGlow;
      pointMaterialRef.current.size = 0.09 + focus * 0.024 + alert * 0.02 + flockGlow * 0.05;
    }

    sweepMaterialRefs.current.forEach((material, index) => {
      if (!material) {
        return;
      }

      const sweepColor = index % 2 === 0 ? colors.sweep : colors.sweepSecondary;
      sweepColorScratch.copy(sweepColor).lerp(colors.alert, alert * 0.25);
      material.color.copy(sweepColorScratch);
      material.opacity = (layout.sweeps[index]?.opacity ?? 0.18) + activity * 0.03 + alert * 0.05;
    });
  });

  return (
    <group>
      <group ref={fieldRef} position={[0, -1.14, 1.24]} scale={[1.04, 1.26, 1.56]}>
        <lineSegments frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute
              ref={(attribute: BufferAttribute | null) => {
                lineAttributeRef.current = attribute;
              }}
              args={[linePositions, 3]}
              attach="attributes-position"
              count={linePositions.length / 3}
              itemSize={3}
              onUpdate={(attribute) => {
                attribute.setUsage(DynamicDrawUsage);
              }}
            />
          </bufferGeometry>
          <lineBasicMaterial
            ref={lineMaterialRef}
            blending={AdditiveBlending}
            color={colors.line}
            depthWrite={false}
            opacity={0.24}
            toneMapped={false}
            transparent
          />
        </lineSegments>

        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute
              ref={(attribute: BufferAttribute | null) => {
                pointPositionAttributeRef.current = attribute;
              }}
              args={[pointPositions, 3]}
              attach="attributes-position"
              count={pointPositions.length / 3}
              itemSize={3}
              onUpdate={(attribute) => {
                attribute.setUsage(DynamicDrawUsage);
              }}
            />
            <bufferAttribute
              ref={(attribute: BufferAttribute | null) => {
                pointColorAttributeRef.current = attribute;
              }}
              args={[pointColors, 3]}
              attach="attributes-color"
              count={pointColors.length / 3}
              itemSize={3}
              onUpdate={(attribute) => {
                attribute.setUsage(DynamicDrawUsage);
              }}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={pointMaterialRef}
            blending={AdditiveBlending}
            depthWrite={false}
            opacity={0.42}
            size={0.09}
            sizeAttenuation
            toneMapped={false}
            transparent
            vertexColors
          />
        </points>

        {layout.sweeps.map((_, index) => {
          const positionArray = sweepPositions[index];

          if (!positionArray) {
            return null;
          }

          return (
            <lineSegments key={index} frustumCulled={false}>
              <bufferGeometry>
                <bufferAttribute
                  ref={(attribute: BufferAttribute | null) => {
                    sweepAttributeRefs.current[index] = attribute;
                  }}
                  args={[positionArray, 3]}
                  attach="attributes-position"
                  count={positionArray.length / 3}
                  itemSize={3}
                  onUpdate={(attribute) => {
                    attribute.setUsage(DynamicDrawUsage);
                  }}
                />
              </bufferGeometry>
              <lineBasicMaterial
                ref={(material: LineBasicMaterial | null) => {
                  sweepMaterialRefs.current[index] = material;
                }}
                blending={AdditiveBlending}
                color={index % 2 === 0 ? colors.sweep : colors.sweepSecondary}
                depthWrite={false}
                opacity={0.14}
                toneMapped={false}
                transparent
              />
            </lineSegments>
          );
        })}
      </group>
    </group>
  );
}

function resolveToneColors(tone: SignalBackdropTone): SceneToneColors {
  if (tone === "violet") {
    return {
      alert: new Color("#d88a2f"),
      line: new Color("#58309a"),
      point: new Color("#c4a4ff"),
      pointAlert: new Color("#ffd4a0"),
      pointBright: new Color("#f4eaff"),
      sweep: new Color(signalPalette.accentViolet),
      sweepSecondary: new Color("#cbb2ff"),
    };
  }

  return {
    alert: new Color(signalPalette.warning),
    line: new Color("#5f7c08"),
    point: new Color("#dfff8d"),
    pointAlert: new Color("#ffd7a6"),
    pointBright: new Color("#f8ffd8"),
    sweep: new Color(signalPalette.primary),
    sweepSecondary: new Color("#efffc2"),
  };
}

function sampleFlockPulse(cycle: number, activeWindow: number) {
  if (cycle > activeWindow) {
    return 0;
  }

  return Math.pow(Math.sin((cycle / Math.max(0.001, activeWindow)) * Math.PI), 2.1);
}

function sampleContourHeight(x: number, z: number, context: ContourSampleContext) {
  const { activity, alert, depth, focusPenalty, focusRadiusSq, focusWorldX, focusWorldZ, seed, time, width } =
    context;
  const distanceFromCenter = Math.min(
    1,
    Math.hypot(x / Math.max(1, width * 0.5), z / Math.max(1, depth * 0.5)),
  );
  const edgeGain = 0.34 + Math.pow(distanceFromCenter, 1.22) * 0.9;
  const base = sampleFbm(x * 0.082 + time * 0.06, z * 0.084 - time * 0.032, seed ^ 0x27d4eb2d);
  const undulation = sampleFbm(
    x * 0.18 - time * 0.11,
    z * 0.16 + time * 0.082,
    seed ^ 0x165667b1,
    3,
  );
  const ribbon =
    Math.sin(x * 0.28 + time * 0.16) * 0.22 + Math.cos(z * 0.24 - time * 0.12 + x * 0.05) * 0.18;
  const alertNoise =
    sampleFbm(x * 0.48 + time * 0.62, z * 0.44 - time * 0.38, seed ^ 0x85ebca6b, 2) * alert * 0.18;
  const focusOffsetX = x - focusWorldX;
  const focusOffsetZ = z - focusWorldZ;
  const pressureWell = Math.exp(-((focusOffsetX * focusOffsetX + focusOffsetZ * focusOffsetZ) / focusRadiusSq));
  const macroSwell =
    Math.sin(x * 0.11 - time * 0.085 + z * 0.038) * 0.2 +
    Math.cos(z * 0.096 + time * 0.072 - x * 0.024) * 0.16;

  return (
    (base * 0.9 + undulation * 0.5 + ribbon * 1.08 + macroSwell) *
      (0.34 + activity * 0.38) *
      edgeGain *
      1.14 +
    alertNoise -
    pressureWell * focusPenalty
  );
}
