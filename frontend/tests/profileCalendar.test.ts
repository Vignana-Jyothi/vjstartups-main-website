import { test } from "node:test";
import assert from "node:assert/strict";

import { buildWeeks, describeCell, initials, monthLabels, safeUrl } from "@/lib/profileCalendar";

// 2026-10-19 is a Monday; 2025-10-20 (365 days earlier + 1) is also a Monday.
const RANGE = { from: "2025-10-20", to: "2026-10-19" };

test("the grid is whole weeks, Sunday first, and covers the range", () => {
  const { weeks } = buildWeeks(RANGE, []);
  assert.ok(weeks.every((w) => w.length === 7));
  assert.equal(weeks[0][0].date, "2025-10-19"); // the Sunday before the first day
  assert.equal(weeks[0][0].inRange, false);
  assert.equal(weeks[0][1].date, "2025-10-20");
  assert.equal(weeks[0][1].inRange, true);
  const last = weeks[weeks.length - 1];
  assert.equal(last[1].date, "2026-10-19");
  assert.equal(last[1].inRange, true);
  assert.equal(last[2].inRange, false); // after the range
  assert.equal(weeks.flat().filter((c) => c.inRange).length, 365);
});

test("days with activity are placed on their date and the rest are empty", () => {
  const days = [{ date: "2026-10-18", count: 4, level: 4, completed: 3, comments: 1 }];
  const cell = buildWeeks(RANGE, days).weeks.flat().find((c) => c.date === "2026-10-18")!;
  assert.equal(cell.count, 4);
  assert.equal(cell.level, 4);
  const empty = buildWeeks(RANGE, days).weeks.flat().find((c) => c.date === "2026-10-17")!;
  assert.deepEqual([empty.count, empty.level], [0, 0]);
});

test("activity outside the range is ignored", () => {
  const days = [{ date: "2024-01-01", count: 9, level: 4 }];
  assert.equal(buildWeeks(RANGE, days).weeks.flat().reduce((n, c) => n + c.count, 0), 0);
});

test("month labels mark the first week of each month, without crowding", () => {
  const { months } = buildWeeks(RANGE, []);
  const names = months.map((m) => m.label);
  assert.equal(new Set(names).size, names.length - (names.filter((n) => n === "Oct").length - 1));
  for (let i = 1; i < months.length; i++) assert.ok(months[i].week - months[i - 1].week >= 3);
  assert.ok(names.includes("Jan") && names.includes("Jul"));
});

test("a calendar that starts a day or two before month end drops the crowded first label", () => {
  const { weeks } = buildWeeks({ from: "2026-01-30", to: "2026-04-30" }, []);
  const labels = monthLabels(weeks);
  assert.notEqual(labels[0].label, "Jan");
});

test("cell descriptions are readable", () => {
  const cell = { date: "2026-10-18", count: 4, level: 4, inRange: true, day: { date: "2026-10-18", count: 4, level: 4, completed: 3, comments: 1 } };
  assert.equal(describeCell(cell), "4 contributions on 18 Oct 2026 (3 completed, 1 comment)");
  assert.equal(describeCell({ date: "2026-10-17", count: 0, level: 0, inRange: true }), "No contributions on 17 Oct 2026");
  assert.equal(describeCell({ date: "2026-10-17", count: 1, level: 1, inRange: true }), "1 contribution on 17 Oct 2026");
});

test("only http(s) addresses are linked", () => {
  assert.equal(safeUrl("https://github.com/asha"), "https://github.com/asha");
  assert.equal(safeUrl("http://asha.dev"), "http://asha.dev/");
  for (const bad of ["javascript:alert(1)", "data:text/html,x", "not a url", "", null, undefined]) {
    assert.equal(safeUrl(bad as string | null | undefined), null, String(bad));
  }
});

test("initials", () => {
  assert.equal(initials("Asha Rao"), "AR");
  assert.equal(initials("  madonna "), "M");
  assert.equal(initials(""), "?");
});
