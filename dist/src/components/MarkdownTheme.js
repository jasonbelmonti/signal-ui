import { jsx as _jsx } from "react/jsx-runtime";
function joinClassNames(...classNames) {
    return classNames.filter(Boolean).join(" ");
}
export function MarkdownTheme({ className, ...articleProps }) {
    return (_jsx("article", { ...articleProps, className: joinClassNames("marathon-markdown", className) }));
}
