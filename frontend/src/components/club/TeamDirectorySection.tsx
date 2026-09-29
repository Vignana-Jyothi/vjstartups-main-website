import { useMemo } from "react";
import { TeamDirectoryGroup } from "@/types/sheetTeamMember";
import { wingDisplayName } from "@/data/clubInfo";
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
    <div>
      <div className="lx-sec-head cl-team-head">
        <span>Live from the club's team sheet</span>
        <h2>Team directory</h2>
      </div>

      <TeamFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedWing={selectedWing}
        onWingChange={onWingChange}
        sheetWings={sheetWings}
        memberCount={memberCount}
        showFilters={showFilters}
      />

      {isLoading && <div className="lx-loading">Loading the team</div>}

      {!isLoading && error && (
        <div className="lx-empty">
          <strong>Couldn't load the team</strong>
          {onRetry && (
            <button type="button" className="lx-cta" onClick={onRetry}>
              Try again ↗
            </button>
          )}
        </div>
      )}

      {!isLoading && !error && isEmpty && (
        <div className="lx-empty">
          <strong>No members yet</strong>
          The team sheet is empty.
        </div>
      )}

      {noSearchResults && (
        <div className="lx-empty">
          <strong>No matches</strong>
          Try another name, role or wing.
        </div>
      )}

      {!isLoading &&
        !error &&
        filteredGroups.map((group) => {
          const size = (group.wingMaster ? 1 : 0) + group.coreTeam.length;
          return (
            <section key={group.wing} className="cl-team" aria-labelledby={`wing-team-${group.wing}`}>
              <div className="cl-team-title">
                <h3 id={`wing-team-${group.wing}`}>{wingDisplayName(group.wingName)}</h3>
                <span>{size} {size === 1 ? "member" : "members"}</span>
              </div>
              <div className="cl-member-grid">
                {group.wingMaster && <TeamMemberCard member={group.wingMaster} variant="master" />}
                {group.coreTeam.map((member) => (
                  <TeamMemberCard
                    key={`${member.wing}-${member.name}-${member.displayOrder}`}
                    member={member}
                    variant="core"
                  />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
