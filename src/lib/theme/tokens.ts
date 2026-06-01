import type { CSSProperties } from "react";
import type { Theme } from "@/lib/types";
import { resolveTheme } from "./resolveTheme";

type CSSVarMap = CSSProperties & Record<`--${string}`, string | number>;

const RADIUS: Record<NonNullable<Theme["radius"]>, { sm: string; md: string; lg: string; image: string }> = {
  sharp: { sm: "0px", md: "2px", lg: "4px", image: "0px" },
  soft: { sm: "6px", md: "12px", lg: "20px", image: "14px" },
  pill: { sm: "12px", md: "20px", lg: "32px", image: "24px" },
};

const SHADOW: Record<NonNullable<Theme["shadow"]>, { sm: string; md: string; lg: string; image: string }> = {
  none: {
    sm: "none",
    md: "none",
    lg: "none",
    image: "none",
  },
  subtle: {
    sm: "0 1px 2px rgba(0,0,0,0.04)",
    md: "0 2px 6px rgba(0,0,0,0.06)",
    lg: "0 8px 24px rgba(0,0,0,0.08)",
    image: "0 4px 16px rgba(0,0,0,0.10)",
  },
  soft: {
    sm: "0 1px 2px rgba(15,23,42,0.06)",
    md: "0 4px 14px rgba(15,23,42,0.08)",
    lg: "0 18px 40px rgba(15,23,42,0.12)",
    image: "0 12px 32px rgba(15,23,42,0.18)",
  },
  dramatic: {
    sm: "0 2px 6px rgba(0,0,0,0.12)",
    md: "0 12px 32px rgba(0,0,0,0.18)",
    lg: "0 32px 72px rgba(0,0,0,0.28)",
    image: "0 24px 56px rgba(0,0,0,0.32)",
  },
};

const DENSITY: Record<
  NonNullable<Theme["density"]>,
  {
    pad: string;
    gutter: string;
    leadingBody: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    body: string;
    caption: string;
  }
> = {
  compact: {
    pad: "24px",
    gutter: "16px",
    leadingBody: "1.45",
    h1: "clamp(2rem, 4.6vw, 3rem)",
    h2: "clamp(1.5rem, 3.4vw, 2.25rem)",
    h3: "clamp(1.25rem, 2.6vw, 1.75rem)",
    h4: "clamp(1rem, 2vw, 1.375rem)",
    body: "clamp(0.95rem, 1.4vw, 1.05rem)",
    caption: "0.8rem",
  },
  comfortable: {
    pad: "40px",
    gutter: "24px",
    leadingBody: "1.55",
    h1: "clamp(2.5rem, 5.6vw, 3.75rem)",
    h2: "clamp(1.875rem, 4.2vw, 2.75rem)",
    h3: "clamp(1.375rem, 3vw, 2rem)",
    h4: "clamp(1.125rem, 2.2vw, 1.5rem)",
    body: "clamp(1rem, 1.55vw, 1.15rem)",
    caption: "0.85rem",
  },
  spacious: {
    pad: "56px",
    gutter: "32px",
    leadingBody: "1.65",
    h1: "clamp(3rem, 6.4vw, 4.5rem)",
    h2: "clamp(2.125rem, 4.6vw, 3rem)",
    h3: "clamp(1.5rem, 3.2vw, 2.25rem)",
    h4: "clamp(1.25rem, 2.4vw, 1.625rem)",
    body: "clamp(1.05rem, 1.7vw, 1.2rem)",
    caption: "0.875rem",
  },
};

const IMAGE_RADIUS: Record<NonNullable<Theme["imageStyle"]>, string> = {
  square: "0px",
  rounded: "var(--slide-radius-md)",
  framed: "var(--slide-radius-sm)",
  polaroid: "4px",
};

const IMAGE_FRAME: Record<
  NonNullable<Theme["imageStyle"]>,
  { ring: string; framePad: string; frameBg: string }
> = {
  square: { ring: "none", framePad: "0px", frameBg: "transparent" },
  rounded: { ring: "none", framePad: "0px", frameBg: "transparent" },
  framed: {
    ring: "inset 0 0 0 1px var(--slide-border)",
    framePad: "0px",
    frameBg: "transparent",
  },
  polaroid: {
    ring: "none",
    framePad: "10px 10px 36px",
    frameBg: "var(--slide-surface)",
  },
};

/**
 * Pure mapping: a Theme object → the `--slide-*` CSS custom property map.
 * Set this on the slide root element (via inline `style`) and every
 * descendant can read tokens via `var(--slide-…)`. This is the single
 * source of truth for slide visual design.
 *
 * Tokens are SCOPED — they never live on `:root`, so the app shell
 * (navbar / sidebars / toolbar) is unaffected by theme changes.
 */
export const themeToCssVars = (rawTheme: Theme): CSSVarMap => {
  const t = resolveTheme(rawTheme);
  const radius = RADIUS[t.radius];
  const shadow = SHADOW[t.shadow];
  const d = DENSITY[t.density];

  return {
    // Color
    "--slide-bg": t.slideBackgroundColor,
    "--slide-bg-gradient": t.gradientBackground || "none",
    "--slide-surface": t.surfaceColor,
    "--slide-fg": t.fontColor,
    "--slide-fg-muted": t.mutedColor,
    "--slide-accent": t.accentColor,
    "--slide-accent-fg": t.accentForeground,
    "--slide-border": t.borderColor,

    // Typography
    "--slide-font-heading": t.fontHeading,
    "--slide-font-body": t.fontFamily,
    "--slide-text-h1": d.h1,
    "--slide-text-h2": d.h2,
    "--slide-text-h3": d.h3,
    "--slide-text-h4": d.h4,
    "--slide-text-body": d.body,
    "--slide-text-caption": d.caption,
    "--slide-leading-tight": "1.1",
    "--slide-leading-body": d.leadingBody,
    "--slide-tracking-tight": "-0.02em",
    "--slide-weight-heading": "700",
    "--slide-weight-body": "400",

    // Spacing
    "--slide-space-1": "4px",
    "--slide-space-2": "8px",
    "--slide-space-3": "12px",
    "--slide-space-4": "16px",
    "--slide-space-5": "24px",
    "--slide-space-6": "32px",
    "--slide-space-7": "48px",
    "--slide-space-8": "64px",
    "--slide-pad": d.pad,
    "--slide-gutter": d.gutter,

    // Shape
    "--slide-radius-sm": radius.sm,
    "--slide-radius-md": radius.md,
    "--slide-radius-lg": radius.lg,

    // Elevation
    "--slide-shadow-sm": shadow.sm,
    "--slide-shadow-md": shadow.md,
    "--slide-shadow-lg": shadow.lg,

    // Image
    "--slide-image-radius": IMAGE_RADIUS[t.imageStyle] === "var(--slide-radius-md)"
      ? radius.md
      : IMAGE_RADIUS[t.imageStyle],
    "--slide-image-ratio": "16 / 9",
    "--slide-image-shadow": shadow.image,
    "--slide-image-ring": IMAGE_FRAME[t.imageStyle].ring,
    "--slide-image-frame-pad": IMAGE_FRAME[t.imageStyle].framePad,
    "--slide-image-frame-bg": IMAGE_FRAME[t.imageStyle].frameBg,

    // Chart palette
    "--slide-chart-1": t.chartPalette[0],
    "--slide-chart-2": t.chartPalette[1],
    "--slide-chart-3": t.chartPalette[2],
    "--slide-chart-4": t.chartPalette[3],
    "--slide-chart-5": t.chartPalette[4],
  };
};
