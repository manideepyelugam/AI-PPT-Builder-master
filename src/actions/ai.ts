"use server";

import client from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ContentItem, ReturnProps, Slide } from "@/lib/types";
import { getServerSession } from "next-auth";
import { genAI } from "./gemini";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { placeholderImageUrl } from "@/lib/images/placeholder";
import {
  SemanticDeckSchema,
  composeDeck,
  fallbackDeck,
  buildSemanticPrompt,
  buildRetryPrompt,
  type SemanticSlide,
} from "@/lib/ai";

export const generateCreativePrompt = async (
  userPrompt: string
): Promise<ReturnProps> => {
  const finalPrompt = `Create a presentation outline for the following topic: "${userPrompt}".

Return a JSON object with an "outlines" array containing AT LEAST 5 slide titles (ideally 6-8). Each title should be a concise, clear heading suitable for a presentation slide — not a full sentence.

Return ONLY the raw JSON object below. No markdown, no code fences, no explanations:
{
  "outlines": [
    "Slide Title 1",
    "Slide Title 2",
    "Slide Title 3",
    "Slide Title 4",
    "Slide Title 5"
  ]
}`;

  try {
    const raw = await callModel(finalPrompt);

    if (!raw) {
      return { status: 400, error: "No response generated" };
    }

    try {
      const cleaned = stripFence(raw);
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        return { status: 500, error: "No JSON found in AI response" };
      }
      const jsonResponse = JSON.parse(match[0]) as { outlines?: string[] };

      if (!Array.isArray(jsonResponse.outlines) || jsonResponse.outlines.length === 0) {
        return { status: 500, error: "AI returned no slide titles" };
      }

      if (jsonResponse.outlines.length < 5) {
        return {
          status: 500,
          error: `Only ${jsonResponse.outlines.length} titles returned — please try again`,
        };
      }

      return { status: 200, data: jsonResponse };
    } catch (error) {
      return {
        status: 500,
        error: "Failed to parse response: " + (error as Error).message,
      };
    }
  } catch (error) {
    return {
      status: 500,
      error: "Internal Server Error: " + (error as Error).message,
    };
  }
};

const findImageComponents = (contentObject: ContentItem): ContentItem[] => {
  const images: ContentItem[] = [];

  if (contentObject.type === "image") {
    images.push(contentObject);
  }

  // Recurse only into ContentItem[] children. Tables carry string[][] and
  // legacy strings — those have no images and must not be cast.
  if (Array.isArray(contentObject.content) && contentObject.content.length > 0) {
    const first = contentObject.content[0];
    if (typeof first !== "string") {
      (contentObject.content as ContentItem[]).forEach((child) => {
        images.push(...findImageComponents(child));
      });
    }
  }

  return images;
};

