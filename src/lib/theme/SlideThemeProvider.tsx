"use client";

import React from "react";
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import type { Theme } from "@/lib/types";
import { cn } from "@/lib/utils";
import { themeToCssVars } from "./tokens";
import { resolveTheme } from "./resolveTheme";

type SlideThemeProviderProps = HTMLAttributes<HTMLElement> & {
  theme: Theme;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Render-as element. Defaults to `div`. */
  as?: ElementType;
  /** When true, the wrapper paints `--slide-bg` / `--slide-bg-gradient`. Default true. */
  paintBackground?: boolean;
};

/**
 * Wraps a slide (or slide preview) and publishes the `--slide-*` design
 * tokens via inline `style`. Descendants read them with `var(--slide-…)`.
 *
 * Scope is intentionally local — no token leaks to `:root`, so the app
 * shell stays untouched when the slide theme changes. Switching themes
 * = updating CSS custom properties on one element. The browser cascades
 * the change to every descendant with no React subtree re-render.
 */
const SlideThemeProvider = React.forwardRef<HTMLElement, SlideThemeProviderProps>(
  ({ theme, children, className, style, as, paintBackground = true, ...rest }, ref) => {
    const Component = (as ?? "div") as ElementType;
    const resolved = resolveTheme(theme);
    const vars = themeToCssVars(theme);

    const paint: CSSProperties = paintBackground
      ? {
          backgroundColor: "var(--slide-bg)",
          backgroundImage: resolved.gradientBackground || undefined,
          color: "var(--slide-fg)",
          fontFamily: "var(--slide-font-body)",
        }
      : {};

    return (
      <Component
        ref={ref}
        data-slide-theme={resolved.id}
        data-slide-mode={resolved.type}
        className={cn("slide-root", className)}
        style={{ ...vars, ...paint, ...style }}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

SlideThemeProvider.displayName = "SlideThemeProvider";

export default SlideThemeProvider;
