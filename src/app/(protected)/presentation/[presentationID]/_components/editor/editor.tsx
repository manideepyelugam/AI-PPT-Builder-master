"use client";

import { v4 } from "uuid";
import { cn } from "@/lib/utils";
import { useDrag, useDrop } from "react-dnd";
import { LayoutSlides, Slide } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useSlideStore } from "@/store/useSlideStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MasterRecursiveComponent from "./masterRecursiveComponent";
import SlideInsertButton from "./SlideInsertButton";
import { SlideThemeProvider } from "@/lib/theme";
import { useEditorClickOutside } from "@/hooks/useEditorClickOutside";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash } from "lucide-react";
import { updateSlides } from "@/actions/projects";

type EditorProps = {
  isEditable: boolean;
};

interface DropZoneProps {
  index: number;
  isEditable: boolean;
  onDrop: (
    item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    },
    dropIndex: number
  ) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  index,
  isEditable,
  onDrop,
}) => {
  const [{ isOver, canDrop }, dropref] = useDrop({
    accept: ["SLIDE", "LAYOUT"],
    drop: (item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    }) => {
      onDrop(item, index);
    },
    canDrop: () => isEditable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  if (!isEditable) {
    return null;
  }

  return (
    <div
      ref={dropref as unknown as React.RefObject<HTMLDivElement>}
      className={cn(
        "relative my-1 h-2 rounded-md transition-all duration-150",
        isOver && canDrop
          ? "h-6 bg-blue-100 ring-2 ring-blue-400"
          : canDrop
            ? "h-3 bg-blue-50/60 ring-1 ring-blue-200"
            : "opacity-0 hover:opacity-100"
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 border-t border-dashed transition-colors",
          isOver && canDrop
            ? "border-blue-500"
            : canDrop
              ? "border-blue-300"
              : "border-gray-300"
        )}
      />
      {isOver && canDrop && (
        <div className="flex h-full items-center justify-center text-xs font-medium text-blue-600">
          Drop here
        </div>
      )}
    </div>
  );
};

interface DragableSlideProps {
  index: number;
  slide: Slide;
  isEditable: boolean;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
  handleDelete: (id: string) => void;
  registerRef?: (index: number, el: HTMLDivElement | null) => void;
}

export const DragableSlide: React.FC<DragableSlideProps> = ({
  index,
  slide,
  isEditable,
  moveSlide,
  handleDelete,
  registerRef,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { currentSlide, currentTheme, setCurrentSlide, updateContentItem } =
    useSlideStore();
  const [{ isDragging }, drag] = useDrag({
    type: "SLIDE",
    item: { index, type: "SLIDE" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditable,
  });

  const [, drop] = useDrop({
    accept: ["SLIDE", "LAYOUT"],
    hover(item: { index: number; type: string }) {
      if (!ref.current || !isEditable) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (item.type === "SLIDE") {
        if (dragIndex === hoverIndex) {
          return;
        }

        moveSlide(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  drag(drop(ref));

  useEffect(() => {
    registerRef?.(index, ref.current);
    return () => registerRef?.(index, null);
  }, [index, registerRef]);

  const handleContentChange = (
    contentID: string,
    newContent: string | string[] | string[][]
  ) => {
    if (isEditable) {
      updateContentItem(slide.id, contentID, newContent);
    }
  };

  return (
    <SlideThemeProvider
      theme={currentTheme}
      ref={ref}
      className={cn(
        "group relative w-full min-h-[420px] rounded-2xl p-0",
        "flex flex-col border",
        "transition-all duration-200",
        index === currentSlide
          ? "ring-2 ring-blue-500 ring-offset-2 shadow-md"
          : "hover:shadow-md",
        slide.className,
        isDragging ? "opacity-40" : "opacity-100"
      )}
      style={{
        borderColor: "var(--slide-border)",
        boxShadow: index === currentSlide ? undefined : "var(--slide-shadow-sm)",
      }}
    >
      <div onClick={() => setCurrentSlide(index)} className="size-full flex-grow overflow-hidden">
        <MasterRecursiveComponent
          content={slide.content}
          isEditable={isEditable}
          isPreview={false}
          slideId={slide.id}
          onContentChange={handleContentChange}
        />
      </div>
      {isEditable && (
        <div
          className={cn(
            "absolute top-2 left-2",
            deleteOpen ? "flex" : "hidden group-hover:flex"
          )}
        >
          <Popover open={deleteOpen} onOpenChange={setDeleteOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-7 w-7 rounded-lg bg-white/90 p-0 shadow-sm backdrop-blur-sm"
              >
                <EllipsisVertical className="size-4" />
                <span className="sr-only">Slide options</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-1" align="start">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                  setDeleteOpen(false);
                  handleDelete(slide.id);
                }}
              >
                <Trash className="size-4" />
                Delete slide
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
      {isEditable && <SlideInsertButton insertIndex={index + 1} />}
    </SlideThemeProvider>
  );
};

const Editor = ({ isEditable }: EditorProps) => {
  useEditorClickOutside();
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setLoading] = useState(true);
  const {
    currentSlide,
    slides,
    project,
    getOrderedSlides,
    reOrderedSlides,
    addSlideAtIndex,
    removeSlide,
  } = useSlideStore();
  const orderedSlides = getOrderedSlides();

  const registerSlideRef = useCallback(
    (index: number, el: HTMLDivElement | null) => {
      slideRefs.current[index] = el;
    },
    []
  );

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    if (isEditable) {
      reOrderedSlides(dragIndex, hoverIndex);
    }
  };

  const handleDrop = (
    item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    },
    dropIndex: number
  ) => {
    if (!isEditable) {
      return;
    }

    if (item.type === "layout") {
      addSlideAtIndex(
        { ...item.component, id: v4(), slideOrder: dropIndex },
        dropIndex
      );
    } else if (item.type === "slide" && item.index !== undefined) {
      moveSlide(item.index, dropIndex);
    }
  };

  const handleDelete = (id: string) => {
    if (isEditable) {
      removeSlide(id);
    }
  };

  useEffect(() => {
    if (slideRefs.current[currentSlide]) {
      slideRefs.current[currentSlide]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSlide]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(false);
    }
  }, []);

  const saveSlides = useCallback(() => {
    if (isEditable && project) {
      (async () => {
        await updateSlides(project.id, JSON.parse(JSON.stringify(slides)));
      })();
    }
  }, [slides, project, isEditable]);

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (isEditable) {
      autoSaveTimerRef.current = setTimeout(() => {
        saveSlides();
      }, 2000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [slides, isEditable, project, saveSlides]);

  return (
    <div className="mx-auto mb-20 flex h-full max-w-6xl flex-1 flex-col px-4">
      {isLoading ? (
        <div className="mt-8 flex w-full flex-col space-y-2 px-4">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
      ) : (
        <ScrollArea className="mt-8 flex-1">
          <div className="space-y-4 px-4 pt-2 pb-4">
            {isEditable && (
              <DropZone index={0} isEditable={isEditable} onDrop={handleDrop} />
            )}
            {orderedSlides.map((slide, index) => (
              <React.Fragment key={slide.id || index}>
                <DragableSlide
                  slide={slide}
                  index={index}
                  isEditable={isEditable}
                  moveSlide={moveSlide}
                  handleDelete={handleDelete}
                  registerRef={registerSlideRef}
                />
                {isEditable && (
                  <DropZone
                    index={index + 1}
                    isEditable={isEditable}
                    onDrop={handleDrop}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default Editor;