// Single Gemini image-generation attempt. Returns a data URL on success,
// null on any failure (network, non-OK response, missing inlineData).
async function callGeminiImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[AI images] GEMINI_API_KEY missing — using Picsum fallback");
    return null;
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent";
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Create a professional, photorealistic 16:9 presentation image for: ${prompt}. High quality, business-appropriate, no text overlays, no watermarks.`,
          },
        ],
      },
    ],
    generationConfig: {
      // gemini-2.5-flash-image-preview requires BOTH modalities listed.
      responseModalities: ["IMAGE", "TEXT"],
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45_000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(
        "[AI images] Gemini non-OK:",
        res.status,
        errText.slice(0, 400)
      );
      return null;
    }

    const data = await res.json();
    const parts =
      (data?.candidates?.[0]?.content?.parts as Array<{
        inlineData?: { mimeType?: string; data?: string };
        inline_data?: { mime_type?: string; data?: string };
        text?: string;
      }>) ?? [];

    for (const p of parts) {
      const inline = p.inlineData ?? p.inline_data;
      const dataB64 = inline?.data;
      if (dataB64) {
        const mime =
          (inline as { mimeType?: string }).mimeType ??
          (inline as { mime_type?: string }).mime_type ??
          "image/png";
        return `data:${mime};base64,${dataB64}`;
      }
    }

    console.warn(
      "[AI images] Gemini returned no inlineData. Parts preview:",
      JSON.stringify(parts).slice(0, 300)
    );
    return null;
  } catch (err) {
    console.warn("[AI images] Gemini error:", (err as Error).message);
    return null;
  }
}

const generateImageURL = async (prompt: string): Promise<string> => {
  // ── Tier 1: Gemini 2.5 Flash Image ("Nano Banana") with one retry ───────
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await callGeminiImage(prompt);
    if (result) return result;
    if (attempt === 0) {
      // Brief backoff before the retry. Don't loop tight on rate limits.
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  // ── Tier 2: Picsum Photos — always instant, no auth, seed-stable ─────────
  return placeholderImageUrl(prompt);
};

// Run image generation for every image node in a slide concurrently.
const replaceImagesWithGenerated = async (layout: Slide): Promise<void> => {
  const imageComponents = findImageComponents(layout.content);
  if (imageComponents.length === 0) return;

  // Derive slide context from the first title/heading we can find so image
  // prompts reflect the slide content, not just the bare alt.
  const slideContext = extractSlideContext(layout.content);

  await Promise.all(
    imageComponents.map(async (component) => {
      const alt = component.alt || "Abstract professional background";
      const prompt = slideContext
        ? `${alt}. Slide context: ${slideContext}`
        : alt;
      component.content = await generateImageURL(prompt);
    })
  );
};

// Walk the tree to find the first title/heading text — used to enrich image
// prompts with the slide's subject matter.
function extractSlideContext(node: ContentItem): string {
  if (
    (node.type === "title" ||
      node.type === "heading1" ||
      node.type === "heading2") &&
    typeof node.content === "string" &&
    node.content.trim().length > 0
  ) {
    return node.content.trim();
  }
  if (Array.isArray(node.content) && node.content.length > 0) {
    const first = node.content[0];
    if (typeof first !== "string") {
      for (const child of node.content as ContentItem[]) {
        const found = extractSlideContext(child);
        if (found) return found;
      }
    }
  }
  return "";
}

// Concurrency-capped Promise.all so a deck with many slides doesn't blow
// past Gemini rate limits.
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      results[i] = await worker(items[i]);
    }
  });
  await Promise.all(runners);
  return results;
}

export const generateLayoutsJSON = async (
  outlines: string[]
): Promise<ReturnProps> => {
  try {
    const slides = await generateSemanticDeckAndCompose(outlines);
    // Cap concurrent image generations across the whole deck to avoid
    // hammering the Gemini image endpoint.
    await mapWithConcurrency(slides, 4, replaceImagesWithGenerated);
    return { status: 200, data: slides };
  } catch (error) {
    return {
      status: 500,
      error: "Internal Server Error" + error,
    };
  }
};

function stripFence(s: string): string {
  return s.replace(/```json|```/g, "").trim();
}

async function callModel(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateSemanticDeckAndCompose(
  outlines: string[]
): Promise<Slide[]> {
  const semantic = await generateSemanticDeck(outlines);
  if (!semantic) {
    console.warn("[AI deck] Validation failed twice — using fallback deck");
    return fallbackDeck(outlines);
  }
  return composeDeck(semantic, outlines);
}

async function generateSemanticDeck(
  outlines: string[]
): Promise<SemanticSlide[] | null> {
  const first = await callModel(buildSemanticPrompt(outlines));
  const firstParsed = tryParse(first);
  if (firstParsed.ok) return firstParsed.data;

  console.warn(
    "[AI deck] First attempt failed:",
    firstParsed.reason.slice(0, 200)
  );

  const second = await callModel(
    buildRetryPrompt(outlines, first, firstParsed.error)
  );
  const secondParsed = tryParse(second);
  if (secondParsed.ok) return secondParsed.data;

  console.warn(
    "[AI deck] Retry failed:",
    secondParsed.reason.slice(0, 200)
  );
  return null;
}

type ParseResult =
  | { ok: true; data: SemanticSlide[] }
  | { ok: false; reason: string; error: ZodError };

function tryParse(raw: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(stripFence(raw));
  } catch (e) {
    return {
      ok: false,
      reason: (e as Error).message,
      error: new ZodError([
        { code: "custom", path: [], message: `JSON parse: ${(e as Error).message}` },
      ]),
    };
  }
  const result = SemanticDeckSchema.safeParse(json);
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    reason: result.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; "),
    error: result.error,
  };
}

export const generateLayout = async (
  projectId: string,
  theme: string
): Promise<ReturnProps> => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { status: 403, error: "User not authenticated" };
    }

    const userExists = await client.user.findUnique({
      where: { id: session.user.id },
    });

    if (!userExists) {
      return { status: 403, error: "User not found in database" };
    }

    const bypassPayments = process.env.DEV_BYPASS_PAYMENTS === "true";

    if (!bypassPayments && !userExists.subscription) {
      return { status: 403, error: "User does not have an active subscription" };
    }

    const project = await client.project.findUnique({
      where: { id: projectId, isDeleted: false },
    });

    if (!project) {
      return { status: 404, error: "Project not found" };
    }

    if (!project.outlines || project.outlines.length === 0) {
      return { status: 400, error: "Project does not have outlines" };
    }

    const layouts = await generateLayoutsJSON(project.outlines);

    if (layouts.status !== 200) {
      return layouts;
    }

    await client.project.update({
      where: { id: projectId },
      data: { slides: layouts.data as Prisma.InputJsonValue, themeName: theme },
    });

    return { status: 200, data: layouts.data };
  } catch (error) {
    return { status: 500, error: "Internal Server Error: " + error };
  }
};

// ─────────────────────────── AI single-slide ───────────────────────────
const AI_SLIDE_KINDS = [
  "hero",
  "titleBody",
  "twoColumn",
  "threeColumn",
  "imageLeft",
  "imageRight",
  "imageGrid",
  "quote",
  "stats",
  "fullImage",
] as const;
export type AISlideKind = (typeof AI_SLIDE_KINDS)[number];

function buildSingleSlidePrompt(
  kind: AISlideKind,
  title: string,
  topic: string
): string {
  const shape: Record<AISlideKind, string> = {
    hero: `{"kind":"hero","outlineIndex":0,"eyebrow":"...","title":"...","subtitle":"..."}`,
    titleBody: `{"kind":"titleBody","outlineIndex":0,"title":"...","body":"..."}`,
    twoColumn: `{"kind":"twoColumn","outlineIndex":0,"title":"...","columns":[{"heading":"...","body":"..."},{"heading":"...","body":"..."}]}`,
    threeColumn: `{"kind":"threeColumn","outlineIndex":0,"title":"...","columns":[{"heading":"...","body":"..."},{"heading":"...","body":"..."},{"heading":"...","body":"..."}]}`,
    imageLeft: `{"kind":"imageLeft","outlineIndex":0,"title":"...","body":"...","imageAlt":"detailed image description"}`,
    imageRight: `{"kind":"imageRight","outlineIndex":0,"title":"...","body":"...","imageAlt":"detailed image description"}`,
    imageGrid: `{"kind":"imageGrid","outlineIndex":0,"title":"...","images":[{"alt":"...","caption":"..."},{"alt":"...","caption":"..."},{"alt":"...","caption":"..."}]}`,
    quote: `{"kind":"quote","outlineIndex":0,"quote":"...","attribution":"..."}`,
    stats: `{"kind":"stats","outlineIndex":0,"title":"...","stats":[{"value":"42%","label":"..."},{"value":"3x","label":"..."},{"value":"$1M","label":"..."}]}`,
    fullImage: `{"kind":"fullImage","outlineIndex":0,"title":"...","imageAlt":"detailed image description"}`,
  };
  return `You are a presentation designer. Generate ONE slide as a single JSON object.

