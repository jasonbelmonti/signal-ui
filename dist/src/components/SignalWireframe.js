import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, Color, MathUtils, Quaternion, Vector3 } from "three";
import { marathonDosPalette } from "../theme/marathonDosTheme.js";
const signalTraceCoordinates = [
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
const toneClassName = {
    primary: undefined,
    violet: "marathon-signal-wireframe--violet",
};
const upAxis = new Vector3(0, 1, 0);
export function SignalWireframe({ animated = true, className, detail = "orthogonal beam lattice", height = 420, label, showLegend = true, style, title = "wire trace field", tone = "primary", usage = "decorative", ...props }) {
    const rootClassName = ["marathon-signal-wireframe", toneClassName[tone], className]
        .filter(Boolean)
        .join(" ");
    const rootStyle = {
        "--marathon-signal-wireframe-height": `${height}px`,
        ...style,
    };
    const accessibilityProps = usage === "graphic"
        ? {
            "aria-label": label,
            role: "img",
        }
        : {
            "aria-hidden": true,
        };
    return (_jsxs("div", { className: rootClassName, style: rootStyle, ...accessibilityProps, ...props, children: [_jsx("div", { "aria-hidden": "true", className: "marathon-signal-wireframe__viewport", children: _jsx(Canvas, { camera: { fov: 34, position: [0, 0.4, 10.25] }, dpr: [1, 2], frameloop: animated ? "always" : "demand", gl: { alpha: true, antialias: true, powerPreference: "high-performance" }, style: { width: "100%", height: "100%" }, children: _jsx(SignalWireframeScene, { animated: animated, tone: tone }) }) }), showLegend ? (_jsxs("div", { className: "marathon-signal-wireframe__legend", children: [_jsx("span", { className: "marathon-signal-wireframe__label", children: title }), _jsxs("span", { className: "marathon-signal-wireframe__detail", children: [detail, _jsx("span", { "aria-hidden": "true", className: "marathon-signal-wireframe__cursor" })] })] })) : null] }));
}
function SignalWireframeScene({ animated, tone, }) {
    const sceneRef = useRef(null);
    const toneColors = useMemo(() => {
        if (tone === "violet") {
            return {
                accent: marathonDosPalette.accentViolet,
                base: "#6d2fd0",
                node: "#d7b8ff",
                tail: "#7d55d7",
            };
        }
        return {
            accent: marathonDosPalette.primary,
            base: marathonDosPalette.primaryDeep,
            node: "#f7ffd7",
            tail: "#8fcb1c",
        };
    }, [tone]);
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
    return (_jsx("group", { children: _jsxs("group", { ref: sceneRef, position: [0, 0.15, 0], children: [_jsxs("lineSegments", { children: [_jsx("bufferGeometry", { children: _jsx("bufferAttribute", { args: [latticeData.baseEdgePositions, 3], attach: "attributes-position", count: latticeData.baseEdgePositions.length / 3, itemSize: 3 }) }), _jsx("lineBasicMaterial", { color: toneColors.base, opacity: 0.34, transparent: true })] }), latticeData.nodes.map((node, index) => {
                    const isSurface = latticeData.surfaceNodeIndexes.has(index);
                    return (_jsxs("mesh", { position: node, children: [_jsx("boxGeometry", { args: isSurface ? [0.16, 0.16, 0.16] : [0.12, 0.12, 0.12] }), _jsx("meshBasicMaterial", { blending: AdditiveBlending, color: isSurface ? toneColors.node : toneColors.base, depthWrite: false, opacity: isSurface ? 0.9 : 0.45, toneMapped: false, transparent: true })] }, index));
                }), _jsx(TraceBeam, { animated: animated, color: toneColors.accent, offset: 0, path: latticeData.tracePaths[0], speed: 1.08, tailColor: toneColors.tail }), _jsx(TraceBeam, { animated: animated, color: toneColors.node, offset: 0.31, path: latticeData.tracePaths[1], speed: 0.94, tailColor: toneColors.accent }), _jsx(TraceBeam, { animated: animated, color: toneColors.accent, offset: 0.64, path: latticeData.tracePaths[2], speed: 0.86, tailColor: toneColors.tail })] }) }));
}
function TraceBeam({ animated, color, offset, path, speed, tailColor }) {
    const coreHeadRef = useRef(null);
    const glowHeadRef = useRef(null);
    const segmentRefs = useRef([]);
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
            const material = mesh.material;
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
        const coreMaterial = coreHead.material;
        const glowMaterial = glowHead.material;
        coreMaterial.opacity = 0.95;
        glowMaterial.opacity = animated
            ? 0.22 + Math.sin(clock.getElapsedTime() * 7.6 + offset) * 0.08
            : 0.2;
    });
    return (_jsxs("group", { children: [Array.from({ length: 7 }, (_, index) => (_jsxs("mesh", { ref: (mesh) => {
                    segmentRefs.current[index] = mesh;
                }, children: [_jsx("cylinderGeometry", { args: [0.06, 0.06, 1, 10, 1, true] }), _jsx("meshBasicMaterial", { blending: AdditiveBlending, color: color, depthWrite: false, toneMapped: false, transparent: true })] }, index))), _jsxs("mesh", { ref: glowHeadRef, children: [_jsx("sphereGeometry", { args: [0.28, 18, 18] }), _jsx("meshBasicMaterial", { blending: AdditiveBlending, color: color, depthWrite: false, toneMapped: false, transparent: true })] }), _jsxs("mesh", { ref: coreHeadRef, children: [_jsx("sphereGeometry", { args: [0.11, 16, 16] }), _jsx("meshBasicMaterial", { blending: AdditiveBlending, color: color, depthWrite: false, toneMapped: false, transparent: true })] })] }));
}
function createLatticeData() {
    const columns = 4;
    const rows = 3;
    const depth = 3;
    const xStep = 1.62;
    const yStep = 1.26;
    const zStep = 1.58;
    const xCenter = (columns - 1) / 2;
    const yCenter = (rows - 1) / 2;
    const zCenter = (depth - 1) / 2;
    const nodes = [];
    const surfaceNodeIndexes = new Set();
    const edgePositions = [];
    const nodeLookup = new Map();
    for (let z = 0; z < depth; z += 1) {
        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < columns; x += 1) {
                const node = new Vector3((x - xCenter) * xStep, (yCenter - y) * yStep, (zCenter - z) * zStep);
                const index = nodes.push(node) - 1;
                if (x === 0 ||
                    x === columns - 1 ||
                    y === 0 ||
                    y === rows - 1 ||
                    z === 0 ||
                    z === depth - 1) {
                    surfaceNodeIndexes.add(index);
                }
                nodeLookup.set(getNodeKey([x, y, z]), node);
            }
        }
    }
    const connectNodePair = (start, end) => {
        const startNode = nodeLookup.get(getNodeKey(start));
        const endNode = nodeLookup.get(getNodeKey(end));
        if (!startNode || !endNode) {
            return;
        }
        edgePositions.push(startNode.x, startNode.y, startNode.z, endNode.x, endNode.y, endNode.z);
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
    const diagonalConnections = [
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
    const tracePaths = signalTraceCoordinates.map((path) => path
        .map((coordinate) => nodeLookup.get(getNodeKey(coordinate)))
        .filter((point) => Boolean(point))
        .map((point) => point.clone()));
    return {
        baseEdgePositions: new Float32Array(edgePositions),
        nodes,
        surfaceNodeIndexes,
        tracePaths,
    };
}
function createPathData(path) {
    const segments = [];
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
function samplePointAlongPath(pathData, distance) {
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
function extractTrailPieces(pathData, startDistance, endDistance) {
    const trailPieces = [];
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
function getNodeKey([column, row, depth]) {
    return `${column}:${row}:${depth}`;
}
