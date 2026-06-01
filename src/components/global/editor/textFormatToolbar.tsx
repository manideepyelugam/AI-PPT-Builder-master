"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useEditorStore } from "@/store/useEditorStore";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const FONT_SIZES = ["10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "60", "72"];
const TOOLBAR_HEIGHT = 48;

const FONT_FAMILIES = [
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Open Sans", value: "'Open Sans', sans-serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Raleway", value: "'Raleway', sans-serif" },
  { label: "Nunito", value: "'Nunito', sans-serif" },
  { label: "Source Sans 3", value: "'Source Sans 3', sans-serif" },
  { label: "IBM Plex Mono", value: "'IBM Plex Mono', monospace" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
];

function getDefaultFontSize(styles: Record<string, string | undefined>): string {
  if (styles.fontSize) {
    return styles.fontSize.replace("px", "");
  }
  return "16";
}

function getCurrentFontFamily(styles: Record<string, string | undefined>): string {
  return styles.fontFamily ?? "'Inter', sans-serif";
}

const TextFormatToolbar: React.FC = () => {
  const { isEditing, toolbarRect, currentStyles, applyStyle, setToolbarHovered } = useEditorStore();
  const setDropdownOpen = useEditorStore((s) => s.setDropdownOpen);

  const handleDropdownOpen = (open: boolean) => {
    setDropdownOpen(open);
    if (open) {
      setToolbarHovered(true);
    } else {
      // Re-focus the textarea so the toolbar stays active and editing resumes naturally
      useEditorStore.getState().focusTextarea?.();
    }
  };
  const [mounted, setMounted] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isEditing || !toolbarRect) return null;

  const showAbove = toolbarRect.top > TOOLBAR_HEIGHT + 64;
  const top = showAbove
    ? toolbarRect.top - TOOLBAR_HEIGHT - 6
    : toolbarRect.top + 40 + 6;
  const left = Math.max(
    8,
    Math.min(toolbarRect.left, (typeof window !== "undefined" ? window.innerWidth : 1200) - 560)
  );

  const isBold = currentStyles.fontWeight === "700" || currentStyles.fontWeight === "bold";
  const isItalic = currentStyles.fontStyle === "italic";
  const isUnderline = currentStyles.textDecoration === "underline";
  const isStrikethrough = currentStyles.textDecoration === "line-through";
  const alignment = currentStyles.textAlign ?? "left";
  const currentFontSize = getDefaultFontSize(currentStyles as Record<string, string | undefined>);
  const currentFontFamily = getCurrentFontFamily(currentStyles as Record<string, string | undefined>);
  const currentColor = currentStyles.color ?? "#000000";

  const toolbar = (
    <div
      ref={toolbarRef}
      data-format-toolbar="true"
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => setToolbarHovered(true)}
      onMouseLeave={() => setToolbarHovered(false)}
      style={{ top, left, zIndex: 9999 }}
      className="bg-popover text-popover-foreground border-border fixed flex h-12 items-center gap-1 rounded-xl border px-2 shadow-xl"
    >
      {/* Font family */}
      <Select
        value={currentFontFamily}
        onValueChange={(val) => applyStyle({ fontFamily: val })}
        onOpenChange={handleDropdownOpen}
      >
        <SelectTrigger className="h-8 w-36 border-0 bg-transparent text-sm focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="max-h-60 overflow-y-auto"
          onPointerEnter={() => setToolbarHovered(true)}
          onPointerLeave={() => setToolbarHovered(false)}
        >
          {FONT_FAMILIES.map((font) => (
            <SelectItem
              key={font.value}
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Font size */}
      <Select
        value={currentFontSize}
        onValueChange={(val) => applyStyle({ fontSize: `${val}px` })}
        onOpenChange={handleDropdownOpen}
      >
        <SelectTrigger className="h-8 w-16 border-0 bg-transparent text-sm focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          onPointerEnter={() => setToolbarHovered(true)}
          onPointerLeave={() => setToolbarHovered(false)}
        >
          {FONT_SIZES.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Bold */}
      <Toggle
        size="sm"
        pressed={isBold}
        onPressedChange={(p) =>
          applyStyle({ fontWeight: p ? "700" : "400" })
        }
        aria-label="Bold"
        className="h-8 w-8"
      >
        <Bold className="size-4" />
      </Toggle>

      {/* Italic */}
      <Toggle
        size="sm"
        pressed={isItalic}
        onPressedChange={(p) =>
          applyStyle({ fontStyle: p ? "italic" : "normal" })
        }
        aria-label="Italic"
        className="h-8 w-8"
      >
        <Italic className="size-4" />
      </Toggle>

      {/* Underline */}
      <Toggle
        size="sm"
        pressed={isUnderline}
        onPressedChange={(p) =>
          applyStyle({ textDecoration: p ? "underline" : "none" })
        }
        aria-label="Underline"
        className="h-8 w-8"
      >
        <Underline className="size-4" />
      </Toggle>

      {/* Strikethrough */}
      <Toggle
        size="sm"
        pressed={isStrikethrough}
        onPressedChange={(p) =>
          applyStyle({ textDecoration: p ? "line-through" : "none" })
        }
        aria-label="Strikethrough"
        className="h-8 w-8"
      >
        <Strikethrough className="size-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <Toggle
        size="sm"
        pressed={alignment === "left"}
        onPressedChange={() => applyStyle({ textAlign: "left" })}
        aria-label="Align left"
        className="h-8 w-8"
      >
        <AlignLeft className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={alignment === "center"}
        onPressedChange={() => applyStyle({ textAlign: "center" })}
        aria-label="Align center"
        className="h-8 w-8"
      >
        <AlignCenter className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={alignment === "right"}
        onPressedChange={() => applyStyle({ textAlign: "right" })}
        aria-label="Align right"
        className="h-8 w-8"
      >
        <AlignRight className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={alignment === "justify"}
        onPressedChange={() => applyStyle({ textAlign: "justify" })}
        aria-label="Justify"
        className="h-8 w-8"
      >
        <AlignJustify className="size-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6" />

      {/* Text color */}
      <Popover onOpenChange={handleDropdownOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1"
            aria-label="Text color"
          >
            <span className="flex flex-col items-center gap-0.5">
              <span className="text-xs font-bold leading-none">A</span>
              <span
                className="h-1 w-5 rounded-sm"
                style={{ backgroundColor: currentColor }}
              />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerEnter={() => setToolbarHovered(true)}
          onPointerLeave={() => setToolbarHovered(false)}
        >
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs">Text color</label>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => applyStyle({ color: e.target.value })}
              className="h-8 w-32 cursor-pointer rounded border"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return ReactDOM.createPortal(toolbar, document.body);
};

export default TextFormatToolbar;
