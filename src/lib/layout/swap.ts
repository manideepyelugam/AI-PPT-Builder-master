import { v4 } from "uuid";
import type {
  ContentItem,
  LayoutSlides,
  Slide,
  SlotKind,
  TextStyles,
} from "@/lib/types";
import { slotCompatibilityScore, inferSlotKind } from "./slotKinds";

interface SlotInstance {
  kind: SlotKind;
  group?: string;
  content: ContentItem["content"];
  alt?: string;
  styles?: TextStyles;
  link?: string;
  code?: string;
  language?: string;
}

// Walk a content tree and collect every node that declares a `slot`.
export function extractSlots(root: ContentItem): SlotInstance[] {
  const out: SlotInstance[] = [];
  const walk = (node: ContentItem) => {
    const kind: SlotKind | null = node.slot ?? inferSlotKind(node.type);
    if (kind) {
      const hasContent =
        (typeof node.content === "string" && node.content.length > 0) ||
        (Array.isArray(node.content) && node.content.length > 0);
      if (hasContent || kind === "image" || kind === "table") {
        out.push({
          kind,
          group: node.slotMeta?.group,
          content: node.content,
          alt: node.alt,
          styles: node.styles,
          link: node.link,
          code: node.code,
          language: node.language,
        });
      }
    }
    if (Array.isArray(node.content) && node.content.length > 0) {
      const first = node.content[0];
      if (typeof first !== "string") {
        (node.content as ContentItem[]).forEach(walk);
      }
    }
  };
  walk(root);
  return out;
}

// Build a fresh clone of `target` with new IDs, injecting source slot values
// into the best-matching target slot.
export function applySwap(slide: Slide, target: LayoutSlides): Slide {
  const sourceSlots = extractSlots(slide.content);
  const used = new Set<number>();

  const cloneAndFill = (node: ContentItem): ContentItem => {
    const cloned: ContentItem = JSON.parse(JSON.stringify(node));
    cloned.id = v4();

    if (cloned.slot) {
      const targetKind = cloned.slot;
      const targetGroup = cloned.slotMeta?.group;

      let bestIdx = -1;
      let bestScore = 0;
      sourceSlots.forEach((src, i) => {
        if (used.has(i)) return;
        let score = slotCompatibilityScore(src.kind, targetKind);
        if (score === 0) return;
        if (targetGroup && src.group === targetGroup) score += 20;
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      });

      if (bestIdx >= 0) {
        const src = sourceSlots[bestIdx];
        used.add(bestIdx);
        if (typeof src.content === "string" || Array.isArray(src.content)) {
          cloned.content = src.content as ContentItem["content"];
        }
        if (src.alt !== undefined) cloned.alt = src.alt;
        if (src.styles) cloned.styles = { ...cloned.styles, ...src.styles };
        if (src.link !== undefined) cloned.link = src.link;
        if (src.code !== undefined) cloned.code = src.code;
        if (src.language !== undefined) cloned.language = src.language;
      }
    }

    if (Array.isArray(cloned.content) && cloned.content.length > 0) {
      const first = cloned.content[0];
      if (typeof first !== "string") {
        cloned.content = (cloned.content as ContentItem[]).map(cloneAndFill);
      }
    }

    return cloned;
  };

  const newContent = cloneAndFill(target.content as ContentItem);

  return {
    ...slide,
    type: target.type,
    slideName: target.slideName ?? slide.slideName,
    className: target.className ?? slide.className,
    content: newContent,
  };
}
