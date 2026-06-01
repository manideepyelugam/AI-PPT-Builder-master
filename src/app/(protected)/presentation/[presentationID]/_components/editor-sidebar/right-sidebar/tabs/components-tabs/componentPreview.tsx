import { ContentItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";
import { useDrag } from "react-dnd";

type ComponentItemProps = {
  type: string;
  componentType: string;
  name: string;
  icon: string;
  component: ContentItem;
};

const ComponentCard = ({ item }: { item: ComponentItemProps }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CONTENT_ITEM",
    item: item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      className={cn(
        "bg-card border-border hover:border-foreground/30 group flex cursor-grab flex-col items-center gap-2 rounded-lg border p-2 transition-[border-color,background-color,transform] active:cursor-grabbing hover:-translate-y-0.5",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      <div className="bg-muted text-foreground/80 flex aspect-video w-full items-center justify-center rounded-md text-xl font-medium">
        <span>{item.icon}</span>
      </div>
      <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium">
        {item.name}
      </span>
    </div>
  );
};

export default ComponentCard;
