export interface TextStyles {
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontFamily?: string;
  textDecoration?: string;
  color?: string;
  textAlign?: string;
  lineHeight?: string;
  letterSpacing?: string;
}

export interface Slide {
  id: string;
  slideName: string;
  type: string;
  content: ContentItem;
  slideOrder: number;
  className?: string;
}

export type ContentType =
  | "column"
  | "resizable-column"
  | "text"
  | "paragraph"
  | "image"
  | "table"
  | "multiColumn"
  | "blank"
  | "imageAndText"
  | "heading1"
  | "heading2"
  | "heading3"
  | "title"
  | "heading4"
  | "blockquote"
  | "numberedList"
  | "bulletedList"
  | "code"
  | "link"
  | "quote"
  | "divider"
  | "calloutBox"
  | "todoList"
  | "bulletList"
  | "codeBlock"
  | "customButton"
  | "tableOfContents";

export type SlotKind =
  | "title"
  | "subtitle"
  | "eyebrow"
  | "paragraph"
  | "heading"
  | "image"
  | "quote"
  | "attribution"
  | "cta"
  | "stat-value"
  | "stat-label"
  | "table"
  | "list"
  | "code";

export interface SlotMeta {
  required?: boolean;
  multi?: boolean;
  group?: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  name: string;
  content: ContentItem[] | string | string[] | string[][];
  initialRows?: number;
  initialColumns?: number;
  restrictedToDrop?: boolean;
  columns?: number;
  placeholder?: string;
  className?: string;
  alt?: string;
  callOutType?: "success" | "warning" | "info" | "question" | "caution";
  link?: string;
  code?: string;
  language?: string;
  bgColor?: string;
  isTransparent?: boolean;
  styles?: TextStyles;
  slot?: SlotKind;
  slotMeta?: SlotMeta;
}

export interface Theme {
  name: string;
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  slideBackgroundColor: string;
  accentColor: string;
  gradientBackground?: string;
  sidebarColor?: string;
  navbarColor?: string;
  type: "light" | "dark";

  // Extended (optional, filled by resolveTheme) — drives the slide design-token engine.
  id?: string;
  fontHeading?: string;
  mutedColor?: string;
  accentForeground?: string;
  borderColor?: string;
  surfaceColor?: string;
  radius?: "sharp" | "soft" | "pill";
  shadow?: "none" | "subtle" | "soft" | "dramatic";
  density?: "compact" | "comfortable" | "spacious";
  imageStyle?: "square" | "rounded" | "framed" | "polaroid";
  chartPalette?: string[];
}

export interface OutlineCard {
  title: string;
  id: string;
  order: number;
}

export interface ReturnProps {
  status: number;
  data?: unknown;
  error?: string;
}

export interface LayoutSlides {
  slideName: string;
  content: ContentItem;
  className?: string;
  type: string;
}

export interface LayoutGroup {
  name: string;
  layouts: Layout[];
}

export interface Layout {
  name: string;
  icon: React.FC;
  type: string;
  component: LayoutSlides;
  layoutType: string;
}
interface Component {
  name: string;
  icon: string;
  type: string;
  component: ContentItem;
  componentType: string;
}

export interface ComponentGroup {
  name: string;
  components: Component[];
}
