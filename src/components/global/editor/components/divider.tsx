import { cn } from "@/lib/utils";
import React from "react";

type DividerProps = {
  className: string;
};

const Divider = ({ className }: DividerProps) => {
  return (
    <hr
      className={cn(
        "my-[var(--slide-space-4)] border-[color:var(--slide-border)]",
        className
      )}
    />
  );
};

export default Divider;
