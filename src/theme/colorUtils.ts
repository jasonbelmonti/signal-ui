export type HexColor = `#${string}`;

type RgbColor = {
  blue: number;
  green: number;
  red: number;
};

type ParsedColor = RgbColor & {
  alpha: number | null;
};

let colorResolutionElement: HTMLElement | null = null;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function expandHexColor(hex: string) {
  if (!/^[0-9a-fA-F]+$/.test(hex)) {
    return null;
  }

  if (hex.length === 3 || hex.length === 4) {
    return hex
      .split("")
      .map((segment) => `${segment}${segment}`)
      .join("");
  }

  if (hex.length === 6 || hex.length === 8) {
    return hex;
  }

  return null;
}

export function isHexColor(color: string | undefined): color is HexColor {
  if (!color) {
    return false;
  }

  const normalized = color.trim();

  return /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(normalized);
}

export function normalizeHexColor(color: string | undefined): HexColor | null {
  if (!isHexColor(color)) {
    return null;
  }

  const parsed = parseHexColor(color);

  return parsed ? formatHexColor(parsed) : null;
}

export function resolveHexColor(color: string | undefined, fallback: HexColor): HexColor {
  return normalizeHexColor(color) ?? fallback;
}

function parseRgbChannel(channel: string) {
  const normalized = channel.trim().replace(/%$/, "");
  const value = Number.parseFloat(normalized);

  if (!Number.isFinite(value)) {
    return null;
  }

  return channel.trim().endsWith("%") ? (value / 100) * 255 : value;
}

function parseHue(hue: string) {
  const normalized = hue.trim().toLowerCase();
  const value = Number.parseFloat(normalized);

  if (!Number.isFinite(value)) {
    return null;
  }

  if (normalized.endsWith("turn")) {
    return value * 360;
  }

  if (normalized.endsWith("rad")) {
    return (value * 180) / Math.PI;
  }

  return value;
}

function parsePercentChannel(channel: string) {
  const normalized = channel.trim();

  if (!normalized.endsWith("%")) {
    return null;
  }

  const value = Number.parseFloat(normalized.slice(0, -1));

  if (!Number.isFinite(value)) {
    return null;
  }

  return clamp(value, 0, 100) / 100;
}

function parseAlphaChannel(channel: string) {
  const normalized = channel.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.endsWith("%")) {
    const value = Number.parseFloat(normalized.slice(0, -1));

    if (!Number.isFinite(value)) {
      return null;
    }

    return clamp(value, 0, 100) / 100;
  }

  const value = Number.parseFloat(normalized);

  if (!Number.isFinite(value)) {
    return null;
  }

  return clamp(value, 0, 1);
}

