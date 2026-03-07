import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from "antd";
export const panelCutCornerPresets = {
    tactical: {
        cutCorner: "accent",
        cutCornerColor: "var(--marathon-primary)",
        cutCornerPlacement: "top-right",
        cutCornerSize: 26,
    },
    architectural: {
        cutCorner: "notch",
        cutCornerColor: "var(--marathon-primary)",
        cutCornerPlacement: "bottom-left",
        cutCornerSize: 24,
    },
};
function toCssLength(value) {
    if (value === undefined) {
        return undefined;
    }
    return typeof value === "number" ? `${value}px` : value;
}
function joinClassNames(...classNames) {
    return classNames.filter(Boolean).join(" ");
}
export function Panel({ className, cutCorner, cutCornerColor, cutCornerPreset, cutCornerPlacement, cutCornerSize, style, ...cardProps }) {
    const preset = cutCornerPreset ? panelCutCornerPresets[cutCornerPreset] : undefined;
    const resolvedCutCorner = cutCorner ?? preset?.cutCorner;
    const resolvedCutCornerColor = cutCornerColor ?? preset?.cutCornerColor ?? "var(--marathon-primary)";
    const resolvedCutCornerPlacement = cutCornerPlacement ?? preset?.cutCornerPlacement ?? "top-right";
    const resolvedCutCornerSize = cutCornerSize ?? preset?.cutCornerSize ?? 26;
    const panelStyle = {
        ...style,
        ...(resolvedCutCorner
            ? {
                "--marathon-panel-cut-color": resolvedCutCornerColor,
                "--marathon-panel-cut-size": toCssLength(resolvedCutCornerSize) ?? "26px",
            }
            : {}),
    };
    return (_jsx(Card, { ...cardProps, className: joinClassNames("marathon-panel", resolvedCutCorner ? `marathon-panel--cut-${resolvedCutCorner}` : undefined, resolvedCutCorner ? `marathon-panel--corner-${resolvedCutCornerPlacement}` : undefined, className), style: panelStyle }));
}
