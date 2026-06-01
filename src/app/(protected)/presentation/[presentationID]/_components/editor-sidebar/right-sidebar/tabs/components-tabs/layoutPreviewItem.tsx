import { LayoutSlides } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";

type LayoutPreviewItemProps = {
  name: string;
  Icon: React.FC;
  type: string;
  isSelected?: boolean;
  comopnent: LayoutSlides;
  onClick?: () => void;
};

const LayoutPreviewItem = ({
  Icon,
  isSelected,
  name,
  onClick,
}: LayoutPreviewItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex cursor-grab flex-col items-center gap-2 rounded-lg p-2 transition-all duration-200 active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-800",
        "size-full text-center",
        isSelected && "ring-2 ring-blue-500"
      )}
    >
      <div className="aspect-video w-full rounded-md border bg-gray-100 p-2 shadow-sm transition-shadow duration-200 hover:shadow-md dark:bg-gray-700">
        <Icon />
      </div>
      <span className="text-xs font-medium text-gray-500">{name}</span>
    </button>
  );
};

export default LayoutPreviewItem;
