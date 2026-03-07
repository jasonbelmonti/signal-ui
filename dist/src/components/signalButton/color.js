import { clamp } from "./utils.js";
export function drawPixel(ctx, x, y, accent, saturation, lift, alpha) {
    ctx.fillStyle = rgba(accent, saturation, lift, alpha);
    ctx.fillRect(x, y, 1, 1);
}
export function rgba(accent, saturation, lift, alpha) {
    const red = liftChannel(accent[0], saturation, lift);
    const green = liftChannel(accent[1], saturation, lift);
    const blue = liftChannel(accent[2], saturation, lift);
    return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1)})`;
}
function liftChannel(channel, saturation, lift) {
    const scaled = channel * saturation;
    return Math.round(clamp(scaled + (255 - scaled) * lift, 0, 255));
}
