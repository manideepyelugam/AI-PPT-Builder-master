import PptxGenJS from "pptxgenjs";
import { ContentItem, Slide, Theme } from "@/lib/types";

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

type Box = { x: number; y: number; w: number; h: number };

function pickText(item: ContentItem): string {
  if (typeof item.content === "string") return item.content;
  if (Array.isArray(item.content) && typeof item.content[0] === "string") {
    return (item.content as string[]).join("\n");
  }
  return "";
}

function fontSizeFor(item: ContentItem): number {
  if (typeof item.styles?.fontSize === "number") return item.styles.fontSize;
  const t: string = item.type;
  switch (t) {
    case "title":
      return 44;
    case "heading1":
      return 36;
    case "heading2":
      return 28;
    case "heading3":
      return 22;
    case "heading4":
      return 18;
    case "blockquote":
    case "quote":
      return 22;
    case "code":
    case "codeBlock":
      return 14;
    case "stat-value":
      return 40;
    case "stat-label":
      return 14;
    case "eyebrow":
      return 14;
    case "subtitle":
      return 20;
    default:
      return 16;
  }
}

function isBold(item: ContentItem): boolean {
  if (item.styles?.fontWeight) {
    const w = item.styles.fontWeight;
    if (typeof w === "number") return w >= 600;
    if (typeof w === "string") return w === "bold" || Number(w) >= 600;
  }
  const t: string = item.type;
  return (
    t === "title" ||
    t.startsWith("heading") ||
    t === "stat-value" ||
    t === "eyebrow"
  );
}

function getChildren(item: ContentItem): ContentItem[] {
  if (!Array.isArray(item.content)) return [];
  if (item.content.length === 0) return [];
  if (typeof item.content[0] === "string") return [];
  return item.content as ContentItem[];
}

function isContainer(type: string): boolean {
  return (
    type === "column" ||
    type === "resizable-column" ||
    type === "multiColumn" ||
    type === "blank" ||
    type === "imageAndText"
  );
}

// In the editor:
//   "column"            renders as flex-col (VERTICAL stack)
//   "resizable-column"  renders as horizontal ResizablePanelGroup (HORIZONTAL split)
//   "multiColumn"       horizontal split
//   "imageAndText"      horizontal split
// Author overrides via className (`flex flex-col` / `flex-row`) are respected.
function isHorizontalContainer(item: ContentItem): boolean {
  const cls = (item.className ?? "").toLowerCase();
  if (cls.includes("flex-col")) return false;
  if (cls.includes("flex-row")) return true;
  switch (item.type) {
    case "resizable-column":
    case "multiColumn":
    case "imageAndText":
      return true;
    case "column":
    case "blank":
    default:
      return false;
  }
}

function parseFlexBasis(item: ContentItem): number | null {
  const cls = item.className ?? "";
  const m = cls.match(/(?:flex-)?\[?(\d+(?:\.\d+)?)%\]?/);
  if (m) return Number(m[1]) / 100;
  return null;
}

function weightedSplit(box: Box, kids: ContentItem[], horizontal: boolean): Box[] {
  const weights = kids.map((k) => parseFlexBasis(k) ?? 1 / kids.length);
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const norm = weights.map((w) => w / total);
  const result: Box[] = [];
  if (horizontal) {
    let cursor = box.x;
    norm.forEach((w) => {
      const width = box.w * w;
      result.push({ x: cursor, y: box.y, w: width, h: box.h });
      cursor += width;
    });
  } else {
    let cursor = box.y;
    norm.forEach((w) => {
      const height = box.h * w;
      result.push({ x: box.x, y: cursor, w: box.w, h: height });
      cursor += height;
    });
  }
  return result;
}

