"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { themes, containerVaraints, itemVatiants } from "@/lib/constant";
import { Theme } from "@/lib/types";
import usePromptStore from "@/store/usePromptStore";
import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

const TemplateSelect = () => {
  const { selectedTheme, setSelectedTheme, setPage } = usePromptStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "light" | "dark">("all");

  const filtered = useMemo(() => {
    return themes.filter((t) => {
      const matchesQuery = query
        ? t.name.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesFilter = filter === "all" ? true : t.type === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  const handlePick = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  const handleContinue = () => {
    if (!selectedTheme) return;
    setPage("method-select");
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8"
      variants={containerVaraints}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVatiants} className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          Choose a <span className="text-vivid">template</span>
        </h1>
        <p className="text-muted-foreground text-base">
          Pick a visual style — you&apos;ll add content next
        </p>
      </motion.div>

      <motion.div
        variants={itemVatiants}
        className="bg-card border-border mx-auto flex max-w-3xl flex-col items-stretch gap-3 rounded-2xl border p-2 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="bg-muted flex items-center gap-1 rounded-xl p-1">
          {(["all", "light", "dark"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`focus-visible:ring-ring rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none ${filter === f
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={containerVaraints}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.map((theme) => {
          const isSelected = selectedTheme?.name === theme.name;
          return (
            <motion.button
              key={theme.name}
              variants={itemVatiants}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => handlePick(theme)}
              aria-pressed={isSelected}
              className={`group focus-visible:ring-ring p-3 relative overflow-hidden rounded-2xl text-left focus-visible:ring-2 focus-visible:outline-none ${isSelected ? "ring-primary ring-2" : ""
                }`}
            >
              {/* Preview */}
              <div
                className="border-border aspect-[16/10] w-full overflow-hidden rounded-2xl border"
                style={{
                  background:
                    theme.gradientBackground || theme.backgroundColor,
                  fontFamily: theme.fontFamily,
                }}
              >
                <div className="flex h-full w-full flex-col justify-between p-5">
                  <div>
                    <div
                      className="mb-2 h-1.5 w-10 rounded-full"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                    <div
                      className="text-lg font-semibold leading-tight"
                      style={{ color: theme.accentColor }}
                    >
                      {theme.name}
                    </div>
                    <div
                      className="mt-1 text-xs opacity-70"
                      style={{ color: theme.fontColor }}
                    >
                      Preview heading
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div
                      className="h-1.5 w-full rounded-full opacity-30"
                      style={{ backgroundColor: theme.fontColor }}
                    />
                    <div
                      className="h-1.5 w-3/4 rounded-full opacity-30"
                      style={{ backgroundColor: theme.fontColor }}
                    />
                    <div
                      className="h-1.5 w-1/2 rounded-full opacity-30"
                      style={{ backgroundColor: theme.fontColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-1 py-2 pt-3">
                <div>
                  <div className="text-foreground text-sm font-medium">
                    {theme.name}
                  </div>
                  <div className="text-muted-foreground text-xs capitalize">
                    {theme.type}
                  </div>
                </div>
                {isSelected && (
                  <span className="bg-primary text-primary-foreground inline-flex size-6 items-center justify-center rounded-full">
                    <Check className="size-3.5" />
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          variants={itemVatiants}
          className="text-muted-foreground py-12 text-center text-sm"
        >
          No templates match &quot;{query}&quot;
        </motion.div>
      )}

      {/* Sticky continue bar */}
      <motion.div
        variants={itemVatiants}
        className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 bg-background/85 border-border flex items-center justify-between rounded-2xl border p-3 backdrop-blur-md shadow-lg"
      >
        <div className="text-sm">
          {selectedTheme ? (
            <>
              <span className="text-muted-foreground">Selected: </span>
              <span className="text-foreground font-medium">
                {selectedTheme.name}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              Pick a template to continue
            </span>
          )}
        </div>

        <Button
          size="default"
          onClick={handleContinue}
          disabled={!selectedTheme}
          className="font-medium"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default TemplateSelect;
