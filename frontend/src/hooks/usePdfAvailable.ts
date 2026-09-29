import { useEffect, useState } from "react";

// Report links in the story data point at files that were never uploaded, and the server
// answers missing paths with the app's HTML. Only treat a link as live once it serves a PDF.
export function usePdfAvailable(url?: string): boolean {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok && (res.headers.get("content-type") ?? "").includes("pdf"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url]);

  return available;
}
