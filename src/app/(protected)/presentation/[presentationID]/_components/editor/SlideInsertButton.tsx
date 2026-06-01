"use client";

import React from "react";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { layouts } from "@/lib/constant";
import { layoutToSlide } from "@/lib/slideUtils";
import { useSlideStore } from "@/store/useSlideStore";
import type { LayoutSlides } from "@/lib/types";

type Props = {
  insertIndex: number;
};

const SlideInsertButton = ({ insertIndex }: Props) => {
  const { addSlideAtIndex, setCurrentSlide } = useSlideStore();
  const [open, setOpen] = React.useState(false);

  const handleInsert = (layout: LayoutSlides) => {
    addSlideAtIndex(layoutToSlide(layout, insertIndex), insertIndex);
    setCurrentSlide(insertIndex);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={
          "pointer-events-none absolute bottom-0 left-0 z-10 flex w-full justify-center"
        }
        style={{ transform: "translateY(50%)" }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Insert slide below"
            className={
              "pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:scale-110 hover:bg-blue-50 hover:text-blue-600 " +
              (open ? "opacity-100" : "opacity-0 group-hover:opacity-100")
            }
          >
            <Plus className="size-4" />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        align="center"
        side="bottom"
        sideOffset={8}
        className="w-[360px] rounded-2xl border border-gray-100 p-0 shadow-xl"
      >
        <ScrollArea className="h-[360px]">
          <div className="p-3">
            {layouts.map((group) => (
              <div key={group.name} className="mb-4">
                <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {group.name}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {group.layouts.map((layout) => {
                    const Icon = layout.icon;
                    return (
                      <button
                        key={layout.layoutType}
                        type="button"
                        onClick={() => handleInsert(layout.component)}
                        className="flex flex-col items-center gap-1 rounded-lg border border-gray-100 bg-white p-2 text-gray-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <div className="h-10 w-full overflow-hidden rounded bg-gray-900">
                          <Icon />
                        </div>
                        <span className="text-[10px] font-medium leading-tight text-center">
                          {layout.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default SlideInsertButton;
