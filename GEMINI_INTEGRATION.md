# Gemini Integration Guide

## Overview

This app uses two Google AI services:

| Service | Model | Purpose |
|---|---|---|
| Gemini | `gemini-1.5-pro` | Generate outline points + slide layouts as JSON |
| Imagen | `imagen-3.0-generate-001` | Generate realistic images for slide placeholders |

---

## SDK and Setup

The integration uses `@google/generative-ai` v0.24.1 (already installed).

**Client initialization** — `src/actions/gemini.ts`:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
```

Set `GEMINI_API_KEY` in `.env` — get yours at [aistudio.google.com](https://aistudio.google.com).

---

## How the AI Pipeline Works

### 1. Outline Generation (`generateCreativePrompt`)

File: `src/actions/ai.ts`

- **Input:** User's free-text prompt (e.g., "Climate Change Effects")
- **Model:** `gemini-1.5-pro`
- **Output:** JSON `{ outlines: string[] }` — 5+ outline points

```typescript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const result = await model.generateContent(finalPrompt);
const json = JSON.parse(result.response.text().replace(/```json|```/g, ""));
```

### 2. Layout Generation (`generateLayoutsJSON`)

File: `src/actions/ai.ts`

- **Input:** Array of outline strings
- **Model:** `gemini-1.5-pro`
- **Output:** Array of `Slide` objects — full JSON with layout type, nested content elements, and image alt text

The prompt instructs Gemini to:
- Use available layout types (`accentLeft`, `twoColumns`, etc.)
- Use available content types (`heading1`, `paragraph`, `image`, etc.)
- Fill content with real text based on the outline
- Generate descriptive alt text for image slots

### 3. Image Generation (`generateImageURL`)

File: `src/actions/ai.ts`

- **Input:** Alt text / image description from the slide JSON
- **API:** Direct REST call to Imagen 3 (`imagen-3.0-generate-001`)
- **Output:** `data:image/png;base64,...` string (embedded inline in the slide)
- **Fallback:** `https://placehold.co/1024x1024` on any error

```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`,
  { method: "POST", body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1 } }) }
);
const base64 = data.predictions?.[0]?.bytesBase64Encoded;
return `data:image/png;base64,${base64}`;
```

---

## Upgrading Models

To use a faster or more capable model, change the model name:

```typescript
// Faster (recommended for outlines)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Higher reasoning (for complex layout generation)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
```

---

## Adding Streaming

For a better UX on long generations, you can switch to streaming:

```typescript
const result = await model.generateContentStream(prompt);
let text = "";
for await (const chunk of result.stream) {
  text += chunk.text();
}
```

This is most useful for the outline generation step where the user is waiting.

---

## Troubleshooting

**"Failed to parse JSON response"** — Gemini sometimes wraps JSON in markdown code fences. The app strips these with `.replace(/```json|```/g, "")`. If still failing, the model may have returned an explanation; consider adding `responseSchema` with the Gemini structured output feature.

**Imagen 3 returns empty** — Imagen 3 may not be available in all API tiers or regions. The app falls back to `placehold.co` images silently.

**Rate limits** — Free tier Gemini API has rate limits. For development, generate small numbers of slides. For production, add retry logic with exponential backoff.
