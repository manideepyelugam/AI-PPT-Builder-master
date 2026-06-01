import { v4 } from "uuid";
import type { ContentItem, LayoutSlides, Slide } from "@/lib/types";
import {
  FullImage,
  Hero,
  ImageGrid,
  ImageLeft,
  ImageRight,
  Quote,
  SectionDivider,
  Stats,
  TableLayout,
  ThreeColumn,
  TitleBody,
  TwoColumn,
} from "@/lib/slideLayouts";
import type { SemanticKind, SemanticSlide } from "./schema";

// Map semantic kind → layout template.
const LAYOUT_FOR_KIND: Record<SemanticKind, LayoutSlides> = {
  hero: Hero,
  section: SectionDivider,
  titleBody: TitleBody,
  twoColumn: TwoColumn,
  threeColumn: ThreeColumn,
  imageLeft: ImageLeft,
  imageRight: ImageRight,
  imageGrid: ImageGrid,
  quote: Quote,
  stats: Stats,
  table: TableLayout,
  fullImage: FullImage,
};

// Deep clone with fresh IDs.
function cloneTree(node: ContentItem): ContentItem {
  const cloned: ContentItem = JSON.parse(JSON.stringify(node));
  const reassign = (n: ContentItem) => {
    n.id = v4();
    if (Array.isArray(n.content) && n.content.length > 0) {
      const first = n.content[0];
      if (typeof first !== "string") {
        (n.content as ContentItem[]).forEach(reassign);
      }
    }
  };
  reassign(cloned);
  return cloned;
}

// Walk a content tree and call visit() on every node.
function walk(node: ContentItem, visit: (n: ContentItem) => void): void {
  visit(node);
  if (Array.isArray(node.content) && node.content.length > 0) {
    const first = node.content[0];
    if (typeof first !== "string") {
      (node.content as ContentItem[]).forEach((c) => walk(c, visit));
    }
  }
}

// Remove a slot-tagged child from the cloned tree by group.
function removeByGroup(root: ContentItem, group: string): void {
  const prune = (node: ContentItem): void => {
    if (Array.isArray(node.content) && node.content.length > 0) {
      const first = node.content[0];
      if (typeof first !== "string") {
        const arr = node.content as ContentItem[];
        node.content = arr.filter((c) => {
          // a node belongs to `group` if it (or any descendant) has slotMeta.group === group
          let belongs = false;
          walk(c, (n) => {
            if (n.slotMeta?.group === group) belongs = true;
          });
          return !belongs;
        }) as ContentItem["content"];
        (node.content as ContentItem[]).forEach(prune);
      }
    }
  };
  prune(root);
}

// Find slot-tagged nodes by slot kind, optionally filtered by group.
function findSlot(
  root: ContentItem,
  kind: string,
  group?: string
): ContentItem | undefined {
  let found: ContentItem | undefined;
  walk(root, (n) => {
    if (found) return;
    if (n.slot === kind && (group ? n.slotMeta?.group === group : true)) {
      found = n;
    }
  });
  return found;
}

function setText(node: ContentItem | undefined, value: string): void {
  if (node) node.content = value;
}

function setImage(node: ContentItem | undefined, alt: string): void {
  if (node) {
    node.alt = alt;
    // image URL is replaced later by replaceImagesWithGenerated; keep current
    // placeholder so the editor renders something while images resolve.
  }
}

