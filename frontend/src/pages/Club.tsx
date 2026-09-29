import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { wings, wingDisplayName } from "@/data/clubInfo";
import { useTeamMembersFromSheet } from "@/hooks/useTeamMembersFromSheet";
import { ClubHero } from "@/components/club/ClubHero";
import { ClubAboutSection } from "@/components/club/ClubAboutSection";
import { WingsOverviewGrid } from "@/components/club/WingsOverviewGrid";
import { WingDetailCard } from "@/components/club/WingDetailCard";
import { TeamDirectorySection } from "@/components/club/TeamDirectorySection";
import { JoinClubSection } from "@/components/club/JoinClubSection";
import "@/components/design-system/listing.css";
import "@/components/club/club.css";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "wings", label: "Wings" },
  { value: "team", label: "Team" },
  { value: "join", label: "Get involved" },
];

// Team-sheet wing names that differ from the wing list's (none since Core became Infra).
const SHEET_ALIASES: Record<string, string> = {};
const wingKey = (name: string) => wingDisplayName(name).split(/\s+/)[0].toLowerCase();

const ClubPage = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedWing, setSelectedWing] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const tabsRef = useRef<HTMLDivElement>(null);
  const { groups, allGroups, wings: sheetWings, isLoading, error, isEmpty, refetch } = useTeamMembersFromSheet({
    selectedWing,
  });

  const teamCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allGroups.forEach((group) => {
      counts[wingKey(group.wing)] = (group.wingMaster ? 1 : 0) + group.coreTeam.length;
    });
    return Object.fromEntries(
      wings.map((wing) => {
        const key = wingKey(wing.name);
        return [wing.id, counts[SHEET_ALIASES[key] ?? key]];
      })
    );
  }, [allGroups]);

  const goTo = (tab: string, anchorId?: string) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      const target = anchorId ? document.getElementById(anchorId) : tabsRef.current;
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="page-shell lx cl" style={{ "--lx-accent": "var(--lime)" } as CSSProperties}>
      <ClubHero
        onExploreWings={() => goTo("wings")}
        onGetInvolved={() => goTo("join")}
        onOpenWing={(id) => goTo("wings", `wing-${id}`)}
      />

      <TabsPrimitive.Root value={activeTab} onValueChange={setActiveTab}>
        {/* Scroll target sits outside the sticky bar: a stuck element can't be scrolled to reliably. */}
        <div ref={tabsRef} className="cl-anchor" />
        <div className="cl-tabs-bar">
          <TabsPrimitive.List className="cl-tabs" aria-label="Club page sections">
            {TABS.map((tab, i) => (
              <TabsPrimitive.Trigger key={tab.value} value={tab.value} className="cl-tab">
                <span>{String(i + 1).padStart(2, "0")}</span>
                {tab.label}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
        </div>

        <div className="lx-section">
          <TabsPrimitive.Content value="overview" className="cl-panel">
            <ClubAboutSection />
            <WingsOverviewGrid
              teamCounts={teamCounts}
              onOpenWing={(id) => goTo("wings", `wing-${id}`)}
            />
          </TabsPrimitive.Content>

          <TabsPrimitive.Content value="wings" className="cl-panel">
            {wings.map((wing, index) => (
              <WingDetailCard
                key={wing.id}
                wing={wing}
                index={index}
                teamCount={teamCounts[wing.id]}
                onMeetTeam={() => {
                  const key = wingKey(wing.name);
                  const sheetWing = sheetWings.find((w) => wingKey(w) === (SHEET_ALIASES[key] ?? key));
                  setSelectedWing(sheetWing ?? "all");
                  goTo("team");
                }}
              />
            ))}
          </TabsPrimitive.Content>

          <TabsPrimitive.Content value="team" className="cl-panel">
            <TeamDirectorySection
              groups={groups}
              sheetWings={sheetWings}
              selectedWing={selectedWing}
              onWingChange={setSelectedWing}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isLoading={isLoading}
              error={error}
              isEmpty={isEmpty}
              onRetry={refetch}
            />
          </TabsPrimitive.Content>

          <TabsPrimitive.Content value="join" className="cl-panel">
            <JoinClubSection onMeetTeam={() => goTo("team")} />
          </TabsPrimitive.Content>
        </div>
      </TabsPrimitive.Root>
    </div>
  );
};

export default ClubPage;
