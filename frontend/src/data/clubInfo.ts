// The club's text, numbers and wings are site content (see siteContent.ts): stored in the
// database and edited at /manage. The team itself comes from the team sheet (clubTeam.ts).
export type { Wing, SubWing, Club } from "./siteContent";

const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
/** "eight" for 8, digits past twelve: "Our eight wings". */
export const countWord = (n: number) => WORDS[n] ?? String(n);

export const wingDisplayName =(name: string) => name.replace(/\s*🪽/u, "").trim();

// Wing and program enquiries go to the innovation cell with the wing or program named in the
// subject (the old per-wing addresses on vjstartups.vnrvjiet.in have no DNS record and bounced).
export const clubContactHref = (topic: string) =>
  `mailto:head.iie@vnrvjiet.in?subject=${encodeURIComponent(`${wingDisplayName(topic)} enquiry`)}`;
