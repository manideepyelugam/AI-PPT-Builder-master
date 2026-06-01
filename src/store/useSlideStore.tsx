import { ContentItem, LayoutSlides, Slide, TextStyles, Theme } from "@/lib/types";
import { applySwap } from "@/lib/layout/swap";
import { Project } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 } from "uuid";

interface SlideState {
  slides: Slide[];
  project: Project | null;
  currentTheme: Theme;
  currentSlide: number;
  setSlides: (slides: Slide[]) => void;
  setProject: (project: Project | null) => void;
  setCurrentTheme: (theme: Theme) => void;
  removeSlide: (id: string) => void;
  addSlideAtIndex: (slide: Slide, index: number) => void;
  getOrderedSlides: () => Slide[];
  reOrderedSlides: (fromIndex: number, toIndex: number) => void;
  updateContentItem: (
    slideId: string,
    contentID: string,
    newContent: string | string[] | string[][]
  ) => void;
  setCurrentSlide: (index: number) => void;
  addComponentInSlide: (
    slideId: string,
    item: ContentItem,
    parentId: string,
    index: number
  ) => void;
  updateContentItemStyle: (
    slideId: string,
    contentId: string,
    styles: Partial<TextStyles>
  ) => void;
  applyLayoutToSlide: (slideId: string, layout: LayoutSlides) => void;
}

const defaultTheme: Theme = {
  name: "Default",
  fontFamily: "'Inter', sans-serif",
  fontColor: "#000000",
  backgroundColor: "#f0f0f0",
  slideBackgroundColor: "#ffffff",
  accentColor: "#3b82f6",
  navbarColor: "#ffffff",
  sidebarColor: "#f0f0f0",
  type: "light",
};

export const useSlideStore = create(
  persist<SlideState>(
    (set, get) => ({
      slides: [],
      project: null,
      currentTheme: defaultTheme,
      currentSlide: 0,
      setSlides: (slides: Slide[]) => set({ slides }),
      setProject: (project: Project | null) => set({ project }),
      setCurrentTheme: (theme: Theme) => set({ currentTheme: theme }),
      removeSlide: (id: string) => {
        set((state) => ({
          slides: state.slides.filter((slide) => slide.id !== id),
        }));
      },
      addSlideAtIndex: (slide: Slide, index: number) => {
        set((state) => {
          const newSlides = [...state.slides];
          newSlides.splice(index, 0, { ...slide, id: v4() });
          newSlides.forEach((s: Slide, i: number) => {
            s.slideOrder = i;
          });
          return { slides: newSlides, currentSlide: index };
        });
      },
      getOrderedSlides: () => {
        const state = get();
        return [...state.slides].sort((a, b) => a.slideOrder - b.slideOrder);
      },
      reOrderedSlides: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newSlides = [...state.slides];
          const [removed] = newSlides.splice(fromIndex, 1);
          newSlides.splice(toIndex, 0, removed);

          let newCurrentSlide = state.currentSlide;
          if (state.currentSlide === fromIndex) {
            newCurrentSlide = toIndex;
          } else if (fromIndex < toIndex) {
            if (state.currentSlide > fromIndex && state.currentSlide <= toIndex) {
              newCurrentSlide = state.currentSlide - 1;
            }
          } else {
            if (state.currentSlide >= toIndex && state.currentSlide < fromIndex) {
              newCurrentSlide = state.currentSlide + 1;
            }
          }

          return {
            slides: newSlides.map((slide: Slide, index: number) => ({
              ...slide,
              slideOrder: index,
            })),
            currentSlide: newCurrentSlide,
          };
        });
      },
      setCurrentSlide: (index: number) => set({ currentSlide: index }),
      updateContentItem: (
        slideId: string,
        contentID: string,
        newContent: string | string[] | string[][]
      ) => {
        set((state) => {
          const updateContentRecursively = (item: ContentItem): ContentItem => {
            if (item.id === contentID) {
              return {
                ...item,
                content: newContent,
              };
            }

            if (
              Array.isArray(item.content) &&
              item.content.every((i) => typeof i !== "string")
            ) {
              const newChildren = item.content.map((subItem) => {
                if (typeof subItem !== "string") {
                  return updateContentRecursively(subItem as ContentItem);
                }
                return subItem;
              }) as ContentItem[];
              // Only create new reference if a child actually changed
              const changed = newChildren.some((c, i) => c !== (item.content as ContentItem[])[i]);
              if (!changed) return item;
              return {
                ...item,
                content: newChildren,
              };
            }
            return item;
          };
          return {
            slides: state.slides.map((slide) =>
              slide.id === slideId
                ? {
                    ...slide,
                    content: updateContentRecursively(slide.content),
                  }
                : slide
            ),
          };
        });
      },
      addComponentInSlide: (
        slideId: string,
        item: ContentItem,
        parentId: string,
        index: number
      ) => {
        set((state) => {
          const updatedSlides = state.slides.map((slide) => {
            if (slide.id === slideId) {
              const updateContentRecursively = (
                content: ContentItem
              ): ContentItem => {
                if (content.id === parentId && Array.isArray(content.content)) {
                  const updatedContent = [...(content.content as ContentItem[])];
                  updatedContent.splice(index, 0, item);
                  return {
                    ...content,
                    content: updatedContent as unknown as string[],
                  };
                }
                if (
                  Array.isArray(content.content) &&
                  content.content.every((i) => typeof i !== "string")
                ) {
                  return {
                    ...content,
                    content: (content.content as ContentItem[]).map(
                      updateContentRecursively
                    ) as unknown as string[],
                  };
                }
                return content;
              };
              return {
                ...slide,
                content: updateContentRecursively(slide.content),
              };
            }
            return slide;
          });
          return { slides: updatedSlides };
        });
      },
      updateContentItemStyle: (
        slideId: string,
        contentId: string,
        styles: Partial<TextStyles>
      ) => {
        set((state) => {
          const updateStyleRecursively = (item: ContentItem): ContentItem => {
            if (item.id === contentId) {
              return { ...item, styles: { ...item.styles, ...styles } };
            }
            if (
              Array.isArray(item.content) &&
              item.content.every((i) => typeof i !== "string")
            ) {
              const newChildren = (item.content as ContentItem[]).map(
                updateStyleRecursively
              );
              // Only create new parent reference if a child actually changed
              const changed = newChildren.some((c, i) => c !== (item.content as ContentItem[])[i]);
              if (!changed) return item;
              return {
                ...item,
                content: newChildren,
              };
            }
            return item;
          };
          return {
            slides: state.slides.map((slide) =>
              slide.id === slideId
                ? { ...slide, content: updateStyleRecursively(slide.content) }
                : slide
            ),
          };
        });
      },
      applyLayoutToSlide: (slideId: string, layout: LayoutSlides) => {
        set((state) => ({
          slides: state.slides.map((slide) =>
            slide.id === slideId ? applySwap(slide, layout) : slide
          ),
        }));
      },
    }),
    { name: "slides-storage", version: 1 }
  )
);
