// Whether `email` is among the people who upvoted or liked something. The older backend sends
// these as plain emails; the current one sends records ({ userEmail, ... }). Both count.
type Upvoter = string | { userEmail?: string | null } | null | undefined;

export function hasUpvoted(upvotedBy: Upvoter[] | null | undefined, email?: string | null): boolean {
  if (!email || !Array.isArray(upvotedBy)) return false;
  const me = email.trim().toLowerCase();
  return upvotedBy.some((u) => (typeof u === "string" ? u : u?.userEmail)?.trim().toLowerCase() === me);
}
