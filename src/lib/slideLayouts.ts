import { v4 as uuidv4 } from "uuid";
import type { ContentType, LayoutSlides, ContentItem } from "./types";
import { placeholderImageUrl } from "./images/placeholder";

const img = (alt: string) => ({
  id: uuidv4(),
  type: "image" as ContentType,
  name: "Image",
  content: placeholderImageUrl(alt),
  alt,
  slot: "image" as const,
  slotMeta: { required: true },
});

// ───────────────────────────── 1. Hero ─────────────────────────────
export const Hero: LayoutSlides = {
  slideName: "Hero",
  type: "hero",
  className:
    "min-h-[420px] flex flex-col justify-center p-[var(--slide-pad)] gap-[var(--slide-space-3)]",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "w-full max-w-3xl mx-auto flex flex-col gap-[var(--slide-space-3)] text-center",
    content: [
      {
        id: uuidv4(),
        type: "paragraph" as ContentType,
        name: "Eyebrow",
        content: "",
        placeholder: "EYEBROW",
        className: "text-[length:var(--slide-text-caption)] uppercase tracking-[var(--slide-tracking-tight)] opacity-70",
        slot: "eyebrow",
      },
      {
        id: uuidv4(),
        type: "title" as ContentType,
        name: "Title",
        content: "",
        placeholder: "A bold hero title",
        slot: "title",
        slotMeta: { required: true },
      },
      {
        id: uuidv4(),
        type: "paragraph" as ContentType,
        name: "Subtitle",
        content: "",
        placeholder: "Supporting subtitle that frames the deck",
        className: "text-[length:var(--slide-text-body)] opacity-80",
        slot: "subtitle",
      },
    ],
  },
};

// ───────────────────────── 2. Section Divider ─────────────────────────
export const SectionDivider: LayoutSlides = {
  slideName: "Section divider",
  type: "sectionDivider",
  className:
    "min-h-[420px] flex flex-col justify-center p-[var(--slide-pad)] gap-[var(--slide-space-2)]",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "w-full max-w-3xl mx-auto flex flex-col gap-[var(--slide-space-2)]",
    content: [
      {
        id: uuidv4(),
        type: "paragraph" as ContentType,
        name: "Section number",
        content: "",
        placeholder: "01",
        className: "text-[length:var(--slide-text-h3)] opacity-50",
        slot: "eyebrow",
      },
      {
        id: uuidv4(),
        type: "title" as ContentType,
        name: "Title",
        content: "",
        placeholder: "Section title",
        slot: "title",
        slotMeta: { required: true },
      },
      {
        id: uuidv4(),
        type: "paragraph" as ContentType,
        name: "Description",
        content: "",
        placeholder: "Short framing line for this section",
        className: "text-[length:var(--slide-text-body)] opacity-80",
        slot: "subtitle",
      },
    ],
  },
};

// ───────────────────────── 3. Title + Body ─────────────────────────
export const TitleBody: LayoutSlides = {
  slideName: "Title + body",
  type: "titleBody",
  className:
    "min-h-[420px] flex flex-col p-[var(--slide-pad)] gap-[var(--slide-space-4)]",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "w-full flex flex-col gap-[var(--slide-space-4)]",
    content: [
      {
        id: uuidv4(),
        type: "title" as ContentType,
        name: "Title",
        content: "",
        placeholder: "Slide title",
        slot: "title",
        slotMeta: { required: true },
      },
      {
        id: uuidv4(),
        type: "paragraph" as ContentType,
        name: "Body",
        content: "",
        placeholder: "Body paragraph — explain the key idea in 2-4 sentences.",
        slot: "paragraph",
        slotMeta: { required: true },
      },
    ],
  },
};

