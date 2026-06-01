import { OutlineCard, Theme } from "@/lib/types";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

type Page = "template-select" | "method-select" | "creative-ai" | "manual";

type Prompt = {
  id: string;
  createdAt: string;
  title: string;
  outlines: OutlineCard[] | [];
};

type PromptStore = {
  page: Page;
  prompts: Prompt[] | [];
  selectedTheme: Theme | null;
  setPage: (page: Page) => void;
  setSelectedTheme: (theme: Theme) => void;
  addPrompts: (prompt: Prompt) => void;
  removePrompt: (id: string) => void;
};

const usePromptStore = create<PromptStore>()(
  devtools(
    persist(
      (set) => ({
        page: "template-select",
        prompts: [],
        selectedTheme: null,
        setPage: (page: Page) => set({ page }),
        setSelectedTheme: (theme: Theme) => set({ selectedTheme: theme }),
        addPrompts: (prompt: Prompt) =>
          set((state) => ({
            prompts: [prompt, ...state.prompts],
          })),
        removePrompt: (id: string) =>
          set((state) => ({
            prompts: state.prompts.filter((prompt: Prompt) => prompt.id !== id),
          })),
      }),
      {
        name: "prompts",
      }
    )
  )
);

export default usePromptStore;
