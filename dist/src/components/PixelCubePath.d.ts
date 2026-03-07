import type { ComponentPropsWithoutRef, CSSProperties } from "react";
export type PixelCubePathTone = "primary" | "violet";
type PathStyle = CSSProperties & Record<`--marathon-cube-path-${string}`, string | number>;
type PixelCubePathBaseProps = Omit<ComponentPropsWithoutRef<"div">, "aria-hidden" | "aria-label" | "aria-live" | "children" | "role" | "style"> & {
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
export declare function PixelCubePath({ className, label, size, style, tone, usage, ...props }: PixelCubePathProps): import("react/jsx-runtime").JSX.Element;
export {};