function parseFunctionalColorArguments(color: string) {
  const match = color.trim().match(/^[a-z]+\((.*)\)$/i);

  const contents = match?.[1];

  if (!contents) {
    return null;
  }

  return contents
    .trim()
    .replace(/\s*\/\s*[^, ]+\s*$/, "")
    .replace(/,/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function parseFunctionalColorChannels(color: string) {
  const match = color.trim().match(/^[a-z]+\((.*)\)$/i);
  const contents = match?.[1]?.trim();

  if (!contents) {
    return null;
  }

  let channelContents = contents;
  let alphaChannel: string | undefined;

  if (channelContents.includes("/")) {
    const [channels, alpha] = channelContents.split("/", 2);
    channelContents = channels?.trim() ?? "";
    alphaChannel = alpha?.trim();
  }

  const channels = channelContents.replace(/,/g, " ").split(/\s+/).filter(Boolean);

  if (!alphaChannel && channels.length === 4) {
    alphaChannel = channels.pop();
  }

  return {
    alpha: alphaChannel ? parseAlphaChannel(alphaChannel) : null,
    channels,
  };
}

function parseRgbColor(color: string): ParsedColor | null {
  const match = color.trim().match(/^rgba?\(/i);

  if (!match) {
    return null;
  }

  const parsedChannels = parseFunctionalColorChannels(color);
  const channels = parsedChannels?.channels;

  if (!channels || channels.length < 3) {
    return null;
  }

  const [redChannel, greenChannel, blueChannel] = channels;

  if (!redChannel || !greenChannel || !blueChannel) {
    return null;
  }

  const red = parseRgbChannel(redChannel);
  const green = parseRgbChannel(greenChannel);
  const blue = parseRgbChannel(blueChannel);

  if (red === null || green === null || blue === null) {
    return null;
  }

  if (parsedChannels?.alpha === undefined) {
    return null;
  }

  return { red, green, blue, alpha: parsedChannels.alpha };
}

function hslToRgb(hue: number, saturation: number, lightness: number): RgbColor {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = normalizedHue / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const matchLightness = lightness - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) {
    red = chroma;
    green = second;
  } else if (segment < 2) {
    red = second;
    green = chroma;
  } else if (segment < 3) {
    green = chroma;
    blue = second;
  } else if (segment < 4) {
    green = second;
    blue = chroma;
  } else if (segment < 5) {
    red = second;
    blue = chroma;
  } else {
    red = chroma;
    blue = second;
  }

  return {
    red: (red + matchLightness) * 255,
    green: (green + matchLightness) * 255,
    blue: (blue + matchLightness) * 255,
  };
}

function parseHslColor(color: string): ParsedColor | null {
  const match = color.trim().match(/^hsla?\(/i);

  if (!match) {
    return null;
  }

  const parsedChannels = parseFunctionalColorChannels(color);
  const channels = parsedChannels?.channels;

  if (!channels || channels.length < 3) {
    return null;
  }

  const [hueChannel, saturationChannel, lightnessChannel] = channels;

  if (!hueChannel || !saturationChannel || !lightnessChannel) {
    return null;
  }

  const hue = parseHue(hueChannel);
  const saturation = parsePercentChannel(saturationChannel);
  const lightness = parsePercentChannel(lightnessChannel);

  if (hue === null || saturation === null || lightness === null) {
    return null;
  }

  if (parsedChannels?.alpha === undefined) {
    return null;
  }

  return { ...hslToRgb(hue, saturation, lightness), alpha: parsedChannels.alpha };
}

function parseHexColor(color: string): RgbColor | null {
  const normalized = color.trim().replace(/^#/, "");
  const hex = expandHexColor(normalized);

  if (!hex) {
    return null;
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return { red, green, blue };
}

function parseHexColorWithAlpha(color: string): ParsedColor | null {
  const normalized = color.trim().replace(/^#/, "");
  const hex = expandHexColor(normalized);
  const rgb = parseHexColor(color);

  if (!hex || !rgb) {
    return null;
  }

  if (normalized.length === 4 || normalized.length === 8) {
    const alphaHex = hex.slice(6, 8);
    const alpha = Number.parseInt(alphaHex, 16) / 255;

    return { ...rgb, alpha };
  }

  return { ...rgb, alpha: null };
}

function parseCssColor(color: string): ParsedColor | null {
  return parseHexColorWithAlpha(color) ?? parseRgbColor(color) ?? parseHslColor(color) ?? parseBrowserColor(color);
}

function getColorResolutionElement() {
  if (typeof document === "undefined") {
    return null;
  }

  if (!colorResolutionElement) {
    colorResolutionElement = document.createElement("div");
    colorResolutionElement.setAttribute("aria-hidden", "true");
    colorResolutionElement.style.display = "none";
    document.documentElement.append(colorResolutionElement);
  } else if (!colorResolutionElement.isConnected) {
    document.documentElement.append(colorResolutionElement);
  }

  return colorResolutionElement;
}

function parseBrowserColor(color: string): ParsedColor | null {
  const resolutionElement = getColorResolutionElement();

  if (!resolutionElement) {
    return null;
  }

  resolutionElement.style.color = "";
  resolutionElement.style.color = color;

  if (!resolutionElement.style.color) {
    return null;
  }

  return parseRgbColor(getComputedStyle(resolutionElement).color);
}

function formatHexColor({ red, green, blue }: RgbColor): HexColor {
  return `#${[red, green, blue]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"))
    .join("")}` as HexColor;
}

function formatCssColor({ red, green, blue, alpha }: ParsedColor) {
  if (alpha === null || alpha >= 1) {
    return formatHexColor({ red, green, blue });
  }

  return `rgba(${clamp(Math.round(red), 0, 255)}, ${clamp(Math.round(green), 0, 255)}, ${clamp(Math.round(blue), 0, 255)}, ${alpha})`;
}

export function normalizeColor(color: string | undefined): HexColor | null {
  if (!color) {
    return null;
  }

  const parsed = parseCssColor(color);

  if (!parsed || (parsed.alpha !== null && parsed.alpha < 1)) {
    return null;
  }

  return formatHexColor(parsed);
}

export function normalizeCssColor(color: string | undefined): string | null {
  if (!color) {
    return null;
  }

  const parsed = parseCssColor(color);

  return parsed ? formatCssColor(parsed) : null;
}

export function mixHexColors(color: string, mixWith: string, mixAmount: number) {
  const source = parseHexColor(color);
  const target = parseHexColor(mixWith);

  if (!source || !target) {
    return color;
  }

  const weight = clamp(mixAmount, 0, 1);

  return formatHexColor({
    red: source.red + (target.red - source.red) * weight,
    green: source.green + (target.green - source.green) * weight,
    blue: source.blue + (target.blue - source.blue) * weight,
  });
}

export function darkenHexColor(color: string, amount: number) {
  return mixHexColors(color, "#000000", amount);
}

export function lightenHexColor(color: string, amount: number) {
  return mixHexColors(color, "#ffffff", amount);
}

export function withAlpha(color: string, alpha: number) {
  const parsed = parseCssColor(color);

  if (!parsed) {
    return color;
  }

  return `rgba(${parsed.red}, ${parsed.green}, ${parsed.blue}, ${clamp(alpha, 0, 1)})`;
}

export function toRgbTriplet(color: string) {
  const parsed = parseCssColor(color);

  if (!parsed) {
    return null;
  }

  return `${parsed.red} ${parsed.green} ${parsed.blue}`;
}