function renderNode(
  pptxSlide: PptxGenJS.Slide,
  item: ContentItem,
  box: Box,
  theme: Theme
): void {
  const t = item.type;

  if (isContainer(t)) {
    const kids = getChildren(item);
    if (kids.length === 0) return;
    const horizontal = isHorizontalContainer(item);
    const gap = 0.1;
    const raw = weightedSplit(box, kids, horizontal);
    const slots = raw.map((b, i) => {
      if (i === 0) return b;
      return horizontal
        ? { ...b, x: b.x + gap / 2, w: b.w - gap / 2 }
        : { ...b, y: b.y + gap / 2, h: b.h - gap / 2 };
    });
    kids.forEach((child, i) => renderNode(pptxSlide, child, slots[i], theme));
    return;
  }

  if (t === "image") {
    const src = typeof item.content === "string" ? item.content : "";
    if (!src) return;
    try {
      pptxSlide.addImage({
        ...box,
        sizing: { type: "cover", w: box.w, h: box.h },
        ...(src.startsWith("data:") ? { data: src } : { path: src }),
      });
    } catch {
      /* skip unloadable image */
    }
    return;
  }

  if (t === "calloutBox") {
    const txt = pickText(item);
    const fill = (item.bgColor ?? theme.accentColor ?? "#F5F5F5").replace("#", "");
    pptxSlide.addShape("roundRect", {
      ...box,
      fill: { color: fill, transparency: 80 },
      line: { color: fill, width: 0.5 },
      rectRadius: 0.08,
    });
    if (txt) {
      const padIn = 0.15;
      pptxSlide.addText(txt, {
        x: box.x + padIn,
        y: box.y + padIn,
        w: box.w - padIn * 2,
        h: box.h - padIn * 2,
        fontSize: 14,
        color: (item.styles?.color ?? theme.fontColor).replace("#", ""),
        valign: "middle",
      });
    }
    return;
  }

  if (t === "customButton") {
    const txt = pickText(item) || "Button";
    const fill = (item.bgColor ?? theme.accentColor ?? "#3B82F6").replace("#", "");
    pptxSlide.addShape("roundRect", {
      ...box,
      fill: { color: fill },
      line: { color: fill, width: 0 },
      rectRadius: 0.06,
    });
    pptxSlide.addText(txt, {
      ...box,
      fontSize: 14,
      bold: true,
      color: "FFFFFF",
      align: "center",
      valign: "middle",
    });
    return;
  }

  if ((t as string) === "blockquote" || (t as string) === "quote") {
    const txt = pickText(item);
    if (!txt) return;
    const accent = (theme.accentColor ?? "#888888").replace("#", "");
    pptxSlide.addShape("line", {
      x: box.x,
      y: box.y,
      w: 0,
      h: box.h,
      line: { color: accent, width: 3 },
    });
    pptxSlide.addText(txt, {
      x: box.x + 0.18,
      y: box.y,
      w: box.w - 0.18,
      h: box.h,
      fontSize: fontSizeFor(item),
      italic: true,
      color: (item.styles?.color ?? theme.fontColor).replace("#", ""),
      valign: "top",
    });
    return;
  }

  if (t === "divider") {
    pptxSlide.addShape("line", {
      x: box.x,
      y: box.y + box.h / 2,
      w: box.w,
      h: 0,
      line: { color: (theme.borderColor ?? "CCCCCC").replace("#", ""), width: 1 },
    });
    return;
  }

  if (t === "table") {
    const raw = item.content;
    if (Array.isArray(raw) && Array.isArray(raw[0])) {
      const rows = (raw as string[][]).map((row) =>
        row.map((cell) => ({ text: cell ?? "" }))
      );
      pptxSlide.addTable(rows, {
        ...box,
        fontSize: 12,
        color: theme.fontColor.replace("#", ""),
        border: { type: "solid", pt: 0.5, color: "CCCCCC" },
      });
    }
    return;
  }

  if (t === "bulletedList" || t === "numberedList" || t === "bulletList" || t === "todoList") {
    const items = Array.isArray(item.content) && typeof item.content[0] === "string"
      ? (item.content as string[])
      : [pickText(item)];
    pptxSlide.addText(
      items.map((line) => ({ text: line, options: { bullet: t === "numberedList" ? { type: "number" } : true } })),
      {
        ...box,
        fontSize: 14,
        color: theme.fontColor.replace("#", ""),
        valign: "top",
      }
    );
    return;
  }

  const text = pickText(item);
  if (!text) return;

  pptxSlide.addText(text, {
    ...box,
    fontSize: fontSizeFor(item),
    bold: isBold(item),
    italic: t === "blockquote" || t === "quote",
    color: (item.styles?.color ?? theme.fontColor).replace("#", ""),
    fontFace: item.styles?.fontFamily?.split(",")[0].replace(/['"]/g, "").trim() || theme.fontFamily,
    align: (item.styles?.textAlign as "left" | "center" | "right" | "justify") ?? "left",
    valign: "top",
    lineSpacingMultiple: 1.2,
  });
}

export async function exportDeckToPptx(
  slides: Slide[],
  theme: Theme,
  filename: string
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = filename;

  const bg = (theme.slideBackgroundColor ?? "#FFFFFF").replace("#", "");

  const ordered = [...slides].sort((a, b) => a.slideOrder - b.slideOrder);

  for (const slide of ordered) {
    const pptxSlide = pptx.addSlide();
    pptxSlide.background = { color: bg };

    const pad = 0.4;
    renderNode(
      pptxSlide,
      slide.content,
      { x: pad, y: pad, w: SLIDE_W - pad * 2, h: SLIDE_H - pad * 2 },
      theme
    );
  }

  await pptx.writeFile({ fileName: `${filename}.pptx` });
}
