import type { SemanticKind } from "./schema";

// One-line guidance per family, embedded in the prompt so the model has
// consistent semantic→kind hints.
export const FAMILY_HINTS: Record<SemanticKind, string> = {
  hero: "opening slide. First outline only. Big title, optional eyebrow + subtitle.",
  section: "chapter divider between thematic groups. Number + title + framing line.",
  titleBody: "single-idea slide (default). One title, one body paragraph.",
  twoColumn: "parallel concepts, comparisons, 'X vs Y'. Two heading+body columns.",
  threeColumn: "three parallel concepts. Three heading+body columns.",
  imageLeft: "an idea that needs visual support, image on the left.",
  imageRight: "an idea that needs visual support, image on the right.",
  imageGrid: "multiple related visuals. Title + 2-3 captioned images.",
  quote: "a memorable line. Quote + optional attribution.",
  stats: "2-4 measurable numbers, each with a value and a label.",
  table: "structured row/column data with headers.",
  fullImage: "cover or strong visual break. Single full-bleed image + optional overlay title.",
};

export const FAMILY_HINT_TEXT = (Object.keys(FAMILY_HINTS) as SemanticKind[])
  .map((k) => `- ${k}: ${FAMILY_HINTS[k]}`)
  .join("\n");
