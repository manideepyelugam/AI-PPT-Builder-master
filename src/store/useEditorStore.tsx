import { TextStyles } from "@/lib/types";
import { create } from "zustand";
import { useSlideStore } from "./useSlideStore";

interface ToolbarRect {
  top: number;
  left: number;
  width: number;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface EditorState {
  selectedContentId: string | null;
  selectedSlideId: string | null;
  toolbarRect: ToolbarRect | null;
  currentStyles: TextStyles;
  isEditing: boolean;
  saveStatus: SaveStatus;
  toolbarHovered: boolean;
  dropdownOpen: boolean;
  blurCancelFn: (() => void) | null;
  focusTextarea: (() => void) | null;
  setToolbarHovered: (hovered: boolean) => void;
  setDropdownOpen: (open: boolean) => void;
  registerBlurCancel: (cancel: () => void) => void;
  registerFocusTextarea: (fn: () => void) => void;
  setSelection: (
    contentId: string,
    slideId: string,
    styles: TextStyles,
    rect: ToolbarRect
  ) => void;
  clearSelection: () => void;
  updateToolbarRect: (rect: ToolbarRect) => void;
  applyStyle: (styles: Partial<TextStyles>) => void;
  setSaveStatus: (status: SaveStatus) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  selectedContentId: null,
  selectedSlideId: null,
  toolbarRect: null,
  currentStyles: {},
  isEditing: false,
  saveStatus: "idle",
  toolbarHovered: false,
  dropdownOpen: false,
  blurCancelFn: null,
  focusTextarea: null,

  setToolbarHovered: (hovered) => set({ toolbarHovered: hovered }),

  setDropdownOpen: (open) => set({ dropdownOpen: open }),

  registerBlurCancel: (cancel) => set({ blurCancelFn: cancel }),

  registerFocusTextarea: (fn) => set({ focusTextarea: fn }),

  setSelection: (contentId, slideId, styles, rect) => {
    set({
      selectedContentId: contentId,
      selectedSlideId: slideId,
      currentStyles: styles ?? {},
      toolbarRect: rect,
      isEditing: true,
    });
  },

  clearSelection: () => {
    if (get().dropdownOpen) return;
    set({
      selectedContentId: null,
      selectedSlideId: null,
      toolbarRect: null,
      isEditing: false,
    });
  },

  updateToolbarRect: (rect) => set({ toolbarRect: rect }),

  setSaveStatus: (status) => set({ saveStatus: status }),

  applyStyle: (styles) => {
    const { selectedContentId, selectedSlideId, currentStyles } = get();
    if (!selectedContentId || !selectedSlideId) return;

    const newStyles = { ...currentStyles, ...styles };
    set({ currentStyles: newStyles });

    useSlideStore
      .getState()
      .updateContentItemStyle(selectedSlideId, selectedContentId, styles);
  },
}));
