"use client";

import { useSlideStore } from "@/store/useSlideStore";
import React, { useEffect, useState } from "react";
import DragableSlidePreview from "./dragableSlidePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Layers } from "lucide-react";
import { createBlankSlide } from "@/lib/slideUtils";

const LayoutPreview = () => {
  const [isLoading, setLoading] = useState(true);
  const { slides, reOrderedSlides, addSlideAtIndex, currentSlide, setCurrentSlide } =
    useSlideStore();

  const orderedSlides = [...slides].sort((a, b) => a.slideOrder - b.slideOrder);

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    reOrderedSlides(dragIndex, hoverIndex);
  };

  // Insert blank slide immediately after the currently active slide
  const handleAddSlide = () => {
    const insertAt = currentSlide + 1;
    const newSlide = createBlankSlide(insertAt);
    addSlideAtIndex(newSlide, insertAt);
    setCurrentSlide(insertAt);
  };

  useEffect(() => {
    if (typeof window !== "undefined") setLoading(false);
  }, []);

  return (
    <aside className="fixed top-14 left-0 z-40 flex h-[calc(100vh-56px)] w-[300px] flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <Layers className="size-3.5" />
          <span>SLIDES</span>
        </div>
        <span className="text-xs text-gray-400">{orderedSlides.length}</span>
      </div>

      {/* Add slide button */}
      <div className="px-3 pt-2 pb-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 border-dashed text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600"
          onClick={handleAddSlide}
        >
          <Plus className="size-3.5" />
          New Slide
        </Button>
      </div>

      {/* Slides list */}
      <ScrollArea className="min-h-0 flex-1 px-2 py-1">
        {isLoading ? (
          <div className="space-y-3 p-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : (
          <div className="space-y-2 pb-8 mr-2">
            {orderedSlides.map((slide, index) => (
              <DragableSlidePreview
                key={slide.id || index}
                slide={slide}
                index={index}
                totalSlides={orderedSlides.length}
                moveSlide={moveSlide}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
};

export default LayoutPreview;
