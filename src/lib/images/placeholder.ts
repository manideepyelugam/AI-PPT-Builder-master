// Deterministic seeded Picsum placeholder URL. Used wherever a slide needs
// an image src but no real image is available yet (manual layout insertion,
// AI tier-2 fallback, etc). Same seed → same image, so re-renders are stable.
export function placeholderImageUrl(
  seed: string,
  w = 1200,
  h = 675
): string {
  const safe =
    seed
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 60) || "slide";
  return `https://picsum.photos/seed/${safe}/${w}/${h}`;
}

// True when a string is a usable image src for an <img> tag — http(s) URL
// or data URL. Empty strings, plain text descriptions, and known dead
// placeholders (placehold.co) return false.
export function isRealImageSrc(src: string | undefined | null): boolean {
  if (!src) return false;
  const s = src.trim();
  if (!s) return false;
  if (s.startsWith("data:")) return true;
  if (s.startsWith("http://") || s.startsWith("https://")) {
    if (s.includes("placehold.co")) return false;
    return true;
  }
  return false;
}