Slide intent: kind="${kind}", title="${title}", topic="${topic}".

Return STRICT JSON matching exactly this shape (no markdown, no fences, no commentary):
${shape[kind]}

Rules:
- outlineIndex MUST be 0.
- Keep prose tight and presentation-ready.
- imageAlt fields must describe a concrete photographic scene.`;
}

export const generateAISlide = async (
  projectId: string,
  slideKind: AISlideKind,
  title: string,
  topic: string,
  insertAt: number
): Promise<ReturnProps> => {
  try {
    if (!projectId) return { status: 400, error: "Project ID is required" };
    if (!AI_SLIDE_KINDS.includes(slideKind)) {
      return { status: 400, error: "Invalid slide kind" };
    }
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { status: 403, error: "User not authenticated" };
    }

    const raw = await callModel(buildSingleSlidePrompt(slideKind, title, topic));
    const parsed = tryParseSingle(raw);
    if (!parsed) {
      return { status: 500, error: "AI returned unparseable slide" };
    }

    const composed = composeDeck([parsed], [title || topic || ""]);
    const slide = composed[0];
    slide.slideOrder = insertAt;
    await replaceImagesWithGenerated(slide);

    return { status: 200, data: slide };
  } catch (error) {
    return { status: 500, error: "Internal Server Error: " + error };
  }
};

function tryParseSingle(raw: string): SemanticSlide | null {
  try {
    const cleaned = stripFence(raw);
    const json = JSON.parse(cleaned);
    const arr = Array.isArray(json) ? json : [json];
    const result = SemanticDeckSchema.safeParse(arr);
    if (result.success) return result.data[0];
    console.warn("[AI slide] zod failure:", result.error.issues.slice(0, 3));
    return null;
  } catch (e) {
    console.warn("[AI slide] JSON parse:", (e as Error).message);
    return null;
  }
}