// ───────────────────────── 4. Two Column ─────────────────────────
export const TwoColumn: LayoutSlides = {
  slideName: "Two column",
  type: "twoColumn",
  className:
    "min-h-[420px] flex flex-col p-[var(--slide-pad)] gap-[var(--slide-space-4)]",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "w-full flex flex-col gap-[var(--slide-space-4)]",
    content: [
      {
        id: uuidv4(),
        type: "title" as ContentType,
        name: "Title",
        content: "",
        placeholder: "Slide title",
        slot: "title",
      },
      {
        id: uuidv4(),
        type: "resizable-column" as ContentType,
        name: "Two columns",
        className: "gap-[var(--slide-gutter)]",
        content: [
          {
            id: uuidv4(),
            type: "column" as ContentType,
            name: "Column 1",
            className: "flex flex-col gap-[var(--slide-space-2)]",
            content: [
              {
                id: uuidv4(),
                type: "heading3" as ContentType,
                name: "Heading",
                content: "",
                placeholder: "Column heading",
                slot: "heading",
                slotMeta: { group: "col-1" },
              },
              {
                id: uuidv4(),
                type: "paragraph" as ContentType,
                name: "Body",
                content: "",
                placeholder: "Column body",
                slot: "paragraph",
                slotMeta: { group: "col-1" },
              },
            ],
          },
          {
            id: uuidv4(),
            type: "column" as ContentType,
            name: "Column 2",
            className: "flex flex-col gap-[var(--slide-space-2)]",
            content: [
              {
                id: uuidv4(),
                type: "heading3" as ContentType,
                name: "Heading",
                content: "",
                placeholder: "Column heading",
                slot: "heading",
                slotMeta: { group: "col-2" },
              },
              {
                id: uuidv4(),
                type: "paragraph" as ContentType,
                name: "Body",
                content: "",
                placeholder: "Column body",
                slot: "paragraph",
                slotMeta: { group: "col-2" },
              },
            ],
          },
        ],
      },
    ],
  },
};

// ───────────────────────── 5. Three Column ─────────────────────────
export const ThreeColumn: LayoutSlides = {
  slideName: "Three column",
  type: "threeColumn",
  className:
    "min-h-[420px] flex flex-col p-[var(--slide-pad)] gap-[var(--slide-space-4)]",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "w-full flex flex-col gap-[var(--slide-space-4)]",
    content: [
      {
        id: uuidv4(),
        type: "title" as ContentType,
        name: "Title",
        content: "",
        placeholder: "Slide title",
        slot: "title",
      },
      {
        id: uuidv4(),
        type: "resizable-column" as ContentType,
        name: "Three columns",
        className: "gap-[var(--slide-gutter)]",
        content: ["col-1", "col-2", "col-3"].map((group): ContentItem => ({
          id: uuidv4(),
          type: "column" as ContentType,
          name: `Column ${group}`,
          className: "flex flex-col gap-[var(--slide-space-2)]",
          content: [
            {
              id: uuidv4(),
              type: "heading3" as ContentType,
              name: "Heading",
              content: "",
              placeholder: "Heading",
              slot: "heading",
              slotMeta: { group },
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Body",
              content: "",
              placeholder: "Body",
              slot: "paragraph",
              slotMeta: { group },
            },
          ],
        })),
      },
    ],
  },
};

// ───────────────────────── 6. Image Left ─────────────────────────
export const ImageLeft: LayoutSlides = {
  slideName: "Image left",
  type: "imageLeft",
  className: "min-h-[420px] p-[var(--slide-pad)]",
  content: {
    id: uuidv4(),
    type: "resizable-column" as ContentType,
    name: "Image left",
    className: "h-full gap-[var(--slide-gutter)] items-center",
    content: [
      img("Left side imagery"),
      {
        id: uuidv4(),
        type: "column" as ContentType,
        name: "Text",
        className: "flex flex-col gap-[var(--slide-space-3)] justify-center",
        content: [
          {
            id: uuidv4(),
            type: "heading1" as ContentType,
            name: "Title",
            content: "",
            placeholder: "Title",
            slot: "title",
            slotMeta: { required: true },
          },
          {
            id: uuidv4(),
            type: "paragraph" as ContentType,
            name: "Body",
            content: "",
            placeholder: "Body paragraph",
            slot: "paragraph",
          },
        ],
      },
    ],
  },
};

