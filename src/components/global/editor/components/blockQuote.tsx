"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface BlockQuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  children: React.ReactNode;
  className?: string;
}

const BlockQuote = ({ children, className, ...props }: BlockQuoteProps) => {
  return (
    <blockquote
      className={cn(
        "border-l-4 pl-[var(--slide-space-4)] italic",
        "my-[var(--slide-space-4)] py-[var(--slide-space-2)]",
        "text-[color:var(--slide-fg-muted)] border-l-[color:var(--slide-accent)]",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
};

export default BlockQuote;
