import { test } from "node:test";
import assert from "node:assert/strict";
import { hasUpvoted } from "@/utils/upvotes";
import { coverPhrase } from "@/components/design-system/CardCover";
import { parseWorksheetCsv } from "@/services/googleSheetsService";
import { groupMembersByWing } from "@/utils/teamMemberTransforms";
import { CLUB_TEAM } from "@/data/clubTeam";
import { canWriteStories } from "@/data/storiesApi";

test("hasUpvoted accepts both the old (emails) and new (records) shapes", () => {
  assert.equal(hasUpvoted(["A@x.com"], "a@x.com"), true);
  assert.equal(hasUpvoted([{ userEmail: "a@x.com" }], "a@x.com"), true);
  assert.equal(hasUpvoted([{ userEmail: "b@x.com" }, "c@x.com"], "a@x.com"), false);
  assert.equal(hasUpvoted(undefined, "a@x.com"), false);
  assert.equal(hasUpvoted(["a@x.com"], null), false);
});

test("coverPhrase keeps a complete phrase instead of cutting mid-sentence", () => {
  assert.equal(coverPhrase("RootSense: Adaptive Field Intelligence for Cleaner Crops"), "RootSense");
  assert.equal(coverPhrase("Lack of Washrooms in public centres"), "Lack of Washrooms in public centres");
  assert.equal(coverPhrase("Fire sprinklers are not installed in the campus"), "Fire sprinklers are not installed");
  assert.equal(coverPhrase('Ending the Institutional "Experience Leak": Bridging the Gap'), "Ending the Institutional Experience Leak");
  assert.ok(!/\b(for|of|in|and)$/i.test(coverPhrase("Intelligent Circular Waste Management and Resource Recovery System")));
});

const SHEET = [
  'Display Name,Wing Name,Role,Department,Year,email-id,LInkedin (ifany),"Phone Number \n(must for - Wing Master)",Insta (optional)',
  "Asha,Infra,Wing Master - Infrastructure,CSE,3rd Year,asha@gmail.com,https://linkedin.com/in/asha,9000000001,https://instagram.com/asha",
  "Ravi,Infra,Wing Master - Campus Digitisation,IT,4th Year,ravi@gmail.com,,9000000002,",
  "Kiran,Infra,Wing Member,IT,2nd Year,,,,",
  ",Ignition,wing member - ProblemHunt,,,,,,",
].join("\n");

test("team sheet: wing from the Wing Name column; rows without a name are skipped", () => {
  const members = parseWorksheetCsv(SHEET, "Details");
  assert.deepEqual(members.map((m) => [m.name, m.wing]), [["Asha", "Infra"], ["Ravi", "Infra"], ["Kiran", "Infra"]]);
  assert.equal(members[0].instagramUrl, "https://instagram.com/asha");
});

test("team sheet: personal emails and phone numbers are never read", () => {
  const text = JSON.stringify(parseWorksheetCsv(SHEET, "Details"));
  assert.ok(!text.includes("@gmail.com"), "email leaked");
  assert.ok(!/9000000\d{3}/.test(text), "phone leaked");
});

test("a wing with two wing masters keeps both", () => {
  const [infra] = groupMembersByWing(parseWorksheetCsv(SHEET, "Details"));
  assert.equal(infra.wingMaster?.name, "Asha");
  assert.deepEqual(infra.coreTeam.map((m) => m.name), ["Ravi", "Kiran"]);
});

test("the bundled club team holds no emails, phone numbers or roll numbers (the repo is public)", () => {
  const text = JSON.stringify(CLUB_TEAM);
  assert.ok(!/[\w.+-]+@[\w-]+\.[\w.]+/.test(text.replace(/https?:\/\/[^"]+/g, "")), "email in clubTeam");
  assert.ok(!/(?<![\w/=?&-])[6-9]\d{9}(?![\w])/.test(text), "phone number in clubTeam");
  assert.ok(!/\b\d{2}07\d[A-Z]\d{2}[A-Z0-9]{2}\b/.test(text), "roll number in clubTeam");
});

test("only admins and wing masters may write stories", () => {
  assert.equal(canWriteStories("admin"), true);
  assert.equal(canWriteStories("wing_master"), true);
  assert.equal(canWriteStories("wing_member"), false);
  assert.equal(canWriteStories("student"), false);
  assert.equal(canWriteStories(undefined), false);
});

test("the built-in site content holds only published contacts (no student emails, no placeholder numbers)", async () => {
  const { builtInContent } = await import("@/data/siteContent");
  const text = JSON.stringify(builtInContent);
  const emails = text.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) ?? [];
  // Program inboxes and faculty mentors only: none of them is a roll-number address.
  assert.ok(emails.length > 0);
  for (const email of emails) assert.match(email, /@vnrvjiet\.in$/, email);
  for (const email of emails) assert.doesNotMatch(email, /^\d{2}071a/i, email);
  assert.doesNotMatch(text, /9876543210|dr-anil-krishnan/);
  assert.equal(new Set(builtInContent.programs.map((p) => p.id)).size, builtInContent.programs.length);
  assert.ok(builtInContent.programs.some((p) => p.onHomePage));
});
