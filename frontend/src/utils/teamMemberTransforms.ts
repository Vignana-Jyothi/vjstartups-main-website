import { siteContentNow } from "@/data/siteContent";
import { SheetTeamMember, TeamDirectoryGroup } from "@/types/sheetTeamMember";

/** Team-sheet wing names that differ from clubInfo wing names (none since Core became Infra) */
const WING_ALIASES: Record<string, string> = {};

function normalizeWingKey(wing: string): string {
  const lower = wing.toLowerCase().trim();
  return WING_ALIASES[lower] ?? lower;
}

/** Canonical wing order from clubInfo — Vision first, then Ignition, Echo, etc. */
export function getWingSortIndex(wing: string): number {
  const key = normalizeWingKey(wing);

  const index = siteContentNow().wings.findIndex((entry) => {
    const entryName = entry.name.toLowerCase();
    const entryKey = entryName.replace(/\s*wing.*$/, "").trim();
    return entryName.includes(key) || entryKey.includes(key) || key.includes(entryKey);
  });

  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

export function compareWings(a: string, b: string): number {
  const orderDiff = getWingSortIndex(a) - getWingSortIndex(b);
  if (orderDiff !== 0) {
    return orderDiff;
  }
  return a.localeCompare(b);
}

export function isWingMaster(member: SheetTeamMember): boolean {
  return /wing master/i.test(member.role);
}

export function resolveWingDisplayName(wing: string): string {
  const normalized = wing.toLowerCase().trim();
  const match = siteContentNow().wings.find((entry) =>
    entry.name.toLowerCase().includes(normalized)
  );

  return match?.name ?? (wing ? `${wing} Wing` : "General");
}

export function groupMembersByWing(members: SheetTeamMember[]): TeamDirectoryGroup[] {
  const groups = new Map<string, SheetTeamMember[]>();

  members.forEach((member) => {
    const key = member.wing || "General";
    const current = groups.get(key) ?? [];
    current.push(member);
    groups.set(key, current);
  });

  return Array.from(groups.entries())
    .map(([wing, groupMembers]) => {
      const sorted = [...groupMembers].sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      const wingMasters = sorted.filter(isWingMaster);
      const coreTeam = sorted.filter((member) => !isWingMaster(member));

      return {
        wing,
        wingName: resolveWingDisplayName(wing),
        wingMaster: wingMasters[0] ?? null,
        // A wing can have more than one master (Infra does); the others lead its team list.
        coreTeam: [...wingMasters.slice(1), ...coreTeam],
      };
    })
    .sort((a, b) => compareWings(a.wing, b.wing));
}

export function filterGroupsByWing(
  groups: TeamDirectoryGroup[],
  selectedWing: string
): TeamDirectoryGroup[] {
  if (!selectedWing || selectedWing === "all") {
    return groups;
  }

  return groups.filter(
    (group) => group.wing.toLowerCase() === selectedWing.toLowerCase()
  );
}

export function getAvailableWings(members: SheetTeamMember[]): string[] {
  return Array.from(new Set(members.map((member) => member.wing).filter(Boolean))).sort(
    compareWings
  );
}
