import { ContentItem, LayoutSlides, Slide } from "@/lib/types";
import { v4 } from "uuid";

export const createBlankSlide = (order: number): Slide => ({
  id: v4(),
  slideName: "Blank slide",
  type: "blank-card",
  slideOrder: order,
  className: "p-8 flex justify-center items-center min-h-[400px]",
  content: {
    id: v4(),
    type: "column",
    name: "Column",
    content: [
      {
        id: v4(),
        type: "title",
        name: "Title",
        content: "",
        placeholder: "Untitled Slide",
      },
    ],
  },
});

// Deep-clone a slide giving every node (slide + all nested content) a fresh id.
// Needed for duplicate to avoid React key collisions and DB id conflicts.
export const deepCloneSlideWithNewIds = (slide: Slide): Slide => {
  const clone = JSON.parse(JSON.stringify(slide)) as Slide;
  clone.id = v4();

  const reassignIds = (item: { id: string; content?: unknown }): void => {
    item.id = v4();
    if (Array.isArray(item.content)) {
      (item.content as { id: string; content?: unknown }[]).forEach(reassignIds);
    }
  };

  reassignIds(clone.content);
  return clone;
};

// Deep-clone a ContentItem tree, giving every node a fresh uuid.
// Layout templates in slideLayouts.ts call uuidv4() at module-load time,
// so every use of the same template would share identical IDs unless we clone.
export const deepCloneContentWithNewIds = (item: ContentItem): ContentItem => {
  const clone = JSON.parse(JSON.stringify(item)) as ContentItem;
  const reassign = (node: ContentItem): void => {
    node.id = v4();
    if (Array.isArray(node.content)) {
      (node.content as ContentItem[]).forEach(reassign);
    }
  };
  reassign(clone);
  return clone;
};

// Build a ready-to-insert Slide from a LayoutSlides template.
// Gives fresh IDs to all content nodes and stamps slideOrder.
export const layoutToSlide = (layout: LayoutSlides, order: number): Slide => ({
  id: v4(),
  slideName: layout.slideName,
  type: layout.type,
  slideOrder: order,
  className: layout.className,
  content: deepCloneContentWithNewIds(layout.content as ContentItem),
});
