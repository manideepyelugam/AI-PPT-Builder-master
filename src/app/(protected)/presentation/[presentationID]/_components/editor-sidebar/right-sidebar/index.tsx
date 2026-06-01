"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSlideStore } from "@/store/useSlideStore";
import { LayoutTemplate, Palette, Type } from "lucide-react";
import React from "react";
import LayoutChooser from "./tabs/layoutChooser";
import { component } from "@/lib/constant";
import ComponentCard from "./tabs/components-tabs/componentPreview";
import ThemeChooser from "./tabs/themeChooser";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SidebarButton = ({
  icon: Icon,
  label,
  children,
  contentWidth = "w-[480px]",
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  children: React.ReactNode;
  contentWidth?: string;
}) => {
  const { currentTheme } = useSlideStore();

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-accent size-9 rounded-xl"
              >
                <Icon className="size-5" />
                <span className="sr-only">{label}</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8}>
            <p className="text-xs">{label}</p>
          </TooltipContent>
          <PopoverContent
            side="left"
            align="center"
            className={`${contentWidth} rounded-2xl border border-gray-100 p-0 shadow-xl`}
            style={{
              backgroundColor: currentTheme.backgroundColor,
              color: currentTheme.fontColor,
            }}
          >
            {children}
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
};

const EditorSidebar = () => {
  return (
    <div className="fixed top-1/2 right-3 z-30">
      <div className="bg-card border-border-subtle -translate-y-1/2 flex flex-col items-center gap-1 rounded-xl border p-1.5 shadow-lg">
        <SidebarButton icon={LayoutTemplate} label="Layouts" contentWidth="w-[480px]">
          <LayoutChooser />
        </SidebarButton>

        <div className="bg-border-subtle h-px w-6" />

        <SidebarButton icon={Type} label="Components" contentWidth="w-[480px]">
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col space-y-6 p-4">
              {component.map((group, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-muted-foreground px-1 text-xs font-semibold uppercase tracking-wide">
                    {group.name}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {group.components.map((item, i) => (
                      <ComponentCard key={i} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SidebarButton>

        <div className="bg-border-subtle h-px w-6" />

        <SidebarButton icon={Palette} label="Theme" contentWidth="w-80">
          <ThemeChooser />
        </SidebarButton>
      </div>
    </div>
  );
};

export default EditorSidebar;
