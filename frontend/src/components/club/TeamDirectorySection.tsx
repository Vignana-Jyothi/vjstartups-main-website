import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { TeamDirectoryGroup } from "@/types/sheetTeamMember";
import { TeamFilterBar } from "./TeamFilterBar";
import { TeamMemberCard } from "./TeamMemberCard";

interface TeamDirectorySectionProps {
  groups: TeamDirectoryGroup[];
  sheetWings: string[];
  selectedWing: string;
  onWingChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry?: () => void;
}

function filterGroupsBySearch(groups: TeamDirectoryGroup[], query: string): TeamDirectoryGroup[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return groups;

  return groups
    .map((group) => {
      const wingMasterMatches =
        group.wingMaster &&
        [group.wingMaster.name, group.wingMaster.role, group.wingMaster.branch, group.wingMaster.year].some(
          (field) => field?.toLowerCase().includes(normalized)
        );

      const filteredCore = group.coreTeam.filter((member) =>
        [member.name, member.role, member.branch, member.year].some((field) =>
          field?.toLowerCase().includes(normalized)
        )
      );

      if (wingMasterMatches) {
        return { ...group, coreTeam: filteredCore.length > 0 ? filteredCore : group.coreTeam };
      }

      if (filteredCore.length > 0) {
        return { ...group, wingMaster: null, coreTeam: filteredCore };
      }

      return null;
    })
    .filter((group): group is TeamDirectoryGroup => group !== null);
}

function countMembers(groups: TeamDirectoryGroup[]): number {
  return groups.reduce((total, group) => {
    return total + (group.wingMaster ? 1 : 0) + group.coreTeam.length;
  }, 0);
}

function TeamDirectorySkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading team directory">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="rounded-vj-large border border-vj-border bg-vj-surface p-6 shadow-[var(--vj-shadow-subtle)]"
        >
          <Skeleton className="mb-6 h-7 w-48" />
          <Skeleton className="mb-6 h-32 w-full rounded-vj-large" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-36 w-full rounded-vj-large" />
            <Skeleton className="h-36 w-full rounded-vj-large" />
            <Skeleton className="h-36 w-full rounded-vj-large" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TeamDirectorySection({
  groups,
  sheetWings,
  selectedWing,
  onWingChange,
  searchQuery,
  onSearchChange,
  isLoading,
  error,
  isEmpty,
  onRetry,
}: TeamDirectorySectionProps) {
  const filteredGroups = useMemo(
    () => filterGroupsBySearch(groups, searchQuery),
    [groups, searchQuery]
  );

  const memberCount = countMembers(filteredGroups);
  const showFilters = !isLoading && !error && sheetWings.length > 0;
  const noSearchResults = !isLoading && !error && !isEmpty && filteredGroups.length === 0;

  return (
    <div className="space-y-6">
      <TeamFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedWing={selectedWing}
        onWingChange={onWingChange}
        sheetWings={sheetWings}
        memberCount={memberCount}
        showFilters={showFilters}
      />

      {isLoading && <TeamDirectorySkeleton />}

      {!isLoading && error && (
        <Alert variant="destructive" className="rounded-vj-large">
          <AlertTitle>Unable to load team directory</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
                Try again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && isEmpty && (
        <div className="flex flex-col items-center rounded-vj-large border border-dashed border-vj-border bg-vj-neutral/30 px-6 py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-vj-muted" aria-hidden="true" />
          <p className="text-vj-muted">No team members found in the Google Sheet.</p>
        </div>
      )}

      {noSearchResults && (
        <div className="flex flex-col items-center rounded-vj-large border border-dashed border-vj-border bg-vj-neutral/30 px-6 py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-vj-muted" aria-hidden="true" />
          <p className="font-medium text-vj-primary">No members match your search</p>
          <p className="mt-2 text-sm text-vj-muted">Try adjusting your search or wing filter.</p>
        </div>
      )}

      {!isLoading &&
        !error &&
        filteredGroups.map((group) => (
          <section
            key={group.wing}
            className="overflow-hidden rounded-vj-large border border-vj-border bg-vj-surface shadow-[var(--vj-shadow-subtle)] animate-fade-in-up"
            aria-labelledby={`wing-team-${group.wing}`}
          >
            <div className="border-b border-vj-border bg-gradient-to-r from-vj-neutral to-vj-surface px-6 py-5 md:px-8">
              <h2 id={`wing-team-${group.wing}`} className="text-xl font-semibold text-vj-primary md:text-2xl">
                {group.wingName} - Team
              </h2>
            </div>

            <div className="space-y-8 p-6 md:p-8">
              {group.wingMaster && (
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-vj-primary">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    Wing Master
                  </h3>
                  <div className="max-w-xl">
                    <TeamMemberCard member={group.wingMaster} variant="master" />
                  </div>
                </div>
              )}

              {group.coreTeam.length > 0 && (
                <div>
                  <h3 className="mb-4 text-base font-semibold text-vj-primary">Core Team Members</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.coreTeam.map((member) => (
                      <TeamMemberCard
                        key={`${member.email || member.name}-${member.displayOrder}`}
                        member={member}
                        variant="core"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
    </div>
  );
}
