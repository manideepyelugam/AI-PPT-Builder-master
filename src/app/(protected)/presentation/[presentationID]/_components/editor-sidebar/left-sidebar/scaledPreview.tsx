import { Slide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSlideStore } from "@/store/useSlideStore";
import { SlideThemeProvider } from "@/lib/theme";
import React from "react";
import MasterRecursiveComponent from "../../editor/masterRecursiveComponent";

type ScaledPreviewProps = {
  slide: Slide;
  isActive: boolean;
  index: number;
};

const ScaledPreview = ({ index, isActive, slide }: ScaledPreviewProps) => {
  const { currentTheme } = useSlideStore();

  return (
    <SlideThemeProvider
      theme={currentTheme}
      className={cn(
        "ring-primary/20 relative aspect-video w-full overflow-hidden rounded-lg ring-2 ring-offset-2 transition-all duration-200",
        isActive
          ? "ring-2 ring-blue-500 ring-offset-2"
          : "hover:ring-2 hover:ring-gray-200 hover:ring-offset-2"
      )}
    >
      {/* Absolutely positioned so image-heavy slides can't push the card height */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="size-[200%] origin-top-left scale-[0.5]">
          <MasterRecursiveComponent
            slideId={slide.id}
            content={slide.content}
            isPreview={true}
            onContentChange={() => {}}
          />
        </div>
      </div>

      <div
        className={cn(
          "absolute bottom-2 left-2 rounded bg-gray-800 px-2 py-1 text-xs",
          isActive && "!text-white ring-2 ring-blue-500 ring-offset-2"
        )}
        style={{ color: "var(--slide-accent)" }}
      >
        {index + 1}
      </div>
    </SlideThemeProvider>
  );
};

export default ScaledPreview;
