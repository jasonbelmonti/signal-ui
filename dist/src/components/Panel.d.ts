import type { CardProps } from "antd";
export type PanelCutCorner = "accent" | "notch";
export type PanelCutCornerPreset = "tactical" | "architectural";
export type PanelCutCornerPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export interface PanelProps extends CardProps {
    cutCornerPreset?: PanelCutCornerPreset;
    cutCorner?: PanelCutCorner;
    cutCornerPlacement?: PanelCutCornerPlacement;
    cutCornerSize?: number | string;
    cutCornerColor?: string;
}
export declare const panelCutCornerPresets: {
    tactical: {
        cutCorner: "accent";
        cutCornerColor: string;
        cutCornerPlacement: "top-right";
        cutCornerSize: number;
    };
    architectural: {
        cutCorner: "notch";
        cutCornerColor: string;
        cutCornerPlacement: "bottom-left";
        cutCornerSize: number;
    };
};
export declare function Panel({ className, cutCorner, cutCornerColor, cutCornerPreset, cutCornerPlacement, cutCornerSize, style, ...cardProps }: PanelProps): import("react/jsx-runtime").JSX.Element;
