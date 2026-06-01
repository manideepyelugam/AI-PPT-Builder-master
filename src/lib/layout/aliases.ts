// Legacy `Slide.type` / layout `type` values that AI or saved decks may emit,
// mapped to the current family `type`. Used at the picker boundary so legacy
// names still apply to a recognised family layout.

export const LAYOUT_ALIASES: Record<string, string> = {
  "blank-card": "titleBody",
  imageAndText: "imageLeft",
  textAndImage: "imageRight",
  twoColumns: "twoColumn",
  twoColumnsWithHeadings: "twoColumn",
  twoColumnsWithHeading: "twoColumn", // AI prompt typo
  threeColumns: "threeColumn",
  threeColumnsWithHeadings: "threeColumn",
  fourColumns: "threeColumn",
  accentLeft: "imageLeft",
  accentRight: "imageRight",
  twoImageColumns: "imageGrid",
  threeImageColumns: "imageGrid",
  fourImageColumns: "imageGrid",
  tableLayout: "table",
};

export function resolveLayoutType(raw: string | undefined | null): string {
  if (!raw) return "titleBody";
  return LAYOUT_ALIASES[raw] ?? raw;
}
