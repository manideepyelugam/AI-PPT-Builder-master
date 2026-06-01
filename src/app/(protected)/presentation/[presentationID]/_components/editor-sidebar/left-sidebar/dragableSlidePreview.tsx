"use client";

import { Slide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSlideStore } from "@/store/useSlideStore";
import { deepCloneSlideWithNewIds } from "@/lib/slideUtils";
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import ScaledPreview from "./scaledPreview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type DragableSlidePreviewProps = {
  slide: Slide;
  index: number;
  totalSlides: number;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
};

const DragableSlidePreview = ({
  index,
  slide,
  totalSlides,
  moveSlide,
}: DragableSlidePreviewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { currentSlide, setCurrentSlide, removeSlide, addSlideAtIndex, reOrderedSlides } =
    useSlideStore();
  const isActive = index === currentSlide;

  const [{ isDragging }, drag] = useDrag({
    type: "SLIDE",
    item: { index, type: "SLIDE" },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: "SLIDE",
    hover: (item: { index: number }) => {
      if (!ref.current || item.index === index) return;
      moveSlide(item.index, index);
      item.index = index;
    },
  });

  drag(drop(ref));

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const clone = deepCloneSlideWithNewIds(slide);
    clone.slideOrder = index + 1;
    addSlideAtIndex(clone, index + 1);
    setCurrentSlide(index + 1);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeSlide(slide.id);
    if (currentSlide >= index && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    reOrderedSlides(index, index - 1);
    setCurrentSlide(index - 1);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index >= totalSlides - 1) return;
    reOrderedSlides(index, index + 1);
    setCurrentSlide(index + 1);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "group relative p-4 cursor-pointer rounded-lg transition-all duration-150",
        isDragging && "opacity-40"
      )}
      onClick={() => setCurrentSlide(index)}
    >
      {/* Active left-bar indicator */}
      <div
        className={cn(
          "absolute top-0 bottom-0 left-0 w-0.5 rounded-full transition-all",
          isActive ? "bg-blue-500" : "bg-transparent group-hover:bg-gray-300"
        )}
      />

      <div className="pl-2">
        <ScaledPreview slide={slide} isActive={isActive} index={index} />
      </div>

      {/* Context menu — visible on hover */}
      <div
        className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-5 rounded bg-white/90 shadow-sm backdrop-blur-sm"
            >
              <MoreHorizontal className="size-3" />
              <span className="sr-only">Slide options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            className="w-44"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 size-3.5" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleMoveUp}
              disabled={index === 0}
            >
              <ArrowUp className="mr-2 size-3.5" />
              Move up
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleMoveDown}
              disabled={index >= totalSlides - 1}
            >
              <ArrowDown className="mr-2 size-3.5" />
              Move down
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={totalSlides <= 1}
              className="text-red-500 focus:text-red-600"
            >
              <Trash2 className="mr-2 size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DragableSlidePreview;
