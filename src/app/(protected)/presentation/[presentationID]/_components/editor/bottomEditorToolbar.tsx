"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Trash2, Sparkles } from "lucide-react";
import { useSlideStore } from "@/store/useSlideStore";
import { createBlankSlide, deepCloneSlideWithNewIds } from "@/lib/slideUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AISlideModal from "./AISlideModal";

type BottomEditorToolbarProps = {
  sidebarWidth: number;
};

const BottomEditorToolbar = ({ sidebarWidth }: BottomEditorToolbarProps) => {
  const { slides, addSlideAtIndex, currentSlide, setCurrentSlide, removeSlide } =
    useSlideStore();
  const [aiOpen, setAiOpen] = useState(false);

  const orderedSlides = [...slides].sort((a, b) => a.slideOrder - b.slideOrder);

  // Insert blank slide after current
  const handleAddSlide = () => {
    const insertAt = currentSlide + 1;
    addSlideAtIndex(createBlankSlide(insertAt), insertAt);
    setCurrentSlide(insertAt);
  };

  // Duplicate current slide, place it right after
  const handleDuplicateSlide = () => {
    const source = orderedSlides[currentSlide];
    if (!source) return;
    const clone = deepCloneSlideWithNewIds(source);
    clone.slideOrder = currentSlide + 1;
    addSlideAtIndex(clone, currentSlide + 1);
    setCurrentSlide(currentSlide + 1);
  };

  // Delete current slide (disabled when only one remains)
  const handleDeleteSlide = () => {
    const source = orderedSlides[currentSlide];
    if (!source || orderedSlides.length <= 1) return;
    removeSlide(source.id);
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="fixed bottom-0 right-0 z-40 flex h-14 items-center justify-center gap-3 border-t border-gray-200 bg-white/95 backdrop-blur-sm"
        style={{ left: sidebarWidth }}
      >
        {/* Action group */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                onClick={handleAddSlide}
              >
                <Plus className="size-3.5" />
                Add slide
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Insert blank slide after current</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-gray-200" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setAiOpen(true)}
              >
                <Sparkles className="size-3.5" />
                AI Slide
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Generate a slide with AI</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-gray-200" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                onClick={handleDuplicateSlide}
              >
                <Copy className="size-3.5" />
                <span className="sr-only">Duplicate slide</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Duplicate current slide</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                onClick={handleDeleteSlide}
                disabled={orderedSlides.length <= 1}
              >
                <Trash2 className="size-3.5" />
                <span className="sr-only">Delete slide</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Delete current slide</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Slide position counter */}
        <span className="min-w-[3rem] text-center text-xs text-gray-400">
          {slides.length > 0 ? `${currentSlide + 1} / ${slides.length}` : "–"}
        </span>
      </div>
      <AISlideModal open={aiOpen} onOpenChange={setAiOpen} />
    </TooltipProvider>
  );
};

export default BottomEditorToolbar;
