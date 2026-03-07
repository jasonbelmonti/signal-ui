import type { ComponentPropsWithoutRef, CSSProperties } from "react";
export type SignalWireframeTone = "primary" | "violet";
type SignalWireframeStyle = CSSProperties & Record<`--marathon-signal-wireframe-${string}`, string | number>;
type SignalWireframeBaseProps = Omit<ComponentPropsWithoutRef<"div">, "aria-hidden" | "aria-label" | "children" | "role" | "style"> & {
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
export type SignalWireframeProps = SignalWireframeDecorativeProps | SignalWireframeGraphicProps;
export declare function SignalWireframe({ animated, className, detail, height, label, showLegend, style, title, tone, usage, ...props }: SignalWireframeProps): import("react/jsx-runtime").JSX.Element;
export {};
