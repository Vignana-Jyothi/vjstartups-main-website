import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Layers, Users, UserPlus } from "lucide-react";
import { wings } from "@/data/clubInfo";
import { useTeamMembersFromSheet } from "@/hooks/useTeamMembersFromSheet";
import { ClubHero } from "@/components/club/ClubHero";
import { ClubAboutSection } from "@/components/club/ClubAboutSection";
import { WingsOverviewGrid } from "@/components/club/WingsOverviewGrid";
import { WingDetailCard } from "@/components/club/WingDetailCard";
import { TeamDirectorySection } from "@/components/club/TeamDirectorySection";
import { JoinClubSection } from "@/components/club/JoinClubSection";
import { cn } from "@/lib/utils";

const tabTriggerClass =
  "min-h-[44px] flex-1 gap-2 rounded-vj-button px-3 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-vj-accent data-[state=active]:text-white data-[state=active]:shadow-[var(--vj-shadow-subtle)]";

const ClubPage = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedWing, setSelectedWing] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { groups, wings: sheetWings, isLoading, error, isEmpty, refetch } = useTeamMembersFromSheet({
    selectedWing,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-vj-neutral to-background">
      <ClubHero
        onExploreWings={() => setActiveTab("wings")}
        onGetInvolved={() => setActiveTab("join")}
      />

      <div className="container mx-auto px-4 py-10 md:py-14">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <div className="sticky top-16 z-20 -mx-4 bg-background/85 px-4 py-3 backdrop-blur-md md:static md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
            <TabsList
              className={cn(
                "flex h-auto w-full gap-1.5 overflow-x-auto rounded-vj-large border border-vj-border bg-vj-surface p-1.5 shadow-[var(--vj-shadow-subtle)]",
                "md:grid md:grid-cols-4 md:overflow-visible"
              )}
              aria-label="Club page sections"
            >
              <TabsTrigger value="overview" className={tabTriggerClass}>
                <Building className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="wings" className={tabTriggerClass}>
                <Layers className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden min-[480px]:inline">Wings Structure</span>
                <span className="min-[480px]:hidden">Wings</span>
              </TabsTrigger>
              <TabsTrigger value="team" className={tabTriggerClass}>
                <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Team Directory</span>
                <span className="sm:hidden">Team</span>
              </TabsTrigger>
              <TabsTrigger value="join" className={tabTriggerClass}>
                <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Get Involved</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-10 focus-visible:outline-none">
            <ClubAboutSection />
            <WingsOverviewGrid />
          </TabsContent>

          <TabsContent value="wings" className="space-y-8 focus-visible:outline-none">
            {wings.map((wing, index) => (
              <WingDetailCard key={wing.id} wing={wing} index={index} />
            ))}
          </TabsContent>

          <TabsContent value="team" className="focus-visible:outline-none">
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
          </TabsContent>

          <TabsContent value="join" className="focus-visible:outline-none">
            <JoinClubSection onApplyNow={() => setActiveTab("team")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClubPage;
