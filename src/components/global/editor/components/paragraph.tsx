"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { TextStyles } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef } from "react";

interface ParagraphProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  styles?: TextStyles;
  isPreview?: boolean;
  contentId?: string;
  slideId?: string;
}

const Paragraph = React.forwardRef<HTMLTextAreaElement, ParagraphProps>(
  (
    { className, styles, isPreview = false, contentId, slideId, onFocus, onBlur, ...props },
    ref
  ) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { setSelection, clearSelection, registerBlurCancel } = useEditorStore();
    const registerFocusTextarea = useEditorStore((s) => s.registerFocusTextarea);

    const adjustHeight = useCallback(() => {
      const textArea = textAreaRef.current;
      if (textArea && !isPreview) {
        textArea.style.height = "0";
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
    }, [isPreview]);

    useEffect(() => {
      const textArea = textAreaRef.current;
      if (textArea && !isPreview) {
        textArea.addEventListener("input", adjustHeight);
        adjustHeight();
        return () => textArea.removeEventListener("input", adjustHeight);
      }
    }, [isPreview, adjustHeight]);

    // Re-adjust height whenever font size or font weight changes (different line height)
    useEffect(() => {
      adjustHeight();
    }, [styles?.fontSize, styles?.fontWeight, styles?.lineHeight, adjustHeight]);

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (blurTimerRef.current) {
          clearTimeout(blurTimerRef.current);
          blurTimerRef.current = null;
        }
        if (contentId && slideId && !isPreview) {
          const rect = e.currentTarget.getBoundingClientRect();
          setSelection(contentId, slideId, styles ?? {}, {
            top: rect.top,
            left: rect.left,
            width: rect.width,
          });
          registerFocusTextarea(() => textAreaRef.current?.focus());
        }
        onFocus?.(e);
      },
      [contentId, slideId, styles, isPreview, setSelection, registerFocusTextarea, onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const timerId = setTimeout(() => {
          const state = useEditorStore.getState();
          if (!state.toolbarHovered && !state.dropdownOpen) {
            clearSelection();
          }
        }, 200);
        blurTimerRef.current = timerId;
        registerBlurCancel(() => {
          clearTimeout(timerId);
          blurTimerRef.current = null;
        });
        onBlur?.(e);
      },
      [clearSelection, registerBlurCancel, onBlur]
    );

    const inlineStyles: React.CSSProperties = {
      padding: 0,
      margin: 0,
      color: "inherit",
      boxSizing: "content-box",
      lineHeight: "1.5em",
      minHeight: "1.5em",
      ...(styles?.fontFamily ? { fontFamily: styles.fontFamily } : {}),
      ...(styles?.fontSize ? { fontSize: styles.fontSize } : {}),
      ...(styles?.fontWeight ? { fontWeight: styles.fontWeight } : {}),
      ...(styles?.fontStyle ? { fontStyle: styles.fontStyle } : {}),
      ...(styles?.textDecoration ? { textDecoration: styles.textDecoration } : {}),
      ...(styles?.color ? { color: styles.color } : {}),
      ...(styles?.textAlign ? { textAlign: styles.textAlign as React.CSSProperties["textAlign"] } : {}),
      ...(styles?.lineHeight ? { lineHeight: styles.lineHeight } : {}),
      ...(styles?.letterSpacing ? { letterSpacing: styles.letterSpacing } : {}),
    };

    return (
      <textarea
        className={cn(
          `w-full resize-none overflow-hidden bg-transparent text-[color:var(--slide-fg)] font-[family-name:var(--slide-font-body)] leading-[var(--slide-leading-body)] font-[number:var(--slide-weight-body)] placeholder:opacity-40 focus:outline-none`,
          `${isPreview ? "text-[0.5rem]" : "text-[length:var(--slide-text-body)]"}`,
          className
        )}
        data-slide-textarea="true"
        style={inlineStyles}
        ref={(el) => {
          (textAreaRef.current as HTMLTextAreaElement | null) = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        readOnly={isPreview}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);

Paragraph.displayName = "Paragraph";
export default Paragraph;
