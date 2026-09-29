import { useState, type CSSProperties } from "react";

// Where a long title can be cut cleanly: just before one of these words. Cutting at a fixed five
// words left fragments like "…Intelligence for" or "Lack of Washrooms in public".
const BREAK_BEFORE = new Set(["a", "an", "and", "or", "in", "of", "for", "on", "at", "to", "with", "from", "during", "that", "which", "due", "by", "into", "through", "across", "via", "using", "&"]);

/** A short, complete phrase from the title: the name before a colon if there is one; the whole
 *  title if it is short (six words, or seven within 48 characters); otherwise the longest
 *  opening of up to five words that ends just before a connecting word. */
export function coverPhrase(title: string) {
  const clean = title.trim().replace(/^[\s"'“‘]+|[\s"'”’.!?]+$/g, "");
  const lead = clean.split(/\s*[:|–—]\s+|\s+-\s+/)[0].replace(/[\s"'”’]+$/, "");
  const source = lead && lead.length >= 3 && lead !== clean ? lead : clean;
  const words = source.replace(/["“”]/g, "").split(/\s+/);
  if (words.length <= 6 || (words.length <= 7 && source.length <= 48)) return words.join(" ");
  for (let k = 5; k >= 2; k--) if (BREAK_BEFORE.has(words[k].toLowerCase())) return words.slice(0, k).join(" ");
  const cut = words.slice(0, 5);
  while (cut.length > 1 && BREAK_BEFORE.has(cut[cut.length - 1].toLowerCase())) cut.pop();
  return cut.join(" ");
}

/**
 * Cover for listing cards. Without a photo (or when it fails to load) the card's own title is set
 * large in outlined type, cropped by the frame, so every card reads as itself instead of sharing
 * one placeholder image.
 */
export function CardCover({ title, image }: { title: string; image?: string | null }) {
  const [failed, setFailed] = useState(false);
  const words = coverPhrase(title) || "—";
  // The type is sized so the longest word fits the card whole (see .lx-card-cover in listing.css).
  const longest = Math.max(6, ...words.split(" ").map((w) => w.length));
  return (
    <>
      <div className="lx-card-cover" aria-hidden="true" style={{ "--fit": longest } as CSSProperties}>
        <span>{words}</span>
      </div>
      {image && !failed && <img src={image} alt="" loading="lazy" onError={() => setFailed(true)} />}
    </>
  );
}
