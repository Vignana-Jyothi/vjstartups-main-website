import { useState, type CSSProperties } from "react";

/**
 * Cover for listing cards. Without a photo (or when it fails to load) the card's own title is set
 * large in outlined type, cropped by the frame, so every card reads as itself instead of sharing
 * one placeholder image.
 */
export function CardCover({ title, image }: { title: string; image?: string | null }) {
  const [failed, setFailed] = useState(false);
  const words = title.trim().split(/\s+/).slice(0, 5).join(" ") || "—";
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
