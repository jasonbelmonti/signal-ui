export const toneAccentRgb = {
    primary: "192 254 4",
    violet: "159 77 255",
};
export const toneAccentChannels = {
    primary: [192, 254, 4],
    violet: [159, 77, 255],
};
export const toneCooldownChannels = {
    primary: [88, 230, 255],
    violet: [255, 174, 92],
};
export const toneClassName = {
    primary: "marathon-signal-button--primary",
    violet: "marathon-signal-button--violet",
};
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
export function lerp(start, end, amount) {
    return start + (end - start) * amount;
}
export function blendChannels(start, end, amount) {
    const mix = clamp(amount, 0, 1);
    return [
        Math.round(lerp(start[0], end[0], mix)),
        Math.round(lerp(start[1], end[1], mix)),
        Math.round(lerp(start[2], end[2], mix)),
    ];
}
export function formatRgbChannels(channels) {
    return channels.join(" ");
}
export function resolveRewardChannels(tone, rewardColor) {
    if (Array.isArray(rewardColor) && rewardColor.length === 3) {
        return rewardColor.map((channel) => clamp(Math.round(channel), 0, 255));
    }
    if (typeof rewardColor === "string") {
        const parsed = parseRgbChannels(rewardColor);
        if (parsed) {
            return parsed;
        }
    }
    return toneCooldownChannels[tone];
}
function parseRgbChannels(value) {
    const normalized = value.trim();
    if (!normalized) {
        return null;
    }
    const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hexValue = hexMatch[1];
        if (hexValue) {
            return parseHexChannels(hexValue);
        }
    }
    const channelMatches = normalized.match(/\d+(\.\d+)?/g);
    if (!channelMatches || channelMatches.length < 3) {
        return null;
    }
    const channels = channelMatches.slice(0, 3).map((channel) => clamp(Math.round(Number(channel)), 0, 255));
    return channels;
}
function parseHexChannels(value) {
    const expandedValue = value.length === 3
        ? value
            .split("")
            .map((channel) => `${channel}${channel}`)
            .join("")
        : value;
    return [
        Number.parseInt(expandedValue.slice(0, 2), 16),
        Number.parseInt(expandedValue.slice(2, 4), 16),
        Number.parseInt(expandedValue.slice(4, 6), 16),
    ];
}
export function toCssLength(value) {
    if (value === undefined) {
        return undefined;
    }
    return typeof value === "number" ? `${value}px` : value;
}
export function toPixelLength(value, fallback = 24) {
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return fallback;
}
export function joinClassNames(...classNames) {
    return classNames.filter(Boolean).join(" ");
}
