import type { CSSProperties, HTMLAttributes } from "react";
type HashCubeStyle = CSSProperties & Record<`--marathon-hash-cube-${string}`, string | number>;
export type HashCubeTone = "primary" | "violet";
export type HashCubeProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "style"> & {
    detail?: string;
    hash: string;
    label?: string;
    showLegend?: boolean;
    size?: number;
    style?: HashCubeStyle;
    tone?: HashCubeTone;
};
export declare function HashCube({ className, detail, hash, label, showLegend, size, style, tone, ...props }: HashCubeProps): import("react/jsx-runtime").JSX.Element;
export {};
