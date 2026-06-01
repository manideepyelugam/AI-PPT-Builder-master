import type { ZodError } from "zod";
import { FAMILY_HINT_TEXT } from "./familyPicker";

const SCHEMA_DESCRIPTION = `Each slide is an object with:
- "outlineIndex": integer, 0-based, identifies which outline card this slide belongs to. Exactly one slide per outline index, in order.
- "kind": one of "hero" | "section" | "titleBody" | "twoColumn" | "threeColumn" | "imageLeft" | "imageRight" | "imageGrid" | "quote" | "stats" | "table" | "fullImage".
- Per-kind fields:
  - hero: { eyebrow?, title, subtitle? }
  - section: { number?, title, subtitle? }
  - titleBody: { title, body }
  - twoColumn: { title?, columns: [{ heading, body }, { heading, body }] }   // exactly 2
  - threeColumn: { title?, columns: [3 of { heading, body }] }               // exactly 3
  - imageLeft: { title, body, imageAlt }
  - imageRight: { title, body, imageAlt }
  - imageGrid: { title?, images: [{ alt, caption? }] }                       // 2 or 3
  - quote: { quote, attribution? }
  - stats: { title?, stats: [{ value, label }] }                             // 2 to 4
  - table: { title?, headers: string[] (2-5), rows: string[][] (1-8 rows) }
  - fullImage: { title?, imageAlt }`;

export function buildSemanticPrompt(outlines: string[]): string {
  return `You produce semantic presentation decks as JSON.

OUTLINES (one slide per card, in order):
${outlines.map((o, i) => `${i}. ${o}`).join("\n")}

Output a JSON array. Each element is a semantic slide.

${SCHEMA_DESCRIPTION}

Family guidance:
${FAMILY_HINT_TEXT}

Rules:
1. Emit EXACTLY ${outlines.length} slides — one per outline, with outlineIndex 0..${outlines.length - 1}.
2. Pick the family whose SHAPE fits the outline. Repeat families when content shape is similar — coherence beats variety.
3. First slide is almost always "hero".
4. Use "section" sparingly between thematic groups; do not start with it.
5. Image alt text must be a clear description of the subject. Avoid "image of" / "picture of".
6. For decks of 4 or more slides, at least 2 slides MUST use an image layout (imageLeft, imageRight, imageGrid, or fullImage). Spread them throughout the deck — not consecutive.
7. Output ONLY the JSON array. No markdown fences, no commentary.`;
}

export function buildRetryPrompt(
  outlines: string[],
  previousResponse: string,
  error: ZodError
): string {
  const issues = error.issues
    .slice(0, 10)
    .map((i) => `- at ${i.path.join(".")}: ${i.message}`)
    .join("\n");

  return `${buildSemanticPrompt(outlines)}

Your previous response failed schema validation. Errors:
${issues}

Previous response (truncated):
${previousResponse.slice(0, 2000)}

Return a corrected JSON array that satisfies the schema. Output ONLY the JSON array.`;
}
