"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { layouts } from "@/lib/constant";
import { Layout } from "@/lib/types";
import { useSlideStore } from "@/store/useSlideStore";
import React from "react";
import LayoutPreviewItem from "./components-tabs/layoutPreviewItem";
import { useDrag } from "react-dnd";
import { layoutToSlide } from "@/lib/slideUtils";
import { SlideThemeProvider } from "@/lib/theme";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

export const DraggableLayoutItem = ({
  name,
  icon,
  type,
  component,
  layoutType,
}: Layout) => {
  const { currentTheme, currentSlide, slides, addSlideAtIndex, setCurrentSlide, applyLayoutToSlide } =
    useSlideStore();

  const orderedSlides = [...slides].sort((a, b) => a.slideOrder - b.slideOrder);

  const [{ isDragging }, drag] = useDrag({
    type: "LAYOUT",
    item: { type, layoutType, component },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleInsert = (e: React.MouseEvent) => {
    e.stopPropagation();
    const insertAt = currentSlide + 1;
    const newSlide = layoutToSlide(component, insertAt);
    addSlideAtIndex(newSlide, insertAt);
    setCurrentSlide(insertAt);
  };

  const handleApplyToCurrent = () => {
    const activeSlide = orderedSlides[currentSlide];
    if (!activeSlide) return;
    applyLayoutToSlide(activeSlide.id, component);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <SlideThemeProvider
        theme={currentTheme}
        // @ts-expect-error react-dnd ref typing
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="group relative rounded-2xl border border-[color:var(--slide-border)] cursor-pointer"
        onClick={handleApplyToCurrent}
      >
        <LayoutPreviewItem
          name={name}
          Icon={icon}
          type={type}
          comopnent={component}
        />
        {/* Insert-as-new button — visible on hover */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleInsert}
              className="absolute top-1 right-1 hidden size-5 items-center justify-center rounded bg-white/90 shadow-sm backdrop-blur-sm hover:bg-green-50 group-hover:flex"
            >
              <Plus className="size-3 text-gray-500 hover:text-green-600" />
              <span className="sr-only">Insert as new slide</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Insert as new slide
          </TooltipContent>
        </Tooltip>
      </SlideThemeProvider>
    </TooltipProvider>
  );
};

const LayoutChooser = () => {
  return (
    <ScrollArea className="h-[400px] rounded-2xl">
      <div className="p-4">
        {layouts.map((group, index) => (
          <div key={group.name || index} className="mb-6">
            <h3 className="my-4 text-sm font-medium">{group.name}</h3>
            <div className="grid grid-cols-3 gap-2">
              {group.layouts.map((layout, index) => (
                <DraggableLayoutItem
                  key={layout.layoutType || index}
                  {...layout}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default LayoutChooser;
