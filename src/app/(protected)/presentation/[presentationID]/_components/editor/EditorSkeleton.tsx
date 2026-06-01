"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SIDEBAR_WIDTH = 300;

const SlideCardSkeleton = () => (
  <div className="bg-card border-border w-full rounded-2xl border p-8 shadow-sm">
    <Skeleton className="mb-6 h-8 w-2/3" />
    <Skeleton className="mb-2 h-4 w-full" />
    <Skeleton className="mb-2 h-4 w-5/6" />
    <Skeleton className="mb-6 h-4 w-4/6" />
    <Skeleton className="h-40 w-full" />
  </div>
);

const EditorSkeleton = () => {
  return (
    <>
      {/* Navbar */}
      <div className="bg-background/80 border-border fixed top-0 right-0 left-0 z-20 flex h-14 items-center justify-between border-b px-4 backdrop-blur">
        <Skeleton className="h-7 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Left thumbnails sidebar */}
      <aside
        className="bg-sidebar border-border fixed top-14 bottom-0 left-0 z-10 border-r p-3"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <Skeleton className="mb-4 h-5 w-24" />
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </aside>

      {/* Right floating icon panel */}
      <div className="bg-card border-border fixed top-1/2 right-3 z-10 flex -translate-y-1/2 flex-col gap-1 rounded-xl border p-1.5 shadow-lg">
        <Skeleton className="size-9 rounded-xl" />
        <Skeleton className="size-9 rounded-xl" />
        <Skeleton className="size-9 rounded-xl" />
      </div>

      {/* Main canvas */}
      <main
        className="bg-muted/40 flex min-h-screen flex-col pt-14 pb-16"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-4 px-8">
          <SlideCardSkeleton />
          <SlideCardSkeleton />
          <SlideCardSkeleton />
        </div>
      </main>
    </>
  );
};

export default EditorSkeleton;
