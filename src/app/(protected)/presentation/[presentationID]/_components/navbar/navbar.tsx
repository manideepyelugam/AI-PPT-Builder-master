"use client";

import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/store/useSlideStore";
import { useEditorStore } from "@/store/useEditorStore";
import { Check, ChevronLeft, Download, Forward, Loader2, Palette, Play } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import PresentationMode from "./presentationMode";
import { cn } from "@/lib/utils";
import { exportDeckToPptx } from "@/lib/export/pptx";

type NavbarProps = {
  presentationID: string;
};

const SaveIndicator = () => {
  const { saveStatus } = useEditorStore();

  if (saveStatus === "idle") return null;

  return (
    <span
      className={cn(
        "flex items-center gap-1 text-xs",
        saveStatus === "saving" && "text-gray-400",
        saveStatus === "saved" && "text-green-500",
        saveStatus === "error" && "text-red-400"
      )}
    >
      {saveStatus === "saving" && <Loader2 className="size-3 animate-spin" />}
      {saveStatus === "saved" && <Check className="size-3" />}
      {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Save failed"}
    </span>
  );
};

const Navbar = ({ presentationID }: NavbarProps) => {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { project, slides, currentTheme, getOrderedSlides } = useSlideStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/share/${presentationID}`
    );
    toast.success("Link copied to clipboard");
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const ordered = getOrderedSlides ? getOrderedSlides() : slides;
      await exportDeckToPptx(
        ordered,
        currentTheme,
        (project?.title ?? "presentation").replace(/[^a-z0-9-_ ]/gi, "").trim() || "presentation"
      );
      toast.success("Exported to PowerPoint");
    } catch (err) {
      console.error("[Export] failed:", err);
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-14 w-full items-center justify-between border-b border-gray-200 bg-white px-4">
      {/* Left: back + title */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="size-4" />
            <span className="hidden text-sm sm:inline">Home</span>
          </Button>
        </Link>
        <div className="hidden h-4 w-px bg-gray-200 sm:block" />
        <span className="hidden max-w-[260px] truncate text-sm font-medium text-gray-800 sm:block">
          {project?.title ?? "Untitled"}
        </span>
        <SaveIndicator />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-gray-600 hover:text-gray-900"
          onClick={handleCopy}
        >
          <Forward className="size-4" />
          <span className="hidden text-sm sm:inline">Share</span>
        </Button>

        <Link href={`/presentation/${presentationID}/select-theme`}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-gray-600 hover:text-gray-900"
          >
            <Palette className="size-4" />
            <span className="hidden text-sm sm:inline">Theme</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-gray-600 hover:text-gray-900"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          <span className="hidden text-sm sm:inline">Export</span>
        </Button>

        <Button
          size="sm"
          className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setIsPresentationMode(true)}
        >
          <Play className="size-3.5" fill="white" />
          <span className="hidden text-sm sm:inline">Present</span>
        </Button>
      </div>

      {isPresentationMode && (
        <PresentationMode onClose={() => setIsPresentationMode(false)} />
      )}
    </nav>
  );
};

export default Navbar;