function composeOne(semantic: SemanticSlide, order: number): Slide {
  const template = LAYOUT_FOR_KIND[semantic.kind];
  const content = cloneTree(template.content as ContentItem);

  switch (semantic.kind) {
    case "hero":
      setText(findSlot(content, "title"), semantic.title);
      setText(findSlot(content, "eyebrow"), semantic.eyebrow ?? "");
      setText(findSlot(content, "subtitle"), semantic.subtitle ?? "");
      break;
    case "section":
      setText(findSlot(content, "title"), semantic.title);
      setText(findSlot(content, "eyebrow"), semantic.number ?? "");
      setText(findSlot(content, "subtitle"), semantic.subtitle ?? "");
      break;
    case "titleBody":
      setText(findSlot(content, "title"), semantic.title);
      setText(findSlot(content, "paragraph"), semantic.body);
      break;
    case "twoColumn":
      if (semantic.title) setText(findSlot(content, "title"), semantic.title);
      semantic.columns.forEach((col, i) => {
        const group = `col-${i + 1}`;
        setText(findSlot(content, "heading", group), col.heading);
        setText(findSlot(content, "paragraph", group), col.body);
      });
      break;
    case "threeColumn":
      if (semantic.title) setText(findSlot(content, "title"), semantic.title);
      semantic.columns.forEach((col, i) => {
        const group = `col-${i + 1}`;
        setText(findSlot(content, "heading", group), col.heading);
        setText(findSlot(content, "paragraph", group), col.body);
      });
      break;
    case "imageLeft":
    case "imageRight":
      setText(findSlot(content, "title"), semantic.title);
      setText(findSlot(content, "paragraph"), semantic.body);
      setImage(findSlot(content, "image"), semantic.imageAlt);
      break;
    case "imageGrid": {
      if (semantic.title) setText(findSlot(content, "title"), semantic.title);
      // Layout template ships 3 image columns. Trim to N if needed.
      for (let i = semantic.images.length + 1; i <= 3; i++) {
        removeByGroup(content, `img-${i}`);
      }
      semantic.images.forEach((image, i) => {
        const group = `img-${i + 1}`;
        setImage(findSlot(content, "image", group), image.alt);
        setText(findSlot(content, "paragraph", group), image.caption ?? "");
      });
      break;
    }
    case "quote":
      setText(findSlot(content, "quote"), semantic.quote);
      setText(findSlot(content, "attribution"), semantic.attribution ?? "");
      break;
    case "stats": {
      if (semantic.title) setText(findSlot(content, "title"), semantic.title);
      for (let i = semantic.stats.length + 1; i <= 3; i++) {
        removeByGroup(content, `stat-${i}`);
      }
      // If schema allowed 4 stats, the template has 3 — duplicate the last
      // group before filling. For now schema caps at 4 but template caps at 3;
      // composer trims down. Extra stats are dropped (length validated 2-4).
      semantic.stats.slice(0, 3).forEach((stat, i) => {
        const group = `stat-${i + 1}`;
        setText(findSlot(content, "stat-value", group), stat.value);
        setText(findSlot(content, "stat-label", group), stat.label);
      });
      break;
    }
    case "table": {
      if (semantic.title) setText(findSlot(content, "title"), semantic.title);
      const tableNode = findSlot(content, "table");
      if (tableNode) {
        const rows = [semantic.headers, ...semantic.rows];
        tableNode.content = rows as unknown as ContentItem["content"];
        tableNode.initialRows = rows.length;
        tableNode.initialColumns = semantic.headers.length;
      }
      break;
    }
    case "fullImage":
      setImage(findSlot(content, "image"), semantic.imageAlt);
      if (semantic.title) setText(findSlot(content, "title"), semantic.title);
      break;
  }

  return {
    id: v4(),
    slideName: template.slideName,
    type: template.type,
    slideOrder: order,
    className: template.className,
    content,
  };
}

// Build a deterministic title-body slide from an outline string. Used as
// the fallback when the semantic deck is missing an outline index.
function fallbackTitleBody(outlineText: string, order: number): Slide {
  const content = cloneTree(TitleBody.content as ContentItem);
  setText(findSlot(content, "title"), outlineText);
  setText(findSlot(content, "paragraph"), "");
  return {
    id: v4(),
    slideName: TitleBody.slideName,
    type: TitleBody.type,
    slideOrder: order,
    className: TitleBody.className,
    content,
  };
}

// Compose a deck. Enforces strict 1:1 outline→slide:
//   - de-duplicates outlineIndex (first wins)
//   - synthesizes a titleBody slide for any missing outline index.
export function composeDeck(
  semantic: SemanticSlide[],
  outlines: string[]
): Slide[] {
  const byIndex = new Map<number, SemanticSlide>();
  for (const s of semantic) {
    if (!byIndex.has(s.outlineIndex)) byIndex.set(s.outlineIndex, s);
  }

  return outlines.map((outline, i) => {
    const s = byIndex.get(i);
    if (!s) return fallbackTitleBody(outline, i);
    return composeOne(s, i);
  });
}

// Emit a deterministic deck of titleBody slides, one per outline. Used when
// AI validation fails twice in a row so the user still lands on a usable deck.
export function fallbackDeck(outlines: string[]): Slide[] {
  return outlines.map((o, i) => fallbackTitleBody(o, i));
}
