import type { CSSProperties, HTMLAttributes } from "react";
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
export declare function PixelCubeLoader({ as, className, detail, gridSize, label, size, showLegend, style, tone, ...props }: PixelCubeLoaderProps): import("react/jsx-runtime").JSX.Element;
export {};
