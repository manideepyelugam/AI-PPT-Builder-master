"use client";

import { Button } from "@/components/ui/button";
import { containerVaraints, itemVatiants } from "@/lib/constant";
import usePromptStore from "@/store/usePromptStore";
import { motion } from "framer-motion";
import { ChevronLeft, ListOrdered, Sparkles } from "lucide-react";

const methods = [
  {
    type: "creative-ai" as const,
    title: "Generate with",
    highlightedText: "Creative AI",
    description:
      "Describe your topic and let AI propose slide titles, then generate the full deck with content and imagery.",
    highlight: true,
    icon: Sparkles,
  },
  {
    type: "manual" as const,
    title: "Build",
    highlightedText: "Manually",
    description:
      "Enter your own slide titles in order. AI fills in content, bullets, and images for each slide you define.",
    highlight: false,
    icon: ListOrdered,
  },
];

const MethodSelect = () => {
  const { selectedTheme, setPage } = usePromptStore();

  return (
    <motion.div
      className="mx-auto w-full space-y-10 px-4 "
      variants={containerVaraints}
      initial="hidden"
      animate="visible"
    >
      <Button
        onClick={() => setPage("template-select")}
        variant="outline"
        size="sm"
      >
        <ChevronLeft className="mr-2 size-4" />
        Back to templates
      </Button>

      <motion.div variants={itemVatiants} className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          How do you want to start?
        </h1>
        <p className="text-muted-foreground text-base">
          {selectedTheme ? (
            <>
              Using template{" "}
              <span className="text-foreground font-medium">
                {selectedTheme.name}
              </span>
            </>
          ) : (
            "Choose a creation method"
          )}
        </p>
      </motion.div>

      <motion.div
        variants={containerVaraints}
        className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2"
      >
        {methods.map((m) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.type}
              variants={itemVatiants}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className={`${m.highlight ? "bg-vivid-gradient" : "bg-border"
                } rounded-2xl p-[1px]`}
            >
              <div className="bg-card flex h-full w-full flex-col items-start justify-between gap-6 rounded-2xl p-6">
                <div className="flex w-full flex-col items-start gap-3">
                  <div
                    className={`${m.highlight
                      ? "bg-vivid-gradient text-primary-foreground"
                      : "bg-muted text-foreground"
                      } inline-flex size-10 items-center justify-center rounded-xl`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {m.title}
                  </p>
                  <p
                    className={`${m.highlight ? "text-vivid" : "text-foreground"
                      } text-3xl font-semibold tracking-tight md:text-4xl`}
                  >
                    {m.highlightedText}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {m.description}
                  </p>
                </div>
                <Button
                  variant={m.highlight ? "default" : "outline"}
                  className="font-medium cursor-pointer"
                  size="sm"
                  onClick={() => setPage(m.type)}
                >
                  {m.highlight ? "Generate" : "Continue"}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default MethodSelect;