// ───────────────────────── 7. Image Right ─────────────────────────
export const ImageRight: LayoutSlides = {
  slideName: "Image right",
  type: "imageRight",
  className: "min-h-[420px] p-[var(--slide-pad)]",
  content: {
    id: uuidv4(),
    type: "resizable-column" as ContentType,
    name: "Image right",
    className: "h-full gap-[var(--slide-gutter)] items-center",
    content: [
      {
        id: uuidv4(),
        type: "column" as ContentType,
        name: "Text",
        className: "flex flex-col gap-[var(--slide-space-3)] justify-center",
        content: [
          {
            id: uuidv4(),
            type: "heading1" as ContentType,
            name: "Title",
            content: "",
            placeholder: "Title",
            slot: "title",
            slotMeta: { required: true },
          },
          {
            id: uuidv4(),
            type: "paragraph" as ContentType,
            name: "Body",
            content: "",
            placeholder: "Body paragraph",
            slot: "paragraph",
          },
        ],
      },
      img("Right side imagery"),
    ],
  },
};

// ───────────────────────── 8. Image Grid ─────────────────────────
export const ImageGrid: LayoutSlides = {
  slideName: "Image grid",
  type: "imageGrid",
  className:
    "min-h-[420px] flex flex-col p-[var(--slide-pad)] gap-[var(--slide-space-4)]",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "w-full flex flex-col gap-[var(--slide-space-4)]",
    content: [
      {
        id: uuidv4(),
        type: "title" as ContentType,
        name: "Title",
        content: "",
        placeholder: "Slide title",
        slot: "title",
      },
      {
        id: uuidv4(),
        type: "resizable-column" as ContentType,
        name: "Image columns",
        className: "gap-[var(--slide-gutter)]",
        content: [1, 2, 3].map((i): ContentItem => ({
          id: uuidv4(),
          type: "column" as ContentType,
          name: `Image ${i}`,
          className: "flex flex-col gap-[var(--slide-space-2)]",
          content: [
            {
              ...img(`Image ${i}`),
              slotMeta: { group: `img-${i}` },
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Caption",
              content: "",
              placeholder: "Caption",
              className: "text-[length:var(--slide-text-caption)] opacity-80 text-center",
              slot: "paragraph",
              slotMeta: { group: `img-${i}` },
            },
          ],
        })),
      },
    ],
  },
};

// ───────────────────────── 9. Quote ─────────────────────────
export const Quote: LayoutSlides = {
  slideName: "Quote",
  type: "quote",
  className:
    "min-h-[420px] flex flex-col justify-center p-[var(--slide-pad)] gap-[var(--slide-space-3)]",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "w-full max-w-3xl mx-auto flex flex-col gap-[var(--slide-space-3)]",
    content: [
      {
        id: uuidv4(),
        type: "blockquote" as ContentType,
        name: "Quote",
        content: "",
        placeholder: "A memorable quote that anchors the slide.",
        slot: "quote",
        slotMeta: { required: true },
      },
      {
        id: uuidv4(),
        type: "paragraph" as ContentType,
        name: "Attribution",
        content: "",
        placeholder: "— Attribution",
        className: "text-[length:var(--slide-text-caption)] opacity-70",
        slot: "attribution",
      },
    ],
  },
};

