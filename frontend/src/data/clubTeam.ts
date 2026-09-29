import type { SheetTeamMember } from "@/types/sheetTeamMember";

// The club team for 2026-27, from "VJ Startups Team (2026-27) - Details" (exported 2026-09-29).
// Only public profile fields are kept: the sheet also holds members' personal emails, phone
// numbers and roll numbers, which must never be added here (this repo is public).
// To update: edit the entries below, or set VITE_TEAM_SHEET_ID to a Google Sheet (see
// hooks/useTeamMembersFromSheet.ts) whose tabs hold no personal contact columns.
export const CLUB_TEAM: SheetTeamMember[] = [
  {"name":"Manoj Kumar Lakkala","role":"Wing Master - Vision and Strategy","wing":"Vision","branch":"Information Technology","year":"3rd Year","linkedinUrl":"https://www.linkedin.com/in/manoj-kumar-lakkala-1404781a7/","instagramUrl":"https://www.instagram.com/the.manojkumarlakkala","imageUrl":"","displayOrder":1},
  {"name":"Manogna Sista","role":"Wing Master - Programs Management","wing":"Ignition","branch":"CSE-AIML","year":"","linkedinUrl":"","instagramUrl":"","imageUrl":"","displayOrder":6},
  {"name":"G. Sriram Charan","role":"Wing Master - Media, Outreach","wing":"Echo","branch":"Computer Science - AIML","year":"3rd Year","linkedinUrl":"","instagramUrl":"","imageUrl":"","displayOrder":19},
  {"name":"Ms. sahithi varma","role":"wing member - Outreach","wing":"Echo","branch":"computer science-AIML","year":"3rd Year","linkedinUrl":"","instagramUrl":"","imageUrl":"","displayOrder":20},
  {"name":"Ms. Jaishna","role":"wing member - Editing","wing":"Echo","branch":"CSE-AIML","year":"3rd Year","linkedinUrl":"https://www.linkedin.com/in/jaishna-chilkapally-0a0573341?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app","instagramUrl":"https://www.instagram.com/__jaishna__?igsh=MWYycWExd2ZwYmJvNw==","imageUrl":"","displayOrder":21},
  {"name":"Ms.Jasvini","role":"wing member - Posters","wing":"Echo","branch":"CSE-AIML","year":"3rd Year","linkedinUrl":"https://www.linkedin.com/in/chinthala-jasvini-11415b33a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app","instagramUrl":"https://www.instagram.com/_jasssviniii_?igsh=MWdiOXdyb2J2N2k3cQ==","imageUrl":"","displayOrder":22},
  {"name":"Shaik Farheen","role":"wing member - Posters","wing":"Echo","branch":"CSE-IOT","year":"3rd Year","linkedinUrl":"","instagramUrl":"","imageUrl":"","displayOrder":23},
  {"name":"Mr.Harshith","role":"wing member - Editing","wing":"Echo","branch":"CSE-AIML","year":"3rd Year","linkedinUrl":"https://www.linkedin.com/in/chiluveru-harshith-68695732b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app","instagramUrl":"https://www.instagram.com/chiluveruharshith?igsh=ZW1scmJodGEyeGt2","imageUrl":"","displayOrder":24},
  {"name":"R.Shanmukh","role":"wing member - Editing","wing":"Echo","branch":"CSE-AIML","year":"2nd year","linkedinUrl":"https://www.linkedin.com/in/ramoju-shanmukha-sai-gopi-srinarayana-534a03406","instagramUrl":"https://www.instagram.com/shanmukhsarkar?stkn=czk3c3duZm9oaHp2","imageUrl":"","displayOrder":25},
  {"name":"A. Srinidhi","role":"wing member - PR and Content","wing":"Echo","branch":"CSE-AIML","year":"2nd year","linkedinUrl":"","instagramUrl":"","imageUrl":"","displayOrder":26},
  {"name":"Suhas Nannapaneni","role":"Wing Master - Financial Support- External Private Schemes","wing":"Fuel","branch":"RAI","year":"2nd Year","linkedinUrl":"","instagramUrl":"","imageUrl":"","displayOrder":27},
  {"name":"Vahini Muttineni","role":"Wing Master - Infrastructure, Deployments","wing":"Infra","branch":"Computer Science - Core","year":"3rd Year","linkedinUrl":"https://www.linkedin.com/in/vahinimuttineni/","instagramUrl":"https://www.instagram.com/vahini_.06/","imageUrl":"","displayOrder":43},
  {"name":"Manikanth Panuganti","role":"Wing Member - VAPT","wing":"Infra","branch":"Computer Science - Core","year":"3rd Year","linkedinUrl":"https://www.linkedin.com/in/panuganti-manikanth-a68ba3325/","instagramUrl":"https://www.instagram.com/manikanth8910/","imageUrl":"","displayOrder":44},
  {"name":"B.Bhargavi","role":"Wing Member","wing":"Infra","branch":"Information Technology","year":"3rd Year","linkedinUrl":"","instagramUrl":"","imageUrl":"","displayOrder":45},
  {"name":"Tanush Peddy","role":"Wing Member","wing":"Infra","branch":"Information Technology","year":"2nd Year","linkedinUrl":"https://www.linkedin.com/in/tanush-peddy-857bb3406/","instagramUrl":"https://www.instagram.com/_tanush.0/","imageUrl":"","displayOrder":46},
  {"name":"Mr. Anirudh","role":"Wing Master - Campus Digitisation","wing":"Infra","branch":"Information Technology","year":"4th Year","linkedinUrl":"https://www.linkedin.com/in/ayinala-anirudha-sai-venkat","instagramUrl":"https://www.instagram.com/anirudh525125","imageUrl":"https://drive.google.com/thumbnail?id=1nKh2s2ZtzwgakxixY2TlrU5_6JCSVY80&sz=w800","displayOrder":47},
  {"name":"Pendem Suhaas","role":"Wing Member","wing":"Infra","branch":"Computer Science - Core","year":"2nd Year","linkedinUrl":"","instagramUrl":"","imageUrl":"","displayOrder":48},
  {"name":"Shubham Das Adhikari","role":"Wing Master","wing":"Talent","branch":"","year":"3rd Year","linkedinUrl":"","instagramUrl":"","imageUrl":"","displayOrder":49},
];
