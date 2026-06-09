"use client";

import { generateCreativePrompt, generateLayout } from "@/actions/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { containerVaraints, itemVatiants } from "@/lib/constant";
import useCreativeAIStore from "@/store/useCreativeAIStore";
import usePromptStore from "@/store/usePromptStore";
import {
  ArrowRight,
  ChevronLeft,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardList from "../common/cardList";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { OutlineCard, Slide } from "@/lib/types";
import { v4 } from "uuid";
import { createProject } from "@/actions/projects";
import { useSlideStore } from "@/store/useSlideStore";
import { Project } from "@prisma/client";

const CreateAI = () => {
  const router = useRouter();
  const [numberOfCards, setNumberOfCards] = useState<number>(0);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const {
    currentAIPrompt,
    outlines,
    setCurrentAIPrompt,
    addMultipleOutlines,
    resetCurrentAIPrompt,
    resetOutlines,
  } = useCreativeAIStore();
  const { addPrompts, setPage, selectedTheme } = usePromptStore();
  const { setProject, setSlides, setCurrentTheme } = useSlideStore();

  const resetCards = () => {
    setEditingCard(null);
    setSelectedCard(null);
    setCurrentAIPrompt("");
    resetOutlines();
  };

  const generateOutlines = async () => {
    if (currentAIPrompt === "") {
      toast.error("Empty prompt", {
        description: "Please enter a prompt to generate slide titles.",
      });
      return;
    }

    setIsGenerating(true);

    const response = await generateCreativePrompt(currentAIPrompt);

    if (response.status === 200) {
      const data = response.data as { outlines: string[] };

      if (data?.outlines) {
        const cardData: OutlineCard[] = data.outlines.map((outline, index) => ({
          id: v4(),
          title: outline,
          order: index + 1,
        }));

        addMultipleOutlines(cardData);
        setNumberOfCards(cardData.length);
      }

      toast.success("Titles ready", {
        description: "Review them below — edit, add, or regenerate.",
      });
    } else {
      toast.error("Failed to generate outlines", {
        description: response.error || "Something went wrong — please try again.",
      });
    }

    setIsGenerating(false);
  };

  const handleGenerate = async () => {
    if (!selectedTheme) {
      toast.error("No template selected");
      setPage("template-select");
      return;
    }
    if (numberOfCards === 0) {
      toast.error("No titles", {
        description: "Add at least one title to generate slides.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const projectTitle = currentAIPrompt.trim() || outlines[0]?.title || "Untitled";
      const response = await createProject(projectTitle, outlines);

      if (response.status !== 200 || !response.data) {
        toast.error("Could not create project", {
          description: response.error || "Something went wrong",
        });
        return;
      }

      const projectData = response.data as Project;

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
        outlines: outlines,
        createdAt: projectData.createdAt.toISOString(),
      });

      toast.success("Presentation ready", {
        description: "Opening editor…",
      });

      setCurrentAIPrompt("");
      resetOutlines();

      router.push(`/presentation/${projectData.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    setNumberOfCards(outlines.length);
    if (outlines.length === 15) {
      toast.error("You can't add more than 15 slides.", {
        description: "Delete some titles to add more, or generate now.",
      });
    }
  }, [outlines]);

  return (
    <motion.div
      className="mx-auto w-full  space-y-6 px-4 py-10 sm:px-6 lg:px-8"
      variants={containerVaraints}
      initial="hidden"
      animate="visible"
    >
      <Button
        onClick={() => {
          resetCurrentAIPrompt();
          resetOutlines();
          setPage("method-select");
        }}
        variant="outline"
        size="sm"
      >
        <ChevronLeft className="mr-2 size-4" />
        Back
      </Button>

      <motion.div variants={itemVatiants} className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          Generate with <span className="text-vivid">Creative AI</span>
        </h1>
        <p className="text-muted-foreground">
          What would you like to create today?
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

      <div className="flex flex-col  items-center w-full justify-center ">

      

      <motion.div
        variants={itemVatiants}
        className="w-full max-w-3xl border-border rounded-2xl border p-4"
      >
        <div className="flex flex-col items-center w-full justify-between gap-3 sm:flex-row">
          <Input
            value={currentAIPrompt}
            onChange={(e) => setCurrentAIPrompt(e.target.value)}
            required
            placeholder="Describe your presentation in detail…"
            className="flex-grow border-0 bg-transparent py-0 text-base w-full shadow-none focus-visible:ring-0 sm:text-lg"
          />
          <div className="flex items-center gap-3">
            <div
              className={`border-border flex w-fit min-w-28 items-center justify-center rounded-lg border px-4 py-1 text-sm font-semibold ${
                numberOfCards === 0 || numberOfCards >= 15
                  ? "text-muted-foreground"
                  : "text-primary"
              }`}
            >
              {numberOfCards === 0 ? "No titles" : `${numberOfCards} titles`}
            </div>
            <Button
              variant="outline"
              onClick={resetCards}
              size="default"
              aria-label="Reset titles"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="flex w-full my-5 items-center justify-center">
        <Button
          className="flex items-center gap-2 font-medium"
          onClick={generateOutlines}
          disabled={isGenerating}
        >
          {isGenerating && outlines.length === 0 ? (
            <p className="text-sm font-medium flex gap-2 items-center">
              <Loader2 className="size-4 animate-spin" />
              Generating titles…
            </p>
          ) : outlines.length === 0 ? (
            <p className="text-sm font-medium flex gap-2 items-center">
              <Sparkles className="size-4" />
              Generate titles
            </p>
          ) : (
            <p className="text-sm font-medium flex gap-2 items-center">
              <RotateCcw className="size-4" />
              Regenerate titles
              <ArrowRight className="size-4" />
            </p>
          )}
        </Button>
      </div>

      <CardList
        outlines={outlines}
        addMultipleOutlines={addMultipleOutlines}
        editingCard={editingCard}
        selectedCard={selectedCard}
        onCardSelect={setSelectedCard}
        onCardDoubleClick={(cardId) => setEditingCard(cardId)}
        setEditingCard={setEditingCard}
        setSelectedCard={setSelectedCard}
      />

      {outlines.length > 0 && (
        <Button
          className="my-4 h-12 w-full max-w-3xl text-base font-medium"
          onClick={handleGenerate}
          disabled={isGenerating || numberOfCards === 0 || numberOfCards > 15}
        >
          {isGenerating ? (
            <p className="text-sm font-medium flex gap-2 items-center">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating presentation…
            </p>
          ) : (
            <p className="text-sm font-medium flex gap-2 items-center">
              <Sparkles className="mr-2 size-4" />
              Approve &amp; Generate Presentation
            </p>
          )}
        </Button>
      )}

      </div>


    </motion.div>
  );
};

export default CreateAI;
