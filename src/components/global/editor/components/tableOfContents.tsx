import { cn } from "@/lib/utils";
import React from "react";

type TableOfContentsProps = {
  items: string[];
  className?: string;
};

const TableOfContents = ({ items, className }: TableOfContentsProps) => {
  return (
    <nav
      className={cn(
        "space-y-2 text-[color:var(--slide-fg)]",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="cursor-pointer hover:underline hover:text-[color:var(--slide-accent)]"
        >
          {item}
        </div>
      ))}
    </nav>
  );
};

export default TableOfContents;
