import type { ContentType, SlotKind } from "@/lib/types";

export const DEFAULT_CONTENT_TYPE_FOR_SLOT: Record<SlotKind, ContentType> = {
  title: "title",
  subtitle: "heading3",
  eyebrow: "paragraph",
  paragraph: "paragraph",
  heading: "heading3",
  image: "image",
  quote: "blockquote",
  attribution: "paragraph",
  cta: "customButton",
  "stat-value": "heading1",
  "stat-label": "paragraph",
  table: "table",
  list: "bulletList",
  code: "codeBlock",
};

// Infer a slot kind from a node's ContentType, used as a fallback when a
// node doesn't carry an explicit `slot` annotation (legacy or AI output).
export function inferSlotKind(type: ContentType): SlotKind | null {
  switch (type) {
    case "title":
      return "title";
    case "heading1":
    case "heading2":
      return "title";
    case "heading3":
    case "heading4":
      return "heading";
    case "paragraph":
      return "paragraph";
    case "image":
      return "image";
    case "blockquote":
    case "quote":
      return "quote";
    case "table":
      return "table";
    case "bulletList":
    case "bulletedList":
    case "numberedList":
    case "todoList":
      return "list";
    case "codeBlock":
    case "code":
      return "code";
    case "customButton":
      return "cta";
    default:
      return null;
  }
}

// Score how well a source slot kind can fill a target slot.
// Higher is better. 0 means no usable mapping.
export function slotCompatibilityScore(
  fromKind: SlotKind,
  toKind: SlotKind
): number {
  if (fromKind === toKind) return 100;

  const textGroup: SlotKind[] = ["title", "subtitle", "heading", "paragraph", "eyebrow"];
  const quoteGroup: SlotKind[] = ["quote", "paragraph", "title"];
  const statGroup: SlotKind[] = ["stat-value", "stat-label", "heading", "paragraph"];

  if (textGroup.includes(fromKind) && textGroup.includes(toKind)) return 60;
  if (quoteGroup.includes(fromKind) && quoteGroup.includes(toKind)) return 50;
  if (statGroup.includes(fromKind) && statGroup.includes(toKind)) return 50;

  if (fromKind === "image" && toKind === "image") return 100;
  if (fromKind === "table" && toKind === "table") return 100;
  if (fromKind === "list" && toKind === "list") return 100;

  return 0;
}
