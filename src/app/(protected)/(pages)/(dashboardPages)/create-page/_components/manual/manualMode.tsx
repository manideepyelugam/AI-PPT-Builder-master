"use client";

import { generateLayout } from "@/actions/ai";
import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { containerVaraints, itemVatiants } from "@/lib/constant";
import { OutlineCard, Slide } from "@/lib/types";
import usePromptStore from "@/store/usePromptStore";
import { useSlideStore } from "@/store/useSlideStore";
import { Project } from "@prisma/client";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";
import CardList from "../common/cardList";

const ManualMode = () => {
  const router = useRouter();
  const { selectedTheme, setPage, addPrompts } = usePromptStore();
  const { setProject, setSlides, setCurrentTheme } = useSlideStore();

  const [projectTitle, setProjectTitle] = useState("");
  const [outlines, setOutlines] = useState<OutlineCard[]>([]);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  const addManualTitle = () => {
    if (!draftTitle.trim()) return;
    if (outlines.length >= 15) {
      toast.error("Limit reached", {
        description: "You can have at most 15 slides per deck.",
      });
      return;
    }
    setOutlines((prev) => [
      ...prev,
      { id: v4(), title: draftTitle.trim(), order: prev.length + 1 },
    ]);
    setDraftTitle("");
  };

  const handleGenerate = async () => {
    if (!selectedTheme) {
      toast.error("No template selected");
      setPage("template-select");
      return;
    }
    if (outlines.length === 0) {
      toast.error("Add at least one slide title", {
        description: "Type a title and press Add or Enter.",
      });
      return;
    }
    const finalTitle = projectTitle.trim() || outlines[0].title;

    setIsGenerating(true);
    try {
      const project = await createProject(finalTitle, outlines);
      if (project.status !== 200 || !project.data) {
        toast.error("Could not create project", {
          description: project.error || "Unknown error",
        });
        return;
      }
      const projectData = project.data as Project;

      const layout = await generateLayout(projectData.id, selectedTheme.name);
      if (layout.status !== 200) {
        toast.error("Could not generate slides", {
          description: layout.error || "Unknown error",
        });
        return;
      }

      setProject({ ...projectData, themeName: selectedTheme.name });
      setSlides(layout.data as Slide[]);
      setCurrentTheme(selectedTheme);
      addPrompts({
        id: projectData.id,
        title: projectData.title,
        outlines,
        createdAt: projectData.createdAt.toISOString(),
      });

      toast.success("Presentation ready", {
        description: "Opening editor…",
      });
      router.push(`/presentation/${projectData.id}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate presentation");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 sm:px-6 lg:px-8"
      variants={containerVaraints}
      initial="hidden"
      animate="visible"
    >
      <Button
        onClick={() => setPage("method-select")}
        variant="outline"
        size="sm"
      >
        <ChevronLeft className="mr-2 size-4" />
        Back
      </Button>

      <motion.div variants={itemVatiants} className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          Build <span className="text-vivid">manually</span>
        </h1>
        <p className="text-muted-foreground text-base">
          Enter your slide titles. AI will fill in content and imagery.
        </p>
        {selectedTheme && (
          <p className="text-muted-foreground text-sm">
            Template:{" "}
            <span className="text-foreground font-medium">
              {selectedTheme.name}
            </span>
          </p>
        )}
      </motion.div>

      <motion.div variants={itemVatiants} className="space-y-2">
        <label className="text-foreground text-sm font-medium">
          Presentation title{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Input
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="e.g. Q4 Strategy Review"
        />
      </motion.div>

      <motion.div
        variants={itemVatiants}
        className="bg-card border-border rounded-2xl border p-4"
      >
        <div className="flex items-center gap-2">
          <Input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addManualTitle();
              }
            }}
            placeholder="Add a slide title…"
            className="flex-1"
          />
          <Button onClick={addManualTitle} size="default">
            <Plus className="mr-1 size-4" />
            Add
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {outlines.length === 0
            ? "Tip: drag-reorder titles after adding them."
            : `${outlines.length} / 15 slides`}
        </p>
      </motion.div>

      <CardList
        outlines={outlines}
        addMultipleOutlines={(next) => setOutlines(next as OutlineCard[])}
        editingCard={editingCard}
        selectedCard={selectedCard}
        onCardSelect={setSelectedCard}
        onCardDoubleClick={(id) => setEditingCard(id)}
        setEditingCard={setEditingCard}
        setSelectedCard={setSelectedCard}
      />

      <Button
        className="my-4 h-12 w-full font-medium"
        onClick={handleGenerate}
        disabled={isGenerating || outlines.length === 0}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Generating presentation…
          </>
        ) : (
          <>
            <Sparkles className="mr-2 size-4" />
            Generate Presentation
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default ManualMode;
