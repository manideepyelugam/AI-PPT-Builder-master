import type { Theme } from "@/lib/types";

const slug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const hexToRgb = (hex: string): [number, number, number] | null => {
  const h = hex.trim().replace("#", "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return [r, g, b];
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return [r, g, b];
  }
  return null;
};

const mix = (hex: string, towards: "white" | "black", ratio: number) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const target = towards === "white" ? 255 : 0;
  const blend = (c: number) => Math.round(c + (target - c) * ratio);
  const out = rgb.map(blend);
  return `#${out.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};

const readableOn = (bg: string): string => {
  const rgb = hexToRgb(bg);
  if (!rgb) return "#ffffff";
  // Perceived luminance
  const [r, g, b] = rgb;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#0b0b0c" : "#ffffff";
};

/**
 * Fill in optional theme fields with sensible defaults derived from the
 * existing required color/font values. Lets legacy themes from constant.ts
 * participate in the new token system without changes.
 */
export const resolveTheme = (theme: Theme): Required<Theme> => {
  const isDark = theme.type === "dark";
  const accent = theme.accentColor;
  const surface = theme.slideBackgroundColor;

  return {
    name: theme.name,
    type: theme.type,
    fontFamily: theme.fontFamily,
    fontColor: theme.fontColor,
    backgroundColor: theme.backgroundColor,
    slideBackgroundColor: theme.slideBackgroundColor,
    accentColor: accent,
    gradientBackground: theme.gradientBackground ?? "",
    sidebarColor: theme.sidebarColor ?? theme.backgroundColor,
    navbarColor: theme.navbarColor ?? theme.backgroundColor,
    id: theme.id ?? slug(theme.name),
    fontHeading: theme.fontHeading ?? theme.fontFamily,
    mutedColor:
      theme.mutedColor ?? mix(theme.fontColor, isDark ? "black" : "white", 0.4),
    accentForeground: theme.accentForeground ?? readableOn(accent),
    borderColor:
      theme.borderColor ?? mix(theme.fontColor, isDark ? "black" : "white", 0.75),
    surfaceColor:
      theme.surfaceColor ?? mix(surface, isDark ? "white" : "black", 0.03),
    radius: theme.radius ?? "soft",
    shadow: theme.shadow ?? (isDark ? "subtle" : "soft"),
    density: theme.density ?? "comfortable",
    imageStyle: theme.imageStyle ?? "rounded",
    chartPalette:
      theme.chartPalette ??
      [accent, mix(accent, "white", 0.3), mix(accent, "black", 0.3), mix(accent, "white", 0.55), mix(accent, "black", 0.55)],
  };
};
