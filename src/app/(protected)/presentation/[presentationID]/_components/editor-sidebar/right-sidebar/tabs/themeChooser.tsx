import { updateTheme } from "@/actions/projects";
import { ScrollArea } from "@/components/ui/scroll-area";
import { themes } from "@/lib/constant";
import { Theme } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSlideStore } from "@/store/useSlideStore";
import { SlideThemeProvider, resolveTheme } from "@/lib/theme";
import React, { useCallback } from "react";
import { toast } from "sonner";

const ThemeChooser = () => {
  const { currentTheme, project, setCurrentTheme, setProject } = useSlideStore();

  const handleThemeChange = useCallback(
    async (theme: Theme) => {
      if (!project) {
        toast.error("Please select a project first");
        return;
      }

      setCurrentTheme(theme);
      // Optimistically reflect in the in-memory project so subsequent reads see the new themeName.
      setProject({ ...project, themeName: theme.name });

      try {
        const res = await updateTheme(project.id, theme.name);
        if (res.status !== 200) {
          toast.error("Failed to update theme");
          return;
        }
        toast.success("Theme updated");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update theme");
      }
    },
    [project, setCurrentTheme, setProject]
  );

  return (
    <ScrollArea className="h-[400px] rounded-2xl">
      <div className="my-4 mt-2 text-center font-bold">Themes</div>
      <div className="my-4 flex flex-col items-center space-y-4">
        {themes.map((theme, index) => {
          const isActive = theme.name === currentTheme.name;
          const resolved = resolveTheme(theme);
          return (
            <SlideThemeProvider
              key={theme.name || index}
              theme={theme}
              role="button"
              tabIndex={0}
              className={cn(
                "flex h-auto w-11/12 cursor-pointer flex-col items-start justify-start gap-2 rounded-[var(--slide-radius-md)] border border-[color:var(--slide-border)] p-4 shadow-[var(--slide-shadow-sm)] hover:shadow-[var(--slide-shadow-md)] transition-shadow",
                isActive && "ring-2 ring-blue-500 ring-offset-2"
              )}
              onClick={() => {
                if (theme.name !== currentTheme.name) {
                  handleThemeChange(theme);
                } else {
                  toast.message("Theme already selected");
                }
              }}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className="text-base font-semibold"
                  style={{ fontFamily: "var(--slide-font-heading)" }}
                >
                  {theme.name}
                </span>
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: "var(--slide-accent)" }}
                />
              </div>
              <div className="w-full space-y-1 text-left">
                <div
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--slide-font-heading)",
                    color: "var(--slide-fg)",
                  }}
                >
                  Title
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--slide-fg-muted)" }}
                >
                  Body &{" "}
                  <span style={{ color: "var(--slide-accent)" }}>link</span>
                </div>
              </div>
              <span className="sr-only">{resolved.id}</span>
            </SlideThemeProvider>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ThemeChooser;