// ───────────────────────── 10. Stats ─────────────────────────
export const Stats: LayoutSlides = {
  slideName: "Stats",
  type: "stats",
  className:
    "min-h-[420px] flex flex-col p-[var(--slide-pad)] gap-[var(--slide-space-4)]",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "w-full flex flex-col gap-[var(--slide-space-4)]",
    content: [
      {
        id: uuidv4(),
        type: "title" as ContentType,
        name: "Title",
        content: "",
        placeholder: "Stats title",
        slot: "title",
      },
      {
        id: uuidv4(),
        type: "resizable-column" as ContentType,
        name: "Stats row",
        className: "gap-[var(--slide-gutter)]",
        content: [1, 2, 3].map((i): ContentItem => ({
          id: uuidv4(),
          type: "column" as ContentType,
          name: `Stat ${i}`,
          className: "flex flex-col gap-[var(--slide-space-1)] text-center",
          content: [
            {
              id: uuidv4(),
              type: "heading1" as ContentType,
              name: "Stat value",
              content: "",
              placeholder: "42%",
              slot: "stat-value",
              slotMeta: { group: `stat-${i}`, required: true },
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Stat label",
              content: "",
              placeholder: "What it measures",
              className: "text-[length:var(--slide-text-caption)] opacity-80",
              slot: "stat-label",
              slotMeta: { group: `stat-${i}` },
            },
          ],
        })),
      },
    ],
  },
};

// ───────────────────────── 11. Table ─────────────────────────
export const TableLayout: LayoutSlides = {
  slideName: "Table",
  type: "table",
  className:
    "min-h-[420px] flex flex-col p-[var(--slide-pad)] gap-[var(--slide-space-3)]",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "w-full flex flex-col gap-[var(--slide-space-3)]",
    content: [
      {
        id: uuidv4(),
        type: "title" as ContentType,
        name: "Title",
        content: "",
        placeholder: "Table title",
        slot: "title",
      },
      {
        id: uuidv4(),
        type: "table" as ContentType,
        name: "Table",
        initialRows: 3,
        initialColumns: 3,
        content: [],
        slot: "table",
        slotMeta: { required: true },
      },
    ],
  },
};

// ───────────────────────── 12. Full Image ─────────────────────────
export const FullImage: LayoutSlides = {
  slideName: "Full image",
  type: "fullImage",
  className: "min-h-[420px] relative overflow-hidden",
  content: {
    id: uuidv4(),
    type: "column" as ContentType,
    name: "Column",
    className: "relative h-full w-full",
    content: [
      {
        id: uuidv4(),
        type: "image" as ContentType,
        name: "Image",
        content: placeholderImageUrl("Full bleed background image"),
        alt: "Full bleed background image",
        className: "absolute inset-0 h-full w-full object-cover",
        slot: "image",
        slotMeta: { required: true },
      },
      {
        id: uuidv4(),
        type: "title" as ContentType,
        name: "Overlay title",
        content: "",
        placeholder: "Overlay title",
        className:
          "relative z-10 self-end p-[var(--slide-pad)] text-[color:var(--slide-bg)] mix-blend-normal",
        slot: "title",
      },
    ],
  },
};

// ───────────────────────────────────────────────────────────────────
// Legacy exports — preserved so existing imports compile and old
// saved decks resolve via aliases. They now point at the closest
// family layout from the curated set.
// ───────────────────────────────────────────────────────────────────
export const BlankCard = TitleBody;
export const AccentLeft = ImageLeft;
export const AccentRight = ImageRight;
export const ImageAndText = ImageLeft;
export const TextAndImage = ImageRight;
export const TwoColumns = TwoColumn;
export const TwoColumnsWithHeadings = TwoColumn;
export const ThreeColumns = ThreeColumn;
export const ThreeColumnsWithHeadings = ThreeColumn;
export const FourColumns = ThreeColumn;
export const TwoImageColumns = ImageGrid;
export const ThreeImageColumns = ImageGrid;
export const FourImageColumns = ImageGrid;

// Convenience: ordered list of every curated family.
export const CURATED_LAYOUTS: LayoutSlides[] = [
  Hero,
  SectionDivider,
  TitleBody,
  TwoColumn,
  ThreeColumn,
  ImageLeft,
  ImageRight,
  ImageGrid,
  Quote,
  Stats,
  TableLayout,
  FullImage,
];
