"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";

// Globally listen for pointerdown. If the user clicks outside any editable
// textarea AND outside the floating format toolbar AND outside any Radix
// popper portal (selects, popovers, dropdowns), blur the active textarea
// and clear the editor selection. Without this, focus is sticky: clicking
// elsewhere on the slide canvas leaves the previous textarea focused and
// the toolbar visible forever.
export function useEditorClickOutside() {
  const clearSelection = useEditorStore((s) => s.clearSelection);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      const inTextarea = target.closest("[data-slide-textarea='true']");
      if (inTextarea) return;

      const inToolbar = target.closest("[data-format-toolbar='true']");
      if (inToolbar) return;

      // Radix portals (Popover/Select/DropdownMenu) live outside the React
      // tree but mark themselves with these attributes.
      const inRadixPortal = target.closest(
        "[data-radix-popper-content-wrapper], [data-radix-popper-anchor], [data-state='open'][role='menu'], [role='dialog']"
      );
      if (inRadixPortal) return;

      const active = document.activeElement as HTMLElement | null;
      if (active && active.tagName === "TEXTAREA") {
        active.blur();
      }
      clearSelection();
    };

    document.addEventListener("pointerdown", handler, true);
    return () => document.removeEventListener("pointerdown", handler, true);
  }, [clearSelection]);
}
