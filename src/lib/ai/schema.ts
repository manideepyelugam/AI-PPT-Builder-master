import { z } from "zod";

// Semantic slide schema — what the AI emits. Pure semantic content; no
// ContentItem trees, no IDs, no className strings. The composer maps this
// into a full Slide using the curated layout families.

const Common = z.object({
  outlineIndex: z.number().int().min(0),
});

export const SemanticSlideSchema = z.discriminatedUnion("kind", [
  Common.extend({
    kind: z.literal("hero"),
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    subtitle: z.string().optional(),
  }),
  Common.extend({
    kind: z.literal("section"),
    number: z.string().optional(),
    title: z.string().min(1),
    subtitle: z.string().optional(),
  }),
  Common.extend({
    kind: z.literal("titleBody"),
    title: z.string().min(1),
    body: z.string().min(1),
  }),
  Common.extend({
    kind: z.literal("twoColumn"),
    title: z.string().optional(),
    columns: z
      .array(z.object({ heading: z.string(), body: z.string() }))
      .length(2),
  }),
  Common.extend({
    kind: z.literal("threeColumn"),
    title: z.string().optional(),
    columns: z
      .array(z.object({ heading: z.string(), body: z.string() }))
      .length(3),
  }),
  Common.extend({
    kind: z.literal("imageLeft"),
    title: z.string().min(1),
    body: z.string(),
    imageAlt: z.string().min(1),
  }),
  Common.extend({
    kind: z.literal("imageRight"),
    title: z.string().min(1),
    body: z.string(),
    imageAlt: z.string().min(1),
  }),
  Common.extend({
    kind: z.literal("imageGrid"),
    title: z.string().optional(),
    images: z
      .array(z.object({ alt: z.string(), caption: z.string().optional() }))
      .min(2)
      .max(3),
  }),
  Common.extend({
    kind: z.literal("quote"),
    quote: z.string().min(1),
    attribution: z.string().optional(),
  }),
  Common.extend({
    kind: z.literal("stats"),
    title: z.string().optional(),
    stats: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .min(2)
      .max(4),
  }),
  Common.extend({
    kind: z.literal("table"),
    title: z.string().optional(),
    headers: z.array(z.string()).min(2).max(5),
    rows: z.array(z.array(z.string())).min(1).max(8),
  }),
  Common.extend({
    kind: z.literal("fullImage"),
    title: z.string().optional(),
    imageAlt: z.string().min(1),
  }),
]);

export type SemanticSlide = z.infer<typeof SemanticSlideSchema>;
export type SemanticKind = SemanticSlide["kind"];

export const SemanticDeckSchema = z.array(SemanticSlideSchema).min(1).max(40);
export type SemanticDeck = z.infer<typeof SemanticDeckSchema>;
